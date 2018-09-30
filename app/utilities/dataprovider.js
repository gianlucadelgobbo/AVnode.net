const dataprovider = {};

const config = require('getconfig');
const helper = require('./helper');

const mongoose = require('mongoose');
const UserShow = mongoose.model('UserShow');
const Event = mongoose.model('Event');
const Footage = mongoose.model('Footage');
// const Crew = mongoose.model('Crew');
const Performance = mongoose.model('Performance');
const Category = mongoose.model('Category');
const Playlist = mongoose.model('Playlist');
const Video = mongoose.model('Video');
const News = mongoose.model('News');

const logger = require('./logger');

dataprovider.fetchShow = (req, model, populate, select, cb) => {
  model.
  findOne({slug: req.params.slug}).
  // lean({ virtuals: true }).
  // C populate({path: 'crews', select: 'stagename slug members', populate: { path: 'members', select: 'stagename slug'}}).
  populate(populate).
  select(select).
  exec((err, data) => {
    cb(err, data);
  });
};

dataprovider.getPerformanceByIds = (req, ids, cb) => {
  Performance.find({'users':{$in: ids}}).
  populate({path: 'categories', select: 'name'}).
  populate({path: 'users', select: 'stagename slug members', populate: { path: 'members', select: 'stagename slug'}}).
  select({ title: 1, categories: 1 }).
  exec((err, data) => {
    //for (var item in data) logger.debug(data[item].users);  
    cb(err, data);
  });
};

dataprovider.getJsonld = (data, req, title) => {
  let jsonld = {
    "@context": "http://schema.org",
  }
  if (data.stagename) {
    if (data.is_crew) {
      jsonld["@type"] = "PerformingGroup";
      if (data.members.length) {
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
    if (data.addressesFormatted) {
      jsonld.address = {
        "@type": "PostalAddress",
        "addressLocality": data.addressesFormatted.trim().split(",")[0].replace(" ", ", ").replace("<b>", "").replace("</b>", "")
      }  
    }
    /*
    if(data.crews && data.crews.length) {
      jsonld.crews = {};
      jsonld.crews["@type"] = "ItemList";
      jsonld.crews.itemListElement = [];
      jsonld.crews.name = "Crews";
      jsonld.crews.description = __("The list of Crews");
      jsonld.crews.itemListElement = [];
      for(let a=0;a<data.crews.length;a++) {
        if (data.crews[a].stats.members) {
          jsonld.crews.itemListElement.push({
            '@type': 'ListItem',
            "position": a+1,
            "url": req.protocol + '://' + req.get('host') + req.originalUrl+data.crews[a].slug
          });
  
        } else {
          jsonld.crews.itemListElement.push({
            '@type': 'ListItem',
            "position": a+1,
            "url": req.protocol + '://' + req.get('host') + req.originalUrl+data[item][a].slug
          });
        }
      }
    }
  
    for(let item in config.sections) {
      if(data[item] && data[item].length) {
        jsonld[item] = {};
        jsonld[item]["@type"] = "ItemList";
        jsonld[item].itemListElement = [];
        jsonld[item].name = config.sections[item].title;
        jsonld[item].description = __("The list of "+jsonld[item].name);
        for(let a=0;a<data[item].length;a++) {
          jsonld[item].itemListElement.push({
            '@type': 'ListItem',
            "position": a+1,
            "url": req.protocol + '://' + req.get('host') + req.originalUrl+item+"/"+data[item][a].slug
          });
        }
      }
    }
    */
  } else if (data.title) {
    if (data.schedule) {
      jsonld["@type"] = "Event";
      jsonld.startDate = data.schedule[0].starttime;
      jsonld.location = {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": data.schedule[0].venue.location.locality,
          "addressCountry": data.schedule[0].venue.location.country
        },
        "name": data.schedule[0].venue.name
      };
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
  } else if (data.length) {
    jsonld["@type"] = "ItemList";
    jsonld.itemListElement = [];
    jsonld.name = title;
    jsonld.description = __("The list of "+jsonld.name);
    jsonld.itemListElement = [];
    for(let a=0;a<data.length;a++) {
      if (data[a].stagename) {
        if (data[a].stats.members) {
          jsonld.itemListElement.push({
            '@type': 'ListItem',
            "position": a+1,
            "url": req.protocol + '://' + req.get('host') + req.originalUrl+data[a].slug
          });
  
        } else {
          jsonld.itemListElement.push({
            '@type': 'ListItem',
            "position": a+1,
            "url": req.protocol + '://' + req.get('host') + req.originalUrl+data[a].slug
          });
        }
  
      } else {
        jsonld.itemListElement.push({
          '@type': 'ListItem',
          "position": a+1,
          "url": req.protocol + '://' + req.get('host') + req.originalUrl+data[a].slug
          /* "item": {
            '@type': 'CreativeWork',
            "name": data[a].title,
            "url": req.protocol + '://' + req.get('host') + req.originalUrl+data[a].slug
          } */
        });
      }
    }
    /* jsonld.name = data.title;
    jsonld.description = data.description;
    jsonld.image = data.imageFormats.large; */
  }

  //logger.debug(jsonld);
  return jsonld;
};

dataprovider.fetchLists = (model, query, select, populate, limit, skip, sorting, cb) => {
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

dataprovider.show = (req, res, section, subsection, model) => {
  let populate = config.sections[section][subsection].populate;
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
  }
  const select = config.sections[section][subsection].select;

  dataprovider.fetchShow(req, model, populate, select, (err, data) => {
    if (err || data === null) {
      res.status(404).render('404', {title:"<span class=\"lnr lnr-warning\" style=\"font-size:  200%;vertical-align:  middle;padding-right: 20px;\"></span><span style=\"vertical-align:  middle;\">"+__("404: Page not found")+"</span>"});
    } else {
      if (req.query.api || req.headers.host.split('.')[0] === 'api' || req.headers.host.split('.')[1] === 'api') {
        if (process.env.DEBUG) {
          res.render('json', {data: data});
        } else {
          res.json(data);
        }
        //res.send(JSON.stringify(data, null, '\t'));
      } else if (req.query.xml) {
        res.render(section + '/fpData', {
          title: data.stagename,
          data: data,
          nextpage: req.params.page ? parseFloat(req.params.page)+1 : 2
        });
      } else {
        if (data.addresses) {
          const locations = data.addresses.map(obj =>{
            if (obj.geometry && obj.geometry.lat && obj.geometry.lng) {
              var rObj = {
                "marker":{
                  "url":"/images/avnode_marker.svg",
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
        if (req.params.img) {
          for (let item in data.medias) {
            if (data.medias[item].slug===req.params.img) {
              if (!req.session[data._id+"#IMG:"+data.medias[item].slug]) {
                req.session[data._id+"#IMG:"+data.medias[item].slug] = true;
                if (!data.medias[item].stats) data.medias[item].stats = {}
                data.medias[item].stats.visits = data.medias[item].stats.visits ? data.medias[item].stats.visits+1 : 1;
                model.update({_id:data._id},{"medias":data.medias}, (err, raw) => {
                  //if (err) c
                  //console.log('The raw response from Mongo was ', raw);
                });
              }
              data.img = data.medias[item];
              data.img.index = item;
            }
          }
          if (!req.user || !req.user.likes || !req.user.likes[section] || req.user.likes[section].map(function(e) { return e.id.toString(); }).indexOf((data._id+"#IMG:"+data.img.slug).toString())===-1) {
            data.liked = false;
          } else {
            data.liked = true;
          }
        } else {
          if (!req.session[data._id]) {
            req.session[data._id] = true;
            data.stats.visits = data.stats.visits ? data.stats.visits+1 : 1;
            model.update({_id:data._id},{"stats.visits":data.stats.visits}, (err, raw) => {
              //if (err) c
              //console.log('The raw response from Mongo was ', raw);
            });
          }  
          if (!req.user || !req.user.likes || !req.user.likes[section] || req.user.likes[section].map(function(e) { return e.id.toString(); }).indexOf(data._id.toString())===-1) {
            data.liked = false;
          } else {
            data.liked = true;
          }
        }
        logger.debug(req.user);
        res.render(section + '/' + subsection, {
          title: data.stagename ? data.stagename : data.title,
          jsonld:dataprovider.getJsonld(data, req, data.stagename ? data.stagename : data.title),
          canonical: req.protocol + '://' + req.get('host') + req.originalUrl.split("?")[0],
          data: data,
          section: section,
          path: req.originalUrl,
          nextpage: req.params.page ? parseFloat(req.params.page)+1 : 2
        });
      }
    }
  });
};

dataprovider.list = (req, res, section, model) => {

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
    res.status(404).render('404', {title:"<span class=\"lnr lnr-warning\" style=\"font-size:  200%;vertical-align:  middle;padding-right: 20px;\"></span><span style=\"vertical-align:  middle;\">"+__("404: Page not found")+"</span>"});
  } else {
    //const query = filter=='individuals' ? {is_crew: 0} : filter=='crews' ? {is_crew: 1} : {};
    const query = config.sections[section].categoriesQueries[filter];
    dataprovider.fetchLists(model, query, select, populate, config.sections[section].limit, skip, config.sections[section].ordersQueries[sorting], (err, data, total) => {
      console.log(req.originalUrl);
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        if (process.env.DEBUG) {
          res.render('json', {total:total, skip:skip, data:data});
        } else {
          res.json({total:total, skip:skip, data:data});
        }
      } else if (req.originalUrl.indexOf("-sitemap.xml")!==-1) {
        let lastmod = new Date();
        lastmod.setHours( lastmod.getHours() -2 );
        lastmod.setMinutes(0);
        lastmod = helper.dateoW3CString(lastmod);
        res.set('Content-Type', 'text/xml');
        res.render('sitemaps/list', {
          host: req.protocol+"://"+req.headers.host,
          data: data,
          lastmod: lastmod,
          basepath: config.sections[section].basepath,
          nextpage: req.params.page ? parseFloat(req.params.page)+1 : 2
        });
      } else {
        const title = config.sections[section].title + ': ' + config.sections[section].labels[filter] + ' ' + config.sections[section].labels[sorting];
        let info = ' From ' + skip + ' to ' + (skip + config.sections[section].limit) + ' on ' + total + ' ' + title;
        let link = '/' + section + '/' + filter + '/' + sorting + '/';
        let pages = helper.getPagination(link, skip, config.sections[section].limit, total);
        res.render(config.sections[section].view_list, {
          title: title,
          section: section,
          jsonld:dataprovider.getJsonld(data, req, title),
          canonical: req.protocol + '://' + req.get('host') + req.originalUrl.split("?")[0],
          sort: sorting,
          pages: pages,
          filter: filter,
          categories: config.sections[section].categories,
          orderings: config.sections[section].orders,
          labels: config.sections[section].labels,
          data: data
        });
      }
    });
  }
};

module.exports = dataprovider;
