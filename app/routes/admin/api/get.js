const router = require('../../router')();
let config = require('getconfig');
let helpers = require('./helpers');

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
    const select = req.query.pure ? config.cpanel[req.params.sez].list.select : Object.assign(config.cpanel[req.params.sez].list.select, config.cpanel[req.params.sez].list.selectaddon);
    const populate = req.query.pure ? [] : config.cpanel[req.params.sez].list.populate;
    const ids = [req.params.id].concat(req.user.crews);
    const query = req.params.sez == "crews" ? {members: req.params.id} : {users:{$in: ids}};

    Models[config.cpanel[req.params.sez].list.model]
    .find(query)
    .select(select)
    .populate(populate)
    .sort({createdAt:-1})
    .exec((err, data) => {
      if (err) {
        res.status(500).json({ error: `${JSON.stringify(err)}` });
      } else {
        let send = JSON.parse(JSON.stringify(req.user));
        send[req.params.sez] = data;
        //for (const item in config.cpanel[req.params.sez].list.select) send[item] = data[item];
        res.json(send);
      }
    });
  } else {
    res.status(404).json({ error: `API_NOT_FOUND` });
  }
}

router.getData = (req, res) => {
  //console.log(req.params);
  for (let item in config.cpanel) {
    //console.log("http://localhost:8006/admin/api/"+item+"?pure=1")
    for (let item2 in config.cpanel[item].forms) {
      //console.log("http://localhost:8006/admin/api/"+item+"/"+item2);
      //console.log("http://localhost:8006/admin/api/"+item+"/:ID/"+item2+"?pure=1");
      //config.cpanel[item].forms[item2].populate = [];
      //config.cpanel[item].forms[item2].select = {};
      for (let item3 in config.cpanel[item].forms[item2].validators) {
        //config.cpanel[item].forms[item2].select[item3] = 1;
        //console.log(item+"/"+item2+"/"+item3);
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
router.getOwnresIds = (req, res,cb) => {
  Models.User
  .findById(req.params.id)
  .select({crews:1})
  .exec((err, data) => {
    if (data._id) data.crews.push(data._id);
    cb(data.crews);
  });
}
router.getSlug = (req, res) => {
  Models[config.cpanel[req.params.sez].model]
  .findOne({ slug : req.params.slug },'_id', (err, user) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    res.json({slug:req.params.slug,exist:user!==null?true:false});
  });
}

router.getEmail = (req, res) => {
  Models["User"]
  .findOne({ $or : [{ "email" : req.params.email },{ "emails.email" : req.params.email }] },'_id', (err, user) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    res.json({email:req.params.email,exist:user!==null?true:false});
  });
}

router.getCategoryByAncestor = (cat, cb) => {
  Models.Category.find({ancestor: cat._id})
  .select({name:1 , slug:1})
  .exec( (err, childrens) => {
    if (err) logger.debug(`${JSON.stringify(err)}`);
    cb(childrens);
  });
}

router.getCategories = (req, res) => {
  if (req.params.rel == "performances" && req.params.q == "type") {
    router.getPerfCategories(req, res);
  } else {
    let conta = 0;
    Models.Category.findOne({slug: req.params.q, rel: req.params.rel })
    .select({name:1 , slug:1})
    .exec( (err, category) => {
      if (err) logger.debug(`${JSON.stringify(err)}`);
      if (category && category._id) {
        router.getCategoryByAncestor(category, (childrens) => {
          if (err) logger.debug(`${JSON.stringify(err)}`);
          for (let a=0;a<childrens.length;a++){
            router.getCategoryByAncestor(childrens[a], (childrens2) => {
              childrens[a].childrens = childrens2;
              conta++;
              if (childrens.length == conta) {
                category.childrens = childrens;
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
}

router.getPerfCategories = (req, res) => {
  Models.Category.find({ancestor: "5be8708afc3961000000021c", rel: req.params.rel })
  .select({name:1 , slug:1})
  .exec( (err, genre) => {
    let conta = 0;
    Models.Category.findOne({slug: req.params.q, rel: req.params.rel })
    .select({name:1 , slug:1})
    .exec( (err, category) => {
      if (err) logger.debug(`${JSON.stringify(err)}`);
      if (category && category._id) {
        router.getCategoryByAncestor(category, (childrens) => {
          logger.debug(childrens);
          if (err) logger.debug(`${JSON.stringify(err)}`);
          for (let a=0;a<childrens.length;a++){
            router.getCategoryByAncestor(childrens[a], (childrens2) => {
              for (let b=0;b<childrens2.length;b++) childrens2[b].childrens = genre;
              childrens[a].childrens = childrens2;
              conta++;
              if (childrens.length == conta) {
                category.childrens = childrens;
                let send = {
                  title: category.name,
                  value: category.slug,
                  key: category._id,
                  children:[]
                };
                for(let a=0; a<category.childrens.length;a++){
                  let child = {
                    title: category.childrens[a].name,
                    value: category.childrens[a].slug,
                    key: category.childrens[a]._id,
                    children:[]
                  };
                  for(let b=0; b<category.childrens[a].childrens.length;b++){
                    let childchild = {
                      title: category.childrens[a].childrens[b].name,
                      value: category.childrens[a].childrens[b].slug,
                      key: category.childrens[a].childrens[b]._id,
                      children:[]
                    };
                    for(let c=0; c<category.childrens[a].childrens[b].childrens.length;c++){
                      let childchildchild = {
                        title: category.childrens[a].childrens[b].childrens[c].name,
                        value: category.childrens[a].childrens[b].childrens[c].slug,
                        key: category.childrens[a].childrens[b].childrens[c]._id,
                        children:[]
                      };
                      childchild.children.push(childchildchild);
                    }
                    child.children.push(childchild);
                  }
                  send.children.push(child);
                }
                res.json(send);
              }
            });
          }
      
        });  
      } else {
        res.json(category);
      }    
    });
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
  var query = {_id: req.params.id};
  if (config.superusers.indexOf(req.user._id.toString())===-1) query.users = req.user._id;
  Models["User"]
  .findOne(query)
  .select({_id:1, stats:1, stagename:1, members:1})
  .populate({ "path": "members", "select": "addresses", "model": "User"})
  .exec((err, crew) => {
    console.log(crew.members.map((item)=>{return item._id}));
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
      });
    } else if (crew.members.map((item)=>{return item._id.toString()}).indexOf(req.params.member)!==-1) {
      res.status(404).json({
        "message": "USER_IS_ALREADY_IN",
        "name": "MongoError",
        "stringValue":"\"USER_IS_ALREADY_IN\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"USER_IS_ALREADY_IN",
          "name":"MongoError",
          "stringValue":"\"USER_IS_ALREADY_IN\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else {
      crew.members.push(req.params.member);
      console.log("crew.members");
      console.log(crew.members);
      console.log(crew.members.length);
      crew.stats.members = crew.members.length;
      console.log(crew);
      crew.save(function(err){
        var query = {_id: req.params.member};
        Models["User"]
        .findOne(query)
        .select({_id:1, stats:1, crews:1})
        //.populate({ "path": "members", "select": "addresses", "model": "User"})
        .exec((err, member) => {
          if (err) {
            logger.debug(`${JSON.stringify(err)}`);
            res.status(404).json({ error: err });
          } else {
            member.crews.push(req.params.id);
            console.log("member.crews");
            console.log(member.crews);
            console.log(member.crews.length);
            member.stats.crews = member.crews.length;
            member.save(function(err){
              if (err) {
                logger.debug(`${JSON.stringify(err)}`);
                res.status(404).json({ error: err });
              } else {
                req.params.sez = 'crews';
                req.params.form = 'members';
                router.getData(req, res);
              }
            });              
          }
        });
      });
    }
  });
}

router.removeMember = (req, res) => {
  var query = {_id: req.params.id};
  if (config.superusers.indexOf(req.user._id.toString())===-1) query.users = req.user._id;
  console.log(query);
  Models["User"]
  .findOne(query)
  .select({_id:1, stagename:1, stats:1, members:1})
  .populate({ "path": "members", "select": "addresses", "model": "User"})
  .exec((err, crew) => {
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
      });
    } else if (crew.members.map((item)=>{return item._id.toString()}).indexOf(req.params.member)===-1) {
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
      });
    } else if (crew.members.length===1) {
      res.status(404).json({
        "message": "LEAST_ONE_MEMBER_IS_REQUIRED",
        "name": "MongoError",
        "stringValue":"\"LEAST_ONE_MEMBER_IS_REQUIRED\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"LEAST_ONE_MEMBER_IS_REQUIRED",
          "name":"MongoError",
          "stringValue":"\"LEAST_ONE_MEMBER_IS_REQUIRED\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else {
      crew.members.splice(crew.members.map((item)=>{return item._id.toString()}).indexOf(req.params.member), 1);
      console.log("crew.members");
      console.log(crew.members);
      console.log(crew.members.length);
      crew.stats.members = crew.members.length;

      crew.save(function(err){
        if (err) {
          logger.debug(`${JSON.stringify(err)}`);
          res.status(404).json({ error: err });
        } else {
          var query = {_id: req.params.member};
          Models["User"]
          .findOne(query)
          .select({_id:1, stats:1, crews:1})
          //.populate({ "path": "members", "select": "addresses", "model": "User"})
          .exec((err, member) => {
            member.crews.splice(member.crews.indexOf(req.params.id), 1);
            console.log("member.crews");
            console.log(member.crews);
            console.log(member.crews.length);
            member.stats.crews = member.crews.length;
            member.save(function(err){
              if (err) {
                logger.debug(`${JSON.stringify(err)}`);
                res.status(404).json({ error: err });
              } else {
                req.params.sez = 'crews';
                req.params.form = 'members';
                router.getData(req, res);
              }
            });
          });
        }
      });
    }
  });
}

router.addUser = (req, res) => {
  var query = {_id: req.params.id};
  if (config.superusers.indexOf(req.user._id.toString())===-1) query.users = {$in: [req.user._id].concat(req.user.crews)};

  Models[config.cpanel[req.params.sez].model]
  .findOne(query)
  .select({_id:1, stagename:1, stats:1, users:1})
  //.populate({ "path": "users", "select": "stagename", "model": "User"})
  .exec((err, item) => {
    if (err) {
      logger.debug(`${JSON.stringify(err)}`);
      res.status(404).json({ error: err });
    } else if (!item) {
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
    } else if (item.users.indexOf(req.params.user)!==-1) {
      res.status(404).json({
        "message": "USER_IS_ALREADY_IN",
        "name": "MongoError",
        "stringValue":"\"USER_IS_ALREADY_IN\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"USER_IS_ALREADY_IN",
          "name":"MongoError",
          "stringValue":"\"USER_IS_ALREADY_IN\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else {
      item.users.push(req.params.user);
      item.save(function(err){
        if (err) {
          logger.debug(`${JSON.stringify(err)}`);
          res.status(404).json({ error: err });
        } else {
          var query = {_id: req.params.user};
          var select = {_id:1, stats:1, crews:1}
          select[req.params.sez] = 1;
          Models["User"]
          .findOne(query)
          .select(select)
          //.populate({ "path": "members", "select": "addresses", "model": "User"})
          .exec((err, user) => {
            user[req.params.sez].push(req.params.id);
            user.save(function(err){
              if (err) {
                logger.debug(`${JSON.stringify(err)}`);
                res.status(404).json({ error: err });
              } else {
                Promise.all(
                  [helpers.setStatsAndActivity(query)]
                ).then( (results) => {
                  //res.json(item);
                  req.params.form = 'public';
                  router.getData(req, res);
                });
              
              }
            });
          });
        }
      });
    }
  });
}

router.removeUser = (req, res) => {
  var query = {_id: req.params.id};
  if (config.superusers.indexOf(req.user._id.toString())===-1) query.users = {$in: [req.user._id].concat(req.user.crews)};

  Models[config.cpanel[req.params.sez].model]
  .findOne(query)
  .select({_id:1, stagename:1, stats:1, users:1,})
  //.populate({ "path": "users", "select": "stagename", "model": "User"})
  .exec((err, item) => {
    if (err) {
      logger.debug(`${JSON.stringify(err)}`);
      res.status(404).json({ error: err });
    } else if (!item) {
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
    } else if (item.users.indexOf(req.params.user)===-1) {
      res.status(404).json({
        "message": "USER_IS_NOT_IN",
        "name": "MongoError",
        "stringValue":"\"USER_IS_NOT_IN\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"USER_IS_NOT_IN",
          "name":"MongoError",
          "stringValue":"\"USER_IS_NOT_IN\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else if (item.users.length===1) {
      res.status(404).json({
        "message": "LEAST_ONE_AUTHOR_IS_REQUIRED",
        "name": "MongoError",
        "stringValue":"\"LEAST_ONE_AUTHOR_IS_REQUIRED\"",
        "kind":"Date",
        "value":null,
        "path":"id",
        "reason":{
          "message":"LEAST_ONE_AUTHOR_IS_REQUIRED",
          "name":"MongoError",
          "stringValue":"\"LEAST_ONE_AUTHOR_IS_REQUIRED\"",
          "kind":"string",
          "value":null,
          "path":"id"
        }
      });
    } else {
      item.users.splice(item.users.indexOf(req.params.user), 1);
      //res.json(item);
      item.save(function(err){
        if (err) {
          logger.debug(`${JSON.stringify(err)}`);
          res.status(404).json({ error: err });
        } else {
          var query = {_id: req.params.user};
          var select = {_id:1, stats:1, crews:1}
          select[req.params.sez] = 1;
          Models["User"]
          .findOne(query)
          .select(select)
          //.populate({ "path": "members", "select": "addresses", "model": "User"})
          .exec((err, user) => {
            user[req.params.sez].splice(user[req.params.sez].indexOf(req.params.id), 1);
            user.save(function(err){
              if (err) {
                logger.debug(`${JSON.stringify(err)}`);
                res.status(404).json({ error: err });
              } else {
                Promise.all(
                  [helpers.setStatsAndActivity(query)]
                ).then( (results) => {
                  req.params.form = 'public';
                  router.getData(req, res);
                });
              }
            });
          });
        }
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
                  site:    (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/+"://"+req.headers.host,
                  title:    __("Email Confirm"),
                  subject:  __("Email Confirm")+' | AVnode.net',
                  block_1:  __("We’ve received a request to add this new email")+": "+user.emails[item].email,
                  button:   __("Click here to confirm"),
                  block_2:  __("If you didn’t make the request, just ignore this message. Otherwise, you add the email using this link:"),
                  block_3:  __("Thanks."),
                  link:     (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/+"://"+req.headers.host+'/verify/email/'+user.emails[item].confirm,
                  html_sign: "The AVnode.net Team",
                  text_sign:  "The AVnode.net Team"
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
