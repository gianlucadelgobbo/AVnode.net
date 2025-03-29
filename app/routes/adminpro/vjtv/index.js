// vjtv-generator.js
import createRouter from '../../router.js';
import mongoose from 'mongoose';
import { logger } from '../../../utilities/logger.js';

const Video = mongoose.model('Video');
const Vjtv = mongoose.model('Vjtv');

const router = createRouter();

router.get('/generator', async (req, res) => {
  try {
    const { day, month } = req.query;
    const { date, enddate } = parseTimeWindow(day, month);

    const existingDays = await getExistingProgrammingDays();
    if (!date || !enddate) {
      return res.render('adminpro/vjtv/generator', {
        title: 'VJ Television',
        currentUrl: req.originalUrl,
        data: [],
        availabledays: existingDays,
        get: req.query,
        script: false
      });
    }

    const videos = await getValidVideos();
    const categorized = categorizeVideos(videos);
    const schedule = generateSchedule(categorized, date, enddate);

    await Vjtv.deleteMany({ programming: { $gte: date, $lt: enddate } });
    await Vjtv.create(schedule);

    const results = await Vjtv.find({ programming: { $gte: date, $lt: enddate } })
      .sort({ programming: 1 })
      .populate([
        {
          path: 'video',
          select: { title: 1, slug: 1, media: 1, createdAt: 1 },
          populate: { path: 'users', select: { stagename: 1 } }
        },
        { path: 'category', select: 'name' }
      ]);

    res.render('adminpro/vjtv/generator', {
      title: 'VJ Television',
      currentUrl: req.originalUrl,
      data: results,
      availabledays: existingDays,
      get: req.query,
      script: false
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send('Errore nella generazione del palinsesto');
  }
});

router.get('/', (req, res) => {
  console.log("sssssssssssssssss")
  console.log(req.originalUrl)
  res.render('adminpro/vjtv/calendar', {
    title: 'VJ Television',
    currentUrl: "req.originalUrl",
    get: req.query,
    calendar: true,
    script: false
  });
});

export default router;

// Helper Functions
function parseTimeWindow(day, month) {
  let date, enddate;
  if (day) {
    const [y, m, d] = day.split('-').map(Number);
    date = new Date(Date.UTC(y, m - 1, d));
    enddate = new Date(Date.UTC(y, m - 1, d + 1));
  } else if (month) {
    const [y, m] = month.split('-').map(Number);
    date = new Date(Date.UTC(y, m - 1, 1));
    enddate = new Date(Date.UTC(y, m, 1));
  }
  return { date, enddate };
}

async function getExistingProgrammingDays() {
  const days = await Vjtv.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$programming' }
        }
      }
    }
  ]);
  return days.map(d => d._id);
}

async function getValidVideos() {
  return await Video.find({
    'categories.0': { $exists: true },
    'media.externalurl': { $exists: false },
    'media.duration': { $gt: 60000 },
    'media.encoded': 1
  })
    .sort({ createdAt: 1 })
    .select({ title: 1, slug: 1, media: 1, categories: 1 })
    .populate({ path: 'categories', select: 'name' })
    .exec();
}

function categorizeVideos(videos) {
  const getCat = name =>
    videos.filter(v => v.categories.some(c => c.name === name));

  return {
    vjdjsets: getCat('VJ-DJ SETS'),
    video: getCat('VIDEO'),
    docs: getCat('DOCS'),
    performances: getCat('PERFORMANCES'),
    ads: getCat('PUBBLICITA') // può essere vuota
  };
}

function generateSchedule(categorized, start, end) {
  const { vjdjsets, video, docs, performances, ads } = categorized;
  const schedule = [];
  const blocks = [
    { name: 'vjdjsets', hours: 6, categoryId: '5be8708afc39610000000218' },
    { name: 'video', hours: 6, categoryId: '5be8708afc39610000000112' },
    { name: 'docs', hours: 6, categoryId: '5be8708afc3961000000008e' },
    { name: 'performances', hours: 6, categoryId: '5be8708afc39610000000195' }
  ];

  const indexes = {
    vjdjsets: 0,
    video: 0,
    docs: 0,
    performances: 0,
    ads: 0
  };

  let time = start.getTime();
  const endTime = end.getTime();

  const contentBlockMs = 20 * 60 * 1000; // ogni 20 minuti
  const adsMaxMs = 2 * 60 * 1000; // max 2 minuti di pubblicità

  while (time < endTime) {
    for (const block of blocks) {
      let blockElapsed = 0;
      const maxBlockTime = block.hours * 60 * 60 * 1000;
      const list = categorized[block.name];

      if (!list.length) continue;

      logger.info(`\n--- Starting block: ${block.name.toUpperCase()} ---`);
      logger.info(`Start time: ${new Date(time).toISOString()}`);

      while (blockElapsed < maxBlockTime && time < endTime) {
        let contentDuration = 0;
        let contentAdded = false;

        while (contentDuration < contentBlockMs && blockElapsed < maxBlockTime) {
          const item = list[indexes[block.name] % list.length];
          if (!item) {
            logger.warn(`Missing item for ${block.name}`);
            break;
          }

          schedule.push({
            video: item._id,
            programming: new Date(time),
            category: block.categoryId
          });

          logger.info(`[VIDEO] ${block.name}: ${item.title} at ${new Date(time).toISOString()}`);

          time += item.media.duration;
          contentDuration += item.media.duration;
          blockElapsed += item.media.duration;
          indexes[block.name]++;
          contentAdded = true;
        }

        if (!contentAdded) {
          logger.warn(`[SKIP] No content added in block ${block.name} at ${new Date(time).toISOString()}`);
          break;
        }

        let adsDuration = 0;
        let adsAdded = false;

        while (ads.length && adsDuration < adsMaxMs) {
          const ad = ads[indexes.ads % ads.length];
          if (!ad) break;

          if (ad.media.duration > (adsMaxMs - adsDuration)) break;

          schedule.push({
            video: ad._id,
            programming: new Date(time),
            category: ad.categories[0]?._id || null
          });

          logger.info(`[ADS] ${ad.title || ad.slug} at ${new Date(time).toISOString()}`);

          time += ad.media.duration;
          adsDuration += ad.media.duration;
          blockElapsed += ad.media.duration;
          indexes.ads++;
          adsAdded = true;
        }

        if (!contentAdded && !adsAdded) {
          logger.warn(`[EXIT] No content or ads added in ${block.name} at ${new Date(time).toISOString()}`);
          break;
        }
      }
    }
  }

  logger.info(`\nSchedule generated with ${schedule.length} items.`);
  return schedule;
}
