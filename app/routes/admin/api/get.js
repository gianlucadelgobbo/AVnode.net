const router = require('../../router')();
let config = require('getconfig');

const mongoose = require('mongoose');
const Models = {
  'Category': mongoose.model('Category'),
  'User': mongoose.model('User'),
  'Performance': mongoose.model('Performance'),
  'Event': mongoose.model('Event'),
  'Footage': mongoose.model('Footage'),
  'Gallery': mongoose.model('Gallery'),
  'News': mongoose.model('News'),
  'Playlist': mongoose.model('Playlist'),
  'Video': mongoose.model('Video'),
  'VenueDB': mongoose.model('VenueDB'),
  'AddressDB': mongoose.model('AddressDB')
}
const logger = require('../../../utilities/logger');

router.getList = (req, res) => {
  if (config.cpanel[req.params.sez] && req.params.id) {
    const id = req.params.id;
    const select = req.query.pure ? config.cpanel[req.params.sez].list.select : Object.assign(config.cpanel[req.params.sez].list.select, config.cpanel[req.params.sez].list.selectaddon);
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
        res.json(send);
      }
    });
  } else {
    res.status(404).json({ error: `API_NOT_FOUND` });
  }
}

router.getData = (req, res) => {
  console.log(req.params);
  for (let item in config.cpanel) {
    console.log("http://localhost:8006/admin/api/"+item+"?pure=1")
    for (let item2 in config.cpanel[item].forms) {
      //console.log("http://localhost:8006/admin/api/"+item+"/"+item2);
      console.log("http://localhost:8006/admin/api/"+item+"/:ID/"+item2+"?pure=1");
      //config.cpanel[item].forms[item2].populate = [];
      //config.cpanel[item].forms[item2].select = {};
      for (let item3 in config.cpanel[item].forms[item2].validators) {
        //config.cpanel[item].forms[item2].select[item3] = 1;
        console.log(item+"/"+item2+"/"+item3);
  
      } 
    }
  }
  if (config.cpanel[req.params.sez] && config.cpanel[req.params.sez].forms[req.params.form]) {
    const id = req.params.id;
    const select = req.query.pure ? config.cpanel[req.params.sez].forms[req.params.form].select : Object.assign(config.cpanel[req.params.sez].forms[req.params.form].select, config.cpanel[req.params.sez].forms[req.params.form].selectaddon);
    const populate = req.query.pure ? [] : config.cpanel[req.params.sez].forms[req.params.form].populate;
    Models[config.cpanel[req.params.sez].model]
    .findById(id)
    .select(select)
    .populate(populate)
    .exec((err, data) => {
      if (err) {
        res.status(404).json({ error: `${JSON.stringify(err)}` });
      } else {
        if (!data) {
          res.status(204).json({ error: `DOC_NOT_FOUND` });
        } else {
          let send = {_id: data._id};
          for (const item in config.cpanel[req.params.sez].forms[req.params.form].select) send[item] = data[item];
          res.json(send);
        }
      }
    });
  } else {
    res.status(404).json({ error: `API_NOT_FOUND` });
  }
}
router.getSlug = (req, res) => {
  Models[config.cpanel[req.params.sez].model]
  .findOne({ slug : req.params.slug },'_id', (err, user) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    res.json({slug:req.params.slug,exist:user!==null?true:false});
  });
}

router.getCategoryByAncestor = (cat, cb) => {
  Models.Category.find({ancestor: cat._id})
  .select({name:1 , slug:1})
  .exec( (err, sons) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    cb(sons);
  });
}

router.getCategories = (req, res) => {
  let conta = 0;
  Models.Category.findOne({slug: req.params.q, rel: req.params.rel })
  .select({name:1 , slug:1})
  .exec( (err, category) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    if (category && category._id) {
      router.getCategoryByAncestor(category, (sons) => {
        if (err) logger.debug(`${JSON.stringify(err)}`);
        for (let a=0;a<sons.length;a++){
          router.getCategoryByAncestor(sons[a], (sons2) => {
            sons[a].sons = sons2;
            conta++;
            if (sons.length == conta) {
              category.sons = sons;
              res.json(category);
            }
          });
        }
    
      });  
    } else {
      res.json(category);
    }
  
  });
}

router.getMembers = (req, res) => {
  Models.User
  .find({$or:[
    { slug : { "$regex": req.params.q, "$options": "i" } },
    { stagename : { "$regex": req.params.q, "$options": "i" } },
    { name : { "$regex": req.params.q, "$options": "i" } },
    { surname : { "$regex": req.params.q, "$options": "i" } }
  ],is_crew: false},'_id, stagename', (err, users) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    res.json(users);
  });
}

router.getAuthors = (req, res) => {
  Models.User
  .find({$or:[
    { slug : { "$regex": req.params.q, "$options": "i" } },
    { stagename : { "$regex": req.params.q, "$options": "i" } },
    { name : { "$regex": req.params.q, "$options": "i" } },
    { surname : { "$regex": req.params.q, "$options": "i" } }
  ]},'_id, stagename', (err, users) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    res.json(users);
  });
}

router.removeAddress = (req, res) => {
  if (req.query.db === "users") {
    console.log(req.query);
    router.removeAddressUsers(req, res, () => {
      router.removeAddressDB(req, res, () => {
        res.json(req.query);
      });
    });
  }
  if (req.query.db === "venues") {
    console.log(req.query);
    router.removeVenueDB(req, res, (newaddr) => {
      console.log("newaddr");
      //console.log(newaddr);
      router.removeAddressEvents(req, res, newaddr, () => {
        console.log("stocazzo END");
        res.json(req.query);
      });
    });
  }
}

router.removeAddressUsers = (req, res, cb) => {
  console.log("removeAddressUsers");
  var conta = 0;
  //res.json(req.query);
  Models.User
  .find({"addresses.country": req.query.country, "addresses.locality": req.query.locality},'_id, addresses', (err, users) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    if (users.length) {
      console.log("stocazzo");
      for(var a=0;a<users.length;a++){
        for(var b=0;b<users[a].addresses.length;b++){
          if (users[a].addresses[b].country === req.query.country && users[a].addresses[b].locality === req.query.locality) {
            if (req.query.action === "REMOVE") {
              if (req.query.field === "locality") {
                users[a].addresses[b].locality = undefined;
              }
              if (req.query.field === "country") {
                console.log("stocazzzooooooooooo USERS");
                console.log(users[a]);
                users[a].addresses.splice(b, 1);
                console.log(users[a]);
              }
            }
            if (req.query.action === "CHANGE" && req.query.old && req.query.new) {
              users[a].addresses[b][req.query.field] = req.query.new;
            }
          }
        }
        console.log("stocazzzooooooooooo USERS");
        console.log(users[a]);
        Models.User.updateOne({_id: users[a]._id}, { $set: {addresses: users[a].addresses}}, function(err, res) {
          conta++;
          if (err) {
            console.log(err);
          } else {
            console.log(res);
          }
          if (conta === users.length) cb();
        });
      }
    } else {
      cb();
    }
  });
}

router.removeAddressDB = (req, res, cb) => {
  console.log("removeAddressDB");
  var collection;
  var rel;
  var q;
  if (req.query.db === "users") {
    collection = Models.AddressDB;
    q = {"country": req.query.country, "locality": req.query.locality};
  }
  if (req.query.db === "venues") {
    collection = Models.VenueDB;
    q = {"name": req.query.name, "country": req.query.country, "locality": req.query.locality};
  }
  collection
  .find(q, (err, addresses) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    if (addresses.length) {
      var b=0;
      if (req.query.action === "REMOVE") {
        if (req.query.field === "locality") {
          addresses[b].locality = undefined;
          console.log("stocazzzooooooooooo AddressDB");
          console.log(addresses[b]);
          collection.findByIdAndUpdate(addresses[b]._id, { $unset: {locality:1}}, { new: false }, function (err, res) {
            console.log(err);
            console.log(res);
            if (err && err.code == "11000") {
              collection.deleteOne(q, function (err) {
                if (err) console.log(err);
                cb();
                // deleted at most one tank document
              });
            } else {
              cb();
            }
          });
        }
        if (req.query.field === "country") {
          collection.deleteOne(q, function (err) {
            if (err) console.log(err);
            cb();
          });
        }
      }
      if (req.query.action === "CHANGE" && req.query.old && req.query.new) {
        var update = {};
        update[req.query.field] = req.query.new;
        collection.findByIdAndUpdate(addresses[b]._id, update, { new: false }, function (err, res) {
          console.log(err);
          console.log(res);
          if (err && err.code == "11000") {
            collection.deleteOne(q, function (err) {
              if (err) console.log(err);
              cb();
              // deleted at most one tank document
            });
          } else {
            cb();
          }
        });
      }
    } else {
      cb();
    }
  });
}

router.removeAddressEvents = (req, res, newaddr, cb) => {
  console.log("removeAddressEvents");
  var conta = 0;
  Models.Event
  .find({$or: [{"schedule.venue.name": req.query.name, "schedule.venue.location.country": req.query.country, "schedule.venue.location.locality": req.query.locality},{"program.schedule.venue.name": req.query.name}]},{schedule:1,title:1,program:1}, (err, events) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    if (events.length) {
      for(var a=0;a<events.length;a++){
        console.log(events[a].title);
        for(var b=0;b<events[a].schedule.length;b++){
          if (events[a].schedule[b].venue.name === req.query.name && events[a].schedule[b].venue.location.country === req.query.country && events[a].schedule[b].venue.location.locality === req.query.locality) {
            /* if (req.query.action === "REMOVE") {
              if (req.query.field === "locality") {
                events[a].schedule[b].venue.location.locality = undefined;
              }
              if (req.query.field === "country") {
                events[a].schedule.splice(b, 1);
              }
            } */
            if (req.query.action === "CHANGE" && req.query.old && req.query.new) {
              if (req.query.field === "name") {
                events[a].schedule[b].venue.name = req.query.new;
              } else {
                events[a].schedule[b].venue.location[req.query.field] = req.query.new;
              }
            }
          }
        }
        if (events[a].program && events[a].program.length) {
          for(var b=0;b<events[a].program.length;b++){
            if (events[a].program[b].schedule.venue && events[a].program[b].schedule.venue.name == req.query.name/*  && events[a].program[b].schedule.venue.location.country === req.query.country && events[a].program[b].schedule.venue.location.locality === req.query.locality */) {
              /* if (req.query.action === "REMOVE") {
                if (req.query.field === "locality") {
                  events[a].program[b].schedule.venue.location.locality = undefined;
                }
                if (req.query.field === "country") {
                  console.log("stocazzzooooooooooo events");
                  console.log(events[a]);
                  events[a].program.splice(b, 1);
                  console.log(events[a]);
                }
              } */
              if (req.query.action === "CHANGE" && req.query.old && req.query.new) {
                if (req.query.field === "name") {
                  events[a].program[b].schedule.venue.name = req.query.new;
                } else {
                  events[a].program[b].schedule.venue.location[req.query.field] = req.query.new;
                }
              }
            }
          }
        }
        var set = events[a].program ? {schedule: events[a].schedule,program: events[a].program} : {schedule: events[a].schedule};
        console.log(set);
        Models.Event.updateOne({_id: events[a]._id}, set, function(err, res) {
          conta++;
          if (err) {
            console.log(err);
          } else {
            console.log(res);
          }
          if (conta === events.length) cb();
        });
      }
    } else {
      cb();
    }
  });
}

router.removeVenueDB = (req, res, cb) => {
  console.log("removeVenueDB");
  var rel;
  var q;
  q = {"name": req.query.name, "country": req.query.country, "locality": req.query.locality};
  Models.VenueDB
  .find(q, (err, addresses) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    if (addresses.length) {
      var b=0;
      /* if (req.query.action === "REMOVE") {
        if (req.query.field === "locality") {
          addresses[b].locality = undefined;
          console.log("stocazzzooooooooooo AddressDB");
          console.log(addresses[b]);
          Models.VenueDB.findByIdAndUpdate(addresses[b]._id, { $unset: {locality:1}}, { new: false }, function (err, res) {
            console.log(err);
            console.log(res);
            if (err && err.code == "11000") {
              Models.VenueDB.deleteOne(q, function (err) {
                if (err) console.log(err);
                cb();
                // deleted at most one tank document
              });
            } else {
              cb();
            }
          });
        }
        if (req.query.field === "country") {
          Models.VenueDB.deleteOne(q, function (err) {
            if (err) console.log(err);
            cb();
          });
        }
      } */
      if (req.query.action === "CHANGE" && req.query.old && req.query.new) {
        var update = {};
        update[req.query.field] = req.query.new;
        console.log(update);
        Models.VenueDB.findByIdAndUpdate(addresses[b]._id, update, { new: false }, function (err, res) {
          //console.log(err);
          //console.log(res);
          if (err && err.code == "11000") {
            Models.VenueDB.deleteOne(q, function (err) {
              if (err) console.log(err);
              cb(res);
              // deleted at most one tank document
            });
          } else {
            cb(res);
          }
        });
      }
    } else {
      console.log("stocazzostocazzostocazzostocazzostocazzo");
      cb();
    }
  });
}

router.addMember = (req, res) => {
  Models.User
  .findOne({_id: req.params.id, members:req.user.id},'_id, members', (err, crew) => {
    if (err) {
      logger.debug(`${JSON.stringify(err)}`);
      res.status(404).json({ error: err });
    } else if (!crew) {
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
      }, null);
    } else if (crew.members.indexOf(req.params.member)!==-1) {
      res.status(404).json({
        "message": "MEMBER_IS_ALREADY_MEMBER",
        "name": "MongoError",
        "stringValue":"\"MEMBER_IS_ALREADY_MEMBER\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"MEMBER_IS_ALREADY_MEMBER",
          "name":"MongoError",
          "stringValue":"\"MEMBER_IS_ALREADY_MEMBER\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      }, null);
    } else {
      crew.members.push(req.params.member);
      crew.save(function(err){
        //res.json(crew);
        req.params.sez = 'crews';
        req.params.form = 'members';
        router.getData(req, res);
      });
    }
  });
}

router.removeMember = (req, res) => {
  Models.User
  .findOne({_id: req.params.id, members:req.user.id},'_id, members', (err, crew) => {
    if (err) {
      logger.debug(`${JSON.stringify(err)}`);
      res.status(404).json({ error: err });
    } else if (!crew) {
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
      }, null);
    } else if (crew.members.indexOf(req.params.member)===-1) {
      res.status(404).json({
        "message": "MEMBER_IS_NOT_A_MEMBER",
        "name": "MongoError",
        "stringValue":"\"MEMBER_IS_NOT_A_MEMBER\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"MEMBER_IS_NOT_A_MEMBER",
          "name":"MongoError",
          "stringValue":"\"MEMBER_IS_NOT_A_MEMBER\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      }, null);
    } else {
      crew.members.splice(crew.members.indexOf(req.params.member), 1);
      //res.json(crew);
      crew.save(function(err){
        //res.json(crew);
        req.params.sez = 'crews';
        req.params.form = 'members';
        router.getData(req, res);
      });
    }
  });
}
router.getCountries = (req, res) => {
  const allCountries = require('node-countries-list');
  const R = require('ramda');
  // FIXME: Later evaluate language param to return
  // localized list depending on the user settings.
  const convert = R.compose(
    R.map(
      R.zipObj(['key', 'name'])
    ),
    R.toPairs
  );

  allCountries('en', (err, countries) => {
    if (err) {
      throw err;
    }
    res.json(convert(countries));
  });
}

router.sendEmailVericaition = (req, res) => {
  console.log("sendEmailVericaition");
  console.log(req.headers.host);
  const uid = require('uuid');
  //const request = require('request');
  const mongoose = require('mongoose');
  const User = mongoose.model('User');
  User.findOne({"emails.email": req.params.email}, "emails", (err, user) => {
    console.log(user._id.toString());
    console.log(req.params.id);
    if (err) { 
      console.log("MAIL SEARCH ERROR");
      res.json({error: true, msg: "MAIL SEARCH ERROR"});
    } else if (!user) {
      console.log("USER NOT FOUND");     
      res.json({error: true, msg: "USER NOT FOUND"});
    } else if (req.params.id !== user._id.toString()) {
      console.log("EMAIL IS NOT YOUR");     
      res.json({error: true, msg: "EMAIL IS NOT YOUR"});
    } else {
      console.log("Email OK");
      let nothingToDo = true;
      for(let item=0;item<user.emails.length;item++) {
        if (user.emails[item].email === req.params.email && !user.emails[item].is_confirmed) {
          nothingToDo = false;
          const mailer = require('../../../utilities/mailer');
          user.emails[item].confirm = uid.v4();
          console.log(user.emails[item]);
          console.log(user);
          user.save((err) => {
            if (err) {
              console.log("Save failure");
              console.log(err);
              res.json({error: true, msg: "Save failure"});
            } else {
              console.log("Save success");
              console.log("mySendMailer");
              mailer.mySendMailer({
                template: 'confirm-email',
                message: {
                  to: user.emails[item].email
                },
                email_content: {
                  site:    req.protocol+"://"+req.headers.host,
                  title:    __("Email Confirm"),
                  subject:  __("Email Confirm")+' | AVnode.net',
                  block_1:  __("We’ve received a request to add this new email")+": "+user.emails[item].email,
                  button:   __("Click here to confirm"),
                  block_2:  __("If you didn’t make the request, just ignore this message. Otherwise, you add the email using this link:"),
                  block_3:  __("Thanks."),
                  link:     req.protocol+"://"+req.headers.host+'/verify/email/'+user.emails[item].confirm,
                  signature: "The AVnode.net Team"
                }
              }, function (err){
                if (err) {
                  console.log("Email sending failure");
                  res.json({error: true, msg: "Email sending failure"});
                } else {
                  console.log("Email sending OK");
                  res.json({error: false, msg: "Email sending success"});
                }
              });
            }
          });
        }
      }
      if(nothingToDo) {
        console.log("Nothing to do");
        res.json({error: true, msg: "Nothing to do"});          
      }
    }
  });
}
/* 
          let mailinglists = [];

          for (mailinglist in user.emails[item].mailinglists) if (user.emails[item].mailinglists[mailinglist]) mailinglists.push(mailinglist);

          let formData = {
            list: 'AXRGq2Ftn2Fiab3skb5E892g',
            email: user.emails[item].email,
            Topics: mailinglists.join(','),
            avnode_id: user._id.toString(),
            flxer_id: user.old_id ? user.old_id : "avnode",
          };
          if (user.name) formData.Name = user.name;
          if (user.surname) formData.Surname = user.surname;
          if (user.stagename) formData.Stagename = user.stagename;
          if (user.addresses && user.addresses[0] && user.addresses[0].locality) formData.Location = user.addresses[0].locality;
          if (user.addresses && user.addresses[0] && user.addresses[0].country) formData.Country = user.addresses[0].country;
          if (user.addresses && user.addresses[0] && user.addresses[0].geometry && user.addresses[0].geometry.lat) formData.LATITUDE = user.addresses[0].geometry.lat;
          if (user.addresses && user.addresses[0] && user.addresses[0].geometry && user.addresses[0].geometry.lng) formData.LONGITUDE = user.addresses[0].geometry.lng;

          request.post({
            url: 'https://ml.avnode.net/subscribe',
            formData:formData,
            function (error, response, body) {
              console.log("Newsletter");
              console.log(error);
              console.log(body);
            }
          });
          //console.log(mailinglists.join(','));
 */

/**/

/*

const profilePublic = require('./api/profilePublic');
const profileImages = require('./api/profileImages');
const profileEmails = require('./api/profileEmails');
const profilePrivate = require('./api/profilePrivate');
const profilePassword = require('./api/profilePassword');


router.get('/countries', (req, res) => {
  // FIXME: Later evaluate language param to return
  // localized list depending on the user settings.
  const convert = R.compose(
    R.map(
      R.zipObj(['key', 'name'])
    ),
    R.toPairs
  );

  allCountries('en', (err, countries) => {
    if (err) {
      throw err;
    }
    res.json(convert(countries));
  });
});
*/
module.exports = router;
