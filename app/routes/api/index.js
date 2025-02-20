import config from 'getconfig';
import createRouter from "../router.js";
const router = createRouter();

import fs from 'fs';
import imageUtil from '../../utilities/image.js';

import mongoose from 'mongoose';

const User = mongoose.model('User');
const Event = mongoose.model('Event');
const Footage = mongoose.model('Footage');
const Performance = mongoose.model('Performance');
const Playlist = mongoose.model('Playlist');
const Video = mongoose.model('Video');
const News = mongoose.model('News');
const Gallery = mongoose.model('Gallery');

const Order = mongoose.model('Order');
const Vjtv = mongoose.model('Vjtv');
const Emailqueue = mongoose.model('Emailqueue');

import { logger, requestLogger, errorLogger } from '../../utilities/logger.js';

router.get('/likes', async (req, res) => {
  let res_send = "P";
  if (!req.user) {
    res.send({err:true,msg:__("Please login to like"), status:""});
  } else { 
    let model;
    let inc;
    let likeid = req.query.img_index ? req.query.id+"#IMG:"+req.query.img_slug : req.query.id;
    if (req.query.section ==='performances') model = Performance;
    if (req.query.section ==='events') model = Event;
    if (req.query.section ==='videos') model = Video;
    if (req.query.section ==='footage') model = Footage;
    if (req.query.section ==='playlists') model = Playlist;
    if (req.query.section ==='news') model = News;
    if (req.query.section ==='galleries') model = Gallery;
    console.log("req.userreq.userreq.userreq.userreq.user")
    console.log(req.user.likes[req.query.section].map(function(e) { return e.id.toString(); }))
    console.log(likeid)
    if (!req.user.likes || !req.user.likes[req.query.section] || req.user.likes[req.query.section].map(function(e) { return e.id.toString(); }).indexOf(likeid.toString())===-1) {
      if (!req.user.likes) req.user.likes = {};
      if (!req.user.likes[req.query.section]) req.user.likes[req.query.section] = [];
      req.user.likes[req.query.section].push({date:new Date(),id:likeid});
      res_send = "Liked";
      inc = 1;
    } else {
      req.user.likes[req.query.section].splice(req.user.likes[req.query.section].map(function(e) { return e.id.toString(); }).indexOf(likeid.toString()),1);
      res_send = "Unliked";
      inc = -1;
    }
    try {
      await User.updateOne({ _id: req.user._id }, { $set: { likes: req.user.likes } }).exec();

      if (req.query.img_slug) {
        try {
          await model.updateOne(
            { _id: req.query.id, "medias.slug": req.query.img_slug },
            { $inc: { "medias.$.stats.likes": inc } }
          ).exec();
        } catch (err) {
          console.error("Error updating media likes:", err);
        }
      } else {
        try {
          await model.updateOne(
            { _id: req.query.id },
            { $inc: { "stats.likes": inc } }
          ).exec();
        } catch (err) {
          console.error("Error updating likes:", err);
        }
      }
  
      res.send({ err: false, msg: "", status: res_send, likes: req.user.likes });
  
    } catch (err) {
      console.error("🔥 Error in /likes route:", err);
      logger.info(err);
    }
  }
});

router.post('/emailqueue', async (req, res) => {
  try {
    const emailqueue = await Emailqueue
    .findOne({_id: req.body.id})
    .exec();
    if (emailqueue.messages_tosend && emailqueue.messages_tosend.length) {
      const data = emailqueue.messages_tosend[0];
      const auth = {
        user: data.user_email,
        pass: data.user_password
      };
      const mail = {
        from: data.from_name + " <"+ data.from_email + ">",
        //to: data.from_name + " <"+ data.from_email + ">",
        to: data.to_html,
        subject: data.subject,
        text: data.text
      };
      if (data.cc_html && data.cc_html.length) mail.cc = data.cc_html.join(", ");
      const gmailer = require('../../utilities/gmailer');
      gmailer.gMailer({auth:auth, mail:mail}, function (err, result){
        if (err) {
          logger.info("Email sending failure");
          logger.info(err);
          res.json({error: true, msg: "Email sending failure", id: req.body.id, err: err});
        } else {
          logger.info("Email sending OK");
          emailqueue.messages_sent.push(emailqueue.messages_tosend[0]);
          emailqueue.messages_tosend = emailqueue.messages_tosend.splice(1, emailqueue.messages_tosend.length)
          emailqueue.save((err) => {
            if (err) {
              res.json({error: true, msg: "Saving email queue failed", id: req.body.id});
            } else {
              res.json({error: false, msg: "Email sending success", id: req.body.id});
            }
          });
        }
      });
    } else {
      logger.info("Email sending completed");
      res.json({error: false, msg: "Email sending completed", id: req.body.id});
    }
  } catch (err) {
    res.status(500).send({ message: `${JSON.stringify(err)}` });
  }
});

router.get('/tobeencoded/:sez', async (req, res) => {
  const Model = req.params.sez && req.params.sez == "videos" ? Video : Footage;
  try {
    const data = await Model
    //.findOne({"media.encoded":{$exists:true},"media.encoded": {$ne:true},"media.encoded": {$ne:1}})
    //.find({"media.encoded":{$exists:true}, "media.original":{$exists:true}, "media.encoded": 1,"media.original":{$regex: '2013/12/capillary_short.mov'}})
    .find({media:{$exists:true}, $or: [{"media.encoded":{$exists:false}}, {"media.encoded":0}]})
    .lean(1)
    .limit(1)
    .sort({createdAt: 1})
    .select({media:1})
    .exec();
    if (data.length) {
      res.json(data);      
    } else {
      try {
        const data = await Model
        .find({media:{$exists:true}, $or: [{"media.rencoded":{$exists:false}}]})
        .lean(1)
        .limit(1)
        .select({media:1})
        .sort({createdAt:-1})
        .exec();
        res.json(data);
      } catch (err) {
        res.status(500).send({ message: `${JSON.stringify(err)}` });
      }
    }
  } catch (err) {
    res.status(500).send({ message: `${JSON.stringify(err)}` });
  }
});

import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';

router.get('/setdurationandsize/:sez/:id/', async (req, res) => {
  logger.info('/setencodingstatus/:sez/:id/');
  logger.info("existsSync");
  let Model = req.params.sez && req.params.sez == "videos" ? Video : Footage;
  let data;
  try {
    data = await Model
    .findOne({_id:req.params.id})
    .exec();
    if (!fs.existsSync(config.appRoot+data.media.file)) {
      return res.json({error: "FILE NOT FOUND"});
    }
  } catch (err) {
    return res.status(500).send({ message: `${JSON.stringify(err)}` });
  }
  data.media.filesize = fs.statSync(config.appRoot+data.media.file).size;
  logger.info("ffprobe");
  logger.info(config.appRoot+data.media.file);

  ffprobe(config.appRoot+data.media.file, { path: ffprobeStatic.path }, function (err, info) {
    logger.info("ffprobe");
    logger.info(info);
  
      if (!info || !info.streams || !info.streams.length) {
      res.json({error: "NO_STREAMS"});
    } else {
      for (var a=0; a<info.streams.length; a++) {
        if (info.streams[a].width && info.streams[a].height) {
          data.media.width = info.streams[a].width;
          data.media.height = info.streams[a].height;
          data.media.duration = info.streams[a].duration*1000;
        }
      }
      try {
        data.save();
      } catch (err) {
        return rres.json(err);
      }
    }
  });
});

router.get('/setencodingstatus/:sez/:id/:encoding', async (req, res) => {
  logger.info('/setencodingstatus/:sez/:id/:encoding');
  logger.info(req.params.encoding);
  const Model = req.params.sez && req.params.sez == "videos" ? Video : Footage;
  let data;
  if (req.params.encoding == 1) {
    try {
      data = await Model
      .findOne({_id:req.params.id})
      .exec()
      logger.info(data.media.original);
      const ext = data.media.original.substring(data.media.original.lastIndexOf(".")+1);
      data.media.file = data.media.original.substring(0, data.media.original.lastIndexOf(".")).replace("_originals/", "/").replace("/glacier/", "/warehouse/")+"_"+ext+".mp4";
      data.media.preview = data.media.original.substring(0, data.media.original.lastIndexOf(".")).replace("_originals/", "_previews/")+"_"+ext+".png";
      data.is_public = 1;
      data.media.encoded = req.params.encoding;
      logger.info(config.appRoot+data.media.preview);
      logger.info(config.appRoot+data.media.file);
      if (fs.existsSync(config.appRoot+data.media.file)) {
        data.media.filesize = fs.statSync(config.appRoot+data.media.file).size;
        const options = config.cpanel[req.params.sez].forms.video.components.media.config;
        logger.info("data.media.filesize");
        logger.info(data.media.filesize);
        logger.info(imageUtil);
        logger.info(imageUtil.resizer);

        imageUtil.resizer([{path:config.appRoot+data.media.preview}], options, (files_resized) => {
          logger.info("files_resized");
          logger.info(files_resized);
          if (files_resized.map(item => {return item.err ? true : false}).indexOf(true)!==-1) {
            logger.info("Image resize ERROR: info undefined");
            res.json(files_resized);
          } else {
            data.media.encoded = req.params.encoding;
            data.media.rencoded = req.params.encoding;
            ffprobe(config.appRoot+data.media.file, { path: ffprobeStatic.path }, async function (err, info) {
              if (!info || !info.streams || !info.streams.length) {
                res.json({error: "NO_STREAMS"});
              } else {
                for (var a=0; a<info.streams.length; a++) {
                  if (info.streams[a].width && info.streams[a].height) {
                    data.media.width = info.streams[a].width;
                    data.media.height = info.streams[a].height;
                    data.media.duration = info.streams[a].duration*1000;
                  }
                }
                try {
                  let result = await data.save();
                  return res.json(result);
                } catch (err) {
                  return res.json(err);
                  
                }
              }
            });
              }
        });
      } else {
        res.json({error: "FILE NOT FOUND"});
      }
    } catch (err) {
      res.status(500).send({ message: `${JSON.stringify(err)}` });
    }
  } else {
    try {
      logger.info("setencodingstatus: "+req.params.id);
      let raw = await Model.updateOne({_id:req.params.id},{ $set: {"media.encoded":req.params.encoding, "media.rencoded":req.params.encoding}})
      logger.info(raw);
      res.json(raw);
    } catch(err) {
      logger.error(err);
      res.json(err);
    }
  }
});

import cors from 'cors';
var corsOptions = {
  origin: 'https://liveperformersmeeting.net',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.post('/transactionupdate', cors(corsOptions), (req, res)=>{
  logger.info("updateTransation");
  logger.info(req.body);

  const gmailer = require('../../utilities/gmailer');
  Order
  .create(req.body, async (err, data) => {
    logger.info("req.body.event");
    logger.info(req.body);
    if(!err) {
      if (req.body.event) {
        logger.info(req.body.event);
        try {
          const event = await Event
          .findOne({"_id":req.body.event})
          .select({title:1, organizationsettings:1})
          .exec();
          logger.info("event.organizationsettings.email");
          logger.info(event.organizationsettings.email);
          const auth = {
            user: event.organizationsettings.emailuser,
            pass: event.organizationsettings.emailpassword
          };
          let email = "Ciao " + req.body.details.payer.name.given_name +",\n"+"your payment to \""+event.title+"\" was successful!!!";
          email+= "\n\nYour purchase is:";
          for (var a=0;a<req.body.details.purchase_units.length;a++) {
            email+= "\n\n"+req.body.details.purchase_units[a].description+"           "+req.body.details.purchase_units[a].amount.value+" "+req.body.details.purchase_units[a].amount.currency_code+" ";
          } 
          email+= "\n\nThank you.";
          email+= "\n\n"+event.organizationsettings.text_sign;
          const mail = {
            from: event.organizationsettings.emailname + " <"+ event.organizationsettings.email + ">",
            to: req.body.details.payer.name.given_name + " " + req.body.details.payer.name.surname + " <"+ req.body.details.payer.email_address + ">",
            subject: __("Payment Confirm") + " | " + event.title,
            text: email
          };
          logger.info("pre gMailer")
          logger.info(auth)
          logger.info(mail)
          gmailer.gMailer({auth:auth, mail:mail}, function (err, result){
            /* logger.info("gMailer");
            logger.info(err);
            logger.info("gMailer");
            logger.info(result);
            res.json({res:result}); */
            if (err) {
              logger.info("Email sending failure");
              logger.info(err);
              res.json({error: true, msg: "Email sending failure", err: err});
            } else {
              logger.info("Email sending OK");
              res.json({error: false, msg: "Email sending success"});
            }
          });
        } catch (err) {
          res.status(500).send({ message: `${JSON.stringify(err)}` });
        }
      } else {
        res.json({err:err});
      }
    }
  });  
});

router.get('/getprogramsdays', async (req, res) => {
  logger.info("getprograms");
  try {
    const days = await Vjtv.
    aggregate([
      {"$group":{
      "_id":{
        "$dateToString":{"format":"%Y-%m-%d","date":"$programming"}
      }
    }}]).
    exec();
    res.json(days.map(item =>{return item._id}));
  } catch (err) {
    res.status(500).send({ message: `${JSON.stringify(err)}` });
  }
});

router.get('/getprograms', async (req, res) => {
  logger.info("getprograms");
  //req.body.month = "2020-03";
  logger.info(req.query);
  if(req.query.day) {
    var pieces = req.query.day.split("-");
    var date = new Date(Date.UTC(parseInt(pieces[0]), parseInt(pieces[1])-1, parseInt(pieces[2]), 0, 0,0,0));
  } else {
    var date = new Date();
  }
  logger.info(date);
  // 1 Month
  //var start = new Date(new Date(date.getFullYear(), date.getMonth(), 1, 0, 0,0,0).getTime()+offset);
  //var end = new Date(new Date(date.getFullYear(), date.getMonth()+1, 1, 0, 0,0,0).getTime()+offset+offset);
  
  //1 Week
  var week = 7*24*60*60*1000;
  //1 Full day
  //var start = new Date(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0,0,0).getTime()+offset);
  //var end = new Date(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59,0,0).getTime()+offset+offset);

  //1 Full day
  var day = 24*60*60*1000;
  //var start = new Date(date.getTime()+offset);
  var start = date;
  var end = new Date(date.getTime()+day);

  logger.info(start);
  logger.info(end);
  try {
    const results = await Vjtv
    .find({programming: { $lt: end, $gt: start}})
    //.select(select)
    .sort({programming: 1})
    .populate([{path: "video", select: {title: 1, slug: 1, "media.preview": 1, "media.duration": 1,"media.file": 1}, populate: {path:"users", select: {stagename: 1}}},{path:"category", select: "name"}])
    .exec();
    var data = [];
    for(var i = 0; i<results.length;i++){
      if (results[i].video && results[i].video.media && results[i].video.media.duration) data.push(results[i]);
    }
    if(req.query.stream) {
      var stream = {
        "channel": "VJ Television",
        "date": req.query.day,
        "program": []
      };
      var tot = 0;
      for(var i = 0; i<data.length;i++){
        duration = parseInt(data[i].video.media.duration)/1000;
        if (tot+duration > 86400) {
          duration = (86400000 - tot*1000)/1000;
        } else {
        }
        tot = parseInt((tot+duration)*1000)/1000;
        stream.program.push({
          "in": 0,
          "out": duration,
          "duration": duration,
          "source": data[i].video.media.file
        });
      }
      res.json(stream);
    } else {
      res.json(data);
    }
    /* if (err) {
      res.status(404).send({ message: `${JSON.stringify(err)}` });
    } else {
      if (!data) {
        res.status(404).send({ message: `DOC_NOT_FOUND` });
      } else {
        if (helpers.editable(req, data, id)) {
          let send = {_id: data._id};
          for (const item in config.cpanel[req.params.sez].forms[req.params.form].select) send[item] = data[item];
          res.json(send);
        } else {
          res.status(401).send({ message: `DOC_NOT_OWNED` });
        }
      }
    } */
  } catch (err) {
    res.status(500).send({ message: `${JSON.stringify(err)}` });
  }
});
  
router.get('/getprograms2', async (req, res) => {
  logger.info("getprograms2");
  //req.body.month = "2020-03";
  logger.info(req.query);
  if(req.query.start && req.query.end) {
    var start = new Date(new Date(req.query.start).getTime()-(new Date(req.query.start).getTimezoneOffset()*60*1000));
    var end = new Date(new Date(req.query.end).getTime()-(new Date(req.query.end).getTimezoneOffset()*60*1000));
  } else {
    var date = new Date();
    logger.info(date);
    // 1 Month
    //var start = new Date(new Date(date.getFullYear(), date.getMonth(), 1, 0, 0,0,0).getTime()+offset);
    //var end = new Date(new Date(date.getFullYear(), date.getMonth()+1, 1, 0, 0,0,0).getTime()+offset+offset);
    
    //1 Week
    var week = 7*24*60*60*1000;
    //1 Full day
    //var start = new Date(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0,0,0).getTime()+offset);
    //var end = new Date(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59,0,0).getTime()+offset+offset);

    //1 Full day
    var day = 24*60*60*1000;
    //var start = new Date(date.getTime()+offset);
    var start = date;
    var end = new Date(date.getTime()+day);
  }

  logger.info(start);
  logger.info(end);
  try {
    const results = await Vjtv
    .find({programming: { $lt: end, $gt: start}})
    //.select(select)
    .sort({programming: 1})
    .populate([{path: "video", select: {title: 1, slug: 1, "media.preview": 1, "media.duration": 1,"media.file": 1}, populate: [{path:"users", select: {stagename: 1}},{path:"categories", select: "name", model:"Category"}]}])
    .exec();
    var data = [];
    var colors = {"PERFORMANCES": "purple", "VJ-DJ SETS": "red", "DOCS": "green"};    
    for(var i = 0; i<results.length;i++){
      if (results[i].video && results[i].video.media && results[i].video.media.duration) data.push( {
        "title": results[i].video.title,
        "start": results[i].programming.getTime()+(results[i].programming.getTimezoneOffset()*60*1000),
        "end": results[i].programming.getTime()+(results[i].programming.getTimezoneOffset()*60*1000)+results[i].video.media.duration,
        "color": colors[results[i].video.categories[0].name] ? colors[results[i].video.categories[0].name] : undefined
      });
    }
    res.json(data);
    /* if (err) {
      res.status(404).send({ message: `${JSON.stringify(err)}` });
    } else {
      if (!data) {
        res.status(404).send({ message: `DOC_NOT_FOUND` });
      } else {
        if (helpers.editable(req, data, id)) {
          let send = {_id: data._id};
          for (const item in config.cpanel[req.params.sez].forms[req.params.form].select) send[item] = data[item];
          res.json(send);
        } else {
          res.status(401).send({ message: `DOC_NOT_OWNED` });
        }
      }
    } */
  } catch (err) {
    res.status(500).send({ message: `${JSON.stringify(err)}` });
  }
});
    
router.get('/getcurrentprogram', async (req, res) => {
  logger.info("getcurrentprogram");
  logger.info(req.query);
  if(req.query.day) {
    var pieces = req.query.day.split("-");
    var date = new Date(Date.UTC(parseInt(pieces[0]), parseInt(pieces[1])-1, parseInt(pieces[2]), 0, 0,0,0));
  } else {
    var date = new Date();
    date = new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ));
  }
  try {
    const data = await Vjtv
    .findOne({programming: { $lt: date}})
    //.select(select)
    .sort({programming: -1})
    .populate([{path: "video", select: {title: 1, slug: 1, "media.preview": 1, "media.duration": 1,"media.file": 1}, populate: {path:"users", select: {stagename: 1}}},{path:"category", select: "name"}])
    .exec()
    var r = {
      data: data, 
      date: date
    };
    if(req.query.chat) {
      const tmi = require('tmi.js');
      const opts = {
        identity: {
          username: process.env.BOT_USERNAME,
          password: process.env.OAUTH_TOKEN
        },
        channels: [
          process.env.CHANNEL_NAME
        ]
      };
      // Create a client with our options
      const client = new tmi.client(opts);

      // Register our event handlers (defined below)
      client.on('connected', onConnectedHandler);
      
      // Connect to Twitch:
      client.connect();
      
      // Called every time a message comes in
      function onConnectedHandler (target, context, msg, self) {
        const https = require('https');
        var mess = "";
        mess+="\nTitle: " + data.video.title;
        mess+="\nAuthor: " + data.video.users[0].stagename;
        mess+="\nURL: https://avnode.net/videos/" + data.video.slug;
        client.say("#vjtelevision", mess);
        res.json(r);
      }
    } else {
      res.json(r);
    }
  } catch (err) {
    res.status(500).send({ message: `${JSON.stringify(err)}` });
  }
});
  
export default router;
