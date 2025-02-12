import createRouter from "../../router.js";
const router = createRouter();
import request from "axios";
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const User = mongoose.model('User');
const Event = mongoose.model('Event');
const News = mongoose.model('News');
import fs from 'fs';

import { logger, requestLogger, errorLogger } from '../../../utilities/logger.js';


router.get('/events', (req, res) => {
  req.session.organizations = undefined;
  logger.info('/admin/tools/import/events');
  res.render('adminpro/supertools/import', {
    title: 'WP Events',
    
    currentUrl: req.originalUrl,
    formUrl: req.originalUrl+"_import",
    body: "[\"onn-frame-musei-in-musica-2018\"]",
    data: {},
    script: false
    //script: '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/wpimport/organizations?page=' + (page) + '"},100);</script>'
  });  
});

router.post('/events_import', (req, res) => {
  logger.info('/admin/tools/import/events_import POST');
  logger.info('{"q": '+req.body.q+'}');
  if (!req.session.events && req.body.q) req.session.events = req.body.q;
  res.redirect(req.originalUrl);
});

router.get('/events_import', (req, res) => {
  logger.info('/admin/tools/import/events_import');
  //logger.info(req.session.events);
  let events = JSON.parse('{"q": '+req.session.events+'}').q;
  //logger.info(events);
  let page = req.query.page ? parseFloat(req.query.page) : 0;
  if (events[page]) {
    const url = "https://flyer.dev.flyer.it/wp-json/wp/v2/events/"+events[page];
    //logger.info({"url": url});
    page++;
    request({
        url: url,
        json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200, body.ID) {
        Event
        .findOne({slug: body.post_name})
        .exec((err, e) => {
          logger.info(body);
          var startdate = new Date(parseInt(body['wpcf-startdate'])*1000);
          var enddate = new Date(parseInt(body['wpcf-enddate'])*1000);
          logger.info("startdate");
          logger.info(startdate);
          logger.info(startdate.toISOString());
          logger.info("enddate");
          logger.info(enddate);
          logger.info(enddate.toISOString());
          var locations = [];
          for (var item in body['wpcf-location']) {
            var arr = body['wpcf-location'][item].split(";");
            var venue = {
              name : arr[0], 
              location : {
                locality : arr[1], 
                country : arr[2], 
                geometry : {
                  lat : arr[3], 
                  lng : arr[4]
                }
              }
            }
            locations.push(venue);
          }
          logger.info(locations);
          if (!e) {
            logger.info("NUOVOOOO");
            var event = {
              wp_id: body.ID,
              wp_users: body.capauthors,
              wp_tags: body.tags,
              createdAt: new Date(body.date),
              stats: {
                visits: 10,
                likes: 10
              },
              slug: body.post_name,
              title: body.post_title,
              subtitles: [{
                lang : "en", 
                abouttext: body.data_evento.replace(/\r\n/g, '').replace(/\n/g, '').replace(/\r/g, '')
              }], 
              image : body.featured && body.featured.full ? {
                file: "/glacier/events_originals/"+body.featured.full.replace("https://flyer.dev.flyer.it/files/", ""), 
              } : undefined, 
              abouts: [{
                lang : "en", 
                abouttext: body.post_content.replace(/\r\n/g, '').replace(/\n/g, '').replace(/\r/g, '')
              }], 
              web: [], 
              schedule: [], 
              is_public: true,
              gallery_is_public : false, 
              is_freezed : false, 
              organizationsettings : {
                program_builder : 0, 
                advanced_proposals_manager : 0, 
                call : {}, 
                permissions : {}
              }, 
              type: "5be8708afc396100000001de",
              categories : [
                "5be8708afc396100000001de"
              ]
            };
          } else {
            logger.info("VECCHIO");
            event = e;
            event.subtitles = [{
              lang : "en", 
              abouttext: body.data_evento.replace(/\r\n/g, '').replace(/\n/g, '').replace(/\r/g, '')
            }];
            event.image = body.featured && body.featured.full ? {
              file: "/glacier/events_originals/"+body.featured.full.replace("https://flyer.dev.flyer.it/files/", ""), 
            } : undefined;
            event.abouts = [{
              lang : "en", 
              abouttext: body.post_content.replace(/\r\n/g, '').replace(/\n/g, '').replace(/\r/g, '')
            }];        
          }
          logger.info(body.web_site);
          for (var item in body.web_site) {
            if (event.web.map(url => {return url.url;}).indexOf(body.web_site[item])) {
              var web = {
                url : body.web_site[item],
              }
              event.web.push(web);
            }
          }
          logger.info("enddate.getDate()-startdate.getDate() "+(enddate.getDate()-startdate.getDate()));
          //for (var a=0;a<=enddate.getDate()-startdate.getDate();a++) {
            logger.info("locations.length "+locations.length);
            event.schedule = [];
            if (locations.length) {
              for (var b=0;b<locations.length;b++) {
                var schedule = {
                  //date: new Date(body.date),
                  starttime: new Date(startdate),
                  endtime: new Date(enddate),
                  venue: locations[b]
                };
                event.schedule.push(schedule);
              }
            } else {
              var schedule = {
                //date: new Date(startdate),
                starttime: new Date(startdate),
                endtime: new Date(enddate)
              };
              event.schedule.push(schedule);
            }
          //}
          //result = event;
          User.findOne({"slug": body.capauthors[0].user_login}, function(error, user) {
            if (!event.users) {
                if (user && user._id) {
                event.users = [user._id];
              } else {
                event.users = [ObjectId("5be87f15fc3961000000a669")];
              }
            }
            logger.info(event);
            Event.
            findOneAndUpdate({slug: event.slug}, event, {upsert: true, useFindAndModify: false, new: true, setDefaultsOnInsert: true }, (err) => {
              let result;
              if (err) {
                logger.info('error '+err);
                result = err;
              } else {
                result = event;
              }
              logger.info('saveoutputsaveoutputsaveoutputsaveoutputsaveoutputsaveoutput ');
              logger.info(body.featured);
              if (body.featured && body.featured.full) {
                router.download(body.featured.full, config.appRoot+event.image.file, (p1,p2,p3) => {
    
                  logger.info('saveoutput ');
                  res.render('adminpro/supertools/import', {
                    title: 'WP Events',
                    
                    currentUrl: req.originalUrl,
                    body: req.session.events,
                    formUrl: req.originalUrl,
                    data: result,
                    //script: false
                    script: '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/wpimport/events_import?page=' + (page) + '"},100);</script>'
                  });
      
                });          
              } else {
                res.render('adminpro/supertools/import', {
                  title: 'WP Events',
                  
                  currentUrl: req.originalUrl,
                  body: req.session.events,
                  formUrl: req.originalUrl,
                  data: result,
                  //script: false
                  script: '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/wpimport/events_import?page=' + (page) + '"},100);</script>'
                });
              }
            });
          });
        
        });
      } else {
        res.render('adminpro/supertools/import', {
          title: 'WP Events',
          
          currentUrl: req.originalUrl,
          body: req.session.events,
          formUrl: req.originalUrl,
          data: {msg: ['End']},
          script: false
        });
      }
    });
  } else {
    req.session.events = undefined;
    res.render('adminpro/supertools/import', {
      title: 'WP Events',
      
      currentUrl: req.originalUrl,
      body: req.session.events,
      formUrl: req.originalUrl,
      data: {msg: ['End']},
      script: false
    });
  }
});

/* let organizations = [
  "telenoika"]; */
router.get('/organizations', (req, res) => {
  req.session.organizations = undefined;
  logger.info('/admin/tools/import/organizations');
  res.render('adminpro/supertools/import', {
    title: 'WP Organizations',
    
    currentUrl: req.originalUrl,
    formUrl: req.originalUrl+"_import",
    data: {},
    script: false
    //script: '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/wpimport/organizations?page=' + (page) + '"},100);</script>'
  });  
});
    
router.post('/organizations_import', (req, res) => {
  logger.info('/admin/tools/import/organizations_import POST');
  logger.info('{"q": '+req.body.q+'}');
  if (!req.session.organizations && req.body.q) req.session.organizations = req.body.q;
  res.redirect(req.originalUrl);
});

router.get('/organizations_import', (req, res) => {
  logger.info('/admin/tools/import/organizations_import');
  logger.info(req.session.organizations);
  let organizations = JSON.parse('{"q": '+req.session.organizations+'}').q;
  logger.info(organizations);
  let page = req.query.page ? parseFloat(req.query.page) : 0;
  if (organizations[page]) {
    const url = "https://flyer.dev.flyer.it/wp-json/wp/v2/author/avnode/"+organizations[page];
    logger.info({"url": url});

    request({
        url: url,
        json: true
    }, function (error, response, body) {
      logger.info({"slug": body.user_login});
      logger.info(error);
      logger.info(response.statusCode);
      logger.info("body.ID");
      logger.info(body.ID);
      if (!error && response.statusCode === 200) {
        page++;
        if (body.organisation) {
          logger.info({"slug": body.user_login});
          logger.info(url);
          logger.info(body.organisation);
          User.findOne({"slug": body.user_login}, function(error, result) {
            if (result) {
              result.organizationData = JSON.parse(JSON.stringify(body.organisation));
              if (result.organizationData.description) {
                var descr = {
                  "is_primary": false,
                  "lang": "fr",
                  "abouttext": result.organizationData.description
                }
                result.abouts.push(descr);
              }
              if (result.organizationData.url.length) {
                result.web = result.web.concat(result.organizationData.url);
                delete result.organizationData.url;
              }
              if (result.organizationData.social.length) {
                result.social = result.social.concat(result.organizationData.social);
                delete result.organizationData.social;
              }
              if (result.organizationData.logo || result.organizationData.statute || result.organizationData.members_cv || result.organizationData.cv) {
                let row = [];
                if (result.organizationData.logo) {
                  var obj = {source: result.organizationData.logo.toString()};
                  const ext = result.organizationData.logo.substring(result.organizationData.logo.lastIndexOf("."));
                  obj.dest = result.organizationData.logo = "/warehouse/organizations/logos/LOGO-"+result.slug+ext;
                  logger.info(obj);
                  row.push(obj);
                }
                if (result.organizationData.statute) {
                  var obj = {source: result.organizationData.statute.toString()};
                  const ext = result.organizationData.statute.substring(result.organizationData.statute.lastIndexOf("."));
                  obj.dest = result.organizationData.statute = "/warehouse/organizations/statutes/STATUTE-"+result.slug+ext;
                  row.push(obj);
                }
                if (result.organizationData.members_cv) {
                  var obj = {source: result.organizationData.members_cv.toString()};
                  const ext = result.organizationData.members_cv.substring(result.organizationData.members_cv.lastIndexOf("."));
                  obj.dest = result.organizationData.members_cv = "/warehouse/organizations/cvs/MEMBERS-CV-"+result.slug+ext;
                  row.push(obj);
                }
                if (result.organizationData.cv) {
                  var obj = {source: result.organizationData.cv.toString()};
                  const ext = result.organizationData.cv.substring(result.organizationData.cv.lastIndexOf("."));
                  obj.dest = result.organizationData.cv = "/warehouse/organizations/cvs/CV-"+result.slug+ext;
                  row.push(obj);
                }
                let contapost = 0;
                for (let a=0;a<row.length;a++) {
                  router.download(row[a].source, config.appRoot+row[a].dest, (p1,p2,p3) => {
                    contapost++;
                    if (contapost == row.length) {
                      result.save(function(error) {
                        res.render('adminpro/supertools/import', {
                          title: 'WP Organizations',
                          
                          currentUrl: req.originalUrl,
                          body: req.session.organizations,
                          formUrl: req.originalUrl,
                          data: error || result,
                          //script: false
                          script: '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/wpimport/organizations_import?page=' + (page) + '"},100);</script>'
                        });
                      });
                    }
                  });          
                }
              } else {
                logger.info('saveoutput ');
                logger.info({"result": result});
                logger.info(body.organisation);
                result.save(function(error) {
                  logger.info("salvato");
                  logger.info(error || result);
                  res.render('adminpro/supertools/import', {
                    title: 'WP Organizations',
                    
                    currentUrl: req.originalUrl,
                    body: req.session.organizations,
                    formUrl: req.originalUrl,
                    data: error || result,
                    //script: false
                    script: '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/wpimport/organizations_import?page=' + (page) + '"},100);</script>'
                  });
                });
              }
            } else {
              res.render('adminpro/supertools/import', {
                title: 'WP Organizations',
                
                currentUrl: req.originalUrl,
                body: req.session.organizations,
                formUrl: req.originalUrl,
                data: {msg: ['ERROR NOT FOUND IN AVNODE: '+organizations[(page-1)]+" http://flyer.dev.flyer.it/wp-admin/user-edit.php?user_id="+body.ID+"&action=edit"]},
                //script: false
                //script: '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/wpimport/organizations_import?page=' + (page) + '"},100);</script>'
              });
            }
          });
        } else {
          res.render('adminpro/supertools/import', {
            title: 'WP Organizations',
            
            currentUrl: req.originalUrl,
            body: req.session.organizations,
            formUrl: req.originalUrl,
            data: {msg: ['ERROR: '+organizations[(page-1)]+" http://flyer.dev.flyer.it/wp-admin/user-edit.php?user_id="+body.ID+"&action=edit"]},
            //script: false
            //script: '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/wpimport/organizations_import?page=' + (page) + '"},100);</script>'
          });
        }
      } else {
        res.render('adminpro/supertools/import', {
          title: 'WP Organizations',
          
          currentUrl: req.originalUrl,
          body: req.session.organizations,
          formUrl: req.originalUrl,
          data: {msg: ['ERROR: '+organizations[(page-1)]+" http://flyer.dev.flyer.it/wp-admin/user-edit.php?user_id="+body.ID+"&action=edit"]},
          script: false
        });
      }
    });
  } else {
    req.session.organizations = undefined;
    res.render('adminpro/supertools/import', {
      title: 'WP Organizations',
      
      currentUrl: req.originalUrl,
      body: req.session.organizations,
      formUrl: req.originalUrl,
      data: {msg: ['End']},
      script: false
    });
  }
});

router.daysBetween = function( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=100*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
    
  // Convert back to days and return
  return Math.round(difference_ms/one_day); 
}

router.get('/news', (req, res) => {
  req.session.news = undefined;
  logger.info('/admin/tools/import/news');
  res.render('adminpro/supertools/import', {
    title: 'WP News',
    
    currentUrl: req.originalUrl,
    formUrl: req.originalUrl+"_import",
    data: {},
    script: false
    //script: '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/wpimport/news?page=' + (page) + '"},100);</script>'
  });  
});
    
router.post('/news_import', (req, res) => {
  logger.info('/admin/tools/import/news_import POST');
  logger.info('{"q": '+req.body.q+'}');
  if (!req.session.news && req.body.q) req.session.news = req.body.q;
  res.redirect(req.originalUrl);
});

router.get('/news_import', (req, res) => {
  logger.info('/admin/tools/import/news_import');
  logger.info(req.session.news);
  let news = JSON.parse('{"q": '+req.session.news+'}').q;
  logger.info(news);
  let page = req.query.page ? parseFloat(req.query.page) : 0;
  logger.info(news[page]);
  if (news[page]) {
    const url = "https://flyer.dev.flyer.it/wp-json/wp/v2/news/"+news[page];
    logger.info({"url": url});

    request({
        url: url,
        json: true
    }, function (error, response, body) {
      logger.info({"error": error});
      logger.info({"response": response});
      logger.info({"body": body});
      if (!error && response.statusCode === 200) {
        page++;
        if (body.ID) {
          let news = body;
          logger.info("News "+news.post_title);
          logger.info(news);
          let tmp = {
            old_id: news.ID,
            createdAt: news.date,
            slug: news.post_name,
            title: news.post_title,
            is_public: true,
            abouts: [{
              lang: 'en',
              abouttext: news.post_content
            }],
            stats: {
              views: 10+Math.floor((Math.random() * 100) + 1),
              likes: 10+Math.floor((Math.random() * 100) + 1)
            },
            web: [],
            social: [],
            users: []
          };
          if (news.video_thumbnail && news.video_thumbnail !== '') {
            tmp.media = {url: news.video_thumbnail};
          }
          for (let web_site in news.web_site) {
            if (
              news.web_site[web_site].indexOf("facebook.com")!==-1 ||
              news.web_site[web_site].indexOf("fb.com")!==-1 ||
              news.web_site[web_site].indexOf("twitter.com")!==-1 ||
              news.web_site[web_site].indexOf("instagram.com")!==-1 ||      
              news.web_site[web_site].indexOf("youtube.com")!==-1 ||      
              news.web_site[web_site].indexOf("vimeo.com")!==-1      
            ) {
              tmp.social.push({
                url: news.web_site[web_site],
                type: 'social'
              });
            } else {
              tmp.web.push({
                url: news.web_site[web_site],
                type: 'web'
              });
            }
          }
          var slugs = [];
          for (let user in news.capauthors) {
            slugs.push(news.capauthors[user].user_login);
          }
          User.find({"slug": {$in: slugs}}).exec((err, persons) => {
            logger.info("slugs");
            logger.info(slugs);
            var usersA = persons.map(function(item){ return item._id; });
            logger.info("usersA");
            if (!usersA.length) usersA = [ObjectId("5be8772bfc39610000007065")];
            tmp.users = usersA;
            logger.info(usersA);
            if (news.featured && news.featured.full) {
              let filename = '';
              let dest = '';
              const source = news.featured.full;
              filename = source.substring(source.lastIndexOf('/') + 1);
    
              news.date = new Date(news.date);
              let month = news.date.getMonth() + 1;
              month = month < 10 ? '0' + month : month;
              dest = `${config.appRoot}/glacier/news_originals/${news.date.getFullYear()}/`;
              if (!fs.existsSync(dest)) {
                logger.info(fs.mkdirSync(dest));
              }
              dest += month;
              if (!fs.existsSync(dest)) {
                logger.info(fs.mkdirSync(dest));
              }
              dest += `/${filename}`;
              //logger.info(dest.replace(config.appRoot, '')+filename);
              tmp.image = {
                file: dest.replace(config.appRoot, ''),
                filename: filename,
                originalname: source
              };
              router.download(source, dest, (p1,p2,p3) => {
  
                logger.info('saveoutput ');
                logger.info(tmp);
                News.
                update({slug: tmp.slug}, tmp, {upsert: true}, (err) => {
                  let result;
                  if (err) {
                    logger.info('error '+err);
                    result = err;
                  } else {
                    result = tmp;
                  }
                  res.render('adminpro/supertools/import', {
                    title: 'WP News',
                    
                    currentUrl: req.originalUrl,
                    body: req.session.news,
                    formUrl: req.originalUrl,
                    data: error || result,
                    //script: false
                    script: '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/wpimport/news_import?page=' + (page) + '"},100);</script>'
                  });
              });
    
              });          
            } else {
              logger.info('saveoutput ');
              logger.info(tmp);
              News.
              update({slug: tmp.slug}, tmp, {upsert: true}, (err) => {
                let result;
                if (err) {
                  logger.info('error '+err);
                  result = err;
                } else {
                  result = tmp;
                }
                res.render('adminpro/supertools/import', {
                  title: 'WP News',
                  
                  currentUrl: req.originalUrl,
                  body: req.session.news,
                  formUrl: req.originalUrl,
                  data: error || result,
                  //script: false
                  script: '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/wpimport/news_import?page=' + (page) + '"},100);</script>'
                });
              });
            }
          });
        } else {
          res.render('adminpro/supertools/import', {
            title: 'WP News',
            
            currentUrl: req.originalUrl,
            body: req.session.news,
            formUrl: req.originalUrl,
            data: {msg: ['ERROR: '+news[(page-1)]+" http://flyer.dev.flyer.it/wp-admin/user-edit.php?user_id="+body.ID+"&action=edit"]},
            //script: false
            //script: '<script>var timeout = setTimeout(function(){location.href="/adminpro/supertools/wpimport/organizations_import?page=' + (page) + '"},100);</script>'
          });
        }
      } else {
        res.render('adminpro/supertools/import', {
          title: 'WP Organizations',
          
          currentUrl: req.originalUrl,
          body: req.session.news,
          formUrl: req.originalUrl,
          data: {msg: ['ERROR: '+news[(page-1)]+" http://flyer.dev.flyer.it/wp-admin/user-edit.php?user_id="+body.ID+"&action=edit"]},
          script: false
        });
      }
    });
  } else {
    //req.session.news = undefined;
    res.render('adminpro/supertools/import', {
      title: 'WP Organizations',
      
      currentUrl: req.originalUrl,
      body: req.session.news,
      formUrl: req.originalUrl,
      data: {msg: ['End']},
      script: false
    });
  }
});


router.download = (source, dest, callback) => {
  //router.mkdirRecursive(dest.substring(0, dest.lastIndexOf("/")), () => {
    var pathToFile = dest.substring(0, dest.lastIndexOf("/"));
    if (!fs.existsSync(pathToFile)) {
      var dirName = "/";
      var filePathSplit = pathToFile.split('/');
      for (var index = 0; index < filePathSplit.length; index++) {
          dirName += filePathSplit[index]+'/';
          if (!fs.existsSync(dirName))
              fs.mkdirSync(dirName);
      }
    }
    request.head(source, function(err, res, body){
      if (err) {
        logger.info(err);
      }
      if (res) {
        logger.info('content-type:', res.headers['content-type']);
        logger.info('content-length:', res.headers['content-length']);
      }
      //dest = dest.substring(0, dest.lastIndexOf("/"));
      logger.info("source ");
      logger.info(source);
      logger.info("dest ");
      logger.info(dest);
      request(source).pipe(fs.createWriteStream(dest)).on('close', callback);
    });
  //});
};

router.mkdirRecursive = (path, callback) => {
  let controlledPaths = []
  let paths = path.split(
    '/' // Put each path in an array
  ).filter(
    p => p != '.' // Skip root path indicator (.)
  ).reduce((memo, item) => {
    // Previous item prepended to each item so we preserve realpaths
    const prevItem = memo.length > 0 ? memo.join('/').replace(/\.\//g, '')+'/' : ''
    controlledPaths.push('./'+prevItem+item)
    return [...memo, './'+prevItem+item]
  }, []).map(dir => {
    fs.mkdir(dir, err => {
      if (err && err.code != 'EEXIST') throw err
      // Delete created directory (or skipped) from controlledPath
      controlledPaths.splice(controlledPaths.indexOf(dir), 1)
      if (controlledPaths.length === 0) {
        return callback()
      }
    })
  })
}

/* router.get('/news_import', (req, res) => {
  logger.info('/admin/tools/wpimport/news');
  let page = req.query.page ? parseFloat(req.query.page) : 1;
  const url = `https://flyer.dev.flyer.it/wp-json/wp/v2/news/?page=${page}`;

  page++;
  request({
      url: url,
      json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200, body.length) {
      let data = [];
      let contapost = 0;
      let contaposttotal = 0;
      body.forEach((news, index) => {
        logger.info("News "+index);
        logger.info("News "+news.title.rendered);
        //logger.info(news);
        let tmp = {
          old_id: news.id,
          createdAt: news.date,
          slug: news.slug,
          title: news.title.rendered,
          is_public: true,
          abouts: [{
            lang: 'en',
            abouttext: news.content.rendered
          }],
          stats: {
            views: 10+Math.floor((Math.random() * 100) + 1),
            likes: 10+Math.floor((Math.random() * 100) + 1)
          },
          web: [],
          social: [],
          users: []
        };
        if (news.video_thumbnail && news.video_thumbnail !== '') {
          tmp.media = {url: news.video_thumbnail};
        }
        for (let web_site in news.web_site) {
          if (
            news.web_site[web_site].indexOf("facebook.com")!==-1 ||
            news.web_site[web_site].indexOf("fb.com")!==-1 ||
            news.web_site[web_site].indexOf("twitter.com")!==-1 ||
            news.web_site[web_site].indexOf("instagram.com")!==-1 ||      
            news.web_site[web_site].indexOf("youtube.com")!==-1 ||      
            news.web_site[web_site].indexOf("vimeo.com")!==-1      
          ) {
            tmp.social.push({
              url: news.web_site[web_site],
              type: 'social'
            });
          } else {
            tmp.web.push({
              url: news.web_site[web_site],
              type: 'web'
            });
          }
        }
        var slugs = [];
        for (let user in news.capauthors) {
          slugs.push(news.capauthors[user].user_login);
        }
        User.find({"slug": {$in: slugs}}).exec((err, persons) => {
          logger.info("slugs");
          logger.info(slugs);
          var usersA = persons.map(function(item){ return item._id; });
          logger.info("usersA");
          if (!usersA.length) usersA = ['5be8772bfc39610007065'];
          tmp.users = usersA;
          logger.info(usersA);
          if (news.featured && news.featured.full) {
            let filename = '';
            let dest = '';
            const source = news.featured.full;
            filename = source.substring(source.lastIndexOf('/') + 1);
  
            news.date = new Date(news.date);
            let month = news.date.getMonth() + 1;
            month = month < 10 ? '0' + month : month;
            contaposttotal++;
            dest = `${config.appRoot}/glacier/news_originals/${news.date.getFullYear()}/`;
            if (!fs.existsSync(dest)) {
              logger.info(fs.mkdirSync(dest));
            }
            dest += month;
            if (!fs.existsSync(dest)) {
              logger.info(fs.mkdirSync(dest));
            }
            dest += `/${filename}`;
            //logger.info(dest.replace(config.appRoot, '')+filename);
            tmp.image = {
              file: dest.replace(config.appRoot, ''),
              filename: filename,
              originalname: source
            };
            data.push(tmp);
            router.download(source, dest, (p1,p2,p3) => {
              contapost++;
              logger.info('contapost download ');
              logger.info(data.length);
              logger.info(body.length);
              logger.info(contapost);

              if (contapost == body.length) {
                logger.info('saveoutput ');
                logger.info(data.length);
                logger.info(data);
                News.
                create(data, (err) => {
                  let result;
                  if (err) {
                    logger.info('error '+err);
                    result = err;
                  } else {
                    result = data;
                  }
                  res.render('admin/tools', {
                    title: 'News',
                    currentUrl: req.originalUrl,
                    data: result,
                    //script: false
                    script: '<script>var timeout = setTimeout(function(){location.href="/admin/tools/wpimport/news?page=' + (page) + '"},100);</script>'
                  });
                });
              }
  
            });          
          } else {
            contapost++;
            logger.info('contapost NO download ');
            logger.info(data.length);
            logger.info(body.length);
            logger.info(contapost);
            if (contapost == body.length) {
              logger.info('saveoutput ');
              logger.info(data.length);
              logger.info(data);
              News.
              create(data, (err) => {
                let result;
                if (err) {
                  logger.info('error '+err);
                  result = err;
                } else {
                  result = data;
                }
                res.render('admin/tools', {
                  title: 'News',
                  currentUrl: req.originalUrl,
                  data: result,
                  //script: false
                  script: '<script>var timeout = setTimeout(function(){location.href="/admin/tools/wpimport/news?page=' + (page) + '"},100);</script>'
                });
              });
            }
          }
        });
      });
    } else {
      res.render('admin/tools', {
        title: 'News',
        currentUrl: req.originalUrl,
        data: {msg: ['End']},
        script: false
      });
    }
  });
});

router.get('/eventsupdate', (req, res) => {
  logger.info('/admin/tools/import/eventsupdate');
  let page = req.query.page ? parseFloat(req.query.page) : 0;
  if (events[page]) {
    const url = "https://flyer.dev.flyer.it/wp-json/wp/v2/events/"+events[page];

    page++;
    request({
        url: url,
        json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200, body.ID) {
        //logger.info(body);
        var startdatetime = new Date((parseInt(body['wpcf-startdate'])*100));
        //logger.info(startdatetime);
        var enddatetime = new Date((parseInt(body['wpcf-enddate'])*100));
        //logger.info(enddatetime);
        
        var locations = [];
        for (var item in body['wpcf-location']) {
          var arr = body['wpcf-location'][item].replace("&amp;","&").split(";");
          var venue = {
            name : arr[0], 
            location : {
              locality : arr[1], 
              country : arr[2], 
              geometry : {
                lat : arr[3], 
                lng : arr[4]
              }
            }
          }
          locations.push(venue);
        }
        //logger.info(locations);

        var event = {
          wp_id: body.ID,
          //wp_users: body.capauthors,
          //wp_tags: body.tags,
          createdAt: new Date(body.date),
          stats: {
            visits: 0,
            likes: 0
          },
          slug: body.post_name,
          title: body.post_title,
          subtitles: [{
            lang : "en", 
            abouttext: body.data_evento
          }], 
          image : body.featured && body.featured.full ? {
            file: "/glacier/events_originals/"+body.featured.full.replace("https://flyer.dev.flyer.it/files/", ""), 
          } : undefined, 
          abouts: [{
            lang : "en", 
            abouttext: body.post_content
          }], 
          web: [], 
          schedule: [], 
          is_public: true,
          gallery_is_public : false, 
          is_freezed : false, 
          organizationsettings : {
            program_builder : 0, 
            advanced_proposals_manager : 0, 
            call : {}, 
            permissions : {}
          }, 
          categories : [
              ("5be8708afc396100001de")
          ]
        };
        ////logger.info(body.web_site);
        for (var item in body.web_site) {
          var web = {
            txt : body.web_site[item],
            url : body.web_site[item],
            target: "_blank"
          }
          event.web.push(web);
        }
        //logger.info("enddate.getDate()-startdate.getDate() "+router.daysBetween( new Date(parseInt(body['wpcf-startdate'])*100), new Date(parseInt(body['wpcf-enddate'])*100) ));
        var daysBetween = router.daysBetween( new Date(parseInt(body['wpcf-startdate'])*100), new Date(parseInt(body['wpcf-enddate'])*100) )
        for (var a=0;a<=daysBetween;a++) {
          logger.info(a);
          if (locations.length) {
            for (var b=0;b<locations.length;b++) {
              var schedule = {
                date: new Date((parseInt(body['wpcf-startdate'])*100)+(a*(100*60*60*24))),
                starttime: new Date((parseInt(body['wpcf-startdate'])*100)+(a*(100*60*60*24))),
                endtime: new Date((parseInt(body['wpcf-enddate'])*100)-((daysBetween-a)*(100*60*60*24))),
                venue: locations[b]
              };
              ////logger.info(schedule);
              event.schedule.push(schedule);
            }
          } else {
            var schedule = {
              date: new Date(parseInt(body['wpcf-startdate'])*100),
              starttime: new Date(parseInt(body['wpcf-startdate'])*100),
              endtime: new Date(parseInt(body['wpcf-enddate'])*100)
            };
            event.schedule.push(schedule);
          }
        }
        //logger.info("original");
        //logger.info(original);

        Event.findOneAndUpdate({"slug": body.post_name}, event, { upsert: true, new: false, setDefaultsOnInsert: true }, function(error, result) {
          if (error) {
            logger.info(error);
          } else if (!result) {
            // Create it
            //result = new Model();
            //result = Object.assign(result, event);
            logger.info("insert");
            logger.info(events[page]);
            // If the document doesn't exist
            // Save the document
          } 
          res.render('admin/tools', {
            title: 'WP Events',
            currentUrl: req.originalUrl,
            data: error || result,
            //script: false
            script: '<script>var timeout = setTimeout(function(){location.href="/admin/tools/wpimport/eventsupdate?page=' + (page) + '"},100);</script>'
          });
        });
      } else {
        res.render('admin/tools', {
          title: 'WP Events',
          currentUrl: req.originalUrl,
          data: {msg: ['ERROR']},
          script: false
        });
      }
    });
  } else {
    res.render('admin/tools', {
      title: 'WP Events',
      currentUrl: req.originalUrl,
      data: {msg: ['End']},
      script: false
    });
  }
});


*/
export default router;