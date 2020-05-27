const router = require('../../router')();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Video = mongoose.model('Video');
const Vjtv = mongoose.model('Vjtv');
const Category = mongoose.model('Category');
const User = mongoose.model('User');

const logger = require('../../../utilities/logger');

router.get('/', (req, res) => {
  let month = [];
  Vjtv.
  aggregate([
    {"$group":{
     "_id":{
       "$dateToString":{"format":"%Y-%m-%d","date":"$programming"}
     }
  }}]).
  exec((err, days) => {
    if (req.query.day || req.query.month) {
      logger.debug("eccomi");
      Video.
      find({"categories.0":{$exists:true},"media.externalurl":{$exists:false},"media.duration": {$gt:60000}, "media.encoded": 1}).
      sort({createdAt: 1}).
      //select({title: 1, slug: 1, "media.duration": 1}).
      select({title: 1, slug: 1, "media.preview": 1, "media.duration": 1,"media.file": 1}).
      populate({path:"categories", select: "name"}).
      //lean().
      exec((err, data) => {
        let date;
        let enddate;
        if (req.query.day) {
          var pieces = req.query.day.split("-");
          date = new Date(Date.UTC(parseInt(pieces[0]), parseInt(pieces[1])-1, parseInt(pieces[2])));
          enddate = new Date(Date.UTC(parseInt(pieces[0]), parseInt(pieces[1])-1, parseInt(pieces[2])));
          enddate = new Date(enddate.setUTCDate(enddate.getUTCDate()+1));
          lastdate = new Date(Date.UTC(parseInt(pieces[0]), parseInt(pieces[1])-1, parseInt(pieces[2])));
          lastdate = new Date(lastdate.setUTCDate(lastdate.getUTCDate()-1));
          //enddate = new Date(enddate.getTime()-(-60*60*1000));
        } else if (req.query.month) {
          var pieces = req.query.month.split("-");
          date = new Date(Date.UTC(parseInt(pieces[0]), parseInt(pieces[1])-1, 1));
          enddate = new Date(Date.UTC(parseInt(pieces[0]), parseInt(pieces[1])-1, 1));
          enddate = new Date(enddate.setUTCMonth(enddate.getUTCMonth()+1));
          lastdate = new Date(Date.UTC(parseInt(pieces[0]), parseInt(pieces[1])-1, 1));
          lastdate = new Date(lastdate.setUTCDate(lastdate.getUTCDate()-1));
        }
        /* logger.debug("date");
        logger.debug(date);
        logger.debug("enddate");
        logger.debug(enddate);
        logger.debug("lastdate");
        logger.debug(lastdate); */
        var query = {programming: { $lt: date, $gt: lastdate}};
        Vjtv.
        find(query).
        sort({programming: 1}).
        //select({title: 1, slug: 1, "media.duration": 1}).
        select({programming: 1}).
        populate({path:"video", select: "media.duration"}).
        exec((err, lasts) => {
          const vjdjsets = data.filter(item => item.categories.map(cat => {return cat.name}).indexOf("VJ-DJ SETS")!==-1);
          const docs = data.filter(item => item.categories.map(cat => {return cat.name}).indexOf("DOCS")!==-1);
          const performances = data.filter(item => item.categories.map(cat => {return cat.name}).indexOf("PERFORMANCES")!==-1);
          const video = data.filter(item => item.categories.map(cat => {return cat.name}).indexOf("VIDEO")!==-1);
          var last = lasts.length-1;
          let contavjdjsets = 0;
          let contadocs = 0;  
          let contaperformances = 0;
          let contavideo = 0;
          if (last) {

            var vjdjsets_ids = vjdjsets.map(item => {return item._id.toString()});
/*             logger.debug("vjdjsets_ids");
            logger.debug(vjdjsets_ids);
            logger.debug("last");
            logger.debug(last);
 */            contavjdjsets = 0;
            while(contavjdjsets == 0 && last>=0) {
/*               logger.debug("contavjdjsets");
              logger.debug(last);
              logger.debug(lasts[last].video._id.toString());
*/              
              logger.debug("lasts");
              logger.debug(lasts[last]);
              contavjdjsets = vjdjsets_ids.indexOf(lasts[last].video._id.toString())!==-1 ? vjdjsets_ids.indexOf(lasts[last].video._id.toString()) : 0
              last--
            }
            last = lasts.length-1;
            var docs_ids = docs.map(item => {return item._id.toString()})
            contadocs = 0;
            while(contadocs == 0 && last>=0) {
/*               logger.debug("contadocs");
              logger.debug(last);
              logger.debug(lasts[last].video._id.toString());
 */              contadocs = docs_ids.indexOf(lasts[last].video._id.toString())!==-1 ? docs_ids.indexOf(lasts[last].video._id.toString()) : 0
              last--
            }
            last = lasts.length-1;
            var performances_ids = performances.map(item => {return item._id.toString()})
            contaperformances = 0;
            while(contaperformances == 0 && last>=0) {
              /* logger.debug("contaperformances");
              logger.debug(last);
              logger.debug(lasts[last].video._id.toString()); */
              contaperformances = performances_ids.indexOf(lasts[last].video._id.toString())!==-1 ? performances_ids.indexOf(lasts[last].video._id.toString()) : 0
              last--
            }
            last = lasts.length-1;
            var video_ids = video.map(item => {return item._id.toString()});
            //logger.debug(video_ids);
            contavideo = 0;
            //logger.debug(lasts);
            while(contavideo == 0 && last>=0) {
              /* logger.debug("contavideo");
              logger.debug(lasts[last].video._id.toString());
              logger.debug(video_ids.indexOf(lasts[last].video._id.toString()));
              logger.debug(last); */
              contavideo = video_ids.indexOf(lasts[last].video._id.toString())!==-1 ? video_ids.indexOf(lasts[last].video._id.toString()) : 0
              last--
            }
          }

          /* logger.debug("contavjdjsets");
          logger.debug(contavjdjsets);
          logger.debug("contadocs");
          logger.debug(contadocs);
          logger.debug("contaperformances");
          logger.debug(contaperformances);
          logger.debug("contavideo");
          logger.debug(contavideo); */
          let milliseconds;
          let dailyTime;
          //logger.debug("dailyTime");
          if (contavjdjsets>0) {
            dailyTime = -date.getTime();
            /* logger.debug(dailyTime);
            logger.debug(lasts[lasts.length-1]);
            logger.debug(lasts[lasts.length-1].programming);
            logger.debug(lasts[lasts.length-1].programming.getTime()); */
            milliseconds = new Date(lasts[lasts.length-1].programming).getTime()+lasts[lasts.length-1].video.media.duration;
            //logger.debug(milliseconds);
            dailyTime+=milliseconds;
            //logger.debug(dailyTime);
          } else {
            milliseconds = date.getTime();
            dailyTime = 0;
          }
          /* logger.debug("dailyTime");
          logger.debug(dailyTime);
          logger.debug("milliseconds");
          logger.debug(milliseconds); */
          const enddatemilliseconds = enddate.getTime()

          var item;
          while(milliseconds<enddatemilliseconds) {
            dailyTime = 0;
            while(dailyTime<6*60*60*1000 && milliseconds<enddatemilliseconds) {
              item = vjdjsets[contavjdjsets];
              month.push({
                video: item._id,
                programming: new Date(milliseconds),
                category : "5be8708afc39610000000218"
                /* title: item.title,
                imageFormats: item.imageFormats,
                media: item.media,
                category: "VJ-DJ SETS",
                programming: new Date(milliseconds).toUTCString().replace(" GMT", "") */
              });
              dailyTime+=item.media.duration;
              milliseconds+=item.media.duration;
              contavjdjsets++;
              if(contavjdjsets>=vjdjsets.length) contavjdjsets = 0;
            }
            while(dailyTime<12*60*60*1000 && milliseconds<enddatemilliseconds) {
              item = docs[contadocs];
              month.push({
                video: item._id,
                programming: new Date(milliseconds),
                category : "5be8708afc3961000000008e"
                /* title: item.title,
                imageFormats: item.imageFormats,
                media: item.media,
                category: "DOCS",
                programming: new Date(milliseconds).toUTCString().replace(" GMT", "") */
              });
              dailyTime+=item.media.duration;
              milliseconds+=item.media.duration;
              contadocs++;
              if(contadocs>=docs.length) contadocs = 0;
            }
            while(dailyTime<18*60*60*1000 && milliseconds<enddatemilliseconds) {
              item = performances[contaperformances];
              month.push({
                video: item._id,
                programming: new Date(milliseconds),
                category : "5be8708afc39610000000195"
                /* title: item.title,
                imageFormats: item.imageFormats,
                media: item.media,
                category: "PERFORMANCES",
                programming: new Date(milliseconds).toUTCString().replace(" GMT", "") */
              });
              dailyTime+=item.media.duration;
              milliseconds+=item.media.duration;
              contaperformances++;
              if(contaperformances>=performances.length) contaperformances = 0;
            }
            while(dailyTime<24*60*60*1000 && milliseconds<enddatemilliseconds) {
              item = video[contavideo];
              month.push({
                video: item._id,
                programming: new Date(milliseconds),
                category : "5be8708afc39610000000112"
                /* .toUTCString().replace(" GMT", "")
                title: item.title,
                imageFormats: item.imageFormats,
                media: item.media,
                category_id: "VIDEO",
                category: "VIDEO", */
              });
              dailyTime+=item.media.duration;
              milliseconds+=item.media.duration;
              contavideo++;
              if(contavideo>=video.length) contavideo = 0;
            }
          }
          var query = {programming: { $lt: enddate, $gt: date}};
          //logger.debug(query);
          Vjtv
          .deleteMany(query, function (err, results) {
            /* logger.debug(query);
            logger.debug(results);
            logger.debug(month.length); */
            Vjtv
            .create(month, function (err, created) {
              //logger.debug("createok");
              /* var pieces = req.query.month.split("-");
              var date = new Date(pieces[0], parseInt(pieces[1])-1, 1, 0, 0,0,0);
              // 1 Month
              var start = new Date(new Date(date.getFullYear(), date.getMonth(), 1, 0, 0,0,0).getTime()+offset);
              var end = new Date(new Date(date.getFullYear(), date.getMonth()+1, 1, 0, 0,0,0).getTime()+offset+offset); */
              Vjtv
              .find(query)
              //.select(select)
              //.limit(100)
              .sort({programming: 1})
              .populate([{path: "video", model: "Video", select: {title: 1, slug: 1, createdAt: 1, "media.preview": 1, "media.duration": 1,"media.file": 1}, populate: {path:"users", select: {stagename: 1}}},{path:"category", select: "name"}])
              .exec((err, data) => {
                //logger.debug("adminpro");
                if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
                  res.json(data);
                } else {
                  res.render('adminpro/vjtv/generator', {
                    title: 'VJTV Generator',
                    currentUrl: req.originalUrl,
                    data: data,
                    availabledays: days.map(item =>{return item._id}),
                    get: req.query,
                    //data: data,
                    script: false
                  });
                }
              });
            });
          });
        });
      });
    } else {
      res.render('adminpro/vjtv/generator', {
        title: 'VJTV Generator',
        currentUrl: req.originalUrl,
        data: month,
        availabledays: days.map(item =>{return item._id}),
        get: req.query,
        script: false
      });
    }
  });
});


module.exports = router;