import createRouter from "../../router.js";
const router = createRouter();

import mongoose from 'mongoose';
const AddressDB = mongoose.model('AddressDB');
const VenueDB = mongoose.model('VenueDB');
const User = mongoose.model('User');
const Event = mongoose.model('Event');

import axios from 'axios';

import { logger, requestLogger, errorLogger } from '../../../utilities/logger.js';


/* router.get('/showall', (req, res) => {
  logger.info('/adminpro/supertools/addresses/showall');
  showall(req, res, false, cb = (data) => {
    res.render('adminpro/supertools/addresses/showall', {
      title: 'adminpro/supertools/addresses/showall',
      currentUrl: '/adminpro/supertools/addresses'+req.path,
      data: data
    });
  });
}); */

/* router.get('/removeAddress', router.removeAddress);

router.removeAddress = (req, res) => {
  if (req.query.db === "users") {
    logger.info(req.query);
    router.removeAddressUsers(req, res, () => {
      router.removeAddressDB(req, res, () => {
        res.json(req.query);
      });
    });
  }
  if (req.query.db === "venues") {
    logger.info(req.query);
    router.removeVenueDB(req, res, (newaddr) => {
      //logger.info(newaddr);
      router.removeAddressEvents(req, res, newaddr, () => {
        res.json(req.query);
      });
    });
  }
}

router.removeAddressUsers = (req, res, cb) => {
  logger.info("removeAddressUsers");
  var conta = 0;
  //res.json(req.query);
  Models.User
  .find({"addresses.country": req.query.country, "addresses.locality": req.query.locality},'_id, addresses', (err, users) => {
    if (err) logger.info(`${JSON.stringify(err)}`);
    if (users.length) {
      for(var a=0;a<users.length;a++){
        for(var b=0;b<users[a].addresses.length;b++){
          if (users[a].addresses[b].country === req.query.country && users[a].addresses[b].locality === req.query.locality) {
            if (req.query.action === "REMOVE") {
              if (req.query.field === "locality") {
                users[a].addresses[b].locality = undefined;
              }
              if (req.query.field === "country") {
                logger.info("stocazzzooooooooooo USERS");
                logger.info(users[a]);
                users[a].addresses.splice(b, 1);
                logger.info(users[a]);
              }
            }
            if (req.query.action === "CHANGE" && req.query.old && req.query.new) {
              users[a].addresses[b][req.query.field] = req.query.new;
            }
          }
        }
        logger.info("stocazzzooooooooooo USERS");
        logger.info(users[a]);
        Models.User.updateOne({_id: users[a]._id}, { $set: {addresses: users[a].addresses}}, function(err, res) {
          conta++;
          if (err) {
            logger.info(err);
          } else {
            logger.info(res);
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
  logger.info("removeAddressDB");
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
    if (err) logger.info(`${JSON.stringify(err)}`);
    if (addresses.length) {
      var b=0;
      if (req.query.action === "REMOVE") {
        if (req.query.field === "locality") {
          addresses[b].locality = undefined;
          logger.info("stocazzzooooooooooo AddressDB");
          logger.info(addresses[b]);
          collection.findByIdAndUpdate(addresses[b]._id, { $unset: {locality:1}}, { new: false }, function (err, res) {
            logger.info(err);
            logger.info(res);
            if (err && err.code == "11000") {
              collection.deleteOne(q, function (err) {
                if (err) logger.info(err);
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
            if (err) logger.info(err);
            cb();
          });
        }
      }
      if (req.query.action === "CHANGE" && req.query.old && req.query.new) {
        var update = {};
        update[req.query.field] = req.query.new;
        collection.findByIdAndUpdate(addresses[b]._id, update, { new: false }, function (err, res) {
          logger.info(err);
          logger.info(res);
          if (err && err.code == "11000") {
            collection.deleteOne(q, function (err) {
              if (err) logger.info(err);
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
} */
router.get('/usersdbcheck', (req, res) => {
  logger.info('/adminpro/supertools/addresses/usersdbcheck');
  usersdbcheck(req, res, cb = (data) => {
    res.render('adminpro/supertools/addresses/usersdbcheck', {
      title: 'adminpro/supertools/addresses/usersdbcheck',
      
      currentUrl: '/adminpro/supertools/addresses'+req.path,
      data: data
    });
  });
});

router.get('/updatedb', (req, res) => {
  logger.info('/adminpro/supertools/addresses/updatedb');
  showall(req, res, true, cb = (data) => {
    res.render('adminpro/supertools', {
      title: 'adminpro/supertools/addresses/updatedb',
      
      currentUrl: '/adminpro/supertools/addresses'+req.path,
      data: data
    });
  });
});
router.get('/getgeometry', (req, res) => {
  logger.info('/addresses/getgeometry');
  getgeometry(req, res, cb = (data) => {
    logger.info('getgeometry');
    const script = !data.length || data[0].error_message  || data[0].status == 'OVER_QUERY_LIMIT' ? false : '<script>var timeout = setTimeout("location.reload(true);",10000);</script>';
    logger.info(script);
    res.render('adminpro/supertools', {
      title: 'adminpro/supertools/addresses/getgeometry',
      
      currentUrl: '/adminpro/supertools/addresses'+req.path,
      data: data,
      script: script
    });
  });
});

router.get('/setgeometry', (req, res) => {
  logger.info(req.query.skip);
  var skip = req.query.skip ? parseFloat(req.query.skip)+1 : 0;
  logger.info(skip);
  setgeometry(req, res, skip, cb = (data) => {
    res.render('adminpro/supertools', {
      title: 'adminpro/supertools/addresses/setgeometry',
      
      currentUrl: '/adminpro/supertools/addresses'+req.path,
      data: data,
      script: data.length ? '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/addresses/setgeometry?skip=' + (skip) + '"},1000);</script>' : ""
    });
  });
});

// VENUES

router.get('/venuesdbcheck', (req, res) => {
  logger.info('/adminpro/supertools/addresses/venuesdbcheck');
  venuesdbcheck(req, res, cb = (data) => {
    logger.info(data);
    res.render('adminpro/supertools/addresses/venuesdbcheck', {
      title: 'adminpro/supertools/addresses/venuesdbcheck',
      
      currentUrl: '/adminpro/supertools/addresses'+req.path,
      data: data
    });
  });
});

router.get('/venuesdbimport', (req, res) => {
  logger.info('/adminpro/supertools/addresses/venuesdbimport');
  venuesdbimport(req, res, cb = (data) => {
    //logger.info(data);
    res.render('adminpro/supertools/addresses/venuesdbcheck', {
      title: 'adminpro/supertools/addresses/venuesdbimport',
      
      currentUrl: '/adminpro/supertools/addresses'+req.path,
      data: data
    });
  });
});

router.get('/venuesgetgeometry', (req, res) => {
  logger.info('/addresses/venuesgetgeometry');
  venuesgetgeometry(req, res, cb = (data) => {
    logger.info('venuesgetgeometry');
    const script = !data.length || data[0].error_message  || data[0].status == 'OVER_QUERY_LIMIT' ? false : '<script>var timeout = setTimeout("location.reload(true);",10000);</script>';
    logger.info(script);
    res.render('adminpro/supertools', {
      title: 'adminpro/supertools/addresses/venuesgetgeometry',
      
      currentUrl: '/adminpro/supertools/addresses'+req.path,
      data: data,
      script: script
    });
  });
});

router.get('/venuessetgeometry', (req, res) => {
  logger.info(req.query.skip);
  var skip = req.query.skip ? parseFloat(req.query.skip)+1 : 0;
  logger.info(skip);
  venuessetgeometry(req, res, skip, cb = (data) => {
    res.render('adminpro/supertools', {
      title: 'adminpro/supertools/addresses/venuessetgeometry',
      
      currentUrl: '/adminpro/supertools/addresses'+req.path,
      data: data,
      script: data.length ? '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/addresses/venuessetgeometry?skip=' + (skip) + '"},1000);</script>' : ""
    });
  });
});

const setgeometry = (req, res, s, cb) => {
  logger.info(s);
  AddressDB.find({status: "OK"}).
  skip(s).
  limit(100).
  sort({"country": 1, "locality": 1}).
  exec((err, addressesA) => {
    logger.info(addressesA);
    if (addressesA.length) {
      let conta = 0;
      addressesA.forEach((element, index) => {
        var find = addressesA[index].locality ? {"addresses.country": addressesA[index].country, "addresses.locality": addressesA[index].locality} : {"addresses.country": addressesA[index].country, "addresses.locality": {$exists: false}}
        User.find(find).
        //select({stagename: 1, old_id: 1, addresses: 1}).
        limit(1).
        exec((err, data) => {
          if (data.length) {
            data.forEach ((user, indexsave) => {
              data[indexsave].addresses.forEach ((useraddress, indexaddress) => {
                logger.info('addresssave pre');
                logger.info(data[indexsave].addresses);
                if (addressesA[index].locality && data[indexsave].addresses[indexaddress].country == addressesA[index].country && addressesA[index].locality == data[indexsave].addresses[indexaddress].locality) {
                  data[indexsave].addresses[indexaddress].country = addressesA[index].country;
                  data[indexsave].addresses[indexaddress].locality = addressesA[index].locality;
                  data[indexsave].addresses[indexaddress].geometry = addressesA[index].geometry;
                  data[indexsave].addresses[indexaddress].formatted_address = addressesA[index].formatted_address;
                }
                if (!addressesA[index].locality && !data[indexsave].addresses[indexaddress].locality && data[indexsave].addresses[indexaddress].country == addressesA[index].country) {
                  data[indexsave].addresses[indexaddress].country = addressesA[index].country;
                  data[indexsave].addresses[indexaddress].geometry = addressesA[index].geometry;
                  data[indexsave].addresses[indexaddress].formatted_address = addressesA[index].formatted_address;
                }
              });
              logger.info('addresssave after');
              logger.info(data[indexsave].addresses);
              data[indexsave].save((err, todo) => {
                if (err) {
                  logger.info('addresssave error');
                } else {
                  logger.info('addresssave OK');
                }
                conta++;
                logger.info('conta '+conta);
                logger.info('data.length + addressesA.length '+(data.length + addressesA.length - 1));
                if (conta === data.length + addressesA.length - 1 ) {
                  cb(data);
                }
              });
            });  
          } else {
            cb(data);
          }
        });
      });
    } else {
      cb(addressesA);
    }
  });
};

const getgeometry = (req, res, cb) => {
  let allres = [];
  //AddressDB.find({country_new: {$exists: false}, status: {$not:{$in: ['OK', 'CHECK', 'ZERO_RESULTS', 'INVALID_REQUEST']}}}).
  //AddressDB.find({status: {$not:{$in: ['ZERO_RESULTS', 'INVALID_REQUEST']}}}).
  AddressDB.find({status: {$exists: false}}).
  limit(50).
  sort({"country": 1, "locality": 1}).
  then(function(addressesA) {
    if (addressesA.length) {
      let conta = 0;
      addressesA.forEach((element, index) => {
        logger.info("https://maps.googleapis.com/maps/api/geocode/json?key="+process.env.GOOGLEMAPSAPIKEY+'&address='+(element.locality ? element.locality+',' : '')+','+element.country);
        axios.get("https://maps.googleapis.com/maps/api/geocode/json?key="+process.env.GOOGLEMAPSAPIKEY+'&address='+encodeURIComponent((element.locality ? element.locality+',' : '')+element.country))
        .then((body) => {
          conta++;
          try {
            logger.info("ADDRESS try");
            let json = JSON.parse(body.data);
            logger.info(json.results[0].address_components);
            if (json.results.length) {
              addressesA[index].formatted_address = json.results[0].formatted_address;
              addressesA[index].status = json.status;
              for(const part in json.results[0].address_components) {
                if (json.results[0].address_components[part].types[0] === "locality") addressesA[index].locality_new = json.results[0].address_components[part].long_name;
                if (json.results[0].address_components[part].types[0] === "country") addressesA[index].country_new = json.results[0].address_components[part].long_name;
              }
              if (!addressesA[index].locality_new || !addressesA[index].country_new || addressesA[index].locality_new !== addressesA[index].locality || addressesA[index].country_new !== addressesA[index].country) {
                addressesA[index].status = "CHECK";
              }
              addressesA[index].geometry = json.results[0].geometry.location;
            } else {
              addressesA[index].formatted_address = "";
              addressesA[index].status = json.status;
            }
            AddressDB.updateOne({_id: addressesA[index]._id}, { $set: addressesA[index]}, function(err, res) {
              if (err) {
                logger.info(err);
              } else {
                AddressDB.find({_id: addressesA[index]._id}).
                then(function(resres) {
                  if (err) {
                    logger.info(err);
                  } else {
                    allres = allres.concat(resres);
                  }
                  logger.info("update end");
                  if (conta === addressesA.length) {
                    logger.info("update end");
                    cb(allres);
                  }
              });
              }
            });
          } catch(e) {
            const error = JSON.parse(body);
            logger.info("ADDRESS catch");
            logger.info(error);

            if (error.status == "ZERO_RESULTS" || error.status == "INVALID_REQUEST") {
              addressesA[index].status = error.status;
              AddressDB.updateOne({_id: addressesA[index]._id}, { $set: addressesA[index]}, function(err, res) {
                if (err) {
                  logger.info(err);
                } else {
                  AddressDB.find({_id: addressesA[index]._id}).
                  then(function(resres) {
                    if (err) {
                      logger.info(err);
                    } else {
                      allres = allres.concat(resres);
                    }
                    if (conta === addressesA.length) {
                      cb(allres);
                    }
                  });
                }
              });
            } else {
              //logger.info(JSON.parse(body));
              allres = allres.concat([error]);
              if (conta === addressesA.length) {
                cb(allres);
              }
            }
          }
        }, (error) => {
          logger.info(error);
        });
        /* UPDATE USERS
                if (json.results[0].geometry.location) {
                  User.find({"addresses.country": addressesA[index].newAddress.country, "addresses.locality": {$in: addressesA[index].localityOld}}).
                  select({stagename: 1, addresses: 1}).
                  limit(1).
                  exec((err, data) => {
                    for (let indexsave=0; indexsave < data.length; indexsave++) { 
                      for (let indexaddress=0; indexaddress < data[indexsave].addresses.length; indexaddress++) { 
                      //elementsave.addresses.forEach((addresssave, indexaddress) => {
                        if (data[indexsave].addresses[indexaddress].country == addressesA[index].newAddress.country && addressesA[index].localityOld.indexOf(data[indexsave].addresses[indexaddress].locality)!==-1) {
                          data[indexsave].addresses[indexaddress] = addressesA[index].newAddress;
                          logger.info('addresssave');
                          logger.info(data[indexsave].addresses[indexaddress]);
                          data[indexsave].save((err, todo) => {
                            if (err) {
                              logger.info('addresssave error');
                            } else {
                              logger.info('addresssave OK');
                            }
                          });
                        }
                      }
                    }
                  });
                }
        */
      });  
    } else {
      cb([{error_message: "ALL ADDRESS PROCESSED"}]);
    }
  });
};

const showall = (req, res, save, cb) => {
  // A const q = req.query.q;
  AddressDB.find({}).
  sort('country').
  sort('locality').
  exec((err, addressOK) => {
    let addressOKobj = {};
    for(addressOKitem in addressOK) {
      addressOKobj[addressOK[addressOKitem].country+"_"+addressOK[addressOKitem].locality] = addressOK[addressOKitem];
    }
    User.find({"addresses.country": {$exists: true}/*, "addresses.geometry": {$exists: false}*/}).
    select({addresses: 1, slug:1}).
    //limit(100).
    lean().
    exec((err, data) => {
      //let addresses = {};
      function toTitleCase(str) {
        if (str) {
          return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        } else {
          return false;
        }
      }
      let update = [];
      let create = [];

      for (const item in data) {
        logger.info(data[item].slug);
        for (const address in data[item].addresses) {
          const country = data[item].addresses[address].country;
          const localityOld = data[item].addresses[address].locality;
          let locality = data[item].addresses[address].locality;
          /* C
          const country = toTitleCase(data[item].addresses[address].country);
          const localityOld = data[item].addresses[address].locality;
          let locality = toTitleCase(data[item].addresses[address].locality);
          */

          /*if (country && typeof addresses[country] === 'undefined') {
            addresses[country] = {};
            //logger.info('country '+addresses[country].indexOf(locality));
          }
          */
          //if (locality && addresses[country].indexOf(locality) === -1) {
            
          if (country) {
            if (typeof addressOKobj[country+"_"+locality] === 'undefined') {
              addressOKobj[country+"_"+locality] = {country: country, locality: locality, localityOld: [localityOld]};
              //if (addressOKobj[country+"_"+locality].status!="OK") delete addressOKobj[country+"_"+locality].status; 
              if (save) {
                create.push(addressOKobj[country+"_"+locality]);
              } else {
                addressOKobj[country+"_"+locality].status = 'TO ADD';
              }
              //logger.info(country);
              //addresses[country].sort();
            } else if(addressOKobj[country+"_"+locality].localityOld.indexOf(localityOld) === -1) {
              addressOKobj[country+"_"+locality].localityOld.push(localityOld);
              if (!save) {
              } else {
                update.push(addressOKobj[country+"_"+locality]);
              }
            }
          }
        }
      }
      let addressesA = [];
      for (const item in addressOKobj) {
        /* C
        if (!addressOKobj[item].formatted_address || (addressOKobj[item].formatted_address.toLowerCase().indexOf((addressOKobj[item].country == "United States" ? "USA" : (addressOKobj[item].country == "United Kingdom" ? "UK" : addressOKobj[item].country)).toLowerCase()) === -1 || addressOKobj[item].formatted_address.toLowerCase().indexOf(addressOKobj[item].locality.toLowerCase()) === -1)) {
          if (!addressOKobj[item].status) addressOKobj[item].status = "DONE";
          addressOKobj[item].status+= ' - DELETE';
        } else if (!addressOKobj[item].formatted_address || (addressOKobj[item].formatted_address.toLowerCase().indexOf((addressOKobj[item].country == "United States" ? "USA" : (addressOKobj[item].country == "United Kingdom" ? "UK" : addressOKobj[item].country)).toLowerCase()) === -1 || addressOKobj[item].formatted_address.toLowerCase().indexOf(addressOKobj[item].locality.toLowerCase()) === -1)) {
          if (!addressOKobj[item].status) addressOKobj[item].status = "DONE";
          addressOKobj[item].status+= ' - DELETE';
        } else {
          if (!addressOKobj[item].status) addressOKobj[item].status = "DONE";
          addressOKobj[item].status+= ' - OK';
        }
        */
        addressesA.push(addressOKobj[item]);
      }
      if (save) {
        for (let item in create) {
          AddressDB.create(create[item], function(err, res) {
            logger.info("createcreatecreate ");
            logger.info(create[item]);
            logger.info("salvatoooooo ");
            logger.info(err);
            logger.info(res);
          });
        }
        create.sort(function(a, b) {
          var x=a.country.toLowerCase(),
          y=b.country.toLowerCase();
          return x<y ? -1 : x>y ? 1 : 0;
        });
        create.sort(function(a, b) {
          var x=a.locality ? a.locality.toLowerCase() : 'a',
          y=b.locality ? b.locality.toLowerCase() : 'a';
          return x<y ? -1 : x>y ? 1 : 0;
        });
        cb(create);
      } else {
        /*
        addressesA.sort(function(a, b) {
          var x=a.country.toLowerCase(),
          y=b.country.toLowerCase();
          return x<y ? -1 : x>y ? 1 : 0;
        });
        */
        addressesA.sort(function(a, b) {
          var x=a.locality ? a.locality.toLowerCase() : 'a',
          y=b.locality ? b.locality.toLowerCase() : 'a';
          return x<y ? -1 : x>y ? 1 : 0;
        });
        cb(addressesA);
  
      }
    });
    /* SAVE

      import request from "axios";
      addressesA.forEach((element, index) => {
        logger.info("https://maps.googleapis.com/maps/api/geocode/json?key="+process.env.GOOGLEMAPSAPIKEY+'&address='+element.newAddress.locality+','+element.newAddress.country);
        request.get("https://maps.googleapis.com/maps/api/geocode/json?key="+process.env.GOOGLEMAPSAPIKEY+'&address='+element.newAddress.locality+','+element.newAddress.country, (error, response, body) => {
          logger.info(error);
          if (error) {
            logger.info(error);
          } else {
            try {
              let json = JSON.parse(body);
              if (json.results.length) {
                addressesA[index].formatted_address = json.results[0].formatted_address;
                addressesA[index].newAddress.geometry = json.results[0].geometry.location;
                if (json.results[0].geometry.location) {
                  User.find({"addresses.country": addressesA[index].newAddress.country, "addresses.locality": {$in: addressesA[index].localityOld}}).
                  select({stagename: 1, addresses: 1}).
                  limit(1).
                  exec((err, data) => {
                    for (let indexsave=0; indexsave < data.length; indexsave++) { 
                      for (let indexaddress=0; indexaddress < data[indexsave].addresses.length; indexaddress++) { 
                      //elementsave.addresses.forEach((addresssave, indexaddress) => {
                        if (data[indexsave].addresses[indexaddress].country == addressesA[index].newAddress.country && addressesA[index].localityOld.indexOf(data[indexsave].addresses[indexaddress].locality)!==-1) {
                          data[indexsave].addresses[indexaddress] = addressesA[index].newAddress;
                          logger.info('addresssave');
                          logger.info(data[indexsave].addresses[indexaddress]);
                          data[indexsave].save((err, todo) => {
                            if (err) {
                              logger.info('addresssave error');
                            } else {
                              logger.info('addresssave OK');
                            }
                          });
                        }
                      }
                    }
                  });
                }
              }
            } catch(e) {
              logger.info(error);
              logger.info(body);
            }
          }
          if (index === addressesA.length-1) {
            res.render('adminpro/supertools', {
              title: 'adminpro/supertools',
              data: addressesA
            });
          }
        });
      });
      */
    });
 };

const usersdbcheck = (req, res, cb) => {
  const q = req.query.q ? {status: req.query.q} : {};
  AddressDB.find(q).
  sort('country').
  sort('locality').
  exec((err, addresses) => {
    cb(addresses);
  });
};

const venuesdbcheck = (req, res, cb) => {
  const q = req.query.q ? {status: req.query.q} : {};
  logger.info(q);
  VenueDB.find(q).
  sort('name').
  exec((err, addresses) => {
    logger.info(q);
    cb(addresses);
  });
};

const venuesdbimport = (req, res, cb) => {
  const q = req.query.q ? {status: req.query.q} : {};
  logger.info(q);
  Event.find({"schedule.venue":{$exists: true}}).
  sort('name').
  exec((err, e) => {
    var addresses = [];
    for (var a=0; a<e.length; a++){
      for (var b=0; b<e[a].schedule.length; b++){
        if (e[a].schedule[b].venue && e[a].schedule[b].venue.location && e[a].schedule[b].venue.name) {
          var loc = JSON.parse(JSON.stringify(e[a].schedule[b].venue.location));
          loc.name = e[a].schedule[b].venue.name;
          logger.info(loc);
          addresses.push(loc);
        }
      }  
    }
    VenueDB.insertMany(addresses, { ordered: false }, (err) => {
      logger.info(err);
      cb(addresses);
    });
  });
};

const venuesgetgeometry = (req, res, cb) => {
  logger.info("venuesgetgeometry");
  let allres = [];
  //AddressDB.find({country_new: {$exists: false}, status: {$not:{$in: ['OK', 'CHECK', 'ZERO_RESULTS', 'INVALID_REQUEST']}}}).
  //AddressDB.find({status: {$not:{$in: ['ZERO_RESULTS', 'INVALID_REQUEST']}}}).
  VenueDB.find({status: {$exists: false}}).
  //VenueDB.find({postal_code_new: {$exists: false}}).
  limit(50).
  sort({"name": 1, "country": 1, "locality": 1}).
  then(function(addressesA) {
    if (addressesA.length) {
      let conta = 0;
      addressesA.forEach((element, index) => {
        logger.info("S");
        logger.info(element);
        logger.info("https://maps.googleapis.com/maps/api/geocode/json?key="+process.env.GOOGLEMAPSAPIKEY+'&address='+(element.name ? element.name+',' : '')+(element.route_new ? element.route_new+',' : '')+(element.street_number_new ? element.street_number_new+',' : '')+(element.locality ? element.locality+',' : '')+element.country);
        axios.get("https://maps.googleapis.com/maps/api/geocode/json?key="+process.env.GOOGLEMAPSAPIKEY+'&address='+encodeURIComponent((element.name ? element.name+',' : '')+(element.route ? element.route+',' : '')+(element.street_number ? element.street_number+',' : '')+(element.locality ? element.locality+',' : '')+element.country))
        .then((b) => {
          logger.info("axiosaxiosaxiosaxios");
          logger.info(error);
            try {
              logger.info("ADDRESS try");
              let eee = JSON.parse(b).results[0];
              logger.info(process.env.GOOGLEMAPSAPIURLBYID+'&placeid='+eee.place_id);
              axios.get(process.env.GOOGLEMAPSAPIURLBYID+'&placeid='+eee.place_id)
              .then((body) => {
                logger.info("axiosaxiosaxiosaxios");
                //logger.info(element);
                //logger.info(error);
                //logger.info(body);
                conta++;
                try {
                  logger.info("ADDRESS try");
                  let json = JSON.parse(body.data);
                  if (json.result) {
                    logger.info(json.result.address_components);
                    addressesA[index].name_new = json.result.name;
                    addressesA[index].formatted_address = json.result.formatted_address;
                    addressesA[index].status = json.status;
                    for(const part in json.result.address_components) {
                      if (json.result.address_components[part].types[0] === "locality") addressesA[index].locality_new = json.result.address_components[part].long_name;
                      if (json.result.address_components[part].types[0] === "country") addressesA[index].country_new = json.result.address_components[part].long_name;
                      if (json.result.address_components[part].types[0] === "street_number") addressesA[index].street_number_new = json.result.address_components[part].long_name;
                      if (json.result.address_components[part].types[0] === "route") addressesA[index].route_new = json.result.address_components[part].long_name;
                      if (json.result.address_components[part].types[0] === "postal_code") addressesA[index].postal_code_new = json.result.address_components[part].long_name;
                    }
                    if (!addressesA[index].locality_new || !addressesA[index].country_new || addressesA[index].locality_new !== addressesA[index].locality || addressesA[index].country_new !== addressesA[index].country) {
                      addressesA[index].status = "CHECK";
                    }
                    addressesA[index].geometry_new = json.result.geometry.location;
                    if (!addressesA[index].geometry && addressesA[index].geometry_new) addressesA[index].geometry = addressesA[index].geometry_new
                    logger.info("addressesA[index]");
                    logger.info(addressesA[index]);
                  } else {
                    addressesA[index].formatted_address = "";
                    addressesA[index].status = json.status;
                  }
                  VenueDB.updateOne({_id: addressesA[index]._id}, { $set: addressesA[index]}, function(err, res) {
                    if (err) {
                      logger.info(err);
                    } else {
                      VenueDB.find({_id: addressesA[index]._id}).
                      then(function(resres) {
                        if (err) {
                          logger.info(err);
                        } else {
                          allres = allres.concat(resres);
                        }
                        logger.info("update end");
                        if (conta === addressesA.length) {
                          logger.info("update end");
                          cb(allres);
                        }
                      });
                    }
                  });
                } catch(e) {
                  const error = JSON.parse(body);
                  logger.info("ADDRESS catch");
                  logger.info(error);
                  cb([{error_message: error}]);
                }
              });    
            } catch(e) {
              const error = JSON.parse(b);
              cb([{error_message: error}]);
            }
        }, (error) => {
          logger.info(error);
          cb([{error_message: error}]);
        });
      });  
    } else {
      cb([{error_message: "ALL ADDRESS PROCESSED"}]);
    }
  });
};

const venuessetgeometry = (req, res, s, cb) => {
  logger.info(s);
  VenueDB.find({status: "OK"}).
  skip(s).
  limit(10).
  sort({"name": 1, "country": 1, "locality": 1}).
  exec((err, addressesA) => {
    logger.info(addressesA);
    if (addressesA.length) {
      let conta = 0;
      addressesA.forEach((element, index) => {
        var find = {"schedule.venue.name": addressesA[index].name, "schedule.venue.location.country": addressesA[index].country, "schedule.venue.location.locality": addressesA[index].locality}
        Event.find(find).
        //select({stagename: 1, old_id: 1, addresses: 1}).
        limit(1).
        exec((err, data) => {
          if (data.length) {
            data.forEach ((user, indexsave) => {
              data[indexsave].schedule.forEach ((useraddress, indexaddress) => {
                if (data[indexsave].schedule[indexaddress].venue.location.country == addressesA[index].country && addressesA[index].locality == data[indexsave].schedule[indexaddress].venue.location.locality) {
                  logger.info('addresssave pre');
                  logger.info(data[indexsave].schedule[indexaddress].venue);
                  data[indexsave].schedule[indexaddress].venue.name = addressesA[index].name;
                  data[indexsave].schedule[indexaddress].venue.location.postal_code = addressesA[index].postal_code_new;
                  data[indexsave].schedule[indexaddress].venue.location.street_number = addressesA[index].street_number_new;
                  data[indexsave].schedule[indexaddress].venue.location.route = addressesA[index].route_new;
                  data[indexsave].schedule[indexaddress].venue.location.country = addressesA[index].country;
                  data[indexsave].schedule[indexaddress].venue.location.locality = addressesA[index].locality;
                  data[indexsave].schedule[indexaddress].venue.location.geometry = addressesA[index].geometry;
                  data[indexsave].schedule[indexaddress].venue.location.formatted_address = addressesA[index].formatted_address;
                  logger.info('addresssave after');
                  logger.info(data[indexsave].schedule[indexaddress].venue);
                }
              });
              data[indexsave].save((err, todo) => {
                if (err) {
                  logger.info('addresssave error');
                } else {
                  logger.info('addresssave OK');
                }
                conta++;
                logger.info('conta '+conta);
                logger.info('data.length + addressesA.length '+(data.length + addressesA.length - 1));
                if (conta === data.length + addressesA.length - 1 ) {
                  cb(data);
                }
              });
            });  
          } else {
            addressesA[index].status = "NOT IN USE";
            addressesA[index].save((err, todo) => {
              conta++;
              logger.info('conta '+conta);
              logger.info('data.length + addressesA.length '+(data.length + addressesA.length - 1));
              if (conta === data.length + addressesA.length - 1 ) {
                cb(data);
              }
          });
          }
        });
      });
    } else {
      cb(addressesA);
    }
  });
};

export default router;