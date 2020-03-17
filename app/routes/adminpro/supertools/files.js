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
  //limit(1).
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
        logger.debug(config.cpanel[adminsez].forms.image.components.image);
        for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
          users[user].image.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.image.components.image.config.sizes[format].folder}/${fileNameWithoutExtension}_${fileExtension}.jpg`;
        }
        for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
          users[user].image.imageFormatsExists[format] = fs.existsSync(global.appRoot+users[user].image.imageFormats[format]);
        }
        if (!users[user].image.exists) {
          users[user].image.mkdir = `mkdir ${fileFolder.replace("/glacier/", "glacier/")}`;
          users[user].image.find = `find ${oldPath.replace("/warehouse/", "/space/PhpMysql2015/sites/flxer/warehouse/")}  -maxdepth 1 -name '${fileName}' -exec cp "{}" ${fileFolder.replace("/glacier/", "glacier/")} \\;`;
          //users[user].image.find2 = `find ${oldPath.replace("/warehouse/", "/space/PhpMysql2015/sites/flxer/warehouse/")} -maxdepth 1 -name '${fileName.substring(0, fileName.lastIndexOf("_"))}*';`;
          users[user].image.find2 = `find ${oldPath.replace("/warehouse/", "/space/PhpMysql2015/sites/flxer/warehouse/")} -maxdepth 1 -name '${fileName.substring(0, fileName.lastIndexOf("_"))}*' -exec cp "{}" ${fileFolder.replace("/glacier/", "glacier/")}/${fileName} \\;`;
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
  select({media: 1, title: 1, is_public: 1, createdAt: 1}).
  exec((err, videos) => {
    for (let video in videos) {
      videos[video].media.exists = fs.existsSync(global.appRoot+videos[video].media.file);
      videos[video].media.imageFormats = {};
      videos[video].media.imageFormatsExists = {};
      const file = videos[video].media.file;
      const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
      const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
      const publicPath = fileFolder.replace("/glacier/video_originals/", "/warehouse/videos/"); // /warehouse/2017/03
      const oldPath = fileFolder.replace("/glacier/videos_originals/", "/warehouse/"); // /warehouse/2017/03
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
          } else {
            videos[video].media.findpreview = `mkdir /sites/avnode.net${previewFileFolder}<br />find /space/PhpMysql2015/sites/flxer${oldPath.replace("/warehouse/videos", "/warehouse")}/preview_files -name '${previewFileName}' -exec cp "{}" /sites/avnode.net${previewFileFolder}/${previewFileName} \\;`;
          }
        }
        if (videos[video].media.previewexists) {
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
      if (fileExtension=="mp4" && videos[video].media.original) {
        //videos[video].media.original = fileFolder.replace('/warehouse/videos/', '/glacier/videos_originals/')+'/'+originalFileName+'.'+originalFileExtension;
        const originalFile = videos[video].media.original;
        const originalFileName = originalFile.substring(originalFile.lastIndexOf('/') + 1); // previewFile.jpg this.previewFile.previewFile.substr(19)
        const originalFileFolder = originalFile.substring(0, originalFile.lastIndexOf('/')); // /warehouse/2017/03
        const oldPath = fileFolder.replace("/glacier/videos_originals/", "/warehouse/"); // /warehouse/2017/03

        videos[video].media.originalexists = fs.existsSync(global.appRoot+videos[video].media.original);
        if (!videos[video].media.originalexists) {
          videos[video].media.findoriginal= `mkdir /sites/avnode.net${originalFileFolder}<br />find /space/PhpMysql2015/sites/flxer${oldPath.replace("/warehouse/videos", "/warehouse")}/original_video -name '${originalFileName}' -exec cp "{}" /sites/avnode.net${originalFileFolder}/${originalFileName} \\;`;
        }
      }
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