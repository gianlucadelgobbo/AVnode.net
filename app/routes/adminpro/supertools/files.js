const router = require('../../router')();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const User = mongoose.model('User');
const Performance = mongoose.model('Performance');
const Category = mongoose.model('Category');
const Event = mongoose.model('Event');
const Footage = mongoose.model('Footage');
const Playlist = mongoose.model('Playlist');
const Gallery = mongoose.model('Gallery');
const Video = mongoose.model('Video');
const News = mongoose.model('News');
const request = require('request');
const fs = require('fs');
const config = require('getconfig');
const sharp = require('sharp');

const logger = require('../../../utilities/logger');

// V > db.events.findOne({"schedule.venue.location.locality":{$exists: true}},{schedule:1});
// V {"addresses.country": "Italy", "addresses.locality":{$in: ["Rome","Roma"]}},{addresses:1}

router.checkAndCreate = (folder, cb) => {
  const folderA = folder.split('/');
  let subfolder = '';

  if (folderA.length) {
    for (let a=1; a<folderA.length;a++) {
      subfolder +=  `/${folderA[a]}`;
      logger.debug(subfolder);
      if (!fs.existsSync(global.appRoot + subfolder)) {
        fs.mkdirSync(global.appRoot + subfolder);
      }
    }
  }
  cb();
};

/* router.download = (source, dest, callback) => {
  request.head(source, function(err, res, body){
    logger.debug('content-type:', res.headers['content-type']);
    logger.debug('content-length:', res.headers['content-length']);
    request(source).pipe(fs.createWriteStream(dest)).on('close', callback);
  });
}; */

router.get('/userimages', (req, res) => {
  logger.debug('/adminpro/supertools/files/userimages');
  let data = [];
  let adminsez = "profile";
  User.
  find({"image.file": {$exists: true}}).
  lean().
  select({image: 1, createdAt: 1}).
  exec((err, users) => {
    for (let user in users) {
      users[user].image.exists = fs.existsSync(global.appRoot+users[user].image.file);
      users[user].image.imageFormats = {};
      users[user].image.imageFormatsExists = {};
      logger.debug(users[user]);
      //logger.debug(config.cpanel[adminsez].config.sizes.image);
      //if (users[user].image.exists) {
        const file = users[user].image.file;
        const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
        const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
        const oldPath = fileFolder.replace("/glacier/users_originals/", "/warehouse/"); // /warehouse/2017/03
        const publicPath = fileFolder.replace("/glacier/users_originals/", "/warehouse/users/"); // /warehouse/2017/03
        const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        // logger.debug('fileName:' + fileName + ' fileFolder:' + fileFolder + ' fileNameWithoutExtension:' + fileNameWithoutExtension);
        for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
          users[user].image.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.image.components.image.config.sizes[format].folder}/${fileNameWithoutExtension}_${fileExtension}.jpg`;
        }
        for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
          users[user].image.imageFormatsExists[format] = fs.existsSync(global.appRoot+users[user].image.imageFormats[format]);
        }
        if (!users[user].image.exists) {
          users[user].image.mkdir = `mkdir ${fileFolder.replace("/glacier/", "glacier/")}`;
          users[user].image.find = `find ${oldPath.replace("/warehouse/", "/space/PhpMysql2015/sites/flxer/warehouse/")}  -maxdepth 1 -name '${fileName}' -exec cp "{}" ${fileFolder.replace("/glacier/", "glacier/")} \\;`;
        }
      //}
      data.push(users[user].image);
    }
    logger.debug(req.path);
    if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
      res.json(data);
    } else {
      res.render('adminpro/supertools/files/showall', {
        title: 'User images',
        
        currentUrl: req.originalUrl,
        data: data,
        script: false
      });
    }
  });
});

router.get('/userformatsgenerator', (req, res) => {
  logger.debug('/adminpro/supertools/files/userimages');
  var limit = 50;
  var skip = req.query.skip ? parseFloat(req.query.skip) : 0;
  let data = [];
  let adminsez = "profile";
  User.
  find({"image.file": {$exists: true}}).
  limit(limit).
  skip(skip).
  lean().
  select({image: 1, createdAt: 1}).
  exec((err, users) => {
    for (let user in users) {
      users[user].image.exists = fs.existsSync(global.appRoot+users[user].image.file);
      users[user].image.imageFormats = {};
      users[user].image.imageFormatsExists = {};
      logger.debug(users[user]);
      //logger.debug(config.cpanel[adminsez].config.sizes.image);
      if (users[user].image.exists) {
        const file = users[user].image.file;
        const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
        const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
        const publicPath = fileFolder.replace("/glacier/users_originals/", "/warehouse/users/"); // /warehouse/2017/03
        const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        // logger.debug('fileName:' + fileName + ' fileFolder:' + fileFolder + ' fileNameWithoutExtension:' + fileNameWithoutExtension);
        for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
          users[user].image.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.image.components.image.config.sizes[format].folder}/${fileNameWithoutExtension}_${fileExtension}.jpg`;
        }
        for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
          users[user].image.imageFormatsExists[format] = fs.existsSync(global.appRoot+users[user].image.imageFormats[format]);
          if (!users[user].image.imageFormatsExists[format]) {
            const folder = users[user].image.imageFormats[format].substring(0, users[user].image.imageFormats[format].lastIndexOf('/'))
            router.checkAndCreate(folder, () => {
              sharp(global.appRoot+users[user].image.file)
              .resize(config.cpanel[adminsez].forms.image.components.image.config.sizes[format].w, config.cpanel[adminsez].forms.image.components.image.config.sizes[format].h)
              .toFile(global.appRoot+users[user].image.imageFormats[format], (err, info) => {
                logger.debug(err);
                logger.debug(info);
              });  
            });
            if (!fs.existsSync(global.appRoot+folder)) {
              fs.mkdirSync(global.appRoot+folder);
            }
          }
        }
      }
      data.push(users[user].image);
    }
    logger.debug(req.path);
    res.render('adminpro/supertools/files/showall', {
      title: 'User images generator',
      
      currentUrl: req.originalUrl,
      data: data,
      script: '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/files/userformatsgenerator?skip=' + (skip+limit) + '"},1000);</script>'
    });
  });
});

router.get('/userimagestodelete', (req, res) => {
  var glob = require("glob")
  let adminsez = "profile";
  logger.debug('getImagesToDelete');
  //logger.debug(query);
  return new Promise(function (resolve, reject) {
    var options = {
      nodir: true,
      cwd: global.appRoot+"/warehouse/users/"
    }
    glob("**/*", options, function (er, warehouse) {
      for (var item in warehouse) warehouse[item] = "/warehouse/users/"+warehouse[item]
      options.cwd = global.appRoot+"/glacier/users_originals/";
      glob("**/*", options, function (er, glacier) {
        for (var item in glacier) glacier[item] = "/glacier/users_originals/"+glacier[item]
        var promises = [];
        for (var item in glacier) {
          promises.push(User.find({"image.file": glacier[item]}).select({_id:1}));
        }
        //console.log(promises)
        Promise.all(
          promises
        ).then( (resultsPromise) => {
          setTimeout(function() {
            //logger.debug('resultsPromise');
            logger.debug(resultsPromise);
            var data = []
            for (var item in glacier) {
              data.push({"image.original": glacier[item], res:resultsPromise[item].length});
              if (resultsPromise[item].length) {
                const file = glacier[item];
                const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
                const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
                const publicPath = fileFolder.replace("/glacier/users_originals/", "/warehouse/users/"); // /warehouse/2017/03
                const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
                const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
                logger.debug(warehouse);
                for(var format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
                  var format = `${publicPath}/${config.cpanel[adminsez].forms.image.components.image.config.sizes[format].folder}/${fileNameWithoutExtension}_${fileExtension}.jpg`;
                  logger.debug(format);
                  if (warehouse.indexOf(format)!==-1) warehouse.splice(warehouse.indexOf(format), 1);
                }
              }
            }
            if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
              logger.debug(warehouse.length);
              logger.debug(glacier.length);
              logger.debug(data.length);
              logger.debug(resultsPromise.length);
              res.json({data:data, warehouse:warehouse});
            } else {
              res.render('adminpro/supertools/files/showall', {
                title: 'User images',
                currentUrl: req.originalUrl,
                data: data,
                script: false
              });
            }
          }, 1000);
        });
      })
    })
  })
});

router.findFile = (query, coll) => {
  coll.
  find(query).
  lean().
  select({_id:1}).
  exec((err, res) => {
    query.res = res.length;
    //logger.debug(query);
    logger.debug(query);
    return query;
  });
}

router.get('/performanceimages', (req, res) => {
  logger.debug('/adminpro/supertools/files/performanceimages');
  let data = [];
  let adminsez = "performances";
  Performance.
  find({"image.file": {$exists: true}}).
  lean().
  select({image: 1, createdAt: 1}).
  exec((err, performances) => {
    for (let performance in performances) {
      performances[performance].image.exists = fs.existsSync(global.appRoot+performances[performance].image.file);
      performances[performance].image.imageFormats = {};
      performances[performance].image.imageFormatsExists = {};
      logger.debug(performances[performance]);
      //logger.debug(config.cpanel[adminsez].config.sizes.image);
      //if (performances[performance].image.exists) {
        const file = performances[performance].image.file;
        const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
        const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
        const oldPath = fileFolder.replace("/glacier/performances_originals/", "/warehouse/"); // /warehouse/2017/03
        const publicPath = fileFolder.replace("/glacier/performances_originals/", "/warehouse/performances/"); // /warehouse/2017/03
        const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        // logger.debug('fileName:' + fileName + ' fileFolder:' + fileFolder + ' fileNameWithoutExtension:' + fileNameWithoutExtension);
        for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
          performances[performance].image.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.image.components.image.config.sizes[format].folder}/${fileNameWithoutExtension}_${fileExtension}.jpg`;
        }
        for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
          performances[performance].image.imageFormatsExists[format] = fs.existsSync(global.appRoot+performances[performance].image.imageFormats[format]);
        }
        if (!performances[performance].image.exists) {
          performances[performance].image.mkdir = `mkdir ${fileFolder.replace("/glacier/", "glacier/")}`;
          performances[performance].image.find = `find ${oldPath.replace("/warehouse/", "/space/PhpMysql2015/sites/flxer/warehouse/")} -name '${fileName}' -exec cp "{}" ${fileFolder.replace("/glacier/", "glacier/")} \\;`;
        }
      //}
      data.push(performances[performance].image);
    }
    logger.debug(req.path);
    if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
      res.json(data);
    } else {
      res.render('adminpro/supertools/files/showall', {
        title: 'Performance images',
        
        currentUrl: req.originalUrl,
        data: data,
        script: false
      });
    }
  });
});

router.get('/performanceformatsgenerator', (req, res) => {
  logger.debug('/adminpro/supertools/files/performanceimages');
  var limit = 50;
  var skip = req.query.skip ? parseFloat(req.query.skip) : 0;
  let data = [];
  let adminsez = "performances";
  Performance.
  find({"image.file": {$exists: true}}).
  limit(limit).
  skip(skip).
  lean().
  select({image: 1, createdAt: 1}).
  exec((err, performances) => {
    for (let performance in performances) {
      performances[performance].image.exists = fs.existsSync(global.appRoot+performances[performance].image.file);
      performances[performance].image.imageFormats = {};
      performances[performance].image.imageFormatsExists = {};
      logger.debug(performances[performance]);
      //logger.debug(config.cpanel[adminsez].config.sizes.image);
      if (performances[performance].image.exists) {
        const file = performances[performance].image.file;
        const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
        const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
        const publicPath = fileFolder.replace("/glacier/performances_originals/", "/warehouse/performances/"); // /warehouse/2017/03
        const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        // logger.debug('fileName:' + fileName + ' fileFolder:' + fileFolder + ' fileNameWithoutExtension:' + fileNameWithoutExtension);
        for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
          performances[performance].image.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.image.components.image.config.sizes[format].folder}/${fileNameWithoutExtension}_${fileExtension}.jpg`;
        }
        for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
          performances[performance].image.imageFormatsExists[format] = fs.existsSync(global.appRoot+performances[performance].image.imageFormats[format]);
          if (!performances[performance].image.imageFormatsExists[format]) {
            let folder = performances[performance].image.imageFormats[format].substring(0, performances[performance].image.imageFormats[format].lastIndexOf('/'))
            router.checkAndCreate(folder, () => {
              sharp(global.appRoot+performances[performance].image.file)
              .resize(config.cpanel[adminsez].forms.image.components.image.config.sizes[format].w, config.cpanel[adminsez].forms.image.components.image.config.sizes[format].h)
              .toFile(global.appRoot+performances[performance].image.imageFormats[format], (err, info) => {
                logger.debug(err);
                logger.debug(info);
              });
            });
          }
        }
      }
      data.push(performances[performance].image);
    }
    logger.debug(req.path);
    res.render('adminpro/supertools/files/showall', {
      title: 'Performance images generator',
      
      currentUrl: req.originalUrl,
      data: data,
      script: '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/files/performanceformatsgenerator?skip=' + (skip+limit) + '"},1000);</script>'
    });
  });
});

router.get('/eventimages', (req, res) => {
  logger.debug('/adminpro/supertools/files/eventimages');
  let data = [];
  let adminsez = "events";
  Event.
  find({"image.file": {$exists: true}}).
  lean().
  sort({_id:-1}).
  select({image: 1, createdAt: 1}).
  exec((err, events) => {
    for (let event in events) {
      events[event].image.exists = fs.existsSync(global.appRoot+events[event].image.file);
      events[event].image.imageFormats = {};
      events[event].image.imageFormatsExists = {};
      logger.debug(events[event]);
      //logger.debug(config.cpanel[adminsez].config.sizes.image);
      //if (events[event].image.exists) {
        const file = events[event].image.file;
        const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
        const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
        const publicPath = fileFolder.replace("/glacier/events_originals/", "/warehouse/events/"); // /warehouse/2017/03
        const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        // logger.debug('fileName:' + fileName + ' fileFolder:' + fileFolder + ' fileNameWithoutExtension:' + fileNameWithoutExtension);
        for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
          events[event].image.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.image.components.image.config.sizes[format].folder}/${fileNameWithoutExtension}_${fileExtension}.jpg`;
        }
        for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
          events[event].image.imageFormatsExists[format] = fs.existsSync(global.appRoot+events[event].image.imageFormats[format]);
        }
      //}
      data.push(events[event].image);
    }
    logger.debug(req.path);
    res.render('adminpro/supertools/files/showall', {
      title: 'Event images',
      
      currentUrl: req.originalUrl,
      data: data,
      script: false
    });
  });
});

router.get('/eventformatsgenerator', (req, res) => {
  logger.debug('/adminpro/supertools/files/eventformatsgenerator');
  var limit = 50;
  var skip = req.query.skip ? parseFloat(req.query.skip) : 0;
  let data = [];
  let adminsez = "events";
  Event.
  find({"image.file": {$exists: true}}).
  sort({_id:-1}).
  limit(limit).
  skip(skip).
  lean().
  select({image: 1, createdAt: 1}).
  exec((err, events) => {
    for (let event in events) {
      events[event].image.exists = fs.existsSync(global.appRoot+events[event].image.file);
      events[event].image.imageFormats = {};
      events[event].image.imageFormatsExists = {};
      //logger.debug(events[event]);
      //logger.debug(config.cpanel[adminsez].config.sizes.image);
      if (events[event].image.exists) {
        const file = events[event].image.file;
        const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
        const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
        const publicPath = fileFolder.replace("/glacier/events_originals/", "/warehouse/events/"); // /warehouse/2017/03
        const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        // logger.debug('fileName:' + fileName + ' fileFolder:' + fileFolder + ' fileNameWithoutExtension:' + fileNameWithoutExtension);
        for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
          events[event].image.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.image.components.image.config.sizes[format].folder}/${fileNameWithoutExtension}_${fileExtension}.jpg`;
        }
        logger.debug('image.config.sizes');
        logger.debug(config.cpanel[adminsez].forms.image.components.image.config.sizes);
        for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
          logger.debug('image.exists');
          logger.debug(events[event].image.file);
          events[event].image.imageFormatsExists[format] = fs.existsSync(global.appRoot+events[event].image.imageFormats[format]);
          logger.debug('format.exists');
          logger.debug(global.appRoot+events[event].image.imageFormats[format]);
          logger.debug(events[event].image.imageFormatsExists[format]);
          if (!events[event].image.imageFormatsExists[format]) {
            let folder = events[event].image.imageFormats[format].substring(0, events[event].image.imageFormats[format].lastIndexOf('/'))
            router.checkAndCreate(folder, () => {
              sharp(global.appRoot+events[event].image.file)
              .resize(config.cpanel[adminsez].forms.image.components.image.config.sizes[format].w, config.cpanel[adminsez].forms.image.components.image.config.sizes[format].h)
              .toFile(global.appRoot+events[event].image.imageFormats[format], (err, info) => {
                //logger.debug(err);
                //logger.debug(info);
              });
            });
          }
        }
      }
      data.push(events[event].image);
    }
    //logger.debug(req.path);
    res.render('adminpro/supertools/files/showall', {
      title: 'Event images generator',
      
    currentUrl: req.originalUrl,
      data: data,
      script: '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/files/eventformatsgenerator?skip=' + (skip+limit) + '"},1000);</script>'
    });
  });
});

router.get('/newsimages', (req, res) => {
  logger.debug('/adminpro/supertools/files/newimages');
  let data = [];
  let adminsez = "news";
  News.
  find({"image.file": {$exists: true}}).
  lean().
  select({image: 1, createdAt: 1}).
  exec((err, newss) => {
    for (let news in newss) {
      newss[news].image.exists = fs.existsSync(global.appRoot+newss[news].image.file);
      newss[news].image.imageFormats = {};
      newss[news].image.imageFormatsExists = {};
      logger.debug(newss[news]);
      //logger.debug(config.cpanel[adminsez].config.sizes.image);
      //if (newss[news].image.exists) {
        const file = newss[news].image.file;
        const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
        const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
        const publicPath = fileFolder.replace("/glacier/news_originals/", "/warehouse/news/"); // /warehouse/2017/03
        const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        // logger.debug('fileName:' + fileName + ' fileFolder:' + fileFolder + ' fileNameWithoutExtension:' + fileNameWithoutExtension);
        for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
          newss[news].image.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.public.components.image.config.sizes[format].folder}/${fileNameWithoutExtension}_${fileExtension}.jpg`;
        }
        for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
          newss[news].image.imageFormatsExists[format] = fs.existsSync(global.appRoot+newss[news].image.imageFormats[format]);
        }
      //}
      data.push(newss[news].image);
    }
    logger.debug(req.path);
    res.render('adminpro/supertools/files/showall', {
      title: 'News images',
      
    currentUrl: req.originalUrl,
      data: data,
      script: false
    });
  });
});

router.get('/newsformatsgenerator', (req, res) => {
  logger.debug('/adminpro/supertools/files/newsimages');
  var limit = 50;
  var skip = req.query.skip ? parseFloat(req.query.skip) : 0;
  let data = [];
  let adminsez = "news";
  News.
  find({"image.file": {$exists: true}}).
  limit(limit).
  skip(skip).
  lean().
  select({image: 1, createdAt: 1}).
  exec((err, newss) => {
    for (let news in newss) {
      newss[news].image.exists = fs.existsSync(global.appRoot+newss[news].image.file);
      data.push(newss[news].image);
    }
    for (let news in newss) {
      newss[news].image.exists = fs.existsSync(global.appRoot+newss[news].image.file);
      newss[news].image.imageFormats = {};
      newss[news].image.imageFormatsExists = {};
      logger.debug(newss[news]);
      //logger.debug(config.cpanel[adminsez].config.sizes.image);
      if (newss[news].image.exists) {
        const file = newss[news].image.file;
        const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
        const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
        const publicPath = fileFolder.replace("/glacier/news_originals/", "/warehouse/news/"); // /warehouse/2017/03
        const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        // logger.debug('fileName:' + fileName + ' fileFolder:' + fileFolder + ' fileNameWithoutExtension:' + fileNameWithoutExtension);
        for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
          newss[news].image.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.public.components.image.config.sizes[format].folder}/${fileNameWithoutExtension}_${fileExtension}.jpg`;
        }
        for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
          newss[news].image.imageFormatsExists[format] = fs.existsSync(global.appRoot+newss[news].image.imageFormats[format]);
          if (!newss[news].image.imageFormatsExists[format]) {
            let folder = newss[news].image.imageFormats[format].substring(0, newss[news].image.imageFormats[format].lastIndexOf('/'))
            router.checkAndCreate(folder, () => {
              sharp(global.appRoot+newss[news].image.file)
              .resize(config.cpanel[adminsez].forms.public.components.image.config.sizes[format].w, config.cpanel[adminsez].forms.public.components.image.config.sizes[format].h)
              .toFile(global.appRoot+newss[news].image.imageFormats[format], (err, info) => {
                logger.debug(err);
                logger.debug(info);
              });
            });
          }
        }
      }
      data.push(newss[news].image);
    }
    logger.debug(req.path);
    res.render('adminpro/supertools/files/showall', {
      title: 'News images generator',
      
    currentUrl: req.originalUrl,
      data: data,
      script: data.length ? '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/files/newsformatsgenerator?skip=' + (skip+limit) + '"},1000);</script>' : ''
    });
  });
});

router.get('/playlistimages', (req, res) => {
  logger.debug('/adminpro/supertools/files/playlistimages');
  let data = [];
  Playlist.
  find({"image.file": {$exists: true}}).
  lean().
  select({image: 1, createdAt: 1}).
  exec((err, playlists) => {
    for (let playlist in playlists) {
      playlists[playlist].image.exists = fs.existsSync(global.appRoot+playlists[playlist].image.file);
      data.push(playlists[playlist].image);
    }
    logger.debug(req.path);
    res.render('adminpro/supertools/files/showall', {
      title: 'Performance images',
      
    currentUrl: req.originalUrl,
      data: data,
      script: false
    });
  });
});

router.get('/footagefiles', (req, res) => {
  logger.debug('/adminpro/supertools/files/footagefiles');
  let data = [];
  const adminsez = 'footage';
  var valid = [
    "mp4",
    "mov",
    "MOV",
    "m4v",
    "MP4",
    "AVI",
    "flv",
    "avi",
    "mpg"
  ];
  Footage.
  find({"media.file": {$exists: true}}).
  lean().

  select({media: 1, createdAt: 1}).
  exec((err, footages) => {
    for (let footage in footages) {
      footages[footage].media.exists = fs.existsSync(global.appRoot+footages[footage].media.file);
      footages[footage].media.imageFormats = {};
      footages[footage].media.imageFormatsExists = {};
      const file = footages[footage].media.file;
      const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
      const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
      const publicPath = fileFolder.replace("/glacier/footage_originals/", "/warehouse/footage/"); // /warehouse/2017/03
      const oldPath = fileFolder.replace("/glacier/footage_originals/", "/warehouse/"); // /warehouse/2017/03
      const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
      const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
      if (fileExtension == "swf" || fileExtension == "flv") {
        footages[footage].media.original = footages[footage].media.file;
      }
      let originalFileExtension = fileNameWithoutExtension.substring(fileNameWithoutExtension.lastIndexOf('_') + 1);
      let originalFileName = '';
      if (!footages[footage].media.exists) {
        footages[footage].media.find = `mkdir /sites/avnode.net${fileFolder}<br />find /space/PhpMysql2015/sites/flxer${oldPath.replace("/warehouse/footage", "/warehouse")} -name '${fileName}' -exec cp "{}" /sites/avnode.net${fileFolder}/${fileName} \\;`;
      }

      if (valid.indexOf(originalFileExtension)===-1) {
        originalFileName = fileNameWithoutExtension;
        originalFileExtension = fileNameWithoutExtension;
      } else {
        originalFileName = fileNameWithoutExtension.substring(0, fileNameWithoutExtension.lastIndexOf('_'));
      }
      /*
      for(let format in config.cpanel[adminsez].forms.video.components.media.config.sizes) {
        logger.debug(footages[footage].media);
        footages[footage].media.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.video.components.media.config.sizes[format].folder}/${fileNameWithoutExtension}_${fileExtension}.jpg`;
      }
      for(let format in config.cpanel[adminsez].forms.video.components.media.config.sizes) {
        footages[footage].media.imageFormatsExists[format] = fs.existsSync(global.appRoot+footages[footage].media.imageFormats[format]);
      }
      */
      logger.debug("stocazzo1 "+footages[footage].media.preview);
      if (footages[footage].media.preview) {
        logger.debug("stocazzo2 "+global.appRoot+footages[footage].media.preview);
        footages[footage].media.previewexists = fs.existsSync(global.appRoot+footages[footage].media.preview);
        logger.debug("stocazzo3 "+footages[footage].media.preview);
        const previewFile = footages[footage].media.preview;
        const previewFileName = previewFile.substring(previewFile.lastIndexOf('/') + 1); // previewFile.jpg this.previewFile.previewFile.substr(19)
        const previewFileFolder = previewFile.substring(0, previewFile.lastIndexOf('/')); // /warehouse/2017/03
        const publicPath = previewFileFolder.replace("/glacier/footage_previews/", "/warehouse/footage_previews/"); // /warehouse/2017/03
        const oldPath = previewFileFolder.replace("/glacier/footage_previews/", "/warehouse/"); // /warehouse/2017/03
        const previewFileNameWithoutExtension = previewFileName.substring(0, previewFileName.lastIndexOf('.'));
        const previewFileExtension = previewFileName.substring(previewFileName.lastIndexOf('.') + 1);
        if (!footages[footage].media.previewexists) {
          footages[footage].media.previewexists = fs.existsSync(global.appRoot+footages[footage].media.preview.replace('.png','.jpg'));
          if (footages[footage].media.previewexists) {
            footages[footage].media.findpreview = `mv ${global.appRoot+footages[footage].media.preview} ${global.appRoot+footages[footage].media.preview.replace('.png','.jpg')}`;
          } else {
            footages[footage].media.findpreview = `mkdir /sites/avnode.net${previewFileFolder}<br />find /space/PhpMysql2015/sites/flxer${oldPath.replace("/warehouse/footage", "warehouse/")} -name '${previewFileName}' -exec cp "{}" /sites/avnode.net${previewFileFolder}/${previewFileName} \\;`;
          }
        }
        if (footages[footage].media.previewexists) {
          // logger.debug('previewFileName:' + previewFileName + ' previewFileFolder:' + previewFileFolder + ' previewFileNameWithoutExtension:' + previewFileNameWithoutExtension);
          for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
            footages[footage].media.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.public.components.media.config.sizes[format].folder}/${previewFileNameWithoutExtension}_${previewFileExtension}.jpg`;
          }
          for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
            footages[footage].media.imageFormatsExists[format] = fs.existsSync(global.appRoot+footages[footage].media.imageFormats[format]);
          }
        } else {
          //footages[footage].media.findpreview = `mkdir ${previewFileFolder.replace("/glacier/", "glacier/")}<br />find ${oldPath.replace("/warehouse/", "warehouse/")} -name '${previewFileName.replace('.png','*.png')}' -exec cp "{}" ${previewFileFolder.replace("/glacier/", "glacier/")}/${previewFileName} \\;`;
          //footages[footage].media.findpreview = `mkdir ${previewFileFolder.replace("/glacier/", "glacier/")}<br />find warehouse/ -name '${previewFileName.replace('.png','.jpg')}' -exec cp "{}" ${previewFileFolder.replace("/glacier/", "glacier/")} \\;`;
          //footages[footage].media.findpreview = `mkdir ${previewFileFolder.replace("/glacier/", "glacier/")}<br />find warehouse/ -name '${previewFileName.replace('.png','_flv.png')}' -exec cp "{}" ${previewFileFolder.replace("/glacier/", "glacier/")}/${previewFileName} \\;`;
          //footages[footage].media.preview = fileFolder.replace('/warehouse/footage/', '/warehouse/footage_previews/')+'/'+fileNameWithoutExtension+'.png';
          //footages[footage].media.previewexists = fs.existsSync(global.appRoot+footages[footage].media.preview);
        }
      }
      if (footages[footage].media.original) {
        const originalFile = footages[footage].media.original;
        const originalFileName = originalFile.substring(originalFile.lastIndexOf('/') + 1); // previewFile.jpg this.previewFile.previewFile.substr(19)
        const originalFileFolder = originalFile.substring(0, originalFile.lastIndexOf('/')); // /warehouse/2017/03
        const oldPath = fileFolder.replace("/glacier/footage_originals/", "/warehouse/"); // /warehouse/2017/03
        //footages[footage].media.original = fileFolder.replace('/warehouse/footage/', '/glacier/footage_originals/')+'/'+originalFileName+'.'+originalFileExtension;
        footages[footage].media.originalexists = fs.existsSync(global.appRoot+footages[footage].media.original);
        if (!footages[footage].media.originalexists) {
          footages[footage].media.findoriginal= `mkdir /sites/avnode.net${originalFileFolder}<br />find /space/PhpMysql2015/sites/flxer${oldPath.replace("/warehouse/footage", "/warehouse")} -name '${originalFileName}' -exec cp "{}" /sites/avnode.net${originalFileFolder}/${originalFileName} \\;`;
        }
      }
      data.push(footages[footage].media);
    }
    logger.debug(req.path);
    if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
      res.json(data);
    } else {
      res.render('adminpro/supertools/files/showall_videos', {
        title: 'Footage images',
        
        currentUrl: req.originalUrl,
        data: data,
        script: false
      });
    }
  });
});

router.get('/footagerenamer', (req, res) => {
  logger.debug('/adminpro/supertools/files/footagefiles');
  let data = [];
  const adminsez = 'footage';
  var valid = [
    "mp4",
    "mov",
    "MOV",
    "m4v",
    "MP4",
    "AVI",
    "flv",
    "avi",
    "mpg"
  ];
  Footage.
  find({"media.file": {$exists: true}}).
  lean().

  select({media: 1, createdAt: 1}).
  exec((err, footages) => {
    for (let footage in footages) {
     if (footages[footage].media.preview) {
        footages[footage].media.previewexists = fs.existsSync(global.appRoot+footages[footage].media.preview);
        if (!footages[footage].media.previewexists) {
          footages[footage].media.previewexists = fs.existsSync(global.appRoot+footages[footage].media.preview.replace('.png','.jpg'));
          if (footages[footage].media.previewexists) footages[footage].media.renamepreview = `db.footage.find({'media.preview': '${footages[footage].media.preview}'}).forEach(function(e){e.media.preview = '${footages[footage].media.preview.replace('.png','.jpg')}';db.footage.save(e)});`;
        }
        if (!footages[footage].media.previewexists) {
          footages[footage].media.previewexists = fs.existsSync(global.appRoot+footages[footage].media.preview.replace('.png','_swf.jpg'));
          if (footages[footage].media.previewexists) footages[footage].media.renamepreview = `db.footage.find({'media.preview': '${footages[footage].media.preview}'}).forEach(function(e){e.media.preview = '${footages[footage].media.preview.replace('.png','_swf.jpg')}';db.footage.save(e)});`;
        }
        if (footages[footage].media.renamepreview) {
          data.push(footages[footage].media);
        }
      }
    }
    res.render('adminpro/supertools/files/renamer', {
      title: 'Footage renamer',
      
    currentUrl: req.originalUrl,
      data: data,
      script: false
    });
  });
});

router.get('/footageformatsgenerator', (req, res) => {
  logger.debug('/adminpro/supertools/files/footageformatsgenerator');
  var limit = 50;
  var skip = req.query.skip ? parseFloat(req.query.skip) : 0;
  let data = [];
  const adminsez = 'footage';
  var valid = [
    "mp4",
    "mov",
    "MOV",
    "m4v",
    "MP4",
    "AVI",
    "flv",
    "avi",
    "mpg"
  ];
  Footage.
  find({"media.file": {$exists: true}}).
  lean().
  limit(limit).
  skip(skip).
  select({media: 1, createdAt: 1}).
  exec((err, footages) => {
    for (let footage in footages) {
      footages[footage].media.exists = fs.existsSync(global.appRoot+footages[footage].media.file);
      footages[footage].media.imageFormats = {};
      footages[footage].media.imageFormatsExists = {};
      const file = footages[footage].media.file;
      const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
      const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
      const publicPath = fileFolder.replace("/glacier/footage_originals/", "/warehouse/footage/"); // /warehouse/2017/03
      const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
      const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
      let originalFileExtension = fileNameWithoutExtension.substring(fileNameWithoutExtension.lastIndexOf('_') + 1);
      let originalFileName = '';

      if (valid.indexOf(originalFileExtension)===-1) {
        originalFileName = fileNameWithoutExtension;
        originalFileExtension = fileNameWithoutExtension;
      } else {
        originalFileName = fileNameWithoutExtension.substring(0, fileNameWithoutExtension.lastIndexOf('_'));
      }
      /*
      for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
        logger.debug(footages[footage].media);
        footages[footage].media.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.public.components.media.config.sizes[format].folder}/${fileNameWithoutExtension}_${fileExtension}.jpg`;
      }
      for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
        footages[footage].media.imageFormatsExists[format] = fs.existsSync(global.appRoot+footages[footage].media.imageFormats[format]);
      }
      */
     logger.debug("stocazzo1 "+footages[footage].media.preview);
     if (footages[footage].media.preview) {
        logger.debug("stocazzo2 "+global.appRoot+footages[footage].media.preview);
        footages[footage].media.previewexists = fs.existsSync(global.appRoot+footages[footage].media.preview);
        if (footages[footage].media.previewexists) {
          logger.debug("stocazzo3 "+footages[footage].media.preview);
          const previewFile = footages[footage].media.preview;
          const previewFileName = previewFile.substring(previewFile.lastIndexOf('/') + 1); // previewFile.jpg this.previewFile.previewFile.substr(19)
          const previewFileFolder = previewFile.substring(0, previewFile.lastIndexOf('/')); // /warehouse/2017/03
          const publicPath = previewFileFolder.replace("/glacier/footage_previews/", "/warehouse/footage_previews/"); // /warehouse/2017/03
          const previewFileNameWithoutExtension = previewFileName.substring(0, previewFileName.lastIndexOf('.'));
          const previewFileExtension = previewFileName.substring(previewFileName.lastIndexOf('.') + 1);
          // logger.debug('previewFileName:' + previewFileName + ' previewFileFolder:' + previewFileFolder + ' previewFileNameWithoutExtension:' + previewFileNameWithoutExtension);
          for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
            footages[footage].media.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.public.components.media.config.sizes[format].folder}/${previewFileNameWithoutExtension}_${previewFileExtension}.jpg`;
          }
          for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
            footages[footage].media.imageFormatsExists[format] = fs.existsSync(global.appRoot+footages[footage].media.imageFormats[format]);
            if (!footages[footage].media.imageFormatsExists[format]) {
              let folder = footages[footage].media.imageFormats[format].substring(0, footages[footage].media.imageFormats[format].lastIndexOf('/'))
              router.checkAndCreate(folder, () => {
                logger.debug("stocazzo "+global.appRoot+previewFile);
                sharp(global.appRoot+previewFile)
                .resize(config.cpanel[adminsez].forms.public.components.media.config.sizes[format].w, config.cpanel[adminsez].forms.public.components.media.config.sizes[format].h)
                .toFile(global.appRoot+footages[footage].media.imageFormats[format], (err, info) => {
                  logger.debug(err);
                  logger.debug(info);
                });
              });
            }
          }
        }
      } else {
        //footages[footage].media.preview = fileFolder.replace('/warehouse/footage/', '/warehouse/footage_previews/')+'/'+fileNameWithoutExtension+'.png';
        //footages[footage].media.previewexists = fs.existsSync(global.appRoot+footages[footage].media.preview);
      }
      if (fileExtension=="mp4") {
        footages[footage].media.original = fileFolder.replace('/warehouse/footage/', '/glacier/footage_originals/')+'/'+originalFileName+'.'+originalFileExtension;
        footages[footage].media.originalexists = fs.existsSync(global.appRoot+footages[footage].media.original);
      }
      data.push(footages[footage].media);
    }
    logger.debug(req.path);
    res.render('adminpro/supertools/files/showall', {
      title: 'Footage images generator',
      
      currentUrl: req.originalUrl,
      data: data,
      script: data.length ? '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/files/footageformatsgenerator?skip=' + (skip+limit) + '"},1000);</script>' : ''
    });
  });
});

router.get('/videofiles', (req, res) => {
  logger.debug('/adminpro/supertools/files/videofiles');
  let data = [];
  const adminsez = 'videos';
  var valid = [
    "mp4",
    "mov",
    "MOV",
    "m4v",
    "MP4",
    "AVI",
    "flv",
    "avi",
    "mpg"
  ];
  Video.
  find({}).
  lean().
  select({media: 1, title: 1, slug: 1, is_public: 1, createdAt: 1}).
  exec((err, videos) => {
    for (let video in videos) {
      let oldPath
      let fileFolder
      if (videos[video].media && videos[video].media.file) {
        videos[video].media.exists = fs.existsSync(global.appRoot+videos[video].media.file);
        videos[video].media.imageFormats = {};
        videos[video].media.imageFormatsExists = {};
        
        const file = videos[video].media.file;
        const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
        fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
        const publicPath = fileFolder.replace("/glacier/video_originals/", "/warehouse/videos/"); // /warehouse/2017/03
        oldPath = fileFolder.replace("/glacier/videos_originals/", "/warehouse/"); // /warehouse/2017/03
        const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        let originalFileExtension = fileNameWithoutExtension.substring(fileNameWithoutExtension.lastIndexOf('_') + 1);
        let originalFileName = '';
        if (!videos[video].media.exists) {
          videos[video].media.find = `mkdir /sites/avnode.net${fileFolder}<br />find /space/PhpMysql2015/sites/flxer${oldPath.replace("/warehouse/videos", "/warehouse")} -name '${fileName}' -exec cp "{}" /sites/avnode.net${fileFolder}/${fileName} \\;`;
        }

        if (valid.indexOf(originalFileExtension)===-1) {
          originalFileName = fileNameWithoutExtension;
          originalFileExtension = fileNameWithoutExtension;
        } else {
          originalFileName = fileNameWithoutExtension.substring(0, fileNameWithoutExtension.lastIndexOf('_'));
        }
      } else {
        if (!videos[video].media) videos[video].media = {};
        videos[video].media.exists = false;
      }
      /*
      for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
        logger.debug(videos[video].media);
        videos[video].media.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.public.components.media.config.sizes[format].folder}/${fileNameWithoutExtension}_${fileExtension}.jpg`;
      }
      for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
        videos[video].media.imageFormatsExists[format] = fs.existsSync(global.appRoot+videos[video].media.imageFormats[format]);
      }
      */
      logger.debug("stocazzo1 "+videos[video].media.preview);
      if (videos[video].media.preview) {
        logger.debug("stocazzo2 "+global.appRoot+videos[video].media.preview);
        videos[video].media.previewexists = fs.existsSync(global.appRoot+videos[video].media.preview);
        logger.debug("stocazzo3 "+videos[video].media.preview);
        const previewFile = videos[video].media.preview;
        const previewFileName = previewFile.substring(previewFile.lastIndexOf('/') + 1); // previewFile.jpg this.previewFile.previewFile.substr(19)
        const previewFileFolder = previewFile.substring(0, previewFile.lastIndexOf('/')); // /warehouse/2017/03
        const publicPath = previewFileFolder.replace("/glacier/videos_previews/", "/warehouse/videos_previews/"); // /warehouse/2017/03
        const previewFileNameWithoutExtension = previewFileName.substring(0, previewFileName.lastIndexOf('.'));
        const previewFileExtension = previewFileName.substring(previewFileName.lastIndexOf('.') + 1);
        if (!videos[video].media.previewexists) {
          videos[video].media.previewexists = fs.existsSync(global.appRoot+videos[video].media.preview.replace('.png','.jpg'));
          if (videos[video].media.previewexists) {
            videos[video].media.findpreview = `mv ${global.appRoot+videos[video].media.preview} ${global.appRoot+videos[video].media.preview.replace('.png','.jpg')}`;
          } else if (oldPath) {
            videos[video].media.findpreview = `mkdir /sites/avnode.net${previewFileFolder}<br />find /space/PhpMysql2015/sites/flxer${oldPath.replace("/warehouse/videos", "/warehouse")}/preview_files -name '${previewFileName}' -exec cp "{}" /sites/avnode.net${previewFileFolder}/${previewFileName} \\;`;
          }
        }
        if (videos[video].media.previewexists) {
          if (!videos[video].media.imageFormats) videos[video].media.imageFormats = {};
          if (!videos[video].media.imageFormatsExists) videos[video].media.imageFormatsExists = {};

          // logger.debug('previewFileName:' + previewFileName + ' previewFileFolder:' + previewFileFolder + ' previewFileNameWithoutExtension:' + previewFileNameWithoutExtension);
          for(let format in config.cpanel[adminsez].forms.video.components.media.config.sizes) {
            videos[video].media.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.video.components.media.config.sizes[format].folder}/${previewFileNameWithoutExtension}_${previewFileExtension}.jpg`;
          }
          for(let format in config.cpanel[adminsez].forms.video.components.media.config.sizes) {
            videos[video].media.imageFormatsExists[format] = fs.existsSync(global.appRoot+videos[video].media.imageFormats[format]);
          }
        }
      } else {
        //videos[video].media.preview = fileFolder.replace('/warehouse/videos/', '/warehouse/videos_previews/')+'/'+fileNameWithoutExtension+'.png';
        //videos[video].media.previewexists = fs.existsSync(global.appRoot+videos[video].media.preview);
      }
      if (/* fileExtension=="mp4" && */ videos[video].media.original) {
        //videos[video].media.original = fileFolder.replace('/warehouse/videos/', '/glacier/videos_originals/')+'/'+originalFileName+'.'+originalFileExtension;
        const originalFile = videos[video].media.original;
        const originalFileName = originalFile.substring(originalFile.lastIndexOf('/') + 1); // previewFile.jpg this.previewFile.previewFile.substr(19)
        const originalFileFolder = originalFile.substring(0, originalFile.lastIndexOf('/')); // /warehouse/2017/03
        if (fileFolder) oldPath = fileFolder.replace("/glacier/videos_originals/", "/warehouse/"); // /warehouse/2017/03

        videos[video].media.originalexists = fs.existsSync(global.appRoot+videos[video].media.original);
        if (!videos[video].media.originalexists) {
          if (oldPath) {
            videos[video].media.findoriginal= `mkdir /sites/avnode.net${originalFileFolder}<br />find /space/PhpMysql2015/sites/flxer${oldPath.replace("/warehouse/videos", "/warehouse")}/original_video -name '${originalFileName}' -exec cp "{}" /sites/avnode.net${originalFileFolder}/${originalFileName} \\;`;
          } else {
            videos[video].media.findoriginal= `mkdir /sites/avnode.net${originalFileFolder}<br />find /space/PhpMysql2015/sites/flxer/warehouse/ -name '${originalFileName}' -exec cp "{}" /sites/avnode.net${originalFileFolder}/${originalFileName} \\;`;
          }
        }
      }
      videos[video].media.title = videos[video].title;
      videos[video].media.slug = videos[video].slug;
      videos[video].media.id = videos[video]._id;
      videos[video].media.is_public = videos[video].is_public;
      data.push(videos[video].media);
    }
    if (req.query.api==1) {
      res.json(data);
    } else {
      logger.debug(req.path);
      res.render('adminpro/supertools/files/showall_videos', {
        title: 'Video images',
        
        currentUrl: req.originalUrl,
        data: data,
        script: false
      });
    }
  });
});

router.get('/videofilestodelete', (req, res) => {
  var glob = require("glob")
  let adminsez = "videos";
  logger.debug('getVideosToDelete');
  //logger.debug(query);
  var files = [];
  var options = {
    nodir: true,
    cwd: global.appRoot+"/warehouse/videos/"
  }
  glob("**/*", options, function (er, warehouse) {
    for (var item in warehouse) warehouse[item] = "/warehouse/videos/"+warehouse[item]
    files = files.concat(warehouse);
    options.cwd = global.appRoot+"/warehouse/videos_previews/";
    glob("**/*", options, function (er, videos_previews) {
      for (var item in videos_previews) videos_previews[item] = "/warehouse/videos_previews/"+videos_previews[item]
      files = files.concat(videos_previews);
      options.cwd = global.appRoot+"/glacier/videos_originals/";
      glob("**/*", options, function (er, videos_originals) {
        for (var item in videos_originals) videos_originals[item] = "/glacier/videos_originals/"+videos_originals[item]
        files = files.concat(videos_originals);
        options.cwd = global.appRoot+"/glacier/videos_previews/";
        glob("**/*", options, function (er, videos_previews_originals) {
          for (var item in videos_previews_originals) videos_previews_originals[item] = "/glacier/videos_previews/"+videos_previews_originals[item]
          files = files.concat(videos_previews_originals);
          Video
          .find({"media": {$exists: true}})
          .select({_id: 1, media: 1})
          .exec((err, data) => {
            //console.log(data[0]);
            var dbfiles = data.map((item) => {return item.media.file});
            dbfiles = dbfiles.concat(data.map((item) => {return item.media.original}));
            dbfiles = dbfiles.concat(data.map((item) => {return item.media.preview}));
            dbfiles = dbfiles.concat(data.map((item) => {return item.imageFormats.small.replace("https://avnode.net","")}));
            dbfiles = dbfiles.concat(data.map((item) => {return item.imageFormats.large.replace("https://avnode.net","")}));
            var todelete = files;
            for (var item in todelete) {
              if (dbfiles.indexOf(todelete[item])!== -1) todelete.splice(item, 1);
            }
            var promises = {
              todelete: todelete,
              files: files,
              dbfiles: dbfiles
            };

            //Do the stuff you need to do after renaming the files
            if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
              //res.json(router.moveFiles(todelete));
              res.json(todelete);
            } else {
              res.render('adminpro/supertools/files/showall', {
                title: 'User images',
                currentUrl: req.originalUrl,
                data: data,
                script: false
              });
            }
          });        
        });  
      });
    })
  })
});

router.get('/videofilestodelete_2', (req, res) => {
  var glob = require("glob")
  logger.debug('getVideosToDelete 2');
  var files = [];
  var options = {
    nodir: true,
  }
  options.cwd = global.appRoot+"/warehouse/videos_previews/";
  glob("**/*", options, function (er, videos_previews) {
    for (var item in videos_previews) videos_previews[item] = "/warehouse/videos_previews/"+videos_previews[item]
    files = files.concat(videos_previews);
    Video
    .find({"media": {$exists: true}})
    .select({_id: 1, media: 1})
    .exec((err, data) => {
      //console.log(data[0]);
      var dbfiles = [];
      dbfiles = dbfiles.concat(data.map((item) => {return item.imageFormats.small.replace("https://avnode.net","")}));
      dbfiles = dbfiles.concat(data.map((item) => {return item.imageFormats.large.replace("https://avnode.net","")}));
      var todelete = files;
      for (var item in todelete) {
        if (dbfiles.indexOf(todelete[item])!== -1) todelete.splice(item, 1);
      }
      var dd = {
        todelete: todelete,
        files: files.length,
        dbfiles: dbfiles.length
      };

      //Do the stuff you need to do after renaming the files
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        res.json(router.moveFiles(todelete, req));
        //res.json(promises);
      } else {
        res.render('adminpro/supertools/files/showall', {
          title: 'User images',
          currentUrl: req.originalUrl,
          data: data,
          script: false
        });
      }
    });        
  })
});

router.get('/videofilestodelete_1', (req, res) => {
  var glob = require("glob")
  logger.debug('getVideosToDelete 1');
  var files = [];
  var options = {
    nodir: true
  }
  options.cwd = global.appRoot+"/warehouse/videos/";
  glob("**/*", options, function (er, videos) {
    for (var item in videos) videos[item] = "/warehouse/videos/"+videos[item]
    files = files.concat(videos);
    Video
    .find({"media": {$exists: true}})
    .select({_id: 1, media: 1})
    .exec((err, data) => {
      //console.log(data[0]);
      var dbfiles = data.map((item) => {return item.media.file});
      var todelete = files;
      for (var item in todelete) {
        if (dbfiles.indexOf(todelete[item])!== -1) todelete.splice(item, 1);
      }
      var dd = {
        todelete: todelete,
        files: files.length,
        dbfiles: dbfiles.length
      };

      //Do the stuff you need to do after renaming the files
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        router.moveFiles(todelete, req, (move) => {
          dd.move = move.length;
          
          res.json(dd);
        });
        //res.json(dd);
      } else {
        res.render('adminpro/supertools/files/showall', {
          title: 'User images',
          currentUrl: req.originalUrl,
          data: data,
          script: false
        });
      }
    });        
  })
});


router.moveFiles = (todelete, req) => {
  const fs = require('fs');
  var test = []
  for (var item in todelete) {
    var move = {
      file: global.appRoot+todelete[item],
      newf: global.appRoot+todelete[item].replace("warehouse", "warehouse/_buttare").replace("glacier", "glacier/_buttare")
    }
    move.fold = move.newf.substring(0, move.newf.lastIndexOf("/"));
    test.push(move);
    if (req.query.move) {
      if (!fs.existsSync(move.fold))
        fs.mkdirSync(move.fold, { recursive: true });
      fs.renameSync(move.file, move.newf);
    }
  }
  return(test)
}

router.moveFilesPromise = (todelete) => {
  return new Promise(function (resolve, reject) {
    const util = require('util');
    const fs = require('fs');
    //console.log("fs.promises.rename");
    //console.log(fs.promises.rename);

    //const rename = util.promisify(fs.rename);
    //console.log(todelete.map(oldname => console.log(global.appRoot+oldname, global.appRoot+"/buttare"+oldname)));

    var promises = []
    var test = []
    for (var item in todelete) {
      if (!fs.existsSync(global.appRoot+todelete[item].replace("warehouse", "warehouse/_buttare").replace("glacier", "glacier/_buttare").substring(0,todelete[item].lastIndexOf("/")))) 
        promises.push(fs.promises.mkdir(global.appRoot+todelete[item].replace("warehouse", "warehouse/_buttare").replace("glacier", "glacier/_buttare").substring(0,todelete[item].lastIndexOf("/")), { recursive: true }));
      test.push(global.appRoot+todelete[item].replace("warehouse", "warehouse/_buttare").replace("glacier", "glacier/_buttare").substring(0,todelete[item].lastIndexOf("/")));
    }
      for (var item in todelete) promises.push(fs.renameSync(global.appRoot+todelete[item], global.appRoot+todelete[item].replace("warehouse", "warehouse/_buttare").replace("glacier", "glacier/_buttare")))
      console.log(test)
      Promise.all(promises)
    .then( (resultsPromise) => {
      setTimeout(function() {
        for (var item in todelete) 
          fs.renameSync(global.appRoot+todelete[item], global.appRoot+todelete[item].replace("warehouse", "warehouse/_buttare").replace("glacier", "glacier/_buttare"));


        resolve(resultsPromise)
      }, 1000);
    });
  });
}


router.get('/videocleaner', (req, res) => {
  logger.debug('/adminpro/supertools/files/videocleaner');
  const adminsez = 'videos';
  let files = {
    files: {
      basefolder: "/warehouse/videos/",
      filelist: []
    },
    originals: {
      basefolder: "/glacier/videos_originals/",
      filelist: []
    },
    previews: {
      basefolder: "/glacier/videos_previews/",
      filelist: []
    },
    previews_formats: {
      basefolder: "/warehouse/videos_previews/",
      filelist: []
    }
  };
  var fs = require('fs');
  var path = require('path');
  var walk = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var i = 0;
      (function next() {
        var file = list[i++];
        if (!file) return done(null, results);
        file = path.resolve(dir, file);
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file, function(err, res) {
              results = results.concat(res);
              next();
            });
          } else {
            results.push(file);
            next();
          }
        });
      })();
    });
  };
  
  walk(global.appRoot+files.files.basefolder, function(err, folder_list_files) {
    if (err) throw err;
    files.files.folder_list = folder_list_files;
    walk(global.appRoot+files.originals.basefolder, function(err, folder_list_originals) {
      if (err) throw err;
      files.originals.folder_list = folder_list_originals;
      walk(global.appRoot+files.previews.basefolder, function(err, folder_list_previews) {
        if (err) throw err;
        files.previews.folder_list = folder_list_previews;
        walk(global.appRoot+files.previews_formats.basefolder, function(err, previews_formats) {
          if (err) throw err;
          files.previews_formats.folder_list = previews_formats;
          Video.
          find({}).
          lean().
          //limit(100).
          select({media: 1}).
          exec((err, videos) => {
            for (let video in videos) {
              if (videos[video].media && videos[video].media.file) files.files.filelist.push(global.appRoot+videos[video].media.file);
              if (videos[video].media && videos[video].media.original) files.originals.filelist.push(global.appRoot+videos[video].media.original);
              if (videos[video].media && videos[video].media.preview) {
                files.previews.filelist.push(global.appRoot+videos[video].media.preview);
                const previewFile = videos[video].media.preview;
                const previewFileName = previewFile.substring(previewFile.lastIndexOf('/') + 1); // previewFile.jpg this.previewFile.previewFile.substr(19)
                const previewFileFolder = previewFile.substring(0, previewFile.lastIndexOf('/')); // /warehouse/2017/03
                const publicPath = previewFileFolder.replace("/glacier/videos_previews/", "/warehouse/videos_previews/"); // /warehouse/2017/03
                const previewFileNameWithoutExtension = previewFileName.substring(0, previewFileName.lastIndexOf('.'));
                const previewFileExtension = previewFileName.substring(previewFileName.lastIndexOf('.') + 1);
                for(let format in config.cpanel[adminsez].forms.video.components.media.config.sizes) {
                  if (!files.previews_formats.filelist[format]) files.previews_formats.filelist[format] = [];
                  files.previews_formats.filelist.push(`${global.appRoot}${publicPath}/${config.cpanel[adminsez].forms.video.components.media.config.sizes[format].folder}/${previewFileNameWithoutExtension}_${previewFileExtension}.jpg`);
                }
              }
            }
            files.files.delete = files.files.folder_list.filter(x => !files.files.filelist.includes(x));
            files.originals.delete = files.originals.folder_list.filter(x => !files.originals.filelist.includes(x));
            files.previews.delete = files.previews.folder_list.filter(x => !files.previews.filelist.includes(x));
            files.previews_formats.delete = files.previews_formats.folder_list.filter(x => !files.previews_formats.filelist.includes(x));
            if (req.query.api==1) {
              res.json(files);
            } else {
              logger.debug(req.path);
              res.render('adminpro/supertools/files/showall_videos', {
                title: 'Video images',
                
                currentUrl: req.originalUrl,
                data: data,
                script: false
              });
            }
          });
        });
      });
    });
  });
});

router.get('/videoformatsgenerator', (req, res) => {
  logger.debug('/adminpro/supertools/files/videoformatsgenerator');
  var limit = 50;
  var skip = req.query.skip ? parseFloat(req.query.skip) : 0;
  let data = [];
  const adminsez = 'videos';
  var valid = [
    "mp4",
    "mov",
    "MOV",
    "m4v",
    "MP4",
    "AVI",
    "flv",
    "avi",
    "mpg"
  ];
  Video.
  find({"media.file": {$exists: true}}).
  lean().
  limit(limit).
  skip(skip).
  select({media: 1, createdAt: 1}).
  exec((err, videos) => {
    for (let video in videos) {
      videos[video].media.exists = fs.existsSync(global.appRoot+videos[video].media.file);
      videos[video].media.imageFormats = {};
      videos[video].media.imageFormatsExists = {};
      const file = videos[video].media.file;
      const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
      const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
      const publicPath = fileFolder.replace("/glacier/video_originals/", "/warehouse/videos/"); // /warehouse/2017/03
      const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
      const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
      let originalFileExtension = fileNameWithoutExtension.substring(fileNameWithoutExtension.lastIndexOf('_') + 1);
      let originalFileName = '';

      if (valid.indexOf(originalFileExtension)===-1) {
        originalFileName = fileNameWithoutExtension;
        originalFileExtension = fileNameWithoutExtension;
      } else {
        originalFileName = fileNameWithoutExtension.substring(0, fileNameWithoutExtension.lastIndexOf('_'));
      }
      /*
      for(let format in config.cpanel[adminsez].forms.video.components.media.config.sizes) {
        logger.debug(videos[video].media);
        videos[video].media.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.video.components.media.config.sizes[format].folder}/${fileNameWithoutExtension}_${fileExtension}.jpg`;
      }
      for(let format in config.cpanel[adminsez].forms.video.components.media.config.sizes) {
        videos[video].media.imageFormatsExists[format] = fs.existsSync(global.appRoot+videos[video].media.imageFormats[format]);
      }
      */
     if (videos[video].media.preview) {
        videos[video].media.previewexists = fs.existsSync(global.appRoot+videos[video].media.preview);
        if (videos[video].media.previewexists) {
          const previewFile = videos[video].media.preview;
          const previewFileName = previewFile.substring(previewFile.lastIndexOf('/') + 1); // previewFile.jpg this.previewFile.previewFile.substr(19)
          const previewFileFolder = previewFile.substring(0, previewFile.lastIndexOf('/')); // /warehouse/2017/03
          const publicPath = previewFileFolder.replace("/glacier/videos_previews/", "/warehouse/videos_previews/"); // /warehouse/2017/03
          const previewFileNameWithoutExtension = previewFileName.substring(0, previewFileName.lastIndexOf('.'));
          const previewFileExtension = previewFileName.substring(previewFileName.lastIndexOf('.') + 1);
          // logger.debug('previewFileName:' + previewFileName + ' previewFileFolder:' + previewFileFolder + ' previewFileNameWithoutExtension:' + previewFileNameWithoutExtension);
          for(let format in config.cpanel[adminsez].forms.video.components.media.config.sizes) {
            videos[video].media.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.video.components.media.config.sizes[format].folder}/${previewFileNameWithoutExtension}_${previewFileExtension}.jpg`;
          }
          for(let format in config.cpanel[adminsez].forms.video.components.media.config.sizes) {
            videos[video].media.imageFormatsExists[format] = fs.existsSync(global.appRoot+videos[video].media.imageFormats[format]);
            if (!videos[video].media.imageFormatsExists[format]) {
              let folder = videos[video].media.imageFormats[format].substring(0, videos[video].media.imageFormats[format].lastIndexOf('/'))
              router.checkAndCreate(folder, () => {
                sharp(global.appRoot+previewFile)
                .resize(config.cpanel[adminsez].forms.video.components.media.config.sizes[format].w, config.cpanel[adminsez].forms.video.components.media.config.sizes[format].h)
                .toFile(global.appRoot+videos[video].media.imageFormats[format], (err, info) => {
                  logger.debug(err);
                  logger.debug(info);
                });
              });
            }
          }
        }
      } else {
        //videos[video].media.preview = fileFolder.replace('/warehouse/videos/', '/warehouse/videos_previews/')+'/'+fileNameWithoutExtension+'.png';
        //videos[video].media.previewexists = fs.existsSync(global.appRoot+videos[video].media.preview);
      }
      if (fileExtension=="mp4") {
        videos[video].media.original = fileFolder.replace('/warehouse/videos/', '/glacier/videos_originals/')+'/'+originalFileName+'.'+originalFileExtension;
        videos[video].media.originalexists = fs.existsSync(global.appRoot+videos[video].media.original);
      }
      data.push(videos[video].media);
    }
    if (req.query.api==1) {
      res.json(data);
    } else {
      logger.debug(req.path);
      res.render('adminpro/supertools/files/showall_videos', {
        title: 'Video images generator',
        
        currentUrl: req.originalUrl,
        data: data,
        script: data.length ? '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/files/videoformatsgenerator?skip=' + (skip+limit) + '"},1000);</script>' : ''
      });
    }
  });
});




router.get('/galleryimages', (req, res) => {
  logger.debug('/adminpro/supertools/files/galleryimages');
  var limit = 50;
  var skip = req.query.skip ? parseFloat(req.query.skip) : 0;
  let data = [];
  const adminsez = 'galleries';
  Gallery.
  find({"medias.0": {$exists: true}}).
  lean().
  //limit(1).
  select({medias:1, createdAt: 1}).
  exec((err, galleries) => {
    for (let gallery=0; gallery<galleries.length; gallery++) {
      for (let media=0; media<galleries[gallery].medias.length; media++) {
        logger.debug(galleries[gallery].medias[media].file);
        galleries[gallery].medias[media].exists = fs.existsSync(global.appRoot+galleries[gallery].medias[media].file);
        galleries[gallery].medias[media].imageFormats = {};
        galleries[gallery].medias[media].imageFormatsExists = {};
        const previewFile = galleries[gallery].medias[media].file;
        const previewFileName = previewFile.substring(previewFile.lastIndexOf('/') + 1); // previewFile.jpg this.previewFile.previewFile.substr(19)
        const previewFileFolder = previewFile.substring(0, previewFile.lastIndexOf('/')); // /warehouse/2017/03
        const publicPath = previewFileFolder.replace("/glacier/galleries_originals/", "/warehouse/galleries/"); // /warehouse/2017/03
        const oldPath = previewFileFolder.replace("/glacier/galleries_originals/", "/warehouse/"); // /warehouse/2017/03
        const previewFileNameWithoutExtension = previewFileName.substring(0, previewFileName.lastIndexOf('.'));
        const previewFileExtension = previewFileName.substring(previewFileName.lastIndexOf('.') + 1);
        //logger.debug('previewFileName:' + previewFileName + ' previewFileFolder:' + previewFileFolder + ' previewFileNameWithoutExtension:' + previewFileNameWithoutExtension);
        for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
          galleries[gallery].medias[media].imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.public.components.image.config.sizes[format].folder}/${previewFileNameWithoutExtension}_${previewFileExtension}.jpg`;
        }
        for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
          galleries[gallery].medias[media].imageFormatsExists[format] = fs.existsSync(global.appRoot+galleries[gallery].medias[media].imageFormats[format]);
        }
        if (!galleries[gallery].medias[media].exists) {
          galleries[gallery].medias[media].mkdir = `mkdir ${previewFileFolder.replace("/glacier/", "glacier/")}`;
          galleries[gallery].medias[media].find = `find ${oldPath.replace("/warehouse/", "/space/PhpMysql2015/sites/flxer/warehouse/")}  -maxdepth 1 -name '${previewFileName}' -exec cp "{}" ${previewFileFolder.replace("/glacier/", "glacier/")} \\;`;
          galleries[gallery].medias[media].find2 = `find ${oldPath.replace("/warehouse/", "/space/PhpMysql2015/sites/flxer/warehouse/")} -maxdepth 1 -name '${previewFileName.substring(0, previewFileName.lastIndexOf("_"))}*';`;
          galleries[gallery].medias[media].find2 = `find ${oldPath.replace("/warehouse/", "/space/PhpMysql2015/sites/flxer/warehouse/")} -maxdepth 1 -name '${previewFileName.substring(0, previewFileName.lastIndexOf("_"))}*' -exec cp "{}" ${previewFileFolder.replace("/glacier/", "glacier/")}/${previewFileName} \\;`;
        }
        logger.debug(galleries[gallery].medias[media]);
        data.push(galleries[gallery].medias[media]);
        //logger.debug("galleries.length "+ galleries.length+" "+ gallery);
        //logger.debug("medias.length "+ galleries[gallery].medias.length+" "+ media);
        if (gallery+1 == galleries.length && media+1 == galleries[gallery].medias.length) {
          logger.debug(req);
          res.render('adminpro/supertools/files/galleryShow', {
            title: 'Gallery images',
            
            currentUrl: req.originalUrl,
            data: data,
            script: false
          });          
        }
      }
    }
  });
});

router.get('/gallerygenerator', (req, res) => {
  logger.debug('/adminpro/supertools/files/gallerygenerator');
  var limit = 2;
  var skip = req.query.skip ? parseFloat(req.query.skip) : 0;
  let data = [];
  const adminsez = 'galleries';
  Gallery.
  find({"medias.0": {$exists: true}}).
  lean().
  limit(limit).
  skip(skip).
  select({medias:1, createdAt: 1}).
  exec((err, galleries) => {
    logger.debug(galleries);
    if (galleries.length) {
      for (let gallery=0; gallery<galleries.length; gallery++) {
        for (let media=0; media<galleries[gallery].medias.length; media++) {
          //logger.debug(galleries[gallery].medias[media].file);
          galleries[gallery].medias[media].exists = fs.existsSync(global.appRoot+galleries[gallery].medias[media].file);
          if (galleries[gallery].medias[media].exists) {
            galleries[gallery].medias[media].imageFormats = {};
            galleries[gallery].medias[media].imageFormatsExists = {};
            const previewFile = galleries[gallery].medias[media].file;
            const previewFileName = previewFile.substring(previewFile.lastIndexOf('/') + 1); // previewFile.jpg this.previewFile.previewFile.substr(19)
            const previewFileFolder = previewFile.substring(0, previewFile.lastIndexOf('/')); // /warehouse/2017/03
            const publicPath = previewFileFolder.replace("/glacier/galleries_originals/", "/warehouse/galleries/"); // /warehouse/2017/03
            const previewFileNameWithoutExtension = previewFileName.substring(0, previewFileName.lastIndexOf('.'));
            const previewFileExtension = previewFileName.substring(previewFileName.lastIndexOf('.') + 1);
            // logger.debug('previewFileName:' + previewFileName + ' previewFileFolder:' + previewFileFolder + ' previewFileNameWithoutExtension:' + previewFileNameWithoutExtension);
            for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
              galleries[gallery].medias[media].imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.public.components.image.config.sizes[format].folder}/${previewFileNameWithoutExtension}_${previewFileExtension}.jpg`;
            }
            for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
              galleries[gallery].medias[media].imageFormatsExists[format] = fs.existsSync(global.appRoot+galleries[gallery].medias[media].imageFormats[format]);
              if (!galleries[gallery].medias[media].imageFormatsExists[format]) {
                let folder = galleries[gallery].medias[media].imageFormats[format].substring(0, galleries[gallery].medias[media].imageFormats[format].lastIndexOf('/'))
                router.checkAndCreate(folder, () => {
                  sharp(global.appRoot+previewFile)
                  .resize(config.cpanel[adminsez].forms.public.components.image.config.sizes[format].w, config.cpanel[adminsez].forms.public.components.image.config.sizes[format].h)
                  .toFile(global.appRoot+galleries[gallery].medias[media].imageFormats[format], (err, info) => {
                    logger.debug(err);
                    logger.debug(info);
                  });
                });
              }
            }
            data.push(galleries[gallery].medias[media]);
          }
          logger.debug("galleries.length "+ galleries.length+" "+ gallery);
          logger.debug("medias.length "+ galleries[gallery].medias.length+" "+ media);
          if (gallery+1 == galleries.length && media+1 == galleries[gallery].medias.length) {
            logger.debug(req.path);
            res.render('adminpro/supertools/files/galleryShow', {
              title: 'Gallery images generator',
              
              currentUrl: req.originalUrl,
              data: data,
              script: data.length ? '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/files/gallerygenerator?skip=' + (skip+limit) + '"},1000);</script>' : ''
            });          
          }
        }
      }  
    } else {
      res.render('adminpro/supertools/files/galleryShow', {
        title: 'Gallery images generator',
        
        currentUrl: req.originalUrl,
        data: data,
        script: data.length ? '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/files/gallerygenerator?skip=' + (skip+limit) + '"},1000);</script>' : ''
      });          
    }
  });
});

router.get('/filescopy', (req, res) => {
  logger.debug('/adminpro/supertools/files/filescopy');
  let files = require("../../../../cp-all");
  let data = {};
  let mkdirs = [];
  files.forEach(function(file) {
    var folders = file.split(" ")[2].split("/");
    if (folders[1] && !data[folders[1]]) data[folders[1]] = {};
    if (folders[2] && !data[folders[1]][folders[2]])  data[folders[1]][folders[2]] = {};
    if (folders[3] && !data[folders[1]][folders[2]][folders[3]])  data[folders[1]][folders[2]][folders[3]] = {};
    if (folders[4] && !data[folders[1]][folders[2]][folders[3]][folders[4]])  data[folders[1]][folders[2]][folders[3]][folders[4]] = {};
  });
  for (var key in data) {
    mkdirs.push("mkdir "+key);
    for (var key2 in data[key]) {
      mkdirs.push("mkdir "+key+"/"+key2);
      for (var key3 in data[key][key2]) {
        mkdirs.push("mkdir "+key+"/"+key2+"/"+key3);
        for (var key4 in data[key][key2][key3]) {
          mkdirs.push("mkdir "+key+"/"+key2+"/"+key3+"/"+key4);
        }
      }
    }
  }
  res.render('adminpro/supertools/files/filescopy', {
    title: 'User images',
    
    currentUrl: req.originalUrl,
    data: mkdirs,
    script: false
  });
});

module.exports = router;