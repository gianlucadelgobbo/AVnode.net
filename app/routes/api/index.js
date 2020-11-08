const config = require('getconfig');
const router = require('../router')();
//const dataprovider = require('../../utilities/dataprovider');
const fs = require("fs");

const imageUtil = require("../../utilities/image");

const Footage = require('mongoose').model('Footage');
const Video = require('mongoose').model('Video');
const Order = require('mongoose').model('Order');
const Event = require('mongoose').model('Event');
const Vjtv = require('mongoose').model('Vjtv');
const Emailqueue = require('mongoose').model('Emailqueue');

const logger = require('../../utilities/logger');

router.post('/emailqueue', (req, res) => {
  Emailqueue
  .findOne({_id: req.body.id})
  .exec((err, emailqueue) => {
    if (err) {
      res.status(500).send({ message: `${JSON.stringify(err)}` });
    } else {
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
            logger.debug("Email sending failure");
            logger.debug(err);
            res.json({error: true, msg: "Email sending failure", id: req.body.id, err: err});
          } else {
            logger.debug("Email sending OK");
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
        logger.debug("Email sending completed");
        res.json({error: false, msg: "Email sending completed", id: req.body.id});
      }
    }
  });
});

router.get('/tobeencoded/:sez', (req, res) => {
  Model = req.params.sez && req.params.sez == "videos" ? Video : Footage;  
  Model
  //.findOne({"media.encoded":{$exists:true},"media.encoded": {$ne:true},"media.encoded": {$ne:1}})
  //.find({"media.encoded":{$exists:true}, "media.original":{$exists:true}, "media.encoded": 1,"media.original":{$regex: '2013/12/capillary_short.mov'}})
  .find({media:{$exists:true}, $or: [{"media.encoded":{$exists:false}}, {"media.encoded":0}]})
  .lean(1)
  .limit(1)
  .sort({createdAt: 1})
  .select({media:1})
  .exec((err, data) => {
    if (err) {
      res.status(500).send({ message: `${JSON.stringify(err)}` });
    } else {
      if (data.length) {
        res.json(data);      
      } else {
        Model
        .find({media:{$exists:true}, $or: [{"media.rencoded":{$exists:false}}]})
        .lean(1)
        .limit(1)
        .select({media:1})
        .sort({createdAt:-1})
        .exec((err, data) => {
          if (err) {
            res.status(500).send({ message: `${JSON.stringify(err)}` });
          } else {
            res.json(data);
          }
        });      
      }
    }
  });
});

router.get('/setdurationandsize/:sez/:id/', (req, res) => {
  logger.debug('/setencodingstatus/:sez/:id/');
  logger.debug("existsSync");
  Model = req.params.sez && req.params.sez == "videos" ? Video : Footage;
  Model
  .findOne({_id:req.params.id})
  .exec((err, data) => {
    logger.debug(data);
    //data.media.file = "/public/1f575e4c-7cd5-4609-a0cc-75b3b301c6f3.mp4";
    if (err) {
      res.status(500).send({ message: `${JSON.stringify(err)}` });
    } else {
      /* if (!data || !data.media || data.media.file) {
        res.status(500).send({ message: "MEDIA NOT FOUND" });
      } else { */
        if (fs.existsSync(global.appRoot+data.media.file)) {
          data.media.filesize = fs.statSync(global.appRoot+data.media.file).size;
          logger.debug("ffprobe");
          logger.debug(global.appRoot+data.media.file);
      
          var ffprobe = require('ffprobe');
          var ffprobeStatic = require('ffprobe-static');
          ffprobe(global.appRoot+data.media.file, { path: ffprobeStatic.path }, function (err, info) {
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
              data.save((err) => {
                if (err) {
                  res.json(err);
                } else {
                  res.json(data);
                }
              });
            }
          });
        } else {
          res.json({error: "FILE NOT FOUND"});
        }
      //}
    }
  });
});

router.get('/setencodingstatus/:sez/:id/:encoding', (req, res) => {
  logger.debug('/setencodingstatus/:sez/:id/:encoding');
  logger.debug(req.params.encoding);
  Model = req.params.sez && req.params.sez == "videos" ? Video : Footage;
  if (req.params.encoding == 1) {
    Model
    .findOne({_id:req.params.id})
    .exec((err, data) => {
      if (err) {
        res.status(500).send({ message: `${JSON.stringify(err)}` });
      } else {
        logger.debug(data.media.original);
        const ext = data.media.original.substring(data.media.original.lastIndexOf(".")+1);
        data.media.file = data.media.original.substring(0, data.media.original.lastIndexOf(".")).replace("_originals/", "/").replace("/glacier/", "/warehouse/")+"_"+ext+".mp4";
        data.media.preview = data.media.original.substring(0, data.media.original.lastIndexOf(".")).replace("_originals/", "_previews/")+"_"+ext+".png";
        data.is_public = 1;
        data.media.encoded = req.params.encoding;
        logger.debug(global.appRoot+data.media.preview);
        logger.debug(global.appRoot+data.media.file);
        if (fs.existsSync(global.appRoot+data.media.file)) {
          data.media.filesize = fs.statSync(global.appRoot+data.media.file).size;
          const options = config.cpanel[req.params.sez].forms.video.components.media.config;
          logger.debug("data.media.filesize");
          logger.debug(data.media.filesize);
          logger.debug(imageUtil);
          logger.debug(imageUtil.resizer);

          imageUtil.resizer([{path:global.appRoot+data.media.preview}], options, (resizeerr, info) => {
            logger.debug("resizeerr || info");
            logger.debug(resizeerr || info);
            if (resizeerr || !info) {
              if (resizeerr) {
                logger.debug(`Image resize ERROR: ${resizeerr}`);
                res.json({error: `Image resize ERROR: ${resizeerr}`});
              } else if (!info) {
                logger.debug("Image resize ERROR: info undefined");
                res.json({error: `Image resize ERROR: ${resizeerr}`});
              }
            } else {
              data.media.encoded = req.params.encoding;
              data.media.rencoded = req.params.encoding;
              var ffprobe = require('ffprobe');
              var ffprobeStatic = require('ffprobe-static');
              ffprobe(global.appRoot+data.media.file, { path: ffprobeStatic.path }, function (err, info) {
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
                  data.save((err) => {
                    if (err) {
                      res.json(err);
                    } else {
                      res.json(data);
                    }
                  });
                }
              });
                }
          });
        } else {
          res.json({error: "FILE NOT FOUND"});
        }
      }
    });
  
  } else {
    Model.updateOne({_id:req.params.id},{"media.encoded":req.params.encoding, "media.rencoded":req.params.encoding}, (err, raw) => {
      res.json(raw);
    });
  }
});

var cors = require('cors')
var corsOptions = {
  origin: 'https://liveperformersmeeting.net',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
router.post('/transactionupdate', cors(corsOptions), (req, res)=>{
  logger.debug("updateTransation");
  logger.debug(req.body);

  const gmailer = require('../../utilities/gmailer');
  Order
  .create(req.body, (err, data) => {
    logger.debug("req.body.event");
    logger.debug(req.body);
    if(!err) {
      if (req.body.event) {
        logger.debug(req.body.event);
        Event
        .findOne({"_id":req.body.event})
        .select({title:1, organizationsettings:1})
        .exec((err, event) => {
          logger.debug("event.organizationsettings.email");
          logger.debug(event.organizationsettings.email);
          if (err) {
            res.status(500).send({ message: `${JSON.stringify(err)}` });
          } else {
            const auth = {
              user: event.organizationsettings.email,
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
            logger.debug("pre gMailer")
            logger.debug(auth)
            logger.debug(mail)
            gmailer.gMailer({auth:auth, mail:mail}, function (err, result){
              /* logger.debug("gMailer");
              logger.debug(err);
              logger.debug("gMailer");
              logger.debug(result);
              res.json({res:result}); */
              if (err) {
                logger.debug("Email sending failure");
                logger.debug(err);
                res.json({error: true, msg: "Email sending failure", err: err});
              } else {
                logger.debug("Email sending OK");
                res.json({error: false, msg: "Email sending success"});
              }
            });
          } 
        });  
      } else {
        res.json({err:err});
      }
    }
  });  
});

router.get('/getprogramsdays', (req, res) => {
  logger.debug("getprograms");
  Vjtv.
  aggregate([
    {"$group":{
     "_id":{
       "$dateToString":{"format":"%Y-%m-%d","date":"$programming"}
     }
  }}]).
  exec((err, days) => {
    res.json(days.map(item =>{return item._id}));
  });
});

router.get('/getprograms', (req, res) => {
  logger.debug("getprograms");
  //req.body.month = "2020-03";
  logger.debug(req.query);
  if(req.query.day) {
    var pieces = req.query.day.split("-");
    var date = new Date(Date.UTC(parseInt(pieces[0]), parseInt(pieces[1])-1, parseInt(pieces[2]), 0, 0,0,0));
  } else {
    var date = new Date();
  }
  logger.debug(date);
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

  logger.debug(start);
  logger.debug(end);
  Vjtv
  .find({programming: { $lt: end, $gt: start}})
  //.select(select)
  .sort({programming: 1})
  .populate([{path: "video", select: {title: 1, slug: 1, "media.preview": 1, "media.duration": 1,"media.file": 1}, populate: {path:"users", select: {stagename: 1}}},{path:"category", select: "name"}])
  .exec((err, data) => {
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
          res.status(404).send({ message: `DOC_NOT_OWNED` });
        }
      }
    } */
  });
});
  
  
router.get('/getcurrentprogram', (req, res) => {
  logger.debug("getcurrentprogram");
  logger.debug(req.query);
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
  logger.debug(date);
  Vjtv
  .findOne({programming: { $lt: date}})
  //.select(select)
  .sort({programming: -1})
  .populate([{path: "video", select: {title: 1, slug: 1, "media.preview": 1, "media.duration": 1,"media.file": 1}, populate: {path:"users", select: {stagename: 1}}},{path:"category", select: "name"}])
  .exec((err, data) => {
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
  });
});
  
module.exports = router;
