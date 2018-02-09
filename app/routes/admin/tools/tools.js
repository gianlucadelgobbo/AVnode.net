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
  console.log('/addresses/getgeometry');
  getgeometry(req, res, cb = (data) => {
    console.log('getgeometry');
    const script = !data.length || data[0].error_message  || data[0].status == 'OVER_QUERY_LIMIT' ? false : '<script>var timeout = setTimeout("location.reload(true);",10000);</script>';
    console.log(script);
    res.render('admin/tools', {
      title: 'admin/tools/addresses/getgeometry',
      currentUrl: req.path,
      data: data,
      script: script
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
  AddressDB.find({country_new: {$exists: false}, locality_new: {$exists: false}, status: {$not:{$in: ['ZERO_RESULTS', 'INVALID_REQUEST']}}}).
  limit(50).
  sort({"country": 1, "locality": 1}).
  then(function(addressesA) {
    if (addressesA.length) {
      let conta = 0;
      addressesA.forEach((element, index) => {
        console.log(process.env.GOOGLEMAPSAPIURL+'&address='+element.locality+','+element.country);
        request.get(process.env.GOOGLEMAPSAPIURL+'&address='+encodeURIComponent(element.locality+','+element.country), (error, response, body) => {
          console.log("requestrequestrequestrequest");
          console.log(element);
          console.log(error);
          console.log(body);
          conta++;
          if (error) {
            console.log(error);
          } else {
            try {
              console.log("ADDRESS try");
              let json = JSON.parse(body);
              console.log(json.results[0].address_components);
              if (json.results.length) {
                addressesA[index].formatted_address = json.results[0].formatted_address;
                addressesA[index].status = json.status;
                for(const part in json.results[0].address_components) {
                  if (json.results[0].address_components[part].types[0] === "locality") addressesA[index].locality_new = json.results[0].address_components[part].long_name;
                  if (json.results[0].address_components[part].types[0] === "country") addressesA[index].country_new = json.results[0].address_components[part].long_name;
                }
                addressesA[index].geometry = json.results[0].geometry.location;
              } else {
                addressesA[index].formatted_address = "";
                addressesA[index].status = json.status;
              }
              AddressDB.update({_id: addressesA[index]._id}, { $set: addressesA[index]}, function(err, res) {
                if (err) {
                  console.log(err);
                } else {
                  AddressDB.find({_id: addressesA[index]._id}).
                  then(function(resres) {
                    if (err) {
                      console.log(err);
                    } else {
                      allres = allres.concat(resres);
                    }
                    //console.log(JSON.parse(body));
                    if (conta === addressesA.length) {
                      console.log();
                      cb(allres);
                    }
                });
                }
              });
            } catch(e) {
              console.log("ADDRESS catch");
              const error = JSON.parse(body);

              if (error.status == "ZERO_RESULTS" || error.status == "INVALID_REQUEST") {
                addressesA[index].status = error.status;
                AddressDB.update({_id: addressesA[index]._id}, { $set: addressesA[index]}, function(err, res) {
                  if (err) {
                    console.log(err);
                  } else {
                    AddressDB.find({_id: addressesA[index]._id}).
                    then(function(resres) {
                      if (err) {
                        console.log(err);
                      } else {
                        allres = allres.concat(resres);
                      }
                    });
                  }
                });
              } else {
                //console.log(JSON.parse(body));
                allres = allres.concat([error]);
                if (conta === addressesA.length) {
                  console.log();
                  cb(allres);
                }
              }
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
    select({addresses: 1}).
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
            //logger.debug('country '+addresses[country].indexOf(locality));
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
              //console.log(country);
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
            console.log("createcreatecreate ");
            console.log(create[item]);
            console.log("salvatoooooo ");
            console.log(err);
            console.log(res);
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
