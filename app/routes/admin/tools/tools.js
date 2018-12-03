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

router.get('/emails', (req, res) => {
  logger.debug('/admin/tools/emails');
  User.find({is_crew: false}).
  select({name: 1, old_id: 1, surname: 1, stagename: 1, addresses: 1, emails: 1}).
  lean().
  sort('name').
  exec((err, results) => {
    let mailinglists = [];
    let conta = 0;
    let fatto = 0;

    results.forEach(function(e) {
      fatto += e.emails.length;
    });
    
    results.forEach(function(e) {
      let email = {
        avnode_id: e._id.toString(),
        flxer_id: e.old_id,
        list: 'AXRGq2Ftn2Fiab3skb5E892g',
        boolean: 'true'
      };
      if (e.name) email.Name = e.name;
      if (e.surname) email.Surname = e.surname;
      if (e.stagename) email.Stagename = e.stagename;
      if (e.addresses && e.addresses[0] && e.addresses[0].locality) email.City = e.addresses[0].locality;
      if (e.addresses && e.addresses[0] && e.addresses[0].country) email.Country = e.addresses[0].country;

      e.emails.forEach(function(ee) {
        email.email = ee.email;
        let topics = [];

        for (const mailinglist in ee.mailinglists) if (ee.mailinglists[mailinglist]) topics.push(mailinglist);
        email.Topics = topics.join(',');
        mailinglists.push(email);
        conta++;

        if (conta === fatto) {
          res.render('admin/tools/emails/showall', {
            title: 'Emails',
            currentUrl: req.path,
            skip: 0,
            data: mailinglists,
            script: false
          });
        }
    });
    });
  });
});
router.get('/updateSendy', (req, res) => {
  const limit = 50;
  const skip = req.query.skip ? parseFloat(req.query.skip) : 0;

  logger.debug('/admin/tools/emails');
  User.find({is_crew: false}).
  select({name: 1, old_id: 1, surname: 1, stagename: 1, addresses: 1, emails: 1}).
  lean().
  limit(limit).
  skip(skip).
  sort('name').
  exec((err, results) => {
    let mailinglists = [];
    let conta = 0;
    let fatto = 0;

    results.forEach(function(e) {
      fatto += e.emails.length;
    });
    
    results.forEach(function(e) {
      let email = {
        avnode_id: e._id.toString(),
        flxer_id: e.old_id,
        list: 'AXRGq2Ftn2Fiab3skb5E892g',
        boolean: 'true'
      };
      if (e.name) email.Name = e.name;
      if (e.surname) email.Surname = e.surname;
      if (e.stagename) email.Stagename = e.stagename;
      if (e.addresses && e.addresses[0] && e.addresses[0].locality) email.City = e.addresses[0].locality;
      if (e.addresses && e.addresses[0] && e.addresses[0].country) email.Country = e.addresses[0].country;
      if (e.addresses && e.addresses[0] && e.addresses[0].geometry && e.addresses[0].geometry.lat && e.addresses[0].geometry.lng) {
        email.LATITUDE = e.addresses[0].geometry.lat;
        email.LONGITUDE = e.addresses[0].geometry.lng;
      }

      e.emails.forEach(function(ee) {
        email.email = ee.email;
        let topics = [];

        for (const mailinglist in ee.mailinglists) if (ee.mailinglists[mailinglist]) topics.push(mailinglist);
        email.Topics = topics.join(',');
        console.log(email);
        //email.mailinglists = ee.mailinglists;
        mailinglists.push(email);

        request.post({
            url: 'https://ml.avnode.net/subscribe',
            formData: email
        }, function (error, response, body) {
          conta++;
          console.log(error);
          console.log(body);
          if (conta === fatto) {
            res.render('admin/tools/emails/showall', {
              title: 'Emails',
              currentUrl: req.path,
              data: mailinglists,
              skip: skip,
              script: '<script>var timeout = setTimeout(function(){location.href="/admin/tools/updateSendy?skip=' + (skip+limit) + '"},1000);</script>'
            });
          }
        });
      });
    });
  });
});
router.get('/', (req, res) => {
  logger.debug('/admin/tools/');
  res.render('admin/tools', {
    title: 'admin/tools',
    currentUrl: req.path,
    data: 'LOAD DATA'
  });
});

router.checkAndCreate = (folder, cb) => {
  const folderA = folder.split('/');
  let subfolder = '';

  if (folderA.length) {
    for (let a=1; a<folderA.length;a++) {
      subfolder +=  `/${folderA[a]}`;
      console.log(subfolder);
      if (!fs.existsSync(global.appRoot + subfolder)) {
        fs.mkdirSync(global.appRoot + subfolder);
      }
    }
  }
  cb();
};
router.get('/categoriesdbcheck', (req, res) => {
  Category.find({}).
  lean().
  sort('name').
  exec((err, cat) => {
    let catO = {};
    cat.forEach(function(e) {
      if (!e.ancestor) {
        if (!catO[e.rel]) {
          catO[e.rel] = {};
        }
        catO[e.rel][e._id] = e;
        catO[e.rel][e._id].son = [];
      }
    });
    catO.stocazzo = {}
    catO.stocazzo.son = [];
    cat.forEach(function(e) {
      if (e.ancestor) {
        if (catO[e.rel][e.ancestor]) {
          catO[e.rel][e.ancestor].son.push(e);
          catO[e.rel][e.ancestor].son.sort(function(a, b){
            if(a.name < b.name) return -1;
            if(a.name > b.name) return 1;
            return 0;
          });
        } else {
          catO.stocazzo.son.push(e);          
        }
      }
    });
    res.render('admin/tools/categories/showall', {
      title: 'Categories',
      currentUrl: req.path,
      data: catO,
      script: false
    });
  });
});


router.download = (source, dest, callback) => {
  request.head(source, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(source).pipe(fs.createWriteStream(dest)).on('close', callback);
  });
};

router.get('/files/userimages', (req, res) => {
  logger.debug('/admin/tools/files/userimages');
  let data = [];
  let adminsez = "profile";
  User.
  find({"image.file": {$exists: true}}).
  //limit(1).
  lean().
  select({image: 1, creation_date: 1}).
  exec((err, users) => {
    for (let user in users) {
      users[user].image.exists = fs.existsSync(global.appRoot+users[user].image.file);
      users[user].image.imageFormats = {};
      users[user].image.imageFormatsExists = {};
      logger.debug(users[user]);
      //console.log(config.cpanel[adminsez].config.sizes.image);
      //if (users[user].image.exists) {
        const file = users[user].image.file;
        const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
        const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
        const oldPath = fileFolder.replace("/glacier/users_originals/", "/warehouse/"); // /warehouse/2017/03
        const publicPath = fileFolder.replace("/glacier/users_originals/", "/warehouse/users/"); // /warehouse/2017/03
        const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        // console.log('fileName:' + fileName + ' fileFolder:' + fileFolder + ' fileNameWithoutExtension:' + fileNameWithoutExtension);
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
    console.log(req.path);
    res.render('admin/tools/files/showall', {
      title: 'User images',
      currentUrl: req.path,
      data: data,
      script: false
    });
  });
});

router.get('/files/userformatsgenerator', (req, res) => {
  logger.debug('/admin/tools/files/userimages');
  var limit = 50;
  var skip = req.query.skip ? parseFloat(req.query.skip) : 0;
  let data = [];
  let adminsez = "profile";
  User.
  find({"image.file": {$exists: true}}).
  limit(limit).
  skip(skip).
  lean().
  select({image: 1, creation_date: 1}).
  exec((err, users) => {
    for (let user in users) {
      users[user].image.exists = fs.existsSync(global.appRoot+users[user].image.file);
      users[user].image.imageFormats = {};
      users[user].image.imageFormatsExists = {};
      logger.debug(users[user]);
      //console.log(config.cpanel[adminsez].config.sizes.image);
      if (users[user].image.exists) {
        const file = users[user].image.file;
        const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
        const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
        const publicPath = fileFolder.replace("/glacier/users_originals/", "/warehouse/users/"); // /warehouse/2017/03
        const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        // console.log('fileName:' + fileName + ' fileFolder:' + fileFolder + ' fileNameWithoutExtension:' + fileNameWithoutExtension);
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
    console.log(req.path);
    res.render('admin/tools/files/showall', {
      title: 'User images generator',
      currentUrl: req.path,
      data: data,
      script: '<script>var timeout = setTimeout(function(){location.href="/admin/tools/files/userformatsgenerator?skip=' + (skip+limit) + '"},1000);</script>'
    });
  });
});

router.get('/files/performanceimages', (req, res) => {
  logger.debug('/admin/tools/files/performanceimages');
  let data = [];
  let adminsez = "performances";
  Performance.
  find({"image.file": {$exists: true}}).
  lean().
  select({image: 1, creation_date: 1}).
  exec((err, performances) => {
    for (let performance in performances) {
      performances[performance].image.exists = fs.existsSync(global.appRoot+performances[performance].image.file);
      performances[performance].image.imageFormats = {};
      performances[performance].image.imageFormatsExists = {};
      logger.debug(performances[performance]);
      //console.log(config.cpanel[adminsez].config.sizes.image);
      //if (performances[performance].image.exists) {
        const file = performances[performance].image.file;
        const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
        const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
        const oldPath = fileFolder.replace("/glacier/performances_originals/", "/warehouse/"); // /warehouse/2017/03
        const publicPath = fileFolder.replace("/glacier/performances_originals/", "/warehouse/performances/"); // /warehouse/2017/03
        const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        // console.log('fileName:' + fileName + ' fileFolder:' + fileFolder + ' fileNameWithoutExtension:' + fileNameWithoutExtension);
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
    console.log(req.path);
    res.render('admin/tools/files/showall', {
      title: 'Performance images',
      currentUrl: req.path,
      data: data,
      script: false
    });
  });
});

router.get('/files/performanceformatsgenerator', (req, res) => {
  logger.debug('/admin/tools/files/performanceimages');
  var limit = 50;
  var skip = req.query.skip ? parseFloat(req.query.skip) : 0;
  let data = [];
  let adminsez = "performances";
  Performance.
  find({"image.file": {$exists: true}}).
  limit(limit).
  skip(skip).
  lean().
  select({image: 1, creation_date: 1}).
  exec((err, performances) => {
    for (let performance in performances) {
      performances[performance].image.exists = fs.existsSync(global.appRoot+performances[performance].image.file);
      performances[performance].image.imageFormats = {};
      performances[performance].image.imageFormatsExists = {};
      logger.debug(performances[performance]);
      //console.log(config.cpanel[adminsez].config.sizes.image);
      if (performances[performance].image.exists) {
        const file = performances[performance].image.file;
        const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
        const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
        const publicPath = fileFolder.replace("/glacier/performances_originals/", "/warehouse/performances/"); // /warehouse/2017/03
        const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        // console.log('fileName:' + fileName + ' fileFolder:' + fileFolder + ' fileNameWithoutExtension:' + fileNameWithoutExtension);
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
    console.log(req.path);
    res.render('admin/tools/files/showall', {
      title: 'Performance images generator',
      currentUrl: req.path,
      data: data,
      script: '<script>var timeout = setTimeout(function(){location.href="/admin/tools/files/performanceformatsgenerator?skip=' + (skip+limit) + '"},1000);</script>'
    });
  });
});

router.get('/files/eventimages', (req, res) => {
  logger.debug('/admin/tools/files/eventimages');
  let data = [];
  let adminsez = "events";
  Event.
  find({"image.file": {$exists: true}}).
  lean().
  select({image: 1, creation_date: 1}).
  exec((err, events) => {
    for (let event in events) {
      events[event].image.exists = fs.existsSync(global.appRoot+events[event].image.file);
      events[event].image.imageFormats = {};
      events[event].image.imageFormatsExists = {};
      logger.debug(events[event]);
      //console.log(config.cpanel[adminsez].config.sizes.image);
      //if (events[event].image.exists) {
        const file = events[event].image.file;
        const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
        const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
        const publicPath = fileFolder.replace("/glacier/events_originals/", "/warehouse/events/"); // /warehouse/2017/03
        const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        // console.log('fileName:' + fileName + ' fileFolder:' + fileFolder + ' fileNameWithoutExtension:' + fileNameWithoutExtension);
        for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
          events[event].image.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.image.components.image.config.sizes[format].folder}/${fileNameWithoutExtension}_${fileExtension}.jpg`;
        }
        for(let format in config.cpanel[adminsez].forms.image.components.image.config.sizes) {
          events[event].image.imageFormatsExists[format] = fs.existsSync(global.appRoot+events[event].image.imageFormats[format]);
        }
      //}
      data.push(events[event].image);
    }
    console.log(req.path);
    res.render('admin/tools/files/showall', {
      title: 'Event images',
      currentUrl: req.path,
      data: data,
      script: false
    });
  });
});

router.get('/files/eventformatsgenerator', (req, res) => {
  logger.debug('/admin/tools/files/eventformatsgenerator');
  var limit = 50;
  var skip = req.query.skip ? parseFloat(req.query.skip) : 0;
  let data = [];
  let adminsez = "events";
  Event.
  find({"image.file": {$exists: true}}).
  limit(limit).
  skip(skip).
  lean().
  select({image: 1, creation_date: 1}).
  exec((err, events) => {
    for (let event in events) {
      events[event].image.exists = fs.existsSync(global.appRoot+events[event].image.file);
      events[event].image.imageFormats = {};
      events[event].image.imageFormatsExists = {};
      //logger.debug(events[event]);
      //console.log(config.cpanel[adminsez].config.sizes.image);
      if (events[event].image.exists) {
        const file = events[event].image.file;
        const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
        const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
        const publicPath = fileFolder.replace("/glacier/events_originals/", "/warehouse/events/"); // /warehouse/2017/03
        const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        // console.log('fileName:' + fileName + ' fileFolder:' + fileFolder + ' fileNameWithoutExtension:' + fileNameWithoutExtension);
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
    //console.log(req.path);
    res.render('admin/tools/files/showall', {
      title: 'Event images generator',
      currentUrl: req.path,
      data: data,
      script: '<script>var timeout = setTimeout(function(){location.href="/admin/tools/files/eventformatsgenerator?skip=' + (skip+limit) + '"},1000);</script>'
    });
  });
});

router.get('/files/newsimages', (req, res) => {
  logger.debug('/admin/tools/files/newimages');
  let data = [];
  let adminsez = "news";
  News.
  find({"image.file": {$exists: true}}).
  lean().
  select({image: 1, creation_date: 1}).
  exec((err, newss) => {
    for (let news in newss) {
      newss[news].image.exists = fs.existsSync(global.appRoot+newss[news].image.file);
      newss[news].image.imageFormats = {};
      newss[news].image.imageFormatsExists = {};
      logger.debug(newss[news]);
      //console.log(config.cpanel[adminsez].config.sizes.image);
      //if (newss[news].image.exists) {
        const file = newss[news].image.file;
        const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
        const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
        const publicPath = fileFolder.replace("/glacier/news_originals/", "/warehouse/news/"); // /warehouse/2017/03
        const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        // console.log('fileName:' + fileName + ' fileFolder:' + fileFolder + ' fileNameWithoutExtension:' + fileNameWithoutExtension);
        for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
          newss[news].image.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.public.components.image.config.sizes[format].folder}/${fileNameWithoutExtension}_${fileExtension}.jpg`;
        }
        for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
          newss[news].image.imageFormatsExists[format] = fs.existsSync(global.appRoot+newss[news].image.imageFormats[format]);
        }
      //}
      data.push(newss[news].image);
    }
    console.log(req.path);
    res.render('admin/tools/files/showall', {
      title: 'News images',
      currentUrl: req.path,
      data: data,
      script: false
    });
  });
});

router.get('/files/newsformatsgenerator', (req, res) => {
  logger.debug('/admin/tools/files/newsimages');
  var limit = 50;
  var skip = req.query.skip ? parseFloat(req.query.skip) : 0;
  let data = [];
  let adminsez = "news";
  News.
  find({"image.file": {$exists: true}}).
  limit(limit).
  skip(skip).
  lean().
  select({image: 1, creation_date: 1}).
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
      //console.log(config.cpanel[adminsez].config.sizes.image);
      if (newss[news].image.exists) {
        const file = newss[news].image.file;
        const fileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
        const fileFolder = file.substring(0, file.lastIndexOf('/')); // /warehouse/2017/03
        const publicPath = fileFolder.replace("/glacier/news_originals/", "/warehouse/news/"); // /warehouse/2017/03
        const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        // console.log('fileName:' + fileName + ' fileFolder:' + fileFolder + ' fileNameWithoutExtension:' + fileNameWithoutExtension);
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
    console.log(req.path);
    res.render('admin/tools/files/showall', {
      title: 'News images generator',
      currentUrl: req.path,
      data: data,
      script: data.length ? '<script>var timeout = setTimeout(function(){location.href="/admin/tools/files/newsformatsgenerator?skip=' + (skip+limit) + '"},1000);</script>' : ''
    });
  });
});

router.get('/files/playlistimages', (req, res) => {
  logger.debug('/admin/tools/files/playlistimages');
  let data = [];
  Playlist.
  find({"image.file": {$exists: true}}).
  lean().
  select({image: 1, creation_date: 1}).
  exec((err, playlists) => {
    for (let playlist in playlists) {
      playlists[playlist].image.exists = fs.existsSync(global.appRoot+playlists[playlist].image.file);
      data.push(playlists[playlist].image);
    }
    console.log(req.path);
    res.render('admin/tools/files/showall', {
      title: 'Performance images',
      currentUrl: req.path,
      data: data,
      script: false
    });
  });
});

router.get('/files/footagefiles', (req, res) => {
  logger.debug('/admin/tools/files/footagefiles');
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

  select({media: 1, creation_date: 1}).
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
      for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
        console.log(footages[footage].media);
        footages[footage].media.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.public.components.media.config.sizes[format].folder}/${fileNameWithoutExtension}_${fileExtension}.jpg`;
      }
      for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
        footages[footage].media.imageFormatsExists[format] = fs.existsSync(global.appRoot+footages[footage].media.imageFormats[format]);
      }
      */
      console.log("stocazzo1 "+footages[footage].media.preview);
      if (footages[footage].media.preview) {
        console.log("stocazzo2 "+global.appRoot+footages[footage].media.preview);
        footages[footage].media.previewexists = fs.existsSync(global.appRoot+footages[footage].media.preview);
        console.log("stocazzo3 "+footages[footage].media.preview);
        const previewFile = footages[footage].media.preview;
        const previewFileName = previewFile.substring(previewFile.lastIndexOf('/') + 1); // previewFile.jpg this.previewFile.previewFile.substr(19)
        const previewFileFolder = previewFile.substring(0, previewFile.lastIndexOf('/')); // /warehouse/2017/03
        const publicPath = previewFileFolder.replace("/glacier/footage_previews/", "/warehouse/footage/"); // /warehouse/2017/03
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
          // console.log('previewFileName:' + previewFileName + ' previewFileFolder:' + previewFileFolder + ' previewFileNameWithoutExtension:' + previewFileNameWithoutExtension);
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
          //footages[footage].media.preview = fileFolder.replace('/warehouse/footage/', '/warehouse/footage_preview/')+'/'+fileNameWithoutExtension+'.png';
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
    console.log(req.path);
    res.render('admin/tools/files/showall', {
      title: 'Footage images',
      currentUrl: req.path,
      data: data,
      script: false
    });
  });
});

router.get('/files/footagerenamer', (req, res) => {
  logger.debug('/admin/tools/files/footagefiles');
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

  select({media: 1, creation_date: 1}).
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
    res.render('admin/tools/files/renamer', {
      title: 'Footage renamer',
      currentUrl: req.path,
      data: data,
      script: false
    });
  });
});

router.get('/files/footageformatsgenerator', (req, res) => {
  logger.debug('/admin/tools/files/footageformatsgenerator');
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
  select({media: 1, creation_date: 1}).
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
        console.log(footages[footage].media);
        footages[footage].media.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.public.components.media.config.sizes[format].folder}/${fileNameWithoutExtension}_${fileExtension}.jpg`;
      }
      for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
        footages[footage].media.imageFormatsExists[format] = fs.existsSync(global.appRoot+footages[footage].media.imageFormats[format]);
      }
      */
     console.log("stocazzo1 "+footages[footage].media.preview);
     if (footages[footage].media.preview) {
        console.log("stocazzo2 "+global.appRoot+footages[footage].media.preview);
        footages[footage].media.previewexists = fs.existsSync(global.appRoot+footages[footage].media.preview);
        if (footages[footage].media.previewexists) {
          console.log("stocazzo3 "+footages[footage].media.preview);
          const previewFile = footages[footage].media.preview;
          const previewFileName = previewFile.substring(previewFile.lastIndexOf('/') + 1); // previewFile.jpg this.previewFile.previewFile.substr(19)
          const previewFileFolder = previewFile.substring(0, previewFile.lastIndexOf('/')); // /warehouse/2017/03
          const publicPath = previewFileFolder.replace("/glacier/footage_previews/", "/warehouse/footage/"); // /warehouse/2017/03
          const previewFileNameWithoutExtension = previewFileName.substring(0, previewFileName.lastIndexOf('.'));
          const previewFileExtension = previewFileName.substring(previewFileName.lastIndexOf('.') + 1);
          // console.log('previewFileName:' + previewFileName + ' previewFileFolder:' + previewFileFolder + ' previewFileNameWithoutExtension:' + previewFileNameWithoutExtension);
          for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
            footages[footage].media.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.public.components.media.config.sizes[format].folder}/${previewFileNameWithoutExtension}_${previewFileExtension}.jpg`;
          }
          for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
            footages[footage].media.imageFormatsExists[format] = fs.existsSync(global.appRoot+footages[footage].media.imageFormats[format]);
            if (!footages[footage].media.imageFormatsExists[format]) {
              let folder = footages[footage].media.imageFormats[format].substring(0, footages[footage].media.imageFormats[format].lastIndexOf('/'))
              router.checkAndCreate(folder, () => {
                console.log("stocazzo "+global.appRoot+previewFile);
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
        //footages[footage].media.preview = fileFolder.replace('/warehouse/footage/', '/warehouse/footage_preview/')+'/'+fileNameWithoutExtension+'.png';
        //footages[footage].media.previewexists = fs.existsSync(global.appRoot+footages[footage].media.preview);
      }
      if (fileExtension=="mp4") {
        footages[footage].media.original = fileFolder.replace('/warehouse/footage/', '/glacier/footage_originals/')+'/'+originalFileName+'.'+originalFileExtension;
        footages[footage].media.originalexists = fs.existsSync(global.appRoot+footages[footage].media.original);
      }
      data.push(footages[footage].media);
    }
    console.log(req.path);
    res.render('admin/tools/files/showall', {
      title: 'Footage images generator',
      currentUrl: req.path,
      data: data,
      script: data.length ? '<script>var timeout = setTimeout(function(){location.href="/admin/tools/files/footageformatsgenerator?skip=' + (skip+limit) + '"},1000);</script>' : ''
    });
  });
});

router.get('/files/videofiles', (req, res) => {
  logger.debug('/admin/tools/files/videofiles');
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
  select({media: 1, creation_date: 1}).
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
        console.log(videos[video].media);
        videos[video].media.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.public.components.media.config.sizes[format].folder}/${fileNameWithoutExtension}_${fileExtension}.jpg`;
      }
      for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
        videos[video].media.imageFormatsExists[format] = fs.existsSync(global.appRoot+videos[video].media.imageFormats[format]);
      }
      */
     console.log("stocazzo1 "+videos[video].media.preview);
     if (videos[video].media.preview) {
        console.log("stocazzo2 "+global.appRoot+videos[video].media.preview);
        videos[video].media.previewexists = fs.existsSync(global.appRoot+videos[video].media.preview);
        console.log("stocazzo3 "+videos[video].media.preview);
        const previewFile = videos[video].media.preview;
        const previewFileName = previewFile.substring(previewFile.lastIndexOf('/') + 1); // previewFile.jpg this.previewFile.previewFile.substr(19)
        const previewFileFolder = previewFile.substring(0, previewFile.lastIndexOf('/')); // /warehouse/2017/03
        const publicPath = previewFileFolder.replace("/glacier/videos_previews/", "/warehouse/videos/"); // /warehouse/2017/03
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
          // console.log('previewFileName:' + previewFileName + ' previewFileFolder:' + previewFileFolder + ' previewFileNameWithoutExtension:' + previewFileNameWithoutExtension);
          for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
            videos[video].media.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.public.components.media.config.sizes[format].folder}/${previewFileNameWithoutExtension}_${previewFileExtension}.jpg`;
          }
          for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
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
      data.push(videos[video].media);
    }
    console.log(req.path);
    res.render('admin/tools/files/showall', {
      title: 'Video images',
      currentUrl: req.path,
      data: data,
      script: false
    });
  });
});

router.get('/files/videoformatsgenerator', (req, res) => {
  logger.debug('/admin/tools/files/videoformatsgenerator');
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
  select({media: 1, creation_date: 1}).
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
      for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
        console.log(videos[video].media);
        videos[video].media.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.public.components.media.config.sizes[format].folder}/${fileNameWithoutExtension}_${fileExtension}.jpg`;
      }
      for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
        videos[video].media.imageFormatsExists[format] = fs.existsSync(global.appRoot+videos[video].media.imageFormats[format]);
      }
      */
     if (videos[video].media.preview) {
        videos[video].media.previewexists = fs.existsSync(global.appRoot+videos[video].media.preview);
        if (videos[video].media.previewexists) {
          const previewFile = videos[video].media.preview;
          const previewFileName = previewFile.substring(previewFile.lastIndexOf('/') + 1); // previewFile.jpg this.previewFile.previewFile.substr(19)
          const previewFileFolder = previewFile.substring(0, previewFile.lastIndexOf('/')); // /warehouse/2017/03
          const publicPath = previewFileFolder.replace("/glacier/videos_previews/", "/warehouse/videos/"); // /warehouse/2017/03
          const previewFileNameWithoutExtension = previewFileName.substring(0, previewFileName.lastIndexOf('.'));
          const previewFileExtension = previewFileName.substring(previewFileName.lastIndexOf('.') + 1);
          // console.log('previewFileName:' + previewFileName + ' previewFileFolder:' + previewFileFolder + ' previewFileNameWithoutExtension:' + previewFileNameWithoutExtension);
          for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
            videos[video].media.imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.public.components.media.config.sizes[format].folder}/${previewFileNameWithoutExtension}_${previewFileExtension}.jpg`;
          }
          for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
            videos[video].media.imageFormatsExists[format] = fs.existsSync(global.appRoot+videos[video].media.imageFormats[format]);
            if (!videos[video].media.imageFormatsExists[format]) {
              let folder = videos[video].media.imageFormats[format].substring(0, videos[video].media.imageFormats[format].lastIndexOf('/'))
              router.checkAndCreate(folder, () => {
                sharp(global.appRoot+previewFile)
                .resize(config.cpanel[adminsez].forms.public.components.media.config.sizes[format].w, config.cpanel[adminsez].forms.public.components.media.config.sizes[format].h)
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
    console.log(req.path);
    res.render('admin/tools/files/showall', {
      title: 'Video images generator',
      currentUrl: req.path,
      data: data,
      script: data.length ? '<script>var timeout = setTimeout(function(){location.href="/admin/tools/files/videoformatsgenerator?skip=' + (skip+limit) + '"},1000);</script>' : ''
    });
  });
});




router.get('/files/galleryimages', (req, res) => {
  logger.debug('/admin/tools/files/galleryimages');
  var limit = 50;
  var skip = req.query.skip ? parseFloat(req.query.skip) : 0;
  let data = [];
  const adminsez = 'galleries';
  Gallery.
  find({"medias.0": {$exists: true}}).
  lean().
  select({medias:1, creation_date: 1}).
  exec((err, galleries) => {
    for (let gallery=0; gallery<galleries.length; gallery++) {
      for (let media=0; media<galleries[gallery].medias.length; media++) {
        //console.log(galleries[gallery].medias[media].file);
        galleries[gallery].medias[media].exists = fs.existsSync(global.appRoot+galleries[gallery].medias[media].file);
        galleries[gallery].medias[media].imageFormats = {};
        galleries[gallery].medias[media].imageFormatsExists = {};
        const previewFile = galleries[gallery].medias[media].file;
        logger.debug(previewFile);
        const previewFileName = previewFile.substring(previewFile.lastIndexOf('/') + 1); // previewFile.jpg this.previewFile.previewFile.substr(19)
        const previewFileFolder = previewFile.substring(0, previewFile.lastIndexOf('/')); // /warehouse/2017/03
        const publicPath = previewFileFolder.replace("/glacier/galleries_originals/", "/warehouse/galleries/"); // /warehouse/2017/03
        const oldPath = previewFileFolder.replace("/glacier/galleries_originals/", "/warehouse/"); // /warehouse/2017/03
        const previewFileNameWithoutExtension = previewFileName.substring(0, previewFileName.lastIndexOf('.'));
        const previewFileExtension = previewFileName.substring(previewFileName.lastIndexOf('.') + 1);
        // console.log('previewFileName:' + previewFileName + ' previewFileFolder:' + previewFileFolder + ' previewFileNameWithoutExtension:' + previewFileNameWithoutExtension);
        for(let format in config.cpanel[adminsez].forms.public.components.medias.config.sizes) {
          galleries[gallery].medias[media].imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.public.components.medias.config.sizes[format].folder}/${previewFileNameWithoutExtension}_${previewFileExtension}.jpg`;
        }
        for(let format in config.cpanel[adminsez].forms.public.components.medias.config.sizes) {
          galleries[gallery].medias[media].imageFormatsExists[format] = fs.existsSync(global.appRoot+galleries[gallery].medias[media].imageFormats[format]);
        }
        if (!galleries[gallery].medias[media].exists) {
          galleries[gallery].medias[media].mkdir = `mkdir ${previewFileFolder.replace("/glacier/", "glacier/")}`;
          galleries[gallery].medias[media].find = `find ${oldPath.replace("/warehouse/", "/space/PhpMysql2015/sites/flxer/warehouse/")}  -maxdepth 1 -name '${previewFileName}' -exec cp "{}" ${previewFileFolder.replace("/glacier/", "glacier/")} \\;`;
          galleries[gallery].medias[media].find2 = `find ${oldPath.replace("/warehouse/", "/space/PhpMysql2015/sites/flxer/warehouse/")} -maxdepth 1 -name '${previewFileName.substring(0, previewFileName.lastIndexOf("_"))}*';`;
          galleries[gallery].medias[media].find2 = `find ${oldPath.replace("/warehouse/", "/space/PhpMysql2015/sites/flxer/warehouse/")} -maxdepth 1 -name '${previewFileName.substring(0, previewFileName.lastIndexOf("_"))}*' -exec cp "{}" ${previewFileFolder.replace("/glacier/", "glacier/")}/${previewFileName} \\;`;
        }
        data.push(galleries[gallery].medias[media]);
        //logger.debug("galleries.length "+ galleries.length+" "+ gallery);
        //logger.debug("medias.length "+ galleries[gallery].medias.length+" "+ media);
        if (gallery+1 == galleries.length && media+1 == galleries[gallery].medias.length) {
          console.log(req.path);
          res.render('admin/tools/files/showall', {
            title: 'Gallery images',
            currentUrl: req.path,
            data: data,
            script: false
          });          
        }
      }
    }
  });
});

router.get('/files/gallerygenerator', (req, res) => {
  logger.debug('/admin/tools/files/gallerygenerator');
  var limit = 10;
  var skip = req.query.skip ? parseFloat(req.query.skip) : 0;
  let data = [];
  const adminsez = 'galleries';
  Gallery.
  find({"medias.0": {$exists: true}}).
  lean().
  limit(limit).
  skip(skip).
  select({medias:1, creation_date: 1}).
  exec((err, galleries) => {
    for (let gallery=0; gallery<galleries.length; gallery++) {
      for (let media=0; media<galleries[gallery].medias.length; media++) {
        //console.log(galleries[gallery].medias[media].file);
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
          // console.log('previewFileName:' + previewFileName + ' previewFileFolder:' + previewFileFolder + ' previewFileNameWithoutExtension:' + previewFileNameWithoutExtension);
          for(let format in config.cpanel[adminsez].forms.public.components.medias.config.sizes) {
            galleries[gallery].medias[media].imageFormats[format] = `${publicPath}/${config.cpanel[adminsez].forms.public.components.medias.config.sizes[format].folder}/${previewFileNameWithoutExtension}_${previewFileExtension}.jpg`;
          }
          for(let format in config.cpanel[adminsez].forms.public.components.medias.config.sizes) {
            galleries[gallery].medias[media].imageFormatsExists[format] = fs.existsSync(global.appRoot+galleries[gallery].medias[media].imageFormats[format]);
            if (!galleries[gallery].medias[media].imageFormatsExists[format]) {
              let folder = galleries[gallery].medias[media].imageFormats[format].substring(0, galleries[gallery].medias[media].imageFormats[format].lastIndexOf('/'))
              router.checkAndCreate(folder, () => {
                sharp(global.appRoot+previewFile)
                .resize(config.cpanel[adminsez].forms.public.components.medias.config.sizes[format].w, config.cpanel[adminsez].forms.public.components.medias.config.sizes[format].h)
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
          console.log(req.path);
          res.render('admin/tools/files/showall', {
            title: 'Gallery images generator',
            currentUrl: req.path,
            data: data,
            script: data.length ? '<script>var timeout = setTimeout(function(){location.href="/admin/tools/files/gallerygenerator?skip=' + (skip+limit) + '"},1000);</script>' : ''
          });          
        }
      }
    }
  });
});

router.get('/files/filescopy', (req, res) => {
  logger.debug('/admin/tools/files/filescopy');
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
  res.render('admin/tools/files/filescopy', {
    title: 'User images',
    currentUrl: req.path,
    data: mkdirs,
    script: false
  });
});

const sanitizeUnicode = (str) => {	
  return str.	
  replace('u00e9', 'é').	
  replace('u00fa', 'ú').	
  replace('u0159', 'ř').	
  replace('u010d', 'č').	
  replace('u00ed', 'í').	
  replace('u00c9', 'é').	
  replace('u00fc', 'ü').	
  replace('u00e0', 'à').	
  replace('u00e9', 'é').	
  replace('u00f6', 'ö').	
  replace('u00e1', 'à').	
  replace('U010c', 'Č').	
  replace('u0020', ' ').	
  replace('u0021', '!').	
  replace('u0022', '"').	
  replace('u0023', '#').	
  replace('u0024', '$').	
  replace('u0025', '%').	
  replace('u0026', '&').	
  replace('u0027', ' ').	
  replace('u0028', '(').	
  replace('u0029', ')').	
  replace('u002a', '*').	
  replace('u002b', '+').	
  replace('u002c', ',').	
  replace('u002d', '-').	
  replace('u002e', '.').	
  replace('u002f', '/').	
  replace('u0030', '0').	
  replace('u0031', '1').	
  replace('u0032', '2').	
  replace('u0033', '3').	
  replace('u0034', '4').	
  replace('u0035', '5').	
  replace('u0036', '6').	
  replace('u0037', '7').	
  replace('u0038', '8').	
  replace('u0039', '9').	
  replace('u003a', ':').	
  replace('u003b', ';').	
  replace('u003c', '<').	
  replace('u003d', '+').	
  replace('u003e', '>').	
  replace('u003f', '?').	
  replace('u0040', '@').	
  replace('u0041', 'A').	
  replace('u0042', 'B').	
  replace('u0043', 'C').	
  replace('u0044', 'D').	
  replace('u0045', 'E').	
  replace('u0046', 'F').	
  replace('u0047', 'G').	
  replace('u0048', 'H').	
  replace('u0049', 'I').	
  replace('u004a', 'J').	
  replace('u004b', 'K').	
  replace('u004c', 'L').	
  replace('u004d', 'M').	
  replace('u004e', 'N').	
  replace('u004f', 'O').	
  replace('u0050', 'P').	
  replace('u0051', 'Q').	
  replace('u0052', 'R').	
  replace('u0053', 'S').	
  replace('u0054', 'T').	
  replace('u0055', 'U').	
  replace('u0056', 'V').	
  replace('u0057', 'W').	
  replace('u0058', 'X').	
  replace('u0059', 'Y').	
  replace('u005a', 'Z').	
  replace('u005b', '[').	
  replace('u005d', ']').	
  replace('u005e', '^').	
  replace('u005f', '_').	
  replace('u0060', '`').	
  replace('u0061', 'a').	
  replace('u0062', 'b').	
  replace('u0063', 'c').	
  replace('u0064', 'd').	
  replace('u0065', 'e').	
  replace('u0066', 'f').	
  replace('u0067', 'g').	
  replace('u0068', 'h').	
  replace('u0069', 'i').	
  replace('u006a', 'j').	
  replace('u006b', 'k').	
  replace('u006c', 'l').	
  replace('u006d', 'm').	
  replace('u006e', 'n').	
  replace('u006f', 'o').	
  replace('u0070', 'p').	
  replace('u0071', 'q').	
  replace('u0072', 'r').	
  replace('u0073', 's').	
  replace('u0074', 't').	
  replace('u0075', 'u').	
  replace('u0076', 'v').	
  replace('u0077', 'w').	
  replace('u0078', 'x').	
  replace('u0079', 'y').	
  replace('u007a', 'z').	
  replace('u007b', '{').	
  replace('u007c', '|').	
  replace('u007d', '}').	
  replace('u007e', '~').	
  replace('u00a0', ' ').	
  replace('u00a1', '¡').	
  replace('u00a2', '¢').	
  replace('u00a3', '£').	
  replace('u00a4', '¤').	
  replace('u00a5', '¥').	
  replace('u00a6', '¦').	
  replace('u00a7', '§').	
  replace('u00a8', '¨').	
  replace('u00a9', '©').	
  replace('u00aa', 'ª').	
  replace('u00ab', '«').	
  replace('u00ac', '¬').	
  replace('u00ad', '').	
  replace('u00ae', '®').	
  replace('u00af', '¯').	
  replace('u00b0', '°').	
  replace('u00b1', '±').	
  replace('u00b2', '²').	
  replace('u00b3', '³').	
  replace('u00b4', '´').	
  replace('u00b5', 'µ').	
  replace('u00b6', '¶').	
  replace('u00b7', '·').	
  replace('u00b8', '¸').	
  replace('u00b9', '¹').	
  replace('u00ba', 'º').	
  replace('u00bb', '»').	
  replace('u00bc', '¼').	
  replace('u00bd', '½').	
  replace('u00be', '¾').	
  replace('u00bf', '¿').	
  replace('u00c0', 'À').	
  replace('u00c1', 'Á').	
  replace('u00c2', 'Â').	
  replace('u00c3', 'Ã').	
  replace('u00c4', 'Ä').	
  replace('u00c5', 'Å').	
  replace('u00c6', 'Æ').	
  replace('u00c7', 'Ç').	
  replace('u00c8', 'È').	
  replace('u00c9', 'É').	
  replace('u00ca', 'Ê').	
  replace('u00cb', 'Ë').	
  replace('u00cc', 'Ì').	
  replace('u00cd', 'Í').	
  replace('u00ce', 'Î').	
  replace('u00cf', 'Ï').	
  replace('u00d0', 'Ð').	
  replace('u00d1', 'Ñ').	
  replace('u00d2', 'Ò').	
  replace('u00d3', 'Ó').	
  replace('u00d4', 'Ô').	
  replace('u00d5', 'Õ').	
  replace('u00d6', 'Ö').	
  replace('u00d7', '×').	
  replace('u00d8', 'Ø').	
  replace('u00d9', 'Ù').	
  replace('u00da', 'Ú').	
  replace('u00db', 'Û').	
  replace('u00dc', 'Ü').	
  replace('u00dd', 'Ý').	
  replace('u00de', 'Þ').	
  replace('u00df', 'ß').	
  replace('u00e0', 'à').	
  replace('u00e1', 'á').	
  replace('u00e2', 'â').	
  replace('u00e3', 'ã').	
  replace('u00e4', 'ä').	
  replace('u00e5', 'å').	
  replace('u00e6', 'æ').	
  replace('u00e7', 'ç').	
  replace('u00e8', 'è').	
  replace('u00e9', 'é').	
  replace('u00ea', 'ê').	
  replace('u00eb', 'ë').	
  replace('u00ec', 'ì').	
  replace('u00ed', 'í').	
  replace('u00ee', 'î').	
  replace('u00ef', 'ï').	
  replace('u00f0', 'ð').	
  replace('u00f1', 'ñ').	
  replace('u00f2', 'ò').	
  replace('u00f3', 'ó').	
  replace('u00f4', 'ô').	
  replace('u00f5', 'õ').	
  replace('u00f6', 'ö').	
  replace('u00f7', '÷').	
  replace('u00f8', 'ø').	
  replace('u00f9', 'ù').	
  replace('u00fa', 'ú').	
  replace('u00fb', 'û').	
  replace('u00fc', 'ü').	
  replace('u00fd', 'ý').	
  replace('u00fe', 'þ').	
  replace('u00ff', 'ÿ').	
  replace('u0100', 'Ā').	
  replace('u0101', 'ā').	
  replace('u0102', 'Ă').	
  replace('u0103', 'ă').	
  replace('u0104', 'Ą').	
  replace('u0105', 'ą').	
  replace('u0106', 'Ć').	
  replace('u0107', 'ć').	
  replace('u0108', 'Ĉ').	
  replace('u0109', 'ĉ').	
  replace('u010a', 'Ċ').	
  replace('u010b', 'ċ').	
  replace('u010c', 'Č').	
  replace('u010d', 'č').	
  replace('u010e', 'Ď').	
  replace('u010f', 'ď').	
  replace('u0110', 'Đ').	
  replace('u0111', 'đ').	
  replace('u0112', 'Ē').	
  replace('u0113', 'ē').	
  replace('u0114', 'Ĕ').	
  replace('u0115', 'ĕ').	
  replace('u0116', 'Ė').	
  replace('u0117', 'ė').	
  replace('u0118', 'Ę').	
  replace('u0119', 'ę').	
  replace('u011a', 'Ě').	
  replace('u011b', 'ě').	
  replace('u011c', 'Ĝ').	
  replace('u011d', 'ĝ').	
  replace('u011e', 'Ğ').	
  replace('u011f', 'ğ').	
  replace('u0120', 'Ġ').	
  replace('u0121', 'ġ').	
  replace('u0122', 'Ģ').	
  replace('u0123', 'ģ').	
  replace('u0124', 'Ĥ').	
  replace('u0125', 'ĥ').	
  replace('u0126', 'Ħ').	
  replace('u0127', 'ħ').	
  replace('u0128', 'Ĩ').	
  replace('u0129', 'ĩ').	
  replace('u012a', 'Ī').	
  replace('u012b', 'ī').	
  replace('u012c', 'Ĭ').	
  replace('u012d', 'ĭ').	
  replace('u012e', 'Į').	
  replace('u012f', 'į').	
  replace('u0130', 'İ').	
  replace('u0131', 'ı').	
  replace('u0132', 'Ĳ').	
  replace('u0133', 'ĳ').	
  replace('u0134', 'Ĵ').	
  replace('u0135', 'ĵ').	
  replace('u0136', 'Ķ').	
  replace('u0137', 'ķ').	
  replace('u0138', 'ĸ').	
  replace('u0139', 'Ĺ').	
  replace('u013a', 'ĺ').	
  replace('u013b', 'Ļ').	
  replace('u013c', 'ļ').	
  replace('u013d', 'Ľ').	
  replace('u013e', 'ľ').	
  replace('u013f', 'Ŀ').	
  replace('u0140', 'ŀ').	
  replace('u0141', 'Ł').	
  replace('u0142', 'ł').	
  replace('u0143', 'Ń').	
  replace('u0144', 'ń').	
  replace('u0145', 'Ņ').	
  replace('u0146', 'ņ').	
  replace('u0147', 'Ň').	
  replace('u0148', 'ň').	
  replace('u0149', 'ŉ').	
  replace('u014a', 'Ŋ').	
  replace('u014b', 'ŋ').	
  replace('u014c', 'Ō').	
  replace('u014d', 'ō').	
  replace('u014e', 'Ŏ').	
  replace('u014f', 'ŏ').	
  replace('u0150', 'Ő').	
  replace('u0151', 'ő').	
  replace('u0152', 'Œ').	
  replace('u0153', 'œ').	
  replace('u0154', 'Ŕ').	
  replace('u0155', 'ŕ').	
  replace('u0156', 'Ŗ').	
  replace('u0157', 'ŗ').	
  replace('u0158', 'Ř').	
  replace('u0159', 'ř').	
  replace('u015a', 'Ś').	
  replace('u015b', 'ś').	
  replace('u015c', 'Ŝ').	
  replace('u015d', 'ŝ').	
  replace('u015e', 'Ş').	
  replace('u015f', 'ş').	
  replace('u0160', 'Š').	
  replace('u0161', 'š').	
  replace('u0162', 'Ţ').	
  replace('u0163', 'ţ').	
  replace('u0164', 'Ť').	
  replace('u0165', 'ť').	
  replace('u0166', 'Ŧ').	
  replace('u0167', 'ŧ').	
  replace('u0168', 'Ũ').	
  replace('u0169', 'ũ').	
  replace('u016a', 'Ū').	
  replace('u016b', 'ū').	
  replace('u016c', 'Ŭ').	
  replace('u016d', 'ŭ').	
  replace('u016e', 'Ů').	
  replace('u016f', 'ů').	
  replace('u0170', 'Ű').	
  replace('u0171', 'ű').	
  replace('u0172', 'Ų').	
  replace('u0173', 'ų').	
  replace('u0174', 'Ŵ').	
  replace('u0175', 'ŵ').	
  replace('u0176', 'Ŷ').	
  replace('u0177', 'ŷ').	
  replace('u0178', 'Ÿ').	
  replace('u0179', 'Ź').	
  replace('u017a', 'ź').	
  replace('u017b', 'Ż').	
  replace('u017c', 'ż').	
  replace('u017d', 'Ž').	
  replace('u017e', 'ž').	
  replace('u017f', 'ſ').	
  replace('u0180', 'ƀ').	
  replace('u0181', 'Ɓ').	
  replace('u0182', 'Ƃ').	
  replace('u0183', 'ƃ').	
  replace('u0184', 'Ƅ').	
  replace('u0185', 'ƅ').	
  replace('u0186', 'Ɔ').	
  replace('u0187', 'Ƈ').	
  replace('u0188', 'ƈ').	
  replace('u0189', 'Ɖ').	
  replace('u018a', 'Ɗ').	
  replace('u018b', 'Ƌ').	
  replace('u018c', 'ƌ').	
  replace('u018d', 'ƍ').	
  replace('u018e', 'Ǝ').	
  replace('u018f', 'Ə').	
  replace('u0190', 'Ɛ').	
  replace('u0191', 'Ƒ').	
  replace('u0192', 'ƒ').	
  replace('u0193', 'Ɠ').	
  replace('u0194', 'Ɣ').	
  replace('u0195', 'ƕ').	
  replace('u0196', 'Ɩ').	
  replace('u0197', 'Ɨ').	
  replace('u0198', 'Ƙ').	
  replace('u0199', 'ƙ').	
  replace('u019a', 'ƚ').	
  replace('u019b', 'ƛ').	
  replace('u019c', 'Ɯ').	
  replace('u019d', 'Ɲ').	
  replace('u019e', 'ƞ').	
  replace('u019f', 'Ɵ').	
  replace('u01a0', 'Ơ').	
  replace('u01a1', 'ơ').	
  replace('u01a2', 'Ƣ').	
  replace('u01a3', 'ƣ').	
  replace('u01a4', 'Ƥ').	
  replace('u01a5', 'ƥ').	
  replace('u01a6', 'Ʀ').	
  replace('u01a7', 'Ƨ').	
  replace('u01a8', 'ƨ').	
  replace('u01a9', 'Ʃ').	
  replace('u01aa', 'ƪ').	
  replace('u01ab', 'ƫ').	
  replace('u01ac', 'Ƭ').	
  replace('u01ad', 'ƭ').	
  replace('u01ae', 'Ʈ').	
  replace('u01af', 'Ư').	
  replace('u01b0', 'ư').	
  replace('u01b1', 'Ʊ').	
  replace('u01b2', 'Ʋ').	
  replace('u01b3', 'Ƴ').	
  replace('u01b4', 'ƴ').	
  replace('u01b5', 'Ƶ').	
  replace('u01b6', 'ƶ').	
  replace('u01b7', 'Ʒ').	
  replace('u01b8', 'Ƹ').	
  replace('u01b9', 'ƹ').	
  replace('u01ba', 'ƺ').	
  replace('u01bb', 'ƻ').	
  replace('u01bc', 'Ƽ').	
  replace('u01bd', 'ƽ').	
  replace('u01be', 'ƾ').	
  replace('u01bf', 'ƿ').	
  replace('u01c0', 'ǀ').	
  replace('u01c1', 'ǁ').	
  replace('u01c2', 'ǂ').	
  replace('u01c3', 'ǃ').	
  replace('u01c4', 'Ǆ').	
  replace('u01c5', 'ǅ').	
  replace('u01c6', 'ǆ').	
  replace('u01c7', 'Ǉ').	
  replace('u01c8', 'ǈ').	
  replace('u01c9', 'ǉ').	
  replace('u01ca', 'Ǌ').	
  replace('u01cb', 'ǋ').	
  replace('u01cc', 'ǌ').	
  replace('u01cd', 'Ǎ').	
  replace('u01ce', 'ǎ').	
  replace('u01cf', 'Ǐ').	
  replace('u01d0', 'ǐ').	
  replace('u01d1', 'Ǒ').	
  replace('u01d2', 'ǒ').	
  replace('u01d3', 'Ǔ').	
  replace('u01d4', 'ǔ').	
  replace('u01d5', 'Ǖ').	
  replace('u01d6', 'ǖ').	
  replace('u01d7', 'Ǘ').	
  replace('u01d8', 'ǘ').	
  replace('u01d9', 'Ǚ').	
  replace('u01da', 'ǚ').	
  replace('u01db', 'Ǜ').	
  replace('u01dc', 'ǜ').	
  replace('u01dd', 'ǝ').	
  replace('u01de', 'Ǟ').	
  replace('u01df', 'ǟ').	
  replace('u01e0', 'Ǡ').	
  replace('u01e1', 'ǡ').	
  replace('u01e2', 'Ǣ').	
  replace('u01e3', 'ǣ').	
  replace('u01e4', 'Ǥ').	
  replace('u01e5', 'ǥ').	
  replace('u01e6', 'Ǧ').	
  replace('u01e7', 'ǧ').	
  replace('u01e8', 'Ǩ').	
  replace('u01e9', 'ǩ').	
  replace('u01ea', 'Ǫ').	
  replace('u01eb', 'ǫ').	
  replace('u01ec', 'Ǭ').	
  replace('u01ed', 'ǭ').	
  replace('u01ee', 'Ǯ').	
  replace('u01ef', 'ǯ').	
  replace('u01f0', 'ǰ').	
  replace('u01f1', 'Ǳ').	
  replace('u01f2', 'ǲ').	
  replace('u01f3', 'ǳ').	
  replace('u01f4', 'Ǵ').	
  replace('u01f5', 'ǵ').	
  replace('u01f6', 'Ƕ').	
  replace('u01f7', 'Ƿ').	
  replace('u01f8', 'Ǹ').	
  replace('u01f9', 'ǹ').	
  replace('u01fa', 'Ǻ').	
  replace('u01fb', 'ǻ').	
  replace('u01fc', 'Ǽ').	
  replace('u01fd', 'ǽ').	
  replace('u01fe', 'Ǿ').	
  replace('u01ff', 'ǿ').	
  replace('u0200', 'Ȁ').	
  replace('u0201', 'ȁ').	
  replace('u0202', 'Ȃ').	
  replace('u0203', 'ȃ').	
  replace('u0204', 'Ȅ').	
  replace('u0205', 'ȅ').	
  replace('u0206', 'Ȇ').	
  replace('u0207', 'ȇ').	
  replace('u0208', 'Ȉ').	
  replace('u0209', 'ȉ').	
  replace('u020a', 'Ȋ').	
  replace('u020b', 'ȋ').	
  replace('u020c', 'Ȍ').	
  replace('u020d', 'ȍ').	
  replace('u020e', 'Ȏ').	
  replace('u020f', 'ȏ').	
  replace('u0210', 'Ȑ').	
  replace('u0211', 'ȑ').	
  replace('u0212', 'Ȓ').	
  replace('u0213', 'ȓ').	
  replace('u0214', 'Ȕ').	
  replace('u0215', 'ȕ').	
  replace('u0216', 'Ȗ').	
  replace('u0217', 'ȗ').	
  replace('u0218', 'Ș').	
  replace('u0219', 'ș').	
  replace('u021a', 'Ț').	
  replace('u021b', 'ț').	
  replace('u021c', 'Ȝ').	
  replace('u021d', 'ȝ').	
  replace('u021e', 'Ȟ').	
  replace('u021f', 'ȟ').	
  replace('u0220', 'Ƞ').	
  replace('u0221', 'ȡ').	
  replace('u0222', 'Ȣ').	
  replace('u0223', 'ȣ').	
  replace('u0224', 'Ȥ').	
  replace('u0225', 'ȥ').	
  replace('u0226', 'Ȧ').	
  replace('u0227', 'ȧ').	
  replace('u0228', 'Ȩ').	
  replace('u0229', 'ȩ').	
  replace('u022a', 'Ȫ').	
  replace('u022b', 'ȫ').	
  replace('u022c', 'Ȭ').	
  replace('u022d', 'ȭ').	
  replace('u022e', 'Ȯ').	
  replace('u022f', 'ȯ').	
  replace('u0230', 'Ȱ').	
  replace('u0231', 'ȱ').	
  replace('u0232', 'Ȳ').	
  replace('u0233', 'ȳ').	
  replace('u0234', 'ȴ').	
  replace('u0235', 'ȵ').	
  replace('u0236', 'ȶ').	
  replace('u0237', 'ȷ').	
  replace('u0238', 'ȸ').	
  replace('u0239', 'ȹ').	
  replace('u023a', 'Ⱥ').	
  replace('u023b', 'Ȼ').	
  replace('u023c', 'ȼ').	
  replace('u023d', 'Ƚ').	
  replace('u023e', 'Ⱦ').	
  replace('u023f', 'ȿ').	
  replace('u0240', 'ɀ').	
  replace('u0241', 'Ɂ').	
  replace('u0242', 'ɂ').	
  replace('u0243', 'Ƀ').	
  replace('u0244', 'Ʉ').	
  replace('u0245', 'Ʌ').	
  replace('u0246', 'Ɇ').	
  replace('u0247', 'ɇ').	
  replace('u0248', 'Ɉ').	
  replace('u024a', 'Ɋ').	
  replace('u024b', 'ɋ').	
  replace('u024c', 'Ɍ').	
  replace('u024d', 'ɍ').	
  replace('u024e', 'Ɏ').	
  replace('u024f', 'ɏ').	
  replace('u011b', 'ě');	
}

module.exports = router;