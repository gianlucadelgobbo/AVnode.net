const config = require('getconfig');
const router = require('../router')();
//const dataprovider = require('../../utilities/dataprovider');
const fs = require("fs");

const imageUtil = require("../../utilities/image");

const Footage = require('mongoose').model('Footage');
const Video = require('mongoose').model('Video');
const Order = require('mongoose').model('Order');

const logger = require('../../utilities/logger');

router.get('/tobeencoded/:sez', (req, res) => {
  Model = req.params.sez && req.params.sez == "videos" ? Video : Footage;  
  Model
  //.findOne({"media.encoded":{$exists:true},"media.encoded": {$ne:true},"media.encoded": {$ne:1}})
  //.find({"media.encoded":{$exists:true}, "media.original":{$exists:true}, "media.encoded": 1,"media.original":{$regex: '2013/12/capillary_short.mov'}})
  .find({media:{$exists:true}, $or: [{"media.encoded":{$exists:false}}, {"media.encoded":0}]})
  .lean(1)
  .limit(1)
  .select({media:1})
  .exec((err, data) => {
    if (err) {
      res.status(500).json({ error: `${JSON.stringify(err)}` });
    } else {
      res.json(data);
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
        res.status(500).json({ error: `${JSON.stringify(err)}` });
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
      }
    });
  
  } else {
    Model.updateOne({_id:req.params.id},{"media.encoded":req.params.encoding}, (err, raw) => {
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
    console.log("updateTransation");
    console.log(req.body);
  
    const gmailer = require('../../utilities/gmailer');
    Order
    .create(req.body, (err, data) => {
      if(!err) {
        /* if (sub.call >= 0 && event.organizationsettings.call && event.organizationsettings.call.calls && event.organizationsettings.call.calls[sub.call] && event.organizationsettings.call.calls[sub.call].email) {
          const auth = {
            user: event.organizationsettings.call.calls[sub.call].email,
            pass: event.organizationsettings.call.calls[sub.call].emailpassword
          };
          let email = "Ciao " + sub.reference.name +",\n"+"your submisstion to the call for proposals \""+event.organizationsettings.call.calls[sub.call].title+"\" with \""+sub.performance.title+"\" changed the status from \"" + old_status_name + "\" to \"" + status[req.body.status] + "\".";
          if (req.body.status == "5be8708afc3961000000019e") {
            email+= "\n\nPlease confirm as soon your participation from this page https://avnode.net/admin/subscriptions ";
          } else {
            email+= "\n\nYou can follow the status of your submission from here https://avnode.net/admin/subscriptions "; 
          }
          email+= "\n\n"+event.organizationsettings.call.calls[sub.call].text_sign;
          const mail = {
            from: event.organizationsettings.call.calls[sub.call].emailname + " <"+ event.organizationsettings.call.calls[sub.call].email + ">",
            to: sub.reference.name + " " + sub.reference.surname + " <"+ sub.reference.email + ">",
            subject: __("Submission UPDATES") + " | " + sub.performance.title + " | " + event.organizationsettings.call.calls[sub.call].title,
            text: email
          };
          console.log("pre gMailer")
          gmailer.gMailer({auth:auth, mail:mail}, function (err, result){
            /* console.log("gMailer");
            console.log(err);
            console.log("gMailer");
            console.log(result);
            res.json({res:result}); */
            /*if (err) {
              logger.debug("Email sending failure");
              res.json({error: true, msg: "Email sending failure"});
            } else {
              logger.debug("Email sending OK");
              res.json({error: false, msg: "Email sending success"});
            }
          });
        } else {
          res.json({err:err});
        } */
        res.json({error: false, msg: "Email sending success"});
      } else {
        res.json({err:err});
      }
    });  
  });


module.exports = router;
