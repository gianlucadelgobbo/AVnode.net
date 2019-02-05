const router = require('../../router')();
let config = require('getconfig');

const mongoose = require('mongoose');
const Models = {
  'User': mongoose.model('User'),
  'Performance': mongoose.model('Performance'),
  'Event': mongoose.model('Event'),
  'Footage': mongoose.model('Footage'),
  'Gallery': mongoose.model('Gallery'),
  'News': mongoose.model('News'),
  'Playlist': mongoose.model('Playlist'),
  'Video': mongoose.model('Video')
}
const logger = require('../../../utilities/logger');

router.postData = (req, res) => {
  logger.debug('postData');
  logger.debug(req.body);
  logger.debug('req.params.sez');
  logger.debug(req.params.sez);
  if (config.cpanel[req.params.sez] && config.cpanel[req.params.sez].forms.new) {
    let select = config.cpanel[req.params.sez].forms.new.select;
    let selectaddon = config.cpanel[req.params.sez].forms.new.selectaddon;
    let post = {};
    //for (const item in select) if(req.body[item]) post[item] = req.body[item];
    // db.users.updateOne({slug:'gianlucadelgobbo'},{$unset: {oldpassword:""}});
    logger.debug('select');
    logger.debug(select);
    for (const item in select) if(req.body[item]) {
      post[item] = req.body[item];
    }
    for (const item in selectaddon) {
      post[item] = selectaddon[item];
    }
    logger.debug('postpostpostpostpostpost');
    logger.debug(post);
    if (req.params.sez == "crews") {
      post.members = [req.user.id];
    } else {
      post.users = [req.user.id];
    }

    Models[config.cpanel[req.params.sez].model]
    .create(post, (err, data) => {
      if (!err) {
        logger.debug('create success');
        logger.debug(data);
        const id = req.user.id;
        Models['User']
        .findById(id, req.params.sez, (err, user) => {
          logger.debug('findById user');
          logger.debug(user);
          if (!err) {
            if (user) {
              user[req.params.sez].push(data._id);
              logger.debug('save user');
              logger.debug(user);
              user.save((err) => {
                if (err) {
                  logger.debug('save user err');
                  logger.debug(err);
                  res.status(400).json(err);
                } else {
                  logger.debug('save user success');
                  if (req.params.ancestor && req.params.id) {
                    Models[config.cpanel[req.params.ancestor].model]
                    .findById(req.params.id)
                    .exec((err, ancestor) => {
                      ancestor[req.params.sez].push(data._id);
                      ancestor.save((err) => {
                        if (err) {
                          logger.debug('save ancestor err');
                          logger.debug(err);
                          res.status(400).json(err);
                        } else {
                          logger.debug("data");
                          logger.debug(data);
                          logger.debug(data);
                          res.json(data);                    
                        }
                      });
                    });
                  } else {
                    res.json(data);                    
                  }
                  /* select = req.query.pure ? config.cpanel[req.params.sez].list.select : Object.assign(config.cpanel[req.params.sez].list.select, config.cpanel[req.params.sez].list.selectaddon);
                  const populate = req.query.pure ? [] : config.cpanel[req.params.sez].list.populate;
                    
                  Models[config.cpanel[req.params.sez].list.model]
                  .findById(id)
                  .select(select)
                  .populate(populate)
                  .exec((err, data) => {
                    if (err) {
                      res.status(500).json({ error: `${JSON.stringify(err)}` });
                    } else {
                      let send = {_id: data._id};
                      for (const item in config.cpanel[req.params.sez].list.select) send[item] = data[item];
                      logger.debug('sendsendsendsendsendsendsend');
                      logger.debug(send);
                      res.json(send);
                    }
                  }); */
                }
              });
            } else {
              res.status(204).json({ error: `DOC_NOT_FOUND` });
            }
          } else {
            res.status(500).json({ error: `${JSON.stringify(err)}` });
          }
        });
      } else {
        logger.debug('create err');
        logger.debug(err);
        res.status(400).json(err);
      }
    });
  } else {
    res.status(404).json({ error: `API_NOT_FOUND` });
  }
}

router.addGallery = (req, res) => {
  Models[req.params.model]
  .findOne({_id: req.params.id/* , members:req.user.id */},'_id, galleries', (err, result) => {
    if (err) {
      logger.debug(`${JSON.stringify(err)}`);
      res.status(404).json({ error: err });
    } else if (!result) {
      res.status(404).json({
        "message": "USER_NOT_ALLOWED_TO_EDIT",
        "name": "MongoError",
        "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"USER_NOT_ALLOWED_TO_EDIT",
          "name":"MongoError",
          "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else {
      Models.Gallery
      .create({slug:req.body.slug, slug:req.body.title}, (err, data) => {
        if (err) {
          logger.debug(`${JSON.stringify(err)}`);
          res.status(404).json({ error: err });
        } else {
          result.galleries.push(data._id);
          result.save(function(err){
            //res.json(result);
            res.json(data);
          });
        }
      });
    }
  });
}

router.addVideos = (req, res) => {
  Models[req.params.model]
  .findOne({_id: req.params.id/* , members:req.user.id */},'_id, videos', (err, result) => {
    if (err) {
      logger.debug(`${JSON.stringify(err)}`);
      res.status(404).json({ error: err });
    } else if (!result) {
      res.status(404).json({
        "message": "USER_NOT_ALLOWED_TO_EDIT",
        "name": "MongoError",
        "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"USER_NOT_ALLOWED_TO_EDIT",
          "name":"MongoError",
          "stringValue":"\"USER_NOT_ALLOWED_TO_EDIT\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else {
      Models.Video
      .create({slug:req.body.slug, slug:req.body.title}, (err, data) => {
        if (err) {
          logger.debug(`${JSON.stringify(err)}`);
          res.status(404).json({ error: err });
        } else {
          result.videos.push(data._id);
          result.save(function(err){
            //res.json(result);
            res.json(data);
          });
        }
      });
    }
  });
}

router.updateSendy = function (req, res) {
  let err = [];
  /*let conta = 0;
  let emailwithmailinglists = user.emails.filter(item => item.mailinglists);
  for (let item=0 ; item<emailwithmailinglists.length;item++) {*/
    let mailinglists = [];
    for (mailinglist in req.body.mailinglists) if (req.body.mailinglists[mailinglist]) mailinglists.push(mailinglist);
    let formData = {
      list: 'AXRGq2Ftn2Fiab3skb5E892g',
      email: req.body.email,
      Topics: mailinglists.join(','),
      avnode_id: req.user._id.toString(),
      avnode_slug: e.slug,
      avnode_email: e.email,
      boolean: true
    };
    if (req.user.old_id) formData.flxer_id = req.user.old_id;
    if (req.user.name) formData.Name = req.user.name;
    if (req.user.surname) formData.Surname = req.user.surname;
    if (req.user.stagename) formData.Stagename = req.user.stagename;
    if (req.user.addresses && req.user.addresses[0] && req.user.addresses[0].locality) formData.Location = req.req.user.addresses[0].locality;
    if (req.user.addresses && req.user.addresses[0] && req.user.addresses[0].country) formData.Country = req.req.user.addresses[0].country;
    if (req.user.addresses && req.user.addresses[0] && req.user.addresses[0].geometry && req.user.addresses[0].geometry.lat) formData.LATITUDE = req.user.addresses[0].geometry.lat;
    if (req.user.addresses && req.user.addresses[0] && req.user.addresses[0].geometry && req.user.addresses[0].geometry.lng) formData.LONGITUDE = req.user.addresses[0].geometry.lng;
    logger.debug("formData");
    logger.debug(formData);
  
    var https = require('https');
    var querystring = require('querystring');
    
    // form data
    var postData = querystring.stringify(formData);
    
    // request option
    var options = {
      host: 'ml.avnode.net',
      port: 443,
      method: 'POST',
      path: '/subscribe',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    };
    
    // request object
    var req = https.request(options, function (res) {
      var result = '';
      res.on('data', function (chunk) {
        result += chunk;
      });
      res.on('end', function () {
        res.json(error);
      });
      res.on('error', function (err) {
        res.json(err);
      })
    });
    
    // req error
    req.on('error', function (err) {
      logger.debug(err);
    });
    
    //send request witht the postData form
    req.write(postData);
    req.end();

    request.post({
      url: 'https://ml.avnode.net/subscribe',
      form: formData,
      function (error, response, body) {
        logger.debug("Newsletter");
        logger.debug(error);
        logger.debug(body);
        res.json(error);
      }
    });
    //logger.debug(mailinglists.join(','));  }
  //}
}



module.exports = router;
