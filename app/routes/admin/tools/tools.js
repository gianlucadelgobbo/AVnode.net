const router = require('../../router')();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const AddressDB = mongoose.model('AddressDB');
const request = require('request');

const logger = require('../../../utilities/logger');

// V > db.events.findOne({"schedule.venue.location.locality":{$exists: true}},{schedule:1});
// V {"addresses.country": "Italy", "addresses.locality":{$in: ["Rome","Roma"]}},{addresses:1}
router.get('/', (req, res) => {
  logger.debug('/admin/tools/');
  res.render('admin/tools', {
    title: 'admin/tools',
    currentUrl: req.path,
    data: 'LOAD DATA'
  });
});

router.get('/addresses/showall', (req, res) => {
  logger.debug('/admin/tools/addresses/showall');
  showall(req, res, false, cb = (data) => {
    res.render('admin/tools/addresses/showall', {
      title: 'admin/tools/addresses/showall',
      currentUrl: req.path,
      data: data
    });
  });
});

router.get('/addresses/updatedb', (req, res) => {
  logger.debug('/admin/tools/addresses/updatedb');
  showall(req, res, true, cb = (data) => {
    res.render('admin/tools', {
      title: 'admin/tools/addresses/updatedb',
      currentUrl: req.path,
      data: data
    });
  });
});
router.get('/addresses/getgeometry', (req, res) => {
  getgeometry(req, res, cb = (data) => {
    res.render('admin/tools', {
      title: 'admin/tools/addresses/getgeometry',
      currentUrl: req.path,
      data: data,
      script: '<script>var timeout = setTimeout("location.reload(true);",10000);</script>'
    });
  });
});

router.get('/addresses/setgeometry', (req, res) => {
  console.log(req.query.skip);
  var skip = req.query.skip ? parseFloat(req.query.skip)+1 : 0;
  console.log(skip);
  setgeometry(req, res, skip, cb = (data) => {
    res.render('admin/tools', {
      title: 'admin/tools/addresses/setgeometry',
      currentUrl: req.path,
      data: data,
      script: '<script>var timeout = setTimeout(function(){location.href="/admin/tools/addresses/setgeometry?skip=' + (skip) + '"},1000);</script>'
    });
  });
});

const setgeometry = (req, res, s, cb) => {
  console.log(s);
  AddressDB.find({formatted_address: {$exists: true}}).
  skip(s).
  limit(1).
  sort({"country": 1, "locality": 1}).
  exec((err, addressesA) => {
    let conta = 0;
    addressesA.forEach((element, index) => {
      addressesA[index].country = addressesA[index].country === '00179' ? 'Italy' : addressesA[index].country;
      User.find({"addresses.country": addressesA[index].country, "addresses.locality": {$in: addressesA[index].localityOld}}).
      select({stagename: 1, old_id: 1, addresses: 1}).
      limit(100).
      exec((err, data) => {
        if (data.length) {
          data.forEach ((user, indexsave) => {
            data[indexsave].addresses.forEach ((useraddress, indexaddress) => {
              if (data[indexsave].addresses[indexaddress].country == addressesA[index].country && addressesA[index].localityOld.indexOf(data[indexsave].addresses[indexaddress].locality)!==-1) {
                data[indexsave].addresses[indexaddress].country = addressesA[index].country;
                data[indexsave].addresses[indexaddress].locality = addressesA[index].locality;
                data[indexsave].addresses[indexaddress].geometry = addressesA[index].geometry;
                data[indexsave].addresses[indexaddress].formatted_address = addressesA[index].formatted_address;
              }
            });
            data[indexsave].save((err, todo) => {
              if (err) {
                console.log('addresssave error');
              } else {
                console.log('addresssave OK');
              }
              conta++;
              console.log('conta '+conta);
              console.log('data.length + addressesA.length '+(data.length + addressesA.length - 1));
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
  });
};

const getgeometry = (req, res, cb) => {
  let allres = [];
  AddressDB.find({formatted_address: {$exists: false}}).
  limit(1).
  sort({"country": 1, "locality": 1}).
  then(function(addressesA) {
    let conta = 0;
    addressesA.forEach((element, index) => {
      console.log(process.env.GOOGLEMAPSAPIURL+'&address='+element.locality+','+element.country);
      request.get(process.env.GOOGLEMAPSAPIURL+'&address='+encodeURIComponent(element.locality+','+element.country), (error, response, body) => {
        console.log(error);
        if (error) {
          console.log(error);
        } else {
          try {
            let json = JSON.parse(body);
            console.log("json");
            console.log(json);
            console.log(addressesA[index]);
            if (json.results.length) {
              addressesA[index].formatted_address = json.results[0].formatted_address;
              addressesA[index].status = json.status;
              for(var part in json.results[0].address_components) {
                if (json.results[0].address_components[part].types[0] === "locality") json.results[0].locality_new = json.results[0].address_components[part].long_name;
                if (json.results[0].address_components[part].types[0] === "country") json.results[0].country_new = json.results[0].address_components[part].long_name;
              }
              addressesA[index].geometry = json.results[0].geometry.location;
            } else {
              addressesA[index].formatted_address = "";
              addressesA[index].status = json.status;
            }
            console.log(addressesA[index]);
            /*
            AddressDB.update({_id: addressesA[index]._id}, { $set: addressesA[index]}, function(err, res) {
              if (err) {
                console.log(err);
              } else {
                AddressDB.find({_id: addressesA[index]._id}).
                then(function(resres) {
                  if (err) {
                    console.log(err);
                  } else {
                    resres[0].res = res;
                    allres.push(resres);
                    console.log('resres');
                    console.log(resres);
                    conta++;
                    console.log(conta);
                    console.log(addressesA.length);
                    if (conta === addressesA.length) {
                      cb(allres);
                    }
                  }
                });
              }
            });
            */
          } catch(e) {
            console.log(error);
            console.log(body);
          }
        }
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
                        console.log('addresssave');
                        console.log(data[indexsave].addresses[indexaddress]);
                        data[indexsave].save((err, todo) => {
                          if (err) {
                            console.log('addresssave error');
                          } else {
                            console.log('addresssave OK');
                          }
                        });
                      }
                    }
                  }
                });
              }
      */
    });
  });
};

const showall = (req, res, save, cb) => {
  // A const q = req.query.q;
  AddressDB.find({"geometry": {$exists: true}}).
  sort('country').
  sort('locality').
  exec((err, addressOK) => {
    let addressOKobj = {};
    for(addressOKitem in addressOK) {
      addressOKobj[addressOK[addressOKitem].country+"_"+addressOK[addressOKitem].locality] = addressOK[addressOKitem];
    }
    User.find({"addresses": {$exists: true}, "addresses.geometry": {$exists: false}}).
    select({addresses: 1}).
    exec((err, data) => {
      //let addresses = {};
      function toTitleCase(str) {
        if (str) {
          return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        } else {
          return false;
        }
      }
      for (const item in data) {
        for (const address in data[item].addresses) {
          const country = toTitleCase(data[item].addresses[address].country);
          const localityOld = data[item].addresses[address].locality;
          let locality = toTitleCase(data[item].addresses[address].locality);

          /*if (country && typeof addresses[country] === 'undefined') {
            addresses[country] = {};
            //logger.debug('country '+addresses[country].indexOf(locality));
          }
          */
          //if (locality && addresses[country].indexOf(locality) === -1) {
            
          if (country && locality) {
            console.log("stocazzo ");
            if (typeof addressOKobj[country+"_"+locality] === 'undefined') {
              addressOKobj[country+"_"+locality] = {'country': country, 'locality': locality/*, 'geometry': data[item].addresses[address].geometry*/, localityOld:[localityOld]};
              addressOKobj[country+"_"+locality].status = "TODO";
              //addresses[country].sort();
            } else if(addressOKobj[country+"_"+locality].localityOld.indexOf(localityOld) === -1) {
              addressOKobj[country+"_"+locality].localityOld.push(localityOld);
              addressOKobj[country+"_"+locality].status = "DONE";
            }
          }
        }
      }
      let addressesA = [];
      for (const item in addressOKobj) {
        if (!addressOKobj[item].status) addressOKobj[item].status = "DONE";
        if (!addressOKobj[item].formatted_address || (addressOKobj[item].formatted_address.toLowerCase().indexOf((addressOKobj[item].country == "United States" ? "USA" : (addressOKobj[item].country == "United Kingdom" ? "UK" : addressOKobj[item].country)).toLowerCase()) === -1 || addressOKobj[item].formatted_address.toLowerCase().indexOf(addressOKobj[item].locality.toLowerCase()) === -1)) {
          addressOKobj[item].status+= ' - DELETE';
        } else {
          addressOKobj[item].status+= ' - OK';
        }
        addressesA.push(addressOKobj[item]);
      }
      if (save) {
        AddressDB.remove({geometry: {$exists: false}}).
        then(function() {
          console.log("cancellato ");
          AddressDB.create(addressesA).
          then(function() {
            console.log("salvato ");
          });
        });
      }
      cb(addressesA);
    });
    /* SAVE

      const request = require('request');
      addressesA.forEach((element, index) => {
        console.log(process.env.GOOGLEMAPSAPIURL+'&address='+element.newAddress.locality+','+element.newAddress.country);
        request.get(process.env.GOOGLEMAPSAPIURL+'&address='+element.newAddress.locality+','+element.newAddress.country, (error, response, body) => {
          console.log(error);
          if (error) {
            console.log(error);
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
                          console.log('addresssave');
                          console.log(data[indexsave].addresses[indexaddress]);
                          data[indexsave].save((err, todo) => {
                            if (err) {
                              console.log('addresssave error');
                            } else {
                              console.log('addresssave OK');
                            }
                          });
                        }
                      }
                    }
                  });
                }
              }
            } catch(e) {
              console.log(error);
              console.log(body);
            }
          }
          if (index === addressesA.length-1) {
            res.render('admin/tools', {
              title: 'admin/tools',
              data: addressesA
            });
          }
        });
      });
      */
    });
 };


module.exports = router;
