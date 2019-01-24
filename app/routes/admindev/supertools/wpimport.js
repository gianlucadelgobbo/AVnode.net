const router = require('../../router')();
const request = require('request');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const User = mongoose.model('User');
const Event = mongoose.model('Event');
const News = mongoose.model('News');
const fs = require('fs');

const logger = require('../../../utilities/logger');
let events = [
  "homework-festival-3",
  "flxer-abuser-alla-biennale-di-venezia",
  "2-many-vjs",
  "re-joyce-concerto-per-pianoforte-voce-e-proiezioni",
  "wam-architecture",
  "queer-jubilee-iii",
  "digital-freedom-week-2007",
  "odd-stream",
  "nufest07",
  "queer-jubilee-iv",
  "homework-festival-5",
  "video-drome",
  "lpm-2007-rome-palazzo-delle-esposizioni",
  "homework-festival-6",
  "rejected-opening-party",
  "gente-de-zona-2010",
  "citizen-report",
  "x-mas-the-city",
  "lpm-2011-roma-design-week",
  "lunchmeat-2011",
  "soundframe-2011",
  "athens-video-art-festival-2011",
  "kernel-festival-2011",
  "freemote-2011",
  "first-avnode-meeting",
  "visionr-2012-soiree-irl-janvier",
  "transmediale-av-node-lounge-2012",
  "vj-conference-budapest",
  "visionr-2012-soiree-irl-fevrier",
  "athens-digital-arts-festival-2012-avaf-introduces-lpm",
  "visionr-2012-soiree-irl-mars",
  "lpm-2012-rome-living-room-vjs-contest",
  "visionr-2012-soiree-irl-avril",
  "b-seite-festival-2012",
  "visionr-2012",
  "lpm-2012-mannheim-b-seite-festival",
  "touch",
  "transmediale-resource-event-001-trial-crack-2012",
  "athens-video-art-festival-2012",
  "lpm-2012-athens-video-art-festival",
  "lunchmeat-2012",
  "bulgari",
  "soundframe-2012",
  "lpm-percentomusica",
  "spiderman-4",
  "robot-festival-05",
  "oddstream-festival-2012",
  "roma-palermo",
  "mira-2013",
  "spektrum-videokunst",
  "b-seite-festival-2013",
  "resonate-festival-2013",
  "lpm-2013-rome-save-the-beauty",
  "soundframe-2013",
  "martini-150-years",
  "playground-av-kick-off-event",
  "lunchmeat-2013",
  "lpm-2013-formello-video-routing-residency",
  "athens-video-art-festival-2013",
  "dancity-festival-2013",
  "ford-fiesta",
  "wind-business",
  "colgate-one-optic",
  "patchlab-2013",
  "reykjavik-visual-music",
  "b-seite-festival-2014",
  "soundframe-2014",
  "lunchmeat-2014",
  "resonate-festival-2014",
  "sophia-digital-art-2014",
  "vj-torna-international",
  "spring-attitude-2014",
  "oddstream-festival-2014",
  "robot-festival-07",
  "athens-digital-art-festival-2014",
  "patchlab-2014",
  "video-mapping-mecar",
  "addnoise-the-creative-and-cultural-meeting-point",
  "amore-2015",
  "feel-free-to-feel-green",
  "lpm-2015-piuvolume",
  "b-seite-festival-2015",
  "11th-edition-of-the-fete-de-lanim",
  "sophia-digital-art-2015",
  "soundframe-2015",
  "resonate-2015",
  "brigitta-zics-eyeresonator-at-the-power-plant",
  "freestyle-computing-competition-awarding-ceremony-2015",
  "la-francia-in-scena-2015-paris-rockin-milano-etienne-de-crecyetnoze",
  "fiber-festival-2015",
  "athens-digital-arts-festival-2015",
  "la-francia-in-scena-2015-nicolas-godin-air-at-festa-della-musica",
  "la-francia-in-scena-2015-cabaret-contemporain-at-dancity-2015",
  "stupid-enough",
  "artistic-interventions-in-public-space",
  "video-mapping-romap-2015-piazza-navona",
  "schmiedeopenlab-music",
  "schmiedetalk-inspiration-kreatives-okosystem",
  "cinema-vertigo-talk-inspiration",
  "jam-island-talk-traumwelten-in-games-sarah-hiebl",
  "tinkerlab-talk-materiability-access-to-materials-manuel-kretzer",
  "offener-raum-ein-begegnungsprojekt-sol-sudhaus",
  "schmiedetalk-stupid-enough-mit-sarah-j-coleman-und-leigh-adams",
  "15eme-festival-international-du-court-metrage",
  "spazi-da-non-perdere",
  "eroffnung-der-ausstellung-ready-performance-bartholomaus-traubeck-years",
  "verleihung-des-salzburger-landespreis-fur-medienkunst-2015",
  "christof-berthold-marcuse-hafner-cargography-salzburger-landespreis-fur-medienkunst-2014",
  "schmiedewerkschau",
  "kernel-theater-015-contemporary-rossini",
  "robot-festival-08",
  "simultan-2015",
  "la-francia-in-scena-2016-1024-architecture-at-robot-festival",
  "centras-festival-2015",
  "lpm-2016-liminal-1",
  "odiosa-juve",
  "la-francia-in-scena-2015-pixel-at-torino-danza-festival",
  "mira-2015",
  "listen-to-the-road",
  "time-based-media-in-contemporary-art",
  "video-mapping-fontana-di-trevi",
  "amore-2016",
  "playground-av-sessions-2016",
  "lpm-2016-strati",
  "simultan-retroscpection-2005-2015",
  "b-seite-festival-2016",
  "oddstream-2016",
  "lpm-2016-liminal-5",
  "12eme-fete-de-lanim",
  "ad-from-eu-definition-to-best-practices",
  "er-va32",
  "mapping-de-butxaca-workshop",
  "resonate-festival-2016",
  "soundframe-2016",
  "tecnica-audiovisual-aplicada-a-lescena",
  "av-audience-development-meeting-2016",
  "lpm-2016-liminal-6-10",
  "tecnica-audiovisual-aplicada-a-lescena-2",
  "intermediate-advanced-mapping-workshop",
  "mapping-festival-2016",
  "playground-av-festival-2016",
  "siliana-crocchianti-life-igt-2016",
  "la-francia-in-scena-2016-christophe-chassol",
  "video-a-r-t-erasmus",
  "ableton-live-intensive-workshop",
  "er-va-33",
  "video-mapping-maxxi-spring-attitude-2016",
  "la-francia-in-scena-2016-acid-arab-at-spring-attitude",
  "athens-digital-art-festival-2016",
  "spring-attitude-2016",
  "la-francia-in-scena-2016-rone-at-spring-attitude",
  "la-francia-in-scena-2016-air-at-spring-attitude",
  "rom-riders-on-the-mall-2016",
  "splice-festival-2016",
  "lpm-2016-bpm-park",
  "full-dome-workshop-360o",
  "mira-berlin-2016",
  "taller-proces-creatiu-performances-audiovisuals",
  "er-va-34",
  "lpm-2016-notte-bianca-della-sapienza",
  "c3-turns-20",
  "taller-creativo-de-mapping-per-a-joves",
  "mapping-modular-i-impressora-3d",
  "fade",
  "er-va-35",
  "townlands-carnival-2016",
  "taller-de-mapping-i-estereoscopia",
  "14o-visual-brasil-festival-barcelona",
  "festival-internacional-de-mapping-de-girona-2016",
  "knockanstockan-independent-music-and-arts-festival",
  "estrany-unusual-music-festival-2016",
  "playground-av-berlin",
  "designing-an-audio-visual-installation-using-maxmsp-jitter-workshop",
  "la-francia-in-scena-2016-1024-architecture-at-live-cinema-festival-2016",
  "vergabe-jahresstipendium-fur-medienkunstvernissage-compositions-for-a-room-maria-morschitzky",
  "labor-prasentationen-plus-dialog",
  "lectura-dones-cerebrals-eeg-aplicades-al-new-media-art",
  "akademie-impuls-prasentationen-wege-und-methoden-plus-dialog",
  "festival-warmup-ctm-presents-the-berlin-current",
  "hebocon",
  "akademie-impuls-prasentationen-plus-dialog",
  "16eme-festival-international-du-court-metrage",
  "social-entrepreneurship-impuls-prasentation-plus-dialog-und-netzwerktreffen-deutsch-romy-sigl",
  "european-heritage-days-hellenic-ministry-of-culture-and-sports",
  "sonic-dreams-festival-2016",
  "schmiede-werkschau-2016",
  "audioshow-audiolab-werkschau-plus-party",
  "korelles-emmanuel-biard-the-well",
  "on-your-own-taller-de-mantenimiento-de-proyectores",
  "la-francia-in-scena-2016-matthieu-tercieux-at-upgrade-le-meraviglie-del-possibile",
  "robot-festival-09",
  "galway-2020-city-of-culture",
  "create-your-live-av-system-using-ableton-live-maxmsp-jitter-workshop",
  "patchlab-2016",
  "lunchmeat-2016",
  "studio-macchinette-maker-faire",
  "symposium-on-digital-arts-2016",
  "bam-festival-3-we-are-the-robots",
  "approaches-to-multichannel-sound-using-reaktor",
  "taller-de-grafica-generativa",
  "istanbul-av-residency-2016",
  "nitav-2nd-edition",
  "spatial-sound-and-lights-using-reaktor-arena-dmx",
  "freestyle-computing-competition-awarding-ceremony-2016",
  "alumbra-mapping-show-sevilla",
  "urban-visual-art",
  "madatac-08",
  "exhibition-and",
  "save-as-what-will-remain-of-new-media-art",
  "postfuture-journey",
  "arduino-for-dummies",
  "b-seite-festival-2017",
  "er-va-36",
  "lpm-2017-liminal-1",
  "ciclo-mx-2017",
  "audience-development-conference",
  "video-then-and-now",
  "rom-riders-on-the-mall-2017",
  "13eme-fete-de-lanim",
  "cinema-4d-workshop",
  "av-audience-development-meeting-2017",
  "oficina-video-mapping-con-telenoika-in-colaboration-with-medialab-oficina-de-imagens-brasil",
  "waiting-spaces-v",
  "visuales-para-artes-escenicas-mapping-interactivos-y-performance-audiovisual",
  "fiber-festival-2017",
  "athens-digital-art-festival-2017",
  "lpm-2017-amsterdam",
  "la-francia-in-scena-2017-nonotak-at-spring-attitude",
  "la-francia-in-scena-2017-dedalus",
  "mapping-workshop",
  "programacion-aplicada-al-live-av-quartz-composer",
  "spring-attitude-2017",
  "splice-festival-2017",
  "er-va-37",
  "la-francia-in-scena-2017-chassol-at-spring-attitude",
  "led-technology-and-interactivity-workshop",
  "la-francia-in-scena-2017-vaudou-game",
  "lpm-2017-notte-bianca-della-sapienza",
  "la-francia-in-scena-2017-fete-de-la-musique",
  "playground-av-festival-2017",
  "blooming-festival-2017",
  "node-17-designing-hope",
  "fade-festival",
  "a-mor-phous-av-fest-2017",
  "zsolnay-light-festival-2017",
  "lumiwall-gallery",
  "creative-europe-desk-greece-conference-digitization-in-the-field-of-culture-and-the-creative-europe-programme",
  "graphic-generation-workshop",
  "taller-de-produccion-sonora-con-maga-bo",
  "townlands-carnival-2017",
  "er-va-38",
  "live-cinema-festival-2017",
  "estrany-unusual-music-festival-2017",
  "led-mappathon",
  "white-noise-minirobot-kinder-workshop",
  "minirobot-hebocon",
  "video-mapping-european-center",
  "sunset-kino-cinema-vertigo-expanded",
  "minischmiede",
  "the-launching-of-the-video-mapping-european-center",
  "minischmiede-hebocon",
  "eroffnung-der-ausstellung-schmiedepolis-fountain-of-ideas",
  "vergabe-jahresstipendium-fur-medienkunst-land-salzburg",
  "european-future-symposium-bremen",
  "jamisland-gamejam",
  "labprasentationen-plus-dialog",
  "input",
  "17eme-festival-international-du-court-metrage",
  "akademie-talks-peer2peer-mentoring",
  "offentliche-workshops",
  "the-everyman-orchestra",
  "subnettalk-the-digital-in-the-arts-and-in-exhibition-katrin-wolf",
  "lecture-performance-christoph-janka",
  "sonic-dreams-festival-2017",
  "15o-visual-brasil-festival",
  "schmiedewerkschau-2017",
  "la-francia-in-scena-2017-siestes-electroniques-at-terraforma",
  "smithfarewellparty",
  "simultan-festival-xii-possible-futures3",
  "framework",
  "3rd-vj-mapping-tournament-mexico",
  "editions-of-light-vol-3",
  "signal-festival-2017",
  "lunchmeat-2017",
  "symposium-on-digital-arts-2016-2",
  "bam-festival-4-%e2%80%a2-new-era",
  "dark-matter-interactive-installation",
  "patchlab-digital-art-festival-2017",
  "intern-for-intermedia-academy-of-fine-arts-students",
  "oddstream-exhibition-2017",
  "rgb-light-experience",
  "automatismes-creatius-amb-raspberrypi",
  "space-vj-meeting-3",
  "mira-2017",
  "cyberdelic-reality",
  "nit-av-3rd-edition",
  "madatac-09",
  "the-new-projectionists-vjing-av-performance-and-post-cinematic-projection",
  "b-seite-festival-2018",
  "video-mapping-festival-1",
  "istanbul-av-residency-2018",
  "rom-riders-on-the-mall-2018",
  "playground-av-festival-2018",
  "av-audience-development-meeting-2018",
  "istanbul-av-residency-2018-2",
  "hidden-structures-oddstream-2018",
  "splice-festival-2018",
  "2018-amsterdam",
  "athens-digital-art-festival-2018",
  "zsolnay-light-festival-2018",
  "lcf-2018-off-accademia-dungheria",
  "lcf-2018-off-contemporary-cluster",
  "lunchmeat-2018",
  "hidden-structures-2018",
  "bam-festival-2018",
  "patchlab-2018",
  "experiences-audio-visuelles"
];

router.get('/events', (req, res) => {
  logger.debug('/admin/tools/import/events');
  let page = req.query.page ? parseFloat(req.query.page) : 0;
  const url = "https://flyer.dev.flyer.it/wp-json/wp/v2/events/"+events[page];

  page++;
  request({
      url: url,
      json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200, body.ID) {
      let data = [];
      let contapost = 0;
      let contaposttotal = 0;
      console.log(body);
      var startdate = new Date(parseInt(body['wpcf-startdate'])*1000);
      console.log(startdate);
      var enddate = new Date(parseInt(body['wpcf-enddate'])*1000);
      console.log(enddate);
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
      console.log(locations);
      
      var event = {
        wp_id: body.ID,
        wp_users: body.capauthors,
        wp_tags: body.tags,
        creation_date: new Date(body.date),
        stats: {
          visits: Math.floor(Math.random() * 1000)+1000,
          likes: Math.floor(Math.random() * 100)+100
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
            ("5be8708afc396100000001de")
        ]
      };
      console.log(body.web_site);
      for (var item in body.web_site) {
        var web = {
          txt : body.web_site[item],
          url : body.web_site[item],
          target: "_blank"
        }
        event.web.push(web);
      }
      console.log("enddate.getDate()-startdate.getDate() "+(enddate.getDate()-startdate.getDate()));
      for (var a=0;a<=enddate.getDate()-startdate.getDate();a++) {
        console.log("locations.length "+locations.length);
        if (locations.length) {
          for (var b=0;b<locations.length;b++) {
            var schedule = {
              date: new Date(body.date),
              starttime: startdate+a,
              endtime: enddate+a,
              venue: locations[b]
            };
            event.schedule.push(schedule);
          }
        } else {
          var schedule = {
            date: new Date(body.date),
            starttime: startdate,
            endtime: enddate
        };
          event.schedule.push(schedule);
        }
      }
      console.log(event);
      //result = event;
      Event.
       create(event, (err) => {
        let result;
        if (err) {
          console.log('error '+err);
          result = err;
        } else {
          result = event;
        }
        res.render('admin/tools', {
          title: 'WP Events',
          currentUrl: req.originalUrl,
          data: result,
          //script: false
          script: '<script>var timeout = setTimeout(function(){location.href="/admin/tools/wpimport/events?page=' + (page) + '"},1000);</script>'
        });
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
});

events = [
  "soundframe-2013",
  "2-many-vjs",
  "wam-architecture",
  "queer-jubilee-iii",
  "digital-freedom-week-2007",
  "odd-stream",
  "nufest07",
  "queer-jubilee-iv",
  "homework-festival-5",
  "video-drome",
  "lpm-percentomusica",
  "lpm-2016-strati",
  "siliana-crocchianti-life-igt-2016"];

router.get('/eventsupdate', (req, res) => {
  logger.debug('/admin/tools/import/eventsupdate');
  let page = req.query.page ? parseFloat(req.query.page) : 0;
  if (events[page]) {
    const url = "https://flyer.dev.flyer.it/wp-json/wp/v2/events/"+events[page];

    page++;
    request({
        url: url,
        json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200, body.ID) {
        //console.log(body);
        var startdatetime = new Date((parseInt(body['wpcf-startdate'])*1000));
        //console.log(startdatetime);
        var enddatetime = new Date((parseInt(body['wpcf-enddate'])*1000));
        //console.log(enddatetime);
        
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
        //console.log(locations);

        var event = {
          wp_id: body.ID,
          //wp_users: body.capauthors,
          //wp_tags: body.tags,
          creation_date: new Date(body.date),
          stats: {
            visits: Math.floor(Math.random() * 1000)+1000,
            likes: Math.floor(Math.random() * 100)+100
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
              ("5be8708afc396100000001de")
          ]
        };
        ////console.log(body.web_site);
        for (var item in body.web_site) {
          var web = {
            txt : body.web_site[item],
            url : body.web_site[item],
            target: "_blank"
          }
          event.web.push(web);
        }
        //console.log("enddate.getDate()-startdate.getDate() "+router.daysBetween( new Date(parseInt(body['wpcf-startdate'])*1000), new Date(parseInt(body['wpcf-enddate'])*1000) ));
        var daysBetween = router.daysBetween( new Date(parseInt(body['wpcf-startdate'])*1000), new Date(parseInt(body['wpcf-enddate'])*1000) )
        for (var a=0;a<=daysBetween;a++) {
          console.log(a);
          if (locations.length) {
            for (var b=0;b<locations.length;b++) {
              var schedule = {
                date: new Date((parseInt(body['wpcf-startdate'])*1000)+(a*(1000*60*60*24))),
                starttime: new Date((parseInt(body['wpcf-startdate'])*1000)+(a*(1000*60*60*24))),
                endtime: new Date((parseInt(body['wpcf-enddate'])*1000)-((daysBetween-a)*(1000*60*60*24))),
                venue: locations[b]
              };
              ////console.log(schedule);
              event.schedule.push(schedule);
            }
          } else {
            var schedule = {
              date: new Date(parseInt(body['wpcf-startdate'])*1000),
              starttime: new Date(parseInt(body['wpcf-startdate'])*1000),
              endtime: new Date(parseInt(body['wpcf-enddate'])*1000)
            };
            event.schedule.push(schedule);
          }
        }
        //console.log("original");
        //console.log(original);

        Event.findOneAndUpdate({"slug": body.post_name}, event, { upsert: true, new: false, setDefaultsOnInsert: true }, function(error, result) {
          if (error) {
            console.log(error);
          } else if (!result) {
            // Create it
            //result = new Model();
            //result = Object.assign(result, event);
            console.log("insert");
            console.log(events[page]);
            // If the document doesn't exist
            // Save the document
            /* result.save(function(error) {
                if (!error) {
                    // Do something with the document
                } else {
                    throw error;
                }
            }); */
          } 
          res.render('admin/tools', {
            title: 'WP Events',
            currentUrl: req.originalUrl,
            data: error || result,
            //script: false
            script: '<script>var timeout = setTimeout(function(){location.href="/admin/tools/wpimport/eventsupdate?page=' + (page) + '"},1000);</script>'
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

/* let organizations = [
  "telenoika"]; */
router.get('/organizations', (req, res) => {
  req.session.organizations = undefined;
  logger.debug('/admin/tools/import/organizations');
  res.render('admindev/supertools/import', {
    title: 'WP Organizations',
    currentUrl: req.originalUrl,
    formUrl: req.originalUrl+"_import",
    data: {},
    script: false
    //script: '<script>var timeout = setTimeout(function(){location.href="/admindev/supertools/wpimport/organizations?page=' + (page) + '"},1000);</script>'
  });  
});
    
router.post('/organizations_import', (req, res) => {
  logger.debug('/admin/tools/import/organizations_import POST');
  logger.debug('{"q": '+req.body.q+'}');
  if (!req.session.organizations && req.body.q) req.session.organizations = req.body.q;
  res.redirect(req.originalUrl);
});

router.get('/organizations_import', (req, res) => {
  logger.debug('/admin/tools/import/organizations_import');
  logger.debug(req.session.organizations);
  let organizations = JSON.parse('{"q": '+req.session.organizations+'}').q;
  logger.debug(organizations);
  let page = req.query.page ? parseFloat(req.query.page) : 0;
  if (organizations[page]) {
    const url = "https://flyer.dev.flyer.it/wp-json/wp/v2/author/avnode/"+organizations[page];
    console.log({"url": url});

    request({
        url: url,
        json: true
    }, function (error, response, body) {
      console.log({"slug": body.user_login});
      console.log(error);
      console.log(response.statusCode);
      console.log("body.ID");
      console.log(body.ID);
      if (!error && response.statusCode === 200) {
        page++;
        if (body.organisation) {
          console.log({"slug": body.user_login});
          console.log(url);
          console.log(body.organisation);
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
                  console.log(obj);
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
                  router.download(row[a].source, global.appRoot+row[a].dest, (p1,p2,p3) => {
                    contapost++;
                    if (contapost == row.length) {
                      result.save(function(error) {
                        res.render('admindev/supertools/import', {
                          title: 'WP Organizations',
                          currentUrl: req.originalUrl,
                          body: req.session.organizations,
                          formUrl: req.originalUrl,
                          data: error || result,
                          //script: false
                          script: '<script>var timeout = setTimeout(function(){location.href="/admindev/supertools/wpimport/organizations_import?page=' + (page) + '"},1000);</script>'
                        });
                      });
                    }
                  });          
                }
              } else {
                console.log('saveoutput ');
                console.log({"result": result});
                console.log(body.organisation);
                result.save(function(error) {
                  console.log("salvato");
                  console.log(error || result);
                  res.render('admindev/supertools/import', {
                    title: 'WP Organizations',
                    currentUrl: req.originalUrl,
                    body: req.session.organizations,
                    formUrl: req.originalUrl,
                    data: error || result,
                    //script: false
                    script: '<script>var timeout = setTimeout(function(){location.href="/admindev/supertools/wpimport/organizations_import?page=' + (page) + '"},1000);</script>'
                  });
                });
              }
            } else {
              res.render('admindev/supertools/import', {
                title: 'WP Organizations',
                currentUrl: req.originalUrl,
                body: req.session.organizations,
                formUrl: req.originalUrl,
                data: {msg: ['ERROR NOT FOUND IN AVNODE: '+organizations[(page-1)]+" http://flyer.dev.flyer.it/wp-admin/user-edit.php?user_id="+body.ID+"&action=edit"]},
                //script: false
                //script: '<script>var timeout = setTimeout(function(){location.href="/admindev/supertools/wpimport/organizations_import?page=' + (page) + '"},1000);</script>'
              });
            }
          });
        } else {
          res.render('admindev/supertools/import', {
            title: 'WP Organizations',
            currentUrl: req.originalUrl,
            body: req.session.organizations,
            formUrl: req.originalUrl,
            data: {msg: ['ERROR: '+organizations[(page-1)]+" http://flyer.dev.flyer.it/wp-admin/user-edit.php?user_id="+body.ID+"&action=edit"]},
            //script: false
            //script: '<script>var timeout = setTimeout(function(){location.href="/admindev/supertools/wpimport/organizations_import?page=' + (page) + '"},1000);</script>'
          });
        }
      } else {
        res.render('admindev/supertools/import', {
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
    res.render('admindev/supertools/import', {
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
  var one_day=1000*60*60*24;

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
  logger.debug('/admin/tools/import/news');
  res.render('admindev/supertools/import', {
    title: 'WP News',
    currentUrl: req.originalUrl,
    formUrl: req.originalUrl+"_import",
    data: {},
    script: false
    //script: '<script>var timeout = setTimeout(function(){location.href="/admindev/supertools/wpimport/news?page=' + (page) + '"},1000);</script>'
  });  
});
    
router.post('/news_import', (req, res) => {
  logger.debug('/admin/tools/import/news_import POST');
  logger.debug('{"q": '+req.body.q+'}');
  if (!req.session.news && req.body.q) req.session.news = req.body.q;
  res.redirect(req.originalUrl);
});


/* router.get('/news_import', (req, res) => {
  logger.debug('/admin/tools/wpimport/news');
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
        console.log("News "+index);
        console.log("News "+news.title.rendered);
        //console.log(news);
        let tmp = {
          old_id: news.id,
          creation_date: news.date,
          slug: news.slug,
          title: news.title.rendered,
          is_public: true,
          abouts: [{
            lang: 'en',
            abouttext: news.content.rendered
          }],
          stats: {
            views: 100+Math.floor((Math.random() * 1000) + 1),
            likes: 100+Math.floor((Math.random() * 1000) + 1)
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
          console.log("slugs");
          console.log(slugs);
          var usersA = persons.map(function(item){ return item._id; });
          console.log("usersA");
          if (!usersA.length) usersA = ['5be8772bfc39610000007065'];
          tmp.users = usersA;
          console.log(usersA);
          if (news.featured && news.featured.full) {
            let filename = '';
            let dest = '';
            const source = news.featured.full;
            filename = source.substring(source.lastIndexOf('/') + 1);
  
            news.date = new Date(news.date);
            let month = news.date.getMonth() + 1;
            month = month < 10 ? '0' + month : month;
            contaposttotal++;
            dest = `${global.appRoot}/glacier/news_originals/${news.date.getFullYear()}/`;
            if (!fs.existsSync(dest)) {
              logger.debug(fs.mkdirSync(dest));
            }
            dest += month;
            if (!fs.existsSync(dest)) {
              logger.debug(fs.mkdirSync(dest));
            }
            dest += `/${filename}`;
            //console.log(dest.replace(global.appRoot, '')+filename);
            tmp.image = {
              file: dest.replace(global.appRoot, ''),
              filename: filename,
              originalname: source
            };
            data.push(tmp);
            router.download(source, dest, (p1,p2,p3) => {
              contapost++;
              console.log('contapost download ');
              console.log(data.length);
              console.log(body.length);
              console.log(contapost);

              if (contapost == body.length) {
                console.log('saveoutput ');
                console.log(data.length);
                console.log(data);
                News.
                create(data, (err) => {
                  let result;
                  if (err) {
                    console.log('error '+err);
                    result = err;
                  } else {
                    result = data;
                  }
                  res.render('admin/tools', {
                    title: 'News',
                    currentUrl: req.originalUrl,
                    data: result,
                    //script: false
                    script: '<script>var timeout = setTimeout(function(){location.href="/admin/tools/wpimport/news?page=' + (page) + '"},1000);</script>'
                  });
                });
              }
  
            });          
          } else {
            contapost++;
            console.log('contapost NO download ');
            console.log(data.length);
            console.log(body.length);
            console.log(contapost);
            if (contapost == body.length) {
              console.log('saveoutput ');
              console.log(data.length);
              console.log(data);
              News.
              create(data, (err) => {
                let result;
                if (err) {
                  console.log('error '+err);
                  result = err;
                } else {
                  result = data;
                }
                res.render('admin/tools', {
                  title: 'News',
                  currentUrl: req.originalUrl,
                  data: result,
                  //script: false
                  script: '<script>var timeout = setTimeout(function(){location.href="/admin/tools/wpimport/news?page=' + (page) + '"},1000);</script>'
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
}); */
router.get('/news_import', (req, res) => {
  logger.debug('/admin/tools/import/news_import');
  logger.debug(req.session.news);
  let news = JSON.parse('{"q": '+req.session.news+'}').q;
  logger.debug(news);
  let page = req.query.page ? parseFloat(req.query.page) : 0;
  logger.debug(news[page]);
  if (news[page]) {
    const url = "https://flyer.dev.flyer.it/wp-json/wp/v2/news/"+news[page];
    console.log({"url": url});

    request({
        url: url,
        json: true
    }, function (error, response, body) {
      console.log(error);
      console.log(response.statusCode);
      console.log("body.ID");
      console.log(body.ID);
      if (!error && response.statusCode === 200) {
        page++;
        if (body.ID) {
          let news = body;
          console.log("News "+news.post_title);
          console.log(news);
          let tmp = {
            old_id: news.ID,
            creation_date: news.date,
            slug: news.post_name,
            title: news.post_title,
            is_public: true,
            abouts: [{
              lang: 'en',
              abouttext: news.post_content
            }],
            stats: {
              views: 100+Math.floor((Math.random() * 1000) + 1),
              likes: 100+Math.floor((Math.random() * 1000) + 1)
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
            console.log("slugs");
            console.log(slugs);
            var usersA = persons.map(function(item){ return item._id; });
            console.log("usersA");
            if (!usersA.length) usersA = ['5be8772bfc39610000007065'];
            tmp.users = usersA;
            console.log(usersA);
            if (news.featured && news.featured.full) {
              let filename = '';
              let dest = '';
              const source = news.featured.full;
              filename = source.substring(source.lastIndexOf('/') + 1);
    
              news.date = new Date(news.date);
              let month = news.date.getMonth() + 1;
              month = month < 10 ? '0' + month : month;
              dest = `${global.appRoot}/glacier/news_originals/${news.date.getFullYear()}/`;
              if (!fs.existsSync(dest)) {
                logger.debug(fs.mkdirSync(dest));
              }
              dest += month;
              if (!fs.existsSync(dest)) {
                logger.debug(fs.mkdirSync(dest));
              }
              dest += `/${filename}`;
              //console.log(dest.replace(global.appRoot, '')+filename);
              tmp.image = {
                file: dest.replace(global.appRoot, ''),
                filename: filename,
                originalname: source
              };
              router.download(source, dest, (p1,p2,p3) => {
  
                console.log('saveoutput ');
                console.log(tmp);
                News.
                update({slug: tmp.slug}, tmp, {upsert: true}, (err) => {
                  let result;
                  if (err) {
                    console.log('error '+err);
                    result = err;
                  } else {
                    result = tmp;
                  }
                  res.render('admindev/supertools/import', {
                    title: 'WP News',
                    currentUrl: req.originalUrl,
                    body: req.session.news,
                    formUrl: req.originalUrl,
                    data: error || result,
                    //script: false
                    script: '<script>var timeout = setTimeout(function(){location.href="/admindev/supertools/wpimport/news_import?page=' + (page) + '"},1000);</script>'
                  });
              });
    
              });          
            } else {
              console.log('saveoutput ');
              console.log(tmp);
              News.
              update({slug: tmp.slug}, tmp, {upsert: true}, (err) => {
                let result;
                if (err) {
                  console.log('error '+err);
                  result = err;
                } else {
                  result = tmp;
                }
                res.render('admindev/supertools/import', {
                  title: 'WP News',
                  currentUrl: req.originalUrl,
                  body: req.session.news,
                  formUrl: req.originalUrl,
                  data: error || result,
                  //script: false
                  script: '<script>var timeout = setTimeout(function(){location.href="/admindev/supertools/wpimport/news_import?page=' + (page) + '"},1000);</script>'
                });
              });
            }
          });
        } else {
          res.render('admindev/supertools/import', {
            title: 'WP News',
            currentUrl: req.originalUrl,
            body: req.session.news,
            formUrl: req.originalUrl,
            data: {msg: ['ERROR: '+news[(page-1)]+" http://flyer.dev.flyer.it/wp-admin/user-edit.php?user_id="+body.ID+"&action=edit"]},
            //script: false
            //script: '<script>var timeout = setTimeout(function(){location.href="/admindev/supertools/wpimport/organizations_import?page=' + (page) + '"},1000);</script>'
          });
        }
      } else {
        res.render('admindev/supertools/import', {
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
    res.render('admindev/supertools/import', {
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
  request.head(source, function(err, res, body){
    if (err) {
      console.log(err);
    }
    if (res) {
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
    }
    //dest = dest.substring(0, dest.lastIndexOf("/"));
    console.log("source ");
    console.log(source);
    console.log("dest ");
    console.log(dest);
    request(source).pipe(fs.createWriteStream(dest)).on('close', callback);
  });
};

module.exports = router;