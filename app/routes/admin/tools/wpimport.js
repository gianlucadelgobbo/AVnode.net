const router = require('../../router')();
const request = require('request');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const User = mongoose.model('User');
const Event = mongoose.model('Event');

const logger = require('../../../utilities/logger');
const events = [
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
    if (!error && response.statusCode === 200, body) {
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
          currentUrl: req.path,
          data: result,
          //script: false
          script: '<script>var timeout = setTimeout(function(){location.href="/admin/tools/wpimport/events?page=' + (page) + '"},1000);</script>'
        });
      });
/* body.date = new Date(body.date);
      let month = body.date.getMonth() + 1;
      month = month < 10 ? '0' + month : month;
      const source = body.featured.full;
      console.log(source);
      let filename = '';
      let dest = '';
      //if (source) {
        contaposttotal++;
        filename = source.substring(source.lastIndexOf('/') + 1);
        dest = `${global.appRoot}/glacier/news_originals/${body.date.getFullYear()}/`;
        if (!fs.existsSync(dest)) {
          logger.debug(fs.mkdirSync(dest));
        }
        dest += month;
        if (!fs.existsSync(dest)) {
          logger.debug(fs.mkdirSync(dest));
        }
        dest += `/${filename}`;
        console.log(dest);
        router.download(source, dest, (p1,p2,p3) => {
          contapost++;
          let tmp = {
            old_id: body.id,
            creation_date: body.date,
            slug: body.slug,
            title: body.title.rendered,
            is_public: true,
            abouts: [{
              lang: 'en',
              abouttext: body.content.rendered
            }],
            stats: {
              views: 100+Math.floor((Math.random() * 1000) + 1),
              likes: 100+Math.floor((Math.random() * 1000) + 1)
            },
            web: [],
            social: [],
            image :{
              file: dest.replace(global.appRoot, ''),
              filename: filename,
              originalname: source
            },
            users: []
          };
          if (body.video_thumbnail && body.video_thumbnail !== '') {
            tmp.media = {url: body.video_thumbnail};
          }
          for (let web_site in body.web_site) {
            if (
              body.web_site[web_site].indexOf("facebook.com")!==-1 ||
              body.web_site[web_site].indexOf("fb.com")!==-1 ||
              body.web_site[web_site].indexOf("twitter.com")!==-1 ||
              body.web_site[web_site].indexOf("instagram.com")!==-1 ||      
              body.web_site[web_site].indexOf("youtube.com")!==-1 ||      
              body.web_site[web_site].indexOf("vimeo.com")!==-1      
            ) {
              tmp.social.push({
                url: body.web_site[web_site],
                type: 'social'
              });
            } else {
              tmp.web.push({
                url: body.web_site[web_site],
                type: 'web'
              });
            }
          }
          let contausers = 0;
          for (let user in body.capauthors) {
            User.
            findOne({slug: user.user_login}).
            select('_id').
            exec((err, person) => {
              if (!person || !person._id) person = {'_id': '5a8b7256a5755a000000d702'};
              contausers++;
              console.log('person');
              console.log(person);
              tmp.users.push(person);
              console.log(tmp.slug);
              console.log('contausers '+contausers);
              console.log('capauthors '+body.capauthors.length);
              console.log('contapost '+contapost);
              console.log('contaposttotal '+contaposttotal);
              console.log('body.length '+body.length);
              if (contausers == body.capauthors.length) {
                data.push(tmp);
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
                      currentUrl: req.path,
                      data: result,
                      script: false
                      //script: '<script>var timeout = setTimeout(function(){location.href="/admin/tools/import/news?page=' + (page) + '"},1000);</script>'
                    });
                  });
                }
              }
            });
          }
        }); */
    } else {
      res.render('admin/tools', {
        title: 'News',
        currentUrl: req.path,
        data: {msg: ['End']},
        script: false
      });
    }
  });
});

router.get('/news', (req, res) => {
  logger.debug('/admin/tools/import/news');
  let page = (req.param.page ? req.param.page : 1);
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
      body.forEach((body, index) => {
        body.date = new Date(body.date);
        let month = body.date.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        const source = body.featured.full;
        console.log(source);
        let filename = '';
        let dest = '';
        //if (source) {
          contaposttotal++;
          filename = source.substring(source.lastIndexOf('/') + 1);
          dest = `${global.appRoot}/glacier/news_originals/${body.date.getFullYear()}/`;
          if (!fs.existsSync(dest)) {
            logger.debug(fs.mkdirSync(dest));
          }
          dest += month;
          if (!fs.existsSync(dest)) {
            logger.debug(fs.mkdirSync(dest));
          }
          dest += `/${filename}`;
          console.log(dest);
          router.download(source, dest, (p1,p2,p3) => {
            contapost++;
            let tmp = {
              old_id: body.id,
              creation_date: body.date,
              slug: body.slug,
              title: body.title.rendered,
              is_public: true,
              abouts: [{
                lang: 'en',
                abouttext: body.content.rendered
              }],
              stats: {
                views: 100+Math.floor((Math.random() * 1000) + 1),
                likes: 100+Math.floor((Math.random() * 1000) + 1)
              },
              web: [],
              social: [],
              image :{
                file: dest.replace(global.appRoot, ''),
                filename: filename,
                originalname: source/*,
                mimetype: String,
                size: Number,
                width: Number,
                height: Number*/
              },
              users: []
            };
            if (body.video_thumbnail && body.video_thumbnail !== '') {
              tmp.media = {url: body.video_thumbnail};
            }
            for (let web_site in body.web_site) {
              if (
                body.web_site[web_site].indexOf("facebook.com")!==-1 ||
                body.web_site[web_site].indexOf("fb.com")!==-1 ||
                body.web_site[web_site].indexOf("twitter.com")!==-1 ||
                body.web_site[web_site].indexOf("instagram.com")!==-1 ||      
                body.web_site[web_site].indexOf("youtube.com")!==-1 ||      
                body.web_site[web_site].indexOf("vimeo.com")!==-1      
              ) {
                tmp.social.push({
                  url: body.web_site[web_site],
                  type: 'social'
                });
              } else {
                tmp.web.push({
                  url: body.web_site[web_site],
                  type: 'web'
                });
              }
            }
            let contausers = 0;
            for (let user in body.capauthors) {
              User.
              findOne({slug: user.user_login}).
              select('_id').
              exec((err, person) => {
                if (!person || !person._id) person = {'_id': '5a8b7256a5755a000000d702'};
                contausers++;
                console.log('person');
                console.log(person);
                tmp.users.push(person);
                console.log(tmp.slug);
                console.log('contausers '+contausers);
                console.log('capauthors '+body.capauthors.length);
                console.log('contapost '+contapost);
                console.log('contaposttotal '+contaposttotal);
                console.log('body.length '+body.length);
                if (contausers == body.capauthors.length) {
                  data.push(tmp);
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
                        currentUrl: req.path,
                        data: result,
                        script: false
                        //script: '<script>var timeout = setTimeout(function(){location.href="/admin/tools/import/news?page=' + (page) + '"},1000);</script>'
                      });
                    });
                  }
                }
              });
            }
          });
      });
    } else {
      res.render('admin/tools', {
        title: 'News',
        currentUrl: req.path,
        data: {msg: ['End']},
        script: false
      });
    }
  });
});

module.exports = router;