//const config = require('getconfig');
const router = require('../router')();
//const dataprovider = require('../../utilities/dataprovider');
const fs = require("fs");

const imageUtil = require("../../utilities/image");

const Footage = require('mongoose').model('Footage');
const Video = require('mongoose').model('Video');

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
  console.log('/setencodingstatus/:sez/:id/:encoding');
  console.log(req.params.encoding);
  Model = req.params.sez && req.params.sez == "videos" ? Video : Footage;
  if (req.params.encoding == 1) {
    Model
    .findOne({_id:req.params.id})
    .exec((err, data) => {
      if (err) {
        res.status(500).json({ error: `${JSON.stringify(err)}` });
      } else {
        console.log(data.media.original);
        const ext = data.media.original.substring(data.media.original.lastIndexOf(".")+1);
        data.media.file = data.media.original.substring(0, data.media.original.lastIndexOf(".")).replace("_originals/", "/").replace("/glacier/", "/warehouse/")+"_"+ext+".mp4";
        data.media.preview = data.media.original.substring(0, data.media.original.lastIndexOf(".")).replace("_originals/", "_previews/")+"_"+ext+".png";
        data.is_public = 1;
        data.media.encoded = req.params.encoding;
        console.log(global.appRoot+data.media.preview);
        if (fs.existsSync(global.appRoot+data.media.file)) {
          data.media.filesize = fs.statSync(global.appRoot+data.media.file).size;
          const options = config.cpanel[req.params.sez].forms.public.components.media.config;

          imageUtil.resizer([{path:global.appRoot+data.media.preview}], options, (resizeerr, info) => {
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

module.exports = router;
