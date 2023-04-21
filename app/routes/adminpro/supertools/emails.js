const router = require('../../router')();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Event = mongoose.model('EventShow');
const ObjectId = Schema.ObjectId;
const User = mongoose.model('User');
const Performance = mongoose.model('Performance');
const Category = mongoose.model('Category');
const Gallery = mongoose.model('Gallery');
const Video = mongoose.model('Video');

const News = mongoose.model('News');
const axios = require('axios');
//const fs = require('fs');
const config = require('getconfig');
//const sharp = require('sharp');

const logger = require('../../../utilities/logger');

// V > db.events.findOne({"schedule.venue.location.locality":{$exists: true}},{schedule:1});
// V {"addresses.country": "Italy", "addresses.locality":{$in: ["Rome","Roma"]}},{addresses:1}

router.get('/allemails', (req, res) => {
  logger.debug('/adminpro/supertools/emails');
  User.find({}).
  select({name: 1, slug: 1, surname: 1, stagename: 1, addresses: 1, emails: 1, email: 1}).
  sort({name: 1}).
  exec((err, results) => {
    console.log(results);
    let mailinglists = [];
    let conta = 0;
    let fatto = 0;

    results.forEach(function(e) {
      fatto += e.emails.length;
    });
    
    results.forEach(function(e) {
      /* if (e.emails.filter(item => item.email=e.email).length===0 && e.activity==0) {
        logger.debug("e.emails.filter(item => item.email=e.email).length");
        logger.debug(e.emails.filter(item => item.email=e.email).length);
        logger.debug(e.email);
        logger.debug(e.emails);
        logger.debug(e.slug);
      } */
      let email = {
        list: 'AXRGq2Ftn2Fiab3skb5E892g',
        api_key: process.env.SENDYAPIKEY,
        //email: e.email,
        avnode_id: e._id.toString(),
        SiteFrom: "AVnode.net",
        avnode_slug: e.slug,
        avnode_email: e.email,
        boolean: 'true'
      };
      if (e.old_id) email.flxer_id = e.old_id;
      if (e.name) email.Name = e.name;
      if (e.surname) email.Surname = e.surname;
      if (e.stagename) email.Stagename = e.stagename;
      if (e.addresses && e.addresses[0] && e.addresses[0].locality) email.City = e.addresses[0].locality;
      if (e.addresses && e.addresses[0] && e.addresses[0].country) email.Country = e.addresses[0].country;
      if (e.addresses && e.addresses[0] && e.addresses[0].geometry && e.addresses[0].geometry.lat && e.addresses[0].geometry.lng) {
        email.LATITUDE = e.addresses[0].geometry.lat;
        email.LONGITUDE = e.addresses[0].geometry.lng;
      }

      e.emails.forEach(function(ee) {
        email.email = ee.email;
        let topics = [];

        for (const mailinglist in ee.mailinglists) if (ee.mailinglists[mailinglist]) topics.push(mailinglist);
        email.Topics = topics.join(',');
        mailinglists.push(email);
        conta++;

        if (conta === fatto) {
          res.render('adminpro/supertools/emails/showall', {
            title: 'Emails',
            
            currentUrl: req.originalUrl,
            skip: 0,
            data: mailinglists,
            script: false
          });
        }
      });
    });
  });
});
router.get('/updateSendy', (req, res) => {
  const limit = 50;
  const skip = req.query.skip ? parseFloat(req.query.skip) : 0;

  logger.debug('/adminpro/supertools/emails');
  User.find({email:{$exists:true}, "emails.email":{$exists:true}, is_crew:false}).
  select({name: 1, slug: 1, old_id: 1, activity: 1, surname: 1, stagename: 1, addresses: 1, emails: 1, email: 1}).
  lean().
  limit(limit).
  skip(skip).
  //sort('name').
  exec((err, results) => {
    if (results && results.length) {
      let mailinglists = [];
      let conta = 0;
      let fatto = 0;
  
      results.forEach(function(e) {
        fatto += e.emails.length;
      });
      
      results.forEach(function(e) {
        logger.debug(e);
        let email = {
          list: 'AXRGq2Ftn2Fiab3skb5E892g',
          api_key: process.env.SENDYAPIKEY,
          avnode_id: e._id.toString(),
          SiteFrom: "AVnode.net",
          avnode_slug: e.slug,
          avnode_email: e.email,
          boolean: 'true'
        };
        if (e.old_id) email.flxer_id = e.old_id;
        if (e.name) email.Name = e.name;
        if (e.surname) email.Surname = e.surname;
        if (e.stagename) email.Stagename = e.stagename;
        if (e.addresses && e.addresses[0] && e.addresses[0].locality) email.City = e.addresses[0].locality;
        if (e.addresses && e.addresses[0] && e.addresses[0].country) email.Country = e.addresses[0].country;
        if (e.addresses && e.addresses[0] && e.addresses[0].geometry && e.addresses[0].geometry.lat && e.addresses[0].geometry.lng) {
          email.LATITUDE = e.addresses[0].geometry.lat;
          email.LONGITUDE = e.addresses[0].geometry.lng;
        }
  
        e.emails.forEach(function(ee) {
          email.email = ee.email;
          let topics = [];
  
          for (const mailinglist in ee.mailinglists) if (ee.mailinglists[mailinglist]) topics.push(mailinglist);
          email.Topics = topics.join(',');
          //logger.debug(email);
          //email.mailinglists = ee.mailinglists;
          mailinglists.push(email);
  
          axios.post('https://ml.avnode.net/subscribe', {email})
          .then((response) => {
            conta++;
            logger.debug(response);
            if (conta === fatto) {
              res.render('adminpro/supertools/emails/showall', {
                title: 'Emails',
                
                currentUrl: req.originalUrl,
                data: mailinglists,
                skip: skip,
                script: '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/emails/updateSendy?skip=' + (skip+limit) + '"},1000);</script>'
              });
            }
          });
        });
      });
    } else {
      res.render('adminpro/supertools/emails/showall', {
        title: 'Emails',
        
        currentUrl: req.originalUrl,
        data: {msg: "FINISHED"},
        script: false
      });

    }
  });
});

router.get('/mailinator', (req, res) => {
  User.find({$or:[{email: new RegExp("mailinator", 'i')}, {"emails.email":new RegExp("mailinator", 'i')}], is_crew:false}).
  select({name: 1, slug: 1, old_id: 1, activity: 1, surname: 1, stagename: 1, addresses: 1, emails: 1, email: 1}).
  lean().
  //sort('name').
  exec((err, results) => {
    logger.debug(results);
    let mailinglists = [];
    let conta = 0;
    let fatto = 0;

    results.forEach(function(e) {
      fatto += e.emails.length;
    });
    
    results.forEach(function(e) {
      /* if (e.emails.filter(item => item.email=e.email).length===0 && e.activity==0) {
        logger.debug("e.emails.filter(item => item.email=e.email).length");
        logger.debug(e.emails.filter(item => item.email=e.email).length);
        logger.debug(e.email);
        logger.debug(e.emails);
        logger.debug(e.slug);
      } */
      let email = {
        list: 'AXRGq2Ftn2Fiab3skb5E892g',
        api_key: process.env.SENDYAPIKEY,
        //email: e.email,
        avnode_id: e._id.toString(),
        SiteFrom: "AVnode.net",
        avnode_slug: e.slug,
        avnode_email: e.email,
        boolean: 'true'
      };
      if (e.old_id) email.flxer_id = e.old_id;
      if (e.name) email.Name = e.name;
      if (e.surname) email.Surname = e.surname;
      if (e.stagename) email.Stagename = e.stagename;
      if (e.addresses && e.addresses[0] && e.addresses[0].locality) email.City = e.addresses[0].locality;
      if (e.addresses && e.addresses[0] && e.addresses[0].country) email.Country = e.addresses[0].country;
      if (e.addresses && e.addresses[0] && e.addresses[0].geometry && e.addresses[0].geometry.lat && e.addresses[0].geometry.lng) {
        email.LATITUDE = e.addresses[0].geometry.lat;
        email.LONGITUDE = e.addresses[0].geometry.lng;
      }

      e.emails.forEach(function(ee) {
        email.email = ee.email;
        let topics = [];

        for (const mailinglist in ee.mailinglists) if (ee.mailinglists[mailinglist]) topics.push(mailinglist);
        email.Topics = topics.join(',');
        mailinglists.push(email);
        conta++;

        if (conta === fatto) {
          res.render('adminpro/supertools/emails/showall', {
            title: 'Emails',
            
            currentUrl: req.originalUrl,
            skip: 0,
            data: mailinglists,
            script: false
          });
        }
      });
    });
  });
});

module.exports = router;