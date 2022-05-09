const dataprovider = {};

const config = require('getconfig');
const helper = require('./helper');
const helpers = require('../routes/admin/api/helpers');

const mongoose = require('mongoose');
const UserShow = mongoose.model('UserShow');
const Event = mongoose.model('Event');
const EventShow = mongoose.model('EventShow');
const Footage = mongoose.model('Footage');
// const Crew = mongoose.model('Crew');
const Performance = mongoose.model('Performance');
const Category = mongoose.model('Category');
const Playlist = mongoose.model('Playlist');
const Gallery = mongoose.model('Gallery');
const Video = mongoose.model('Video');
const News = mongoose.model('News');

const logger = require('./logger');

var countries = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'American Samoa',
  'Andorra',
  'Angola',
  'Anguilla',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Aruba',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'British Virgin Islands',
  'Brunei',
  'Bulgaria',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Cayman Islands',
  'Chile',
  'China',
  'Colombia',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Curaçao',
  'Cyprus',
  'Czechia',
  "Côte d'Ivoire",
  'Denmark',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Estonia',
  'Falkland Islands (Islas Malvinas)',
  'Fiji',
  'Finland',
  'France',
  'French Guiana',
  'French Polynesia',
  'Gabon',
  'Germany',
  'Ghana',
  'Greece',
  'Greenland',
  'Grenada',
  'Guam',
  'Guatemala',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jersey',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kosovo',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Malta',
  'Martinique',
  'Mauritius',
  'Mexico',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar (Burma)',
  'Namibia',
  'Nepal',
  'Netherlands',
  'New Caledonia',
  'New Zealand',
  'Nicaragua',
  'Nigeria',
  'Niue',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Puerto Rico',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Réunion',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Pierre and Miquelon',
  'Saint Vincent and the Grenadines',
  'San Marino',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'South Africa',
  'South Korea',
  'Spain',
  'Sri Lanka',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tanzania',
  'Thailand',
  'The Bahamas',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'U.S. Virgin Islands',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Zambia',
  'Zimbabwe'
];
/*
var countries_plugin = helpers.getCountries().map(item => {return item.label});
console.log(countries.sort().slice(0, 100))
console.log(countries.sort().slice(100, 200))
console.log(countries.sort().slice(200, 250))
console.log(countries.length)
for(var b=0;b<countries.length;b++){
  if (countries_plugin.indexOf(countries[b])===-1) {
    console.log(countries[b]);
  }
}
*/
dataprovider.fetchShow = (req, section, subsection, model, populate, select, output, cb) => {
  /* logger.debug("populate");
  logger.debug(populate);
  logger.debug("req.query");
  logger.debug(req.query);
  logger.debug("subsection");
  logger.debug(subsection);
  logger.debug("slug");
  logger.debug(req.params.slug);
  logger.debug("model");
  logger.debug(model); */
  if ((section=="performers" || section=="organizations") &&  subsection != "show") {
    if (req.query.crews) {
      select.crews = 1;
      model.
      findOne({slug: req.params.slug}).
      populate(populate).
      select(select).
      exec((err, data) => {
        var meandcrews = data.crews;
        meandcrews.push(data._id);
        let submodel = (subsection == "performances" ? Performance : EventShow);
        let query = populate.filter(pop => pop.path == subsection)[0].match;
        if (subsection == "partnerships") {
          query["partners.users"] = {$in: meandcrews};
        } else {
          query.users = {$in: meandcrews};
        }
        const newselect = populate.filter(pop => pop.path == subsection)[0].select;
        const newpopulate = populate.filter(pop => pop.path == subsection)[0].populate;
        const limit = populate.filter(pop => pop.path == subsection)[0].options.limit;
        const sort = populate.filter(pop => pop.path == subsection)[0].options.sort;
        //logger.debug("newselect");
        //logger.debug(newselect);
        //logger.debug(submodel);
        //logger.debug(sort);
        //const total = d && d[nolimit[0].path] && d[nolimit[0].path].length ? d[nolimit[0].path].length : 0;
        submodel.
        countDocuments(query, (err, d) => {
          submodel.
          find(query).
          populate(newpopulate).
          select(newselect).
          sort(sort).
          limit(limit).
          exec((err, sub) => {
            let datadata = JSON.parse(JSON.stringify(data));
            datadata[subsection] = sub;
            const total = d;
            cb(err, datadata, total);
          });
        });
      });
    } else {
      const nolimit = JSON.parse(JSON.stringify(populate));
      delete nolimit[0].options;
      if (req.query.limit) {
        for(let a=0; a<populate.length;a++) {
          if (populate[a].options && populate[a].options.limit) populate[a].options.limit = parseInt(req.query.limit);
        }
      }
      model.
      findOne({slug: req.params.slug}).
      lean({ virtuals: false }).
      // C populate({path: 'crews', select: 'stagename slug members', populate: { path: 'members', select: 'stagename slug'}}).
      populate(nolimit).
      select("_id").
      exec((err, d) => {
        logger.debug(d);
        const total = d && d[nolimit[0].path] && d[nolimit[0].path].length ? d[nolimit[0].path].length : 0;
        model.
        findOne({slug: req.params.slug}).
        // lean({ virtuals: true }).
        // C populate({path: 'crews', select: 'stagename slug members', populate: { path: 'members', select: 'stagename slug'}}).
        populate(populate).
        select(select).
        exec((err, data) => {
          /* const res = Object.assign(select, data);
          //logger.debug(select);
          //logger.debug(Object.keys(res));
          cb(err, res, total); */
          //logger.debug("res.partnershipaaaaaaab");
          if(data && data.partnerships && data.partnerships_ordered) {
            delete data.partnerships;
            //logger.debug(data.partnerships);
          }
          cb(err, data, total);
        });
      });
    }
  } else {
    if (subsection === "program") {
      if (req.params.performance) {
        for(let a=0; a<populate.length;a++) {
          if (populate[a].path==="program.performance") {
            //populate[a].match = { "slug": req.params.performance};
            populate[a].select.abouts = 1;
            populate[a].select.bookings = 1;
            populate[a].populate.push({
              "path": "bookings.event",
              "select": {
                "title": 1,
                "image": 1,
                "schedule": 1,
                "slug": 1
              },
              "model": "EventShow"
            });
            populate[a].populate.push({
              "path": "users",
              "select": {
                "stagename": 1,
                "image": 1,
                "slug": 1,
                "abouts": 1,
                "addresses": 1,
                "web": 1,
                "social": 1
              },
              "model": "UserShow"
            });
            populate[a].populate.push({
              "path": "galleries",
              "match": { "is_public": true},
              "select": {
                "title": 1,
                "stats": 1,
                "image": 1,
                "slug": 1
              },
              "model": "Gallery"
            });
            populate[a].populate.push({
              "path": "videos",
              "match": { "is_public": true},
              "select": {
                "title": 1,
                "stats": 1,
                "media": 1,
                "slug": 1
              },
              "model": "Video"
            });
          }
        }
      }
      if (req.params.day) {
        /*
        const date = new Date(req.params.day);
        //logger.debug(date);
        select['program.schedule.date.$'] = date;
        populate.push({
          "path": "program.schedule",
          "match": {day: req.params.day}
        }); */
      }
    }
    if (subsection === "performers") {
      if (req.params.performer) {
        for(let a=0; a<populate.length;a++) {
          if (populate[a].path==="program.performance") {
            for(let b=0; b<populate[a].populate.length;b++) {
              if (populate[a].populate[b].path==="users") {
                //populate[a].match = { "users": req.params.performer};
                populate[a].populate[b].select.abouts = 1;
                populate[a].populate[b].populate = [{
                  "path": "performances",
                  //"match": {"bookings.event.slug": "fotonica-2018"},
                  "select": {
                    "title": 1,
                    "image": 1,
                    "type": 1,
                    "bookings": 1,
                    "slug": 1
                  },
                  "model": "Performance",
                  "populate": [{
                    "path": "bookings.event",
                    "match": {"slug": req.params.slug},
                    "select": {
                      "title": 1,
                      "image": 1,
                      "slug": 1
                    },
                    "model": "EventShow"
                  }]
                }];
              }
            }
          }
        }
      }
    }
    if (section === "performances") {
      if (req.params.gallery || req.params.video) {
        for(let a=0; a<populate.length;a++) {
          if (populate[a].path==="galleries") {

            populate[a].select.medias = 1;
            populate[a].match = { "slug": req.params.gallery};           
            populate[a].populate = [{
              "path": "users",
              "select": {
                "slug": 1,
                "image": 1,
                "organizationData.logo": 1,
                "members": 1,
                "addresses.country": 1,
                "addresses.locality": 1,
                "stats": 1,
                "stagename": 1
              },
              "model": "UserShow"
            },{
              "path": "performances",
              "match": { "is_public": true},
              "select": {
                "title": 1,
                "slug": 1,
                "categories": 1,
                "stats": 1,
                "image": 1
              },
              "model": "Performance"
            },{
              "path": "events",
              "match": { "is_public": true},
              "select": {
                "title": 1,
                "slug": 1,
                "categories": 1,
                "stats": 1,
                "image": 1
              },
              "model": "Event"
            }];
          }
          if (populate[a].path==="videos") {

            populate[a].match = { "slug": req.params.video};           
            populate[a].populate = [{
              "path": "users",
              "select": {
                "slug": 1,
                "image": 1,
                "organizationData.logo": 1,
                "members": 1,
                "addresses.country": 1,
                "addresses.locality": 1,
                "stats": 1,
                "stagename": 1
              },
              "model": "UserShow"
            },{
              "path": "performances",
              "match": { "is_public": true},
              "select": {
                "title": 1,
                "slug": 1,
                "categories": 1,
                "stats": 1,
                "image": 1
              },
              "model": "Performance"
            },{
              "path": "events",
              "match": { "is_public": true},
              "select": {
                "title": 1,
                "slug": 1,
                "categories": 1,
                "stats": 1,
                "image": 1
              },
              "model": "Event"
            }];
          }
        }
      }
    }
    logger.debug("BINGOOOOO");
    logger.debug(select);
    logger.debug({slug: req.params.sub ? req.params.sub : req.params.slug});
    logger.debug("model");
    logger.debug(model);
    model.
    findOne({slug: req.params.sub ? req.params.sub : req.params.slug, is_public: 1}).
    // lean({ virtuals: true }).
    // C populate({path: 'crews', select: 'stagename slug members', populate: { path: 'members', select: 'stagename slug'}}).
    populate(populate).
    select(select).
    exec((err, ddd) => {
      logger.debug(err);
      let data;
      if (ddd) data = JSON.parse(JSON.stringify(ddd));
      let res = {};
      if (data && data.organizationsettings && data.organizationsettings.call && data.organizationsettings.call.calls && data.organizationsettings.call.calls.length) {
        data.participate = true;
      }
      if (output && data) {
        for(var item in output) {
          if (data[item]) {
            if (output[item] === 1) {
              res[item] = data[item];
            } else {
              for(var item2 in output[item]) {
                if (!res[item]) res[item] = {};
                if (data[item][item2]) {
                  res[item][item2] = data[item][item2];
                }
              }
            }
          }
        }
      } else {
        res = data;
      }
      if (res && res.advanced && res.advanced.programmebydayvenue && req.params.day) {
        let programmebydayvenue = [];
        for(let a=0; a<res.advanced.programmebydayvenue.length;a++) {
          if (res.advanced.programmebydayvenue[a].day===req.params.day) {
            programmebydayvenue.push(res.advanced.programmebydayvenue[a]);
          }
        }
        res.advanced.programmebydayvenue = programmebydayvenue;
        res.advanced.programmenotscheduled = undefined;
      }

      if (res && res.advanced && res.advanced.programmebydayvenue && req.params.type) {
        for(let a=0; a<res.advanced.programmebydayvenue.length;a++) {
          for(let b=0; b<res.advanced.programmebydayvenue[a].rooms.length;b++) {
            let performances = [];
            for(let c=0; c<res.advanced.programmebydayvenue[a].rooms[b].performances.length;c++) {
              if (res.advanced.programmebydayvenue[a].rooms[b].performances[c].performance.type && res.advanced.programmebydayvenue[a].rooms[b].performances[c].performance.type.slug===req.params.type) {
                performances.push(res.advanced.programmebydayvenue[a].rooms[b].performances[c]);
              }
            }
            res.advanced.programmebydayvenue[a].rooms[b].performances = performances;
          }
        }
        let a=0;
        while(a<res.advanced.programmebydayvenue.length) {
          let b=0;
          while(b<res.advanced.programmebydayvenue[a].rooms.length) {
            if (!res.advanced.programmebydayvenue[a].rooms[b].performances.length) {
              res.advanced.programmebydayvenue[a].rooms.splice(b, 1);
            } else {
              b++;
            }
          }
          if (!res.advanced.programmebydayvenue[a].rooms.length) {
            res.advanced.programmebydayvenue.splice(a, 1);
          } else {
            a++;
          }
        }
        res.advanced.programmenotscheduled = undefined;
      }

      if (res && res.advanced && res.advanced.programmebydayvenue && req.params.performance) {
        for(let a=0; a<res.advanced.programmebydayvenue.length;a++) {
          for(let b=0; b<res.advanced.programmebydayvenue[a].rooms.length;b++) {
            for(let c=0; c<res.advanced.programmebydayvenue[a].rooms[b].performances.length;c++) {
              if (res.advanced.programmebydayvenue[a].rooms[b].performances[c].performance.slug===req.params.performance) {
                res.performance = res.advanced.programmebydayvenue[a].rooms[b].performances[c].performance;
              }
            }
          }
        }
        if (res.performance && res.performance.bookings && res.performance.bookings.length) {
          let a=0;
          while(a<res.performance.bookings.length) {
            /* let b=0;
            while(b<res.performer.performances[a].bookings.length) {
              if (!res.performer.performances[a].bookings[b].event) {
                res.performer.performances[a].bookings.splice(b, 1);
              } else {
                b++;
              }
            } */
            if (!res.performance.bookings[a].event || res.performance.bookings[a].event.slug!=req.params.slug) {
              res.performance.bookings.splice(a, 1);
            } else {
              a++;
            }
          }
        }
        delete res.advanced.programmebydayvenue;
        res.advanced.programmenotscheduled = undefined;
      }
      if (res && res.advanced && res.advanced.performers && res.advanced.performers.performers && req.params.performer) {
        //logger.debug("BINGOOOOO");
        for(let a=0; a<res.advanced.performers.performers.length;a++) {
          if (res.advanced.performers.performers[a].slug===req.params.performer) {
            res.performer = res.advanced.performers.performers[a];
          }
        }
        //logger.debug(res.performer);
        if (res.performer) {
          //console.log("res.performer.performances")
          //console.log(res.performer.performances)
          res.performer.performances = []
          //console.log(res.advanced.programmebydayvenue)
          /*
          let a=0;
          while(a<res.performer.performances.length) {
            let b=0;
            while(b<res.performer.performances[a].bookings.length) {
              if (!res.performer.performances[a].bookings[b].event) { ///.slug != req.params.slug
                res.performer.performances[a].bookings.splice(b, 1);
              } else {
                b++;
              }
            }
            if (!res.performer.performances[a].bookings.length) {
              res.performer.performances.splice(a, 1);
            } else {
              a++;
            }
          } */
        }
        delete res.advanced.performers;
      }
      //logger.debug("res.partnershipaaaaaaa");
      if(res && res.partnerships && res.partnerships_ordered) {
        delete res.partnerships;
        //logger.debug(res.partnerships);
      }
      //logger.debug("fetchShow END");
      cb(err, res);
      //cb(err, data);
    });
  }

};

dataprovider.getPerformanceByIds = (req, ids, cb) => {
  Performance.find({'users':{$in: ids}}).
  populate({path: 'type', select: 'name'}).
  populate({path: 'users', select: 'stagename slug members', populate: { path: 'members', select: 'stagename slug'}}).
  select({ title: 1, categories: 1 }).
  exec((err, data) => {
    //for (var item in data) //logger.debug(data[item].users);  
    cb(err, data);
  });
};

/* dataprovider.getEmailById = (id, cb) => {
  UserShow.findOne({'_id':id}, "email",(err, data) => {
    //logger.debug("getEmailById");  
    //logger.debug(data);  
    cb(err, data);
  });
}; */

dataprovider.getJsonld = (data, req, title, section, subsection, type) => {
  let jsonld = {
    "@context": "http://schema.org",
  }
  if (data && data.stagename) {
    if (subsection != "show") {
      jsonld["@type"] = "ItemList";
      jsonld.itemListElement = [];
      jsonld.name = data.stagename+" "+__(config.sections[section][subsection].title);
      jsonld.image = data.imageFormats.large;
      jsonld.description = __("The list of "+config.sections[section][subsection].title+" by")+" "+data.stagename;
      jsonld.itemListElement = [];
      for(let a=0;a<data.length;a++) {
        if (data[a].stagename) {
          if (data[a].stats.members) {
            jsonld.itemListElement.push({
              '@type': 'ListItem',
              "position": a+1,
              "url": (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl+data[a].slug
            });
    
          } else {
            jsonld.itemListElement.push({
              '@type': 'ListItem',
              "position": a+1,
              "url": (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl+data[a].slug
            });
          }
    
        } else {
          jsonld.itemListElement.push({
            '@type': 'ListItem',
            "position": a+1,
            "url": (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl+data[a].slug
            /* "item": {
              '@type': 'CreativeWork',
              "name": data[a].title,
              "url": (req.get('host') === "localhost:8006" ? "http" : "https") + '://' + req.get('host') + req.originalUrl+data[a].slug
            } */
          });
        }
      }
      /* jsonld.name = data.title;
      jsonld.description = data.description;
      jsonld.image = data.imageFormats.large; */
    } else {
      if (data.is_crew) {
        jsonld["@type"] = "PerformingGroup";
        if (data.members && data.members.length) {
          jsonld.member = [];
          for(let a=0;a<data.members.length;a++) {
            jsonld.member.push({
              '@type': 'OrganizationRole', 
              "member": {
                "@type": "Person",
                "name": data.members[a].stagename
              }
            });
          }
        }
      } else {
        jsonld["@type"] = "Person";
      }
      jsonld.name = data.stagename;
      jsonld.description = data.description;
      jsonld.image = data.imageFormats.large;
      if ((data.web && data.web.length) || (data.social && data.social.length)) {
        jsonld.sameAs = [];
        if (data.web) for(let a=0;a<data.web.length;a++) jsonld.sameAs.push(data.web[a].url);
        if (data.social) for(let a=0;a<data.social.length;a++) jsonld.sameAs.push(data.social[a].url);
      }
      if (data.addresses.length && data.addresses[0]) {
        jsonld.address = {
          "@type": "PostalAddress",
          "addressLocality": data.addresses[0].locality,
          "addressCountry": data.addresses[0].country
        }  
      }
    }
  } else if (data && data.title) {
    logger.debug("subsection");
    logger.debug(subsection);
    if (subsection != "show" && !data.performer && !data.performance) {
      jsonld["@type"] = "ItemList";
      jsonld.itemListElement = [];
      jsonld.name = data.title+" "+__(config.sections[section][subsection].title);
      if (type) jsonld.name+= ": "+type.name;
      if (req.params.day) jsonld.name+= ": "+req.params.day;
      jsonld.image = data.imageFormats.large;
      if (data.event) {
        jsonld.description = data.event.description;
      } else if (data.performance) {
        jsonld.description = data.performance.description;
      } else {
        jsonld.description = __("The "+config.sections[section][subsection].title+" of")+" "+(type ? type.name+" "+__("of")+" " : req.params.day ? req.params.day+" "+__("of")+" " : "") + data.title;
      }
      jsonld.itemListElement = [];
      for(let a=0;a<data.length;a++) {
        if (data[a].stagename) {
          if (data[a].stats.members) {
            jsonld.itemListElement.push({
              '@type': 'ListItem',
              "position": a+1,
              "url": (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl+data[a].slug
            });
    
          } else {
            jsonld.itemListElement.push({
              '@type': 'ListItem',
              "position": a+1,
              "url": (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl+data[a].slug
            });
          }
    
        } else {
          jsonld.itemListElement.push({
            '@type': 'ListItem',
            "position": a+1,
            "url": (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl+data[a].slug
            /* "item": {
              '@type': 'CreativeWork',
              "name": data[a].title,
              "url": (req.get('host') === "localhost:8006" ? "http" : "https") + '://' + req.get('host') + req.originalUrl+data[a].slug
            } */
          });
        }
      }
      /* jsonld.name = data.title;
      jsonld.description = data.description;
      jsonld.image = data.imageFormats.large; */
    } else if (subsection == "performers" && data.performer) {
      if (data.performer.is_crew) {
        jsonld["@type"] = "PerformingGroup";
        if (data.performer.members && data.performer.members.length) {
          jsonld.member = [];
          for(let a=0;a<data.performer.members.length;a++) {
            jsonld.member.push({
              '@type': 'OrganizationRole', 
              "member": {
                "@type": "Person",
                "name": data.performer.members[a].stagename
              }
            });
          }
        }
      } else {
        jsonld["@type"] = "Person";
      }
      jsonld.name = data.performer.stagename;
      jsonld.description = data.performer.description;
      jsonld.image = data.performer.imageFormats.large;
      if ((data.performer.web && data.performer.web.length) || (data.performer.social && data.performer.social.length)) {
        jsonld.sameAs = [];
        if (data.performer.web) for(let a=0;a<data.performer.web.length;a++) jsonld.sameAs.push(data.performer.web[a].url);
        if (data.performer.social) for(let a=0;a<data.performer.social.length;a++) jsonld.sameAs.push(data.performer.social[a].url);
      }
      if (data.performer.addresses && data.performer.addresses.length) {
        logger.debug(data.addresses);
        jsonld.address = {
          "@type": "PostalAddress",
          "addressLocality": data.performer.addresses[0].locality,
          "addressCountry": data.performer.addresses[0].country/* .join(", ").trim().split(",")[0].replace(" ", ", ").replace("<b>", "").replace("</b>", "") */
        }  
      }
    } else if (subsection == "program" && data.performance) {
      if (data.performance.bookings && data.performance.bookings.length) {
        for(let a=0;a<data.performance.bookings.length;a++) {
          //logger.debug(data.performance.bookings[a]);
          if(data.performance.bookings[a].event._id.toString()==data._id.toString()) {
            jsonld.startDate = data.performance.bookings[a].schedule[0].starttime;
            jsonld.location = {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": data.performance.bookings[a].schedule[0].venue.location.locality,
                "addressCountry": data.performance.bookings[a].schedule[0].venue.location.country
              },
              "name": data.performance.bookings[a].schedule[0].venue.name
            };    
          }
        }
      }
      jsonld["@type"] = "CreativeWork";
      jsonld.author = [];
      if (data.performance.users) {
        for(let a=0;a<data.performance.users.length;a++) {
          if (data.performance.users[a].members && data.performance.users[a].members.length) {
            jsonld.author.push({
              '@type': 'OrganizationRole',
              "name": data.performance.users[a].stagename
            });
    
          } else {
            jsonld.author.push({
              '@type': 'Person',
              "name": data.performance.users[a].stagename
            });
          }
        }  
      }
      jsonld.name = data.title+" "+__("Program")+": "+data.performance.title;
      jsonld.description = data.performance.description;
      jsonld.image = data.performance.imageFormats.large;
      if ((data.performance.web && data.performance.web.length) || (data.performance.social && data.performance.social.length)) {
        jsonld.sameAs = [];
        if (data.performance.web) for(let a=0;a<data.performance.web.length;a++) jsonld.sameAs.push(data.performance.web[a].url);
        if (data.performance.social) for(let a=0;a<data.performance.social.length;a++) jsonld.sameAs.push(data.performance.social[a].url);
      }
      if (data.performance.media && data.performance.media.file && data.performance.media.width && data.performance.media.height) {
        jsonld.video = "https://"+req.headers.host+data.performance.media.file;
        jsonld.video_width = data.performance.media.width;
        jsonld.video_height = data.performance.media.height;
      }

    } else {
      if (data.schedule && data.schedule.length && data.schedule[0].venue && data.schedule[0].venue.location) {
        jsonld["@type"] = "Event";
        jsonld.startDate = data.schedule[0].starttime;
        if (data.schedule[0].venue.type == 'virtual') {
          jsonld.location = {
            "@type": "VirtualLocation",
            "url": data.schedule[0].venue.url
          }
        } else {
          jsonld.location = {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": data.schedule[0].venue.location.locality,
              "addressCountry": data.schedule[0].venue.location.country
            },
            "name": data.schedule[0].venue.name
          };  
        }
      } else {
        jsonld["@type"] = "CreativeWork";
        jsonld.author = [];
        if (data.users) {
          for(let a=0;a<data.users.length;a++) {
            if (data.users[a].members && data.users[a].members.length) {
              jsonld.author.push({
                '@type': 'OrganizationRole',
                "name": data.users[a].stagename
              });
      
            } else {
              jsonld.author.push({
                '@type': 'Person',
                "name": data.users[a].stagename
              });
            }
          }  
        }
      }
      jsonld.name = data.title;
      jsonld.description = data.description;
      jsonld.image = data.imageFormats.large;
      if ((data.web && data.web.length) || (data.social && data.social.length)) {
        jsonld.sameAs = [];
        if (data.web) for(let a=0;a<data.web.length;a++) jsonld.sameAs.push(data.web[a].url);
        if (data.social) for(let a=0;a<data.social.length;a++) jsonld.sameAs.push(data.social[a].url);
      }
      if (data.media && data.media.file && data.media.width && data.media.height) {
        jsonld.video = "https://"+req.headers.host+data.media.file;
        jsonld.video_width = data.media.width;
        jsonld.video_height = data.media.height;
      }
    }
  } else if (data && data.length) {
    jsonld["@type"] = "ItemList";
    jsonld.itemListElement = [];
    jsonld.name = title;
    jsonld.image = "/images/sez/avnode.net-"+section+".jpg";
    jsonld.description = __("The list of "+jsonld.name);
    jsonld.itemListElement = [];
    for(let a=0;a<data.length;a++) {
      if (data[a].stagename) {
        if (data[a].stats.members) {
          jsonld.itemListElement.push({
            '@type': 'ListItem',
            "position": a+1,
            "url": (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl+data[a].slug
          });
  
        } else {
          jsonld.itemListElement.push({
            '@type': 'ListItem',
            "position": a+1,
            "url": (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl+data[a].slug
          });
        }
  
      } else {
        jsonld.itemListElement.push({
          '@type': 'ListItem',
          "position": a+1,
          "url": (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl+data[a].slug
          /* "item": {
            '@type': 'CreativeWork',
            "name": data[a].title,
            "url": (req.get('host') === "localhost:8006" ? "http" : "https") + '://' + req.get('host') + req.originalUrl+data[a].slug
          } */
        });
      }
    }
    /* jsonld.name = data.title;
    jsonld.description = data.description;
    jsonld.image = data.imageFormats.large; */
  }

  logger.debug(jsonld);
  return jsonld;
};

dataprovider.fetchRandomPerformance = (model, query, select, populate, limit, skip, sorting, cb) => {
  query.is_public = true;
  Performance.countDocuments(query, function(error, total) {
    var random = Math.floor(Math.random() * total)
    Performance.find(query)
    .skip(random)
    .populate(populate)
    .limit(1)
    .select(select)
    .exec(function(err, data) {
      cb(err, data, total);
    });
  });
};

dataprovider.fetchLists = (model, query, select, populate, limit, skip, sorting, cb) => {
  query.is_public = true;
  /* 
  logger.debug("BINGOOOOO");
  logger.debug(query);
  logger.debug(select);
  logger.debug(sorting);
  */
  model.countDocuments(query, function(error, total) {
    model.find(query)
    .populate(populate)
    .select(select)
    .limit(limit)
    .skip(skip)
    .sort(sorting)
    /*.select(config.sections[section].list_fields)*/
    .exec(function(err, data) {
      cb(err, data, total);
    });
  });
};

dataprovider.makeTextPlainToRich = (str) => {
  str=str.replace('"','&quot;');
  str=str.replace("###b###","<b>");
  str=str.replace("###/b###","</b>");
  str=str.replace('((mailto:|(news|(ht|f)tp(s?))://){1}\S+)','<a href="\0" target="_blank">\0</a>');
  str=str.replace(">mailto:", ">", str);
  //str = preg_replace('/((http(s)?:\/\/)|(www\\.))((\w|\.)+)(\/)?(\S+)?/i','<a href="\0" target="_blank">\0</a>', str);
  str=str.replace("\r\n","<br />");
  str=str.replace("\n","<br />");
  //str=$this->eraseTripleBr(str);
  //str=htmlspecialchars(str);
  //str=htmlentities(str);
  return str;	
}

dataprovider.addCat = (req, populate, cb) => {
  if (req.params.type) {
    Category.
    findOne({slug: req.params.type}).
    exec((err, cat) => {
      if (cat && populate[0].match) populate[0].match.type = cat._id;
      cb(populate, cat)
    });
  } else {
    cb(populate)
  }
}

dataprovider.show = (req, res, section, subsection, model) => {
  //logger.debug(section);
  //logger.debug(subsection);
  //logger.debug(config.sections[section]);
  let populate = JSON.parse(JSON.stringify(config.sections[section][subsection].populate));
  //logger.debug("populate PRE");
  //logger.debug(populate);
  dataprovider.addCat(req, populate, (populate, type) => {
    for(let item in populate) {
      if (req.params.page && populate[item].options && populate[item].options.limit) populate[item].options.skip = populate[item].options.limit*(req.params.page-1);
      
      if (populate[item].model === 'UserShow') populate[item].model = UserShow;
      if (populate[item].model === 'Performance') populate[item].model = Performance;
      if (populate[item].model === 'Event') populate[item].model = Event;
      if (populate[item].model === 'Video') populate[item].model = Video;
      if (populate[item].model === 'Footage') populate[item].model = Footage;
      if (populate[item].model === 'Playlist') populate[item].model = Playlist;
      if (populate[item].model === 'Category') populate[item].model = Category;
      if (populate[item].model === 'News') populate[item].model = News;
  
      if (populate[item].populate && populate[item].populate.model === 'UserShow') populate[item].populate.model = UserShow;
      if (populate[item].populate && populate[item].populate.model === 'Performance') populate[item].populate.model = Performance;
      if (populate[item].populate && populate[item].populate.model === 'Event') populate[item].populate.model = Event;
      if (populate[item].populate && populate[item].populate.model === 'Video') populate[item].populate.model = Video;
      if (populate[item].populate && populate[item].populate.model === 'Footage') populate[item].populate.model = Footage;
      if (populate[item].populate && populate[item].populate.model === 'Playlist') populate[item].populate.model = Playlist;
      if (populate[item].populate && populate[item].populate.model === 'Category') populate[item].populate.model = Category;
      if (populate[item].populate && populate[item].populate.model === 'News') populate[item].populate.model = News;
      if (populate[item].populate) {
        for(let a=0;a<populate[item].populate.length;a++) {
          if (populate[item].populate[a] && populate[item].populate[a].model === 'UserShow') populate[item].populate[a].model = UserShow;
          if (populate[item].populate[a] && populate[item].populate[a].model === 'Performance') populate[item].populate[a].model = Performance;
          if (populate[item].populate[a] && populate[item].populate[a].model === 'Event') populate[item].populate[a].model = Event;
          if (populate[item].populate[a] && populate[item].populate[a].model === 'Video') populate[item].populate[a].model = Video;
          if (populate[item].populate[a] && populate[item].populate[a].model === 'Footage') populate[item].populate[a].model = Footage;
          if (populate[item].populate[a] && populate[item].populate[a].model === 'Playlist') populate[item].populate[a].model = Playlist;
          if (populate[item].populate[a] && populate[item].populate[a].model === 'Category') populate[item].populate[a].model = Category;
          if (populate[item].populate[a] && populate[item].populate[a].model === 'News') populate[item].populate[a].model = News;
        }
      }
    }
    //logger.debug("populate AFTER");
    //logger.debug(populate[0].match);
    const select = config.sections[section][subsection].select;
    const output = config.sections[section][subsection].output ? config.sections[section][subsection].output : false;

    dataprovider.fetchShow(req, section, subsection, model, populate, select, output, (err, data, total) => {
      //logger.debug("fetchShow END");
      //logger.debug(data);
      if (err || !data || data === null) {
        res.status(404).render('404', {path: req.originalUrl, title:__("404: Page not found"), titleicon:"icon-warning"});
      } else {
        // MAP
        if (data && data.schedule && data.schedule.length && data.schedule[0].venue && data.schedule[0].venue.location) {
          const locations = data.schedule.map(obj =>{
            if (obj.venue.location.geometry && obj.venue.location.geometry.lat && obj.venue.location.geometry.lng) {
              var rObj = {
                "marker":{
                  "url":"/images/icon_marker.svg",
                  "scaledSize":{"width":46,"height":78,"f":"px","b":"px"},
                  "origin":{"x":0,"y":0},
                  "anchor":{"x":23,"y":78}
                }
              };
              rObj.lat = obj.venue.location.geometry.lat;
              rObj.lng = obj.venue.location.geometry.lng;
              return rObj;
            }
          });
          if (locations && locations.length) {
            data.locations = [];
            for (let item in locations) {
              if (locations[item]) data.locations.push(locations[item]);
            }
          }
          //logger.debug("locations");
          //logger.debug(locations);
          //data.schedule = undefined;
        }
        if (data && data.addresses && data.addresses.length) {
          const locations = data.addresses.map(obj =>{
            if (obj && obj.geometry && obj.geometry.lat && obj.geometry.lng) {
              var rObj = {
                "marker":{
                  "url":"/images/icon_marker.svg",
                  "scaledSize":{"width":46,"height":78,"f":"px","b":"px"},
                  "origin":{"x":0,"y":0},
                  "anchor":{"x":23,"y":78}
                }
              };
              rObj.lat = obj.geometry.lat;
              rObj.lng = obj.geometry.lng;
              return rObj;
            }
          });
          if (locations && locations.length) {
            data.locations = [];
            for (let item in locations) {
              if (locations[item]) data.locations.push(locations[item]);
            }
          }
        }
        // MAP END

        if (data && data.medias && req.params.img) {
          for (let item in data.medias) {
            if (data.medias[item].slug===req.params.img) {
              if (!req.session[data._id+"#IMG:"+data.medias[item].slug]) {
                req.session[data._id+"#IMG:"+data.medias[item].slug] = true;
                if (!data.medias[item].stats) data.medias[item].stats = {}
                data.medias[item].stats.visits = data.medias[item].stats.visits ? data.medias[item].stats.visits+1 : 1;
                model.updateOne({_id:data._id},{"medias":data.medias}, (err, raw) => {
                });
              }
              data.img = data.medias[item];
              data.img.index = item;
            }
          }
          for (let item in data.medias2) {
            if (data.medias2[item].slug===req.params.img) {
              data.img.imageFormats = data.medias2[item].imageFormats;
            }
          }
          if (!req.user || !req.user.likes || !req.user.likes[section] || req.user.likes[section].map(function(e) { return e.id.toString(); }).indexOf((data._id+"#IMG:"+data.img.slug).toString())===-1) {
            data.liked = false;
          } else {
            data.liked = true;
          }
        } else if (data && data.galleries && data.galleries[0] && data.galleries[0].medias && req.params.img) {
          for (let item in data.galleries[0].medias) {
            if (data.galleries[0].medias[item].slug===req.params.img) {
              if (!req.session[data.galleries[0]._id+"#IMG:"+data.galleries[0].medias[item].slug]) {
                req.session[data.galleries[0]._id+"#IMG:"+data.galleries[0].medias[item].slug] = true;
                if (!data.galleries[0].medias[item].stats) data.galleries[0].medias[item].stats = {}
                data.galleries[0].medias[item].stats.visits = data.galleries[0].medias[item].stats.visits ? data.galleries[0].medias[item].stats.visits+1 : 1;
                model.updateOne({_id:data.galleries[0]._id},{"medias":data.galleries[0].medias}, (err, raw) => {
                });
              }
              data.galleries[0].img = data.galleries[0].medias[item];
              data.galleries[0].img.index = item;
            }
          }
          for (let item in data.galleries[0].medias2) {
            if (data.galleries[0].medias2[item].slug===req.params.img) {
              data.galleries[0].img.imageFormats = data.galleries[0].medias2[item].imageFormats;
            }
          }
          if (!req.user || !req.user.likes || !req.user.likes[section] || req.user.likes[section].map(function(e) { return e.id.toString(); }).indexOf((data._id+"#IMG:"+req.params.img).toString())===-1) {
            data.liked = false;
          } else {
            data.liked = true;
          }
        } else {
          if (!req.session[data._id]) {
            req.session[data._id] = true;
            if (!data.stats) data.stats = {};
            data.stats.visits = data.stats.visits ? data.stats.visits+1 : 1;
            model.updateOne({_id:data._id},{"stats.visits":data.stats.visits}, (err, raw) => {
            });
          }  
          if (!req.user || !req.user.likes || !req.user.likes[section] || req.user.likes[section].map(function(e) { return e.id.toString(); }).indexOf(data._id.toString())===-1) {
            data.liked = false;
          } else {
            data.liked = true;
          }
        }
        data.pages = [];
        if (total>0) {
          let limit = req.query.limit ? parseInt(req.query.limit) : config.sections[section].limit;
          let link = '/' + data.slug + '/' + subsection + '/page/';
          let page = (req.params.page ? parseFloat(req.params.page) : 1);
          skip = (page - 1) * limit;
          data.pages = helper.getPagination(link, skip, limit, total, "/"); 
        }
        /* let editable = false;
        if (req.user && req.user._id) {
          if (req.user.is_admin) {
            editable = true;
          } else if (data.users) {
            for(let a=0;a<data.users.length;a++) if (data.users[a]._id.toString() === req.user._id.toString() || req.user.crews.indexOf(data.users[a]._id.toString())!==-1) editable = true;
          } else if (data._id.toString() === req.user._id.toString()) {
            editable = true;
          }
        } */
        if (req.query.api || req.headers.host.split('.')[0] === 'api' || req.headers.host.split('.')[1] === 'api') {
          //logger.debug("fetchShow END");
          res.json(data);
          /* if (process.env.DEBUG) {
            res.render('json', {data: data});
          } else {
            res.json(data);
          } */
          //res.send(JSON.stringify(data, null, '\t'));
        } else if (req.query.xml) {
          res.render(section + '/fpData', {
            title: data.stagename,
            data: data,
            nextpage: req.params.page ? parseFloat(req.params.page)+1 : 2
          });
        } else {
          let title = (data.stagename ? data.stagename : data.title)
          title+= (config.sections[section] && subsection!="show" && config.sections[section][subsection] ? " "+__(config.sections[section][subsection].title) : "");
          if (type) title+= ": "+type.name;
          if (req.params.day) title+= ": "+req.params.day;
          if (data.performance) title+= ": "+data.performance.title;

          if (req.query.oembed) {
            res.render(section + '/oembed', {
              title: title,
              jsonld:dataprovider.getJsonld(data, req, data.stagename ? data.stagename : data.title, section, subsection, type),
              canonical: (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl.split("?")[0],
              data: data,
              section: section,
            });
          } else {
            var scripts = [];
            if (data && data.media && data.media.file) scripts.push("video");
            if (data && data.videos && data.videos && data.videos.length && data.videos[0].media) scripts.push("video");
            res.render(section + '/' + subsection, {
              title: title,
              jsonld:dataprovider.getJsonld(data, req, data.stagename ? data.stagename : data.title, section, subsection, type),
              canonical: (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl.split("?")[0],
              editable: helpers.editable(req, data, data._id),
              get: req.query,
              data: data,
              host: req.get('host'),
              scripts: scripts,
              type: type,
              pages: data.pages,
              section: section,
              path: req.originalUrl,
              nextpage: req.params.page ? parseFloat(req.params.page)+1 : 2
            });
          }
        }
      }
    });
  });
};

dataprovider.list = (req, res, section, model) => {

  if (!model) {
    res.status(404).render('404', {path: req.originalUrl, title:__("404: Page not found"), titleicon:"icon-warning"});
  } else {
    const page = req.params.page;
    const filter = req.params.filter;
    const sorting = req.params.sorting;
  
    let notfound = false;
  
    if (config.sections[section].categories.indexOf(filter) === -1) notfound = true;
    if (typeof config.sections[section].ordersQueries[sorting] === 'undefined') notfound = true;
    if (parseInt(page).toString()!=page.toString()) notfound = true;
  
    const skip = (page - 1) * config.sections[section].limit;
    const select = config.sections[section].list_fields;
    const populate = config.sections[section].list_populate;
  
    if (notfound) {
      res.status(404).render('404', {path: req.originalUrl, title:__("404: Page not found"), titleicon:"icon-warning"});
    } else {
      //const query = filter=='individuals' ? {is_crew: 0} : filter=='crews' ? {is_crew: 1} : {};
      const query = Object.assign({}, config.sections[section].categoriesQueries[filter]);
      if (req.query.country ) {
        query["addresses.country"] = new RegExp(req.query.country, "i");
      }
      dataprovider.fetchLists(model, query, select, populate, config.sections[section].limit, skip, config.sections[section].ordersQueries[sorting], (err, data, total) => {
        const title = config.sections[section].title + ': ' + config.sections[section].labels[filter] + ' ' + config.sections[section].labels[sorting];
        if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
          if (process.env.DEBUG) {
            res.render('json', {data: {total:total, skip:skip, data:data}});
          } else {
            res.json({total:total, skip:skip, data:data});
          }
        } else if (req.originalUrl.indexOf("-sitemap.xml")!==-1) {
          if (data.length) {
            /* var dates = data.map(item => {return item.updatedAt}).sort().reverse()[0];
            //logger.debug(dates);
            let lastmod = new Date();
            lastmod.setHours( lastmod.getHours() -2 );
            lastmod.setMinutes(0); */
            let lastmod = helper.dateoW3CString(data.map(item => {
              return item.updatedAt ? item.updatedAt : item.createdAt;
            }).sort().reverse()[0]);
            res.set('Content-Type', 'text/xml');
            res.render('sitemaps/list', {
              host: (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/+"://"+req.headers.host,
              data: data,
              lastmod: lastmod,
              basepath: config.sections[section].basepath,
              nextpage: req.params.page ? parseFloat(req.params.page)+1 : 2
            });
          } else {
            res.status(404).render('404', {path: req.originalUrl, title:__("404: Page not found"), titleicon:"icon-warning"});
          }
        } else {
          let info = ' From ' + skip + ' to ' + (skip + config.sections[section].limit) + ' on ' + total + ' ' + title;
          let link = '/' + section + '/' + filter + '/' + sorting + '/';
          let pages = helper.getPagination(link, skip, config.sections[section].limit, total, (req.query.country ? "?country="+req.query.country : ""));
          var scripts = [];
          if (data && data.media && data.media[0] && data.media[0].file) scripts.push("video");
          if (section === "videos") scripts.push("video");

          res.render(config.sections[section].view_list, {
            title: title,
            section: section,
            jsonld:dataprovider.getJsonld(data, req, title, section, null, null),
            canonical: (req.get('host') === "localhost:8006" ? "http" : "https") /*req.protocol*/ + '://' + req.get('host') + req.originalUrl.split("?")[0],
            sort: sorting,
            total: total,
            pages: pages,
            scripts: scripts,
            selected_country: req.query.country,
            countries: countries,
            filter: filter,
            categories: config.sections[section].categories,
            orderings: config.sections[section].orders,
            labels: config.sections[section].labels,
            data: data
          });
        }
      });
    }
  }

};

module.exports = dataprovider;
