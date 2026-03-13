import mongoose from 'mongoose';
import { expandEventToInstances } from './extractors/extractEvent.js';
import { pushToAlgolia } from './pushToAlgolia.js';
import algoliaService from './algoliaService.js';
import { ALGOLIA_INDEX_NAME, LOCALES } from './constants.js';
import { logger, requestLogger, errorLogger } from '../logger.js';
import { syncPerformanceToAlgolia } from './syncPerformance.js';
import { syncUserToAlgolia } from './syncUser.js';
import { syncGalleryToAlgolia } from './syncGallery.js';
import { syncVideoToAlgolia } from './syncVideo.js';

export const syncEventToAlgolia = async (eventId) => {
  const Event = mongoose.model('Event');

  const event = await Event.findById(eventId)
    .populate('type', 'name slug')
    .populate('categories', 'name slug')
    .populate('users', 'stagename slug')
    .populate({ path: 'partners.users', select: 'stagename slug' })
    .populate({
      path: 'program.performance',
      select: 'title slug type users',
      populate: { path: 'users', select: 'stagename slug' }
    })
    .populate({
      path: 'program_freezed.performance',
      select: 'title slug type users',
      populate: { path: 'users', select: 'stagename slug' }
    })
    .populate('videos', 'title slug url')
    .populate('galleries', 'title slug')
    .exec();

  if (!event) return;

  const records = expandEventToInstances(event, LOCALES);

  if (!records || !records.length) return;

  if (event.is_public) {
    await pushToAlgolia(records);
    //logger.info(records)
    logger.info("Push To Algolia success")
  } else {
    const ids = records.map((r) => r.objectID).filter(Boolean);
    if (ids.length) {
      await algoliaService.deleteObjects(ALGOLIA_INDEX_NAME, ids);
    }
  }
  
  // Cascade sync: update related performances, users (producers, performers, partners), galleries and videos
  try {
    const performanceIds = new Set();
    const userIds = new Set();
    const galleryIds = new Set();
    const videoIds = new Set();

    // Producers
    (event.users || []).forEach(u => u?._id && userIds.add(u._id.toString()));

    const collectProgram = (programArr) => {
      (programArr || []).forEach(p => {
        if (p?.performance?._id) performanceIds.add(p.performance._id.toString());
        (p?.performance?.users || []).forEach(u => u?._id && userIds.add(u._id.toString()));
      });
    };
    collectProgram(event.program || []);
    collectProgram(event.program_freezed || []);

    // Partners' users
    (event.partners || []).forEach(part => {
      (part.users || []).forEach(u => u?._id && userIds.add(u._id.toString()));
    });

    // Galleries and Videos
    (event.galleries || []).forEach(g => g?._id && galleryIds.add(g._id.toString()));
    (event.videos || []).forEach(v => v?._id && videoIds.add(v._id.toString()));

    Array.from(performanceIds).forEach(id => {
      syncPerformanceToAlgolia(id).catch((e) => logger.error('Algolia cascade sync (performance) failed', e));
    });
    Array.from(userIds).forEach(id => {
      syncUserToAlgolia(id).catch((e) => logger.error('Algolia cascade sync (user) failed', e));
    });
    Array.from(galleryIds).forEach(id => {
      syncGalleryToAlgolia(id).catch((e) => logger.error('Algolia cascade sync (gallery) failed', e));
    });
    Array.from(videoIds).forEach(id => {
      syncVideoToAlgolia(id).catch((e) => logger.error('Algolia cascade sync (video) failed', e));
    });
  } catch (e) {
    logger.error('Algolia event cascade sync exception', e);
  }
};

export default { syncEventToAlgolia };


