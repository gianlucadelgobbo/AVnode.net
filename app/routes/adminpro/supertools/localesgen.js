const router = require('../../router')();
const mongoose = require('mongoose');
const jsonfile = require('jsonfile');
const config = require('getconfig');

const logger = require('../../../utilities/logger');

router.get('/', (req, res) => {
  res.render('adminpro/supertools/localesgen/index', {
    title: 'Locales Generator',
    currentUrl: req.originalUrl,
    script: false
  });
});

router.post('/', (req, res) => {
  var locale = {};
  var localeTMP = req.body.labelsinput.split("\n");
  localeTMP.forEach((item,i)=>{
    localeTMP[i] = item.split("\t");
  })
  localeTMP[0].forEach((item,i)=>{
    if(i>0) locale[item] = {};
  })
  for(i=1;i<localeTMP.length;i++) {
    if (i>0) {
      for(y=1;y<localeTMP[i].length;y++) {
          locale[localeTMP[0][y]][localeTMP[i][0]] = localeTMP[i][y];
      }
    }
  }
  /* var clone = $(" #localesresult .form-group");
  $(" #localesresult .form-group").remove() */
  let promises = [];
  let msg = [];
  for(item in locale){
    //console.log(JSON.stringify(locale[item], null, 2));
    locale[item]["------------------NEW ADD------------------"] = "------------------NEW ADD------------------";

    promises.push(router.writeData(appRoot+"/locales/"+item.trim() + '.json', locale[item]));
  }
  Promise.all(
    promises
  ).then( (resultsPromise) => {
    setTimeout(function() {
      logger.debug('resultsPromise');
      logger.debug(resultsPromise);
      res.render('adminpro/supertools/localesgen/index', {
        title: 'Locales Generator',
        currentUrl: req.originalUrl,
        labelsinput: req.body.labelsinput,
        msg: resultsPromise,
        script: false
      });
    }, 1000);
  });
});

router.writeData =(file, data) =>{
  return new Promise((resolve,reject)=>{
    jsonfile.writeFile(file,data, { spaces: 2 },(err)=>{
      if(err) {
        reject("JSON "+file.replace(appRoot, "") + " error: "+JSON.stringify(err));
      } else {
        resolve("JSON "+file.replace(appRoot, "") + " saved");
      }
    });
  });
}

module.exports = router;