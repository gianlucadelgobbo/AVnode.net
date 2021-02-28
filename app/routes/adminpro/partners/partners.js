const router = require('../../router')();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = mongoose.model('User');
const ObjectId = mongoose.Types.ObjectId;
const Event = mongoose.model('Event');
const Category = mongoose.model('Category');
const Gallery = mongoose.model('Gallery');
const Emailqueue = mongoose.model('Emailqueue');

const fs = require('fs');
const config = require('getconfig');
const sharp = require('sharp');

const logger = require('../../../utilities/logger');

var populate = [
  {path: "members", select: {stagename:1, gender:1, name:1, surname:1, email:1, emails:1, phone:1, mobile:1, lang:1, skype:1, slug:1, social:1, web:1}, model:"UserShow"},
  {path: "partnerships", select: {title:1, slug:1}, model:"EventShow"},
  {path: "partnerships.category", select: {name:1, slug:1}, model:"Category"}
];

//HOME - ORGANIZATIONS LIST
router.get('/', (req, res) => {
  const myids = req.user.crews.concat([req.user._id]);
  User.
  find({"_id": {$in:myids}}).
  sort({stagename: 1}).
  select({stagename:1}).
  exec((err, data) => {
    //logger.debug(Object.keys(data[0]));

    if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
      res.json(data);
    } else {
      res.render('adminpro/partners/home', {
        title: 'Partners',
        currentUrl: req.originalUrl,
        
        data: data,
        script: false
      });
    }
  });
});

router.get('/:id', (req, res) => {
  router.getPartners(req, res);
});

/* router.get('/:id/send', (req, res) => {
  router.getEmailqueue(req, res);
}); */

router.get('/:id/:sez', (req, res) => {
  router.getPartners(req, res);
});

router.post('/:id/:sez', (req, res) => {
  router.getPartners(req, res);
});

router.get('/:id/event/:event', (req, res) => {
  router.getPartners(req, res);
});

router.get('/:id/event/:event/manage', (req, res) => {
  getManageables(req, res);
});

/* router.get('/:id/event/:event/send', (req, res) => {
  router.getEmailqueue(req, res);
}); */

router.get('/:id/event/:event/:sez', (req, res) => {
  router.getPartners(req, res);
});

router.post('/:id/event/:event/:sez', (req, res) => {
  router.getPartners(req, res);
});

/* router.getEmailqueue = (req, res) => {
  logger.debug('/getEmailqueue/'+req.params.id);
  logger.debug("req.body");
  logger.debug(req.body);
  logger.debug("req.params");
  logger.debug(req.params);

  User.
  findOne({"_id": req.params.id}).
  lean().
  select({stagename: 1}).
  exec((err, user) => {
    Event.
    find({"users": req.params.id}).
    select({title: 1}).
    sort({title: 1}).
    //select({stagename: 1, createdAt: 1, crews:1}).
    exec((err, events) => {
      var query = {organization: req.params.id};
      if (req.params.event) query.event = req.params.event;
      var populate = [
        {path: "organization", select: {stagename:1, slug:1}, model:"UserShow"},
        {path: "user", select: {stagename:1, slug:1}, model:"UserShow"},
        {path: "event", select: {title:1, slug:1}, model:"EventShow"}
      ];
      Emailqueue.
      find(query).
      //sort({stagename: 1}).
      //select({stagename: 1, createdAt: 1, crews:1}).
      populate(populate).
      exec((err, data) => {
        if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
          res.json(data);
        } else {
          res.redirect('/adminpro/emailqueue/')
          res.render('adminpro/partners/organization_partners_send', {
            title: 'Partners: '+user.stagename,
            currentUrl: req.originalUrl,
            map: req.query.map,
            csv: req.query.csv,
            body: req.body,
            event: req.params.event,
            
            owner: req.params.id,
            events: events,
            user: req.user,
            data: data,
            script: false
          });
        }
      });
    });
  });
} */

router.getPartners = (req, res) => {
  logger.debug('/getPartners/'+req.params.id);
  logger.debug("req.body");
  logger.debug(req.body);
  logger.debug("req.params");
  logger.debug(req.params);
  User.
  findOne({"_id": req.params.id}).
  lean().
  select({stagename: 1}).
  exec((err, user) => {
    Event.
    find({"users": req.params.id}).
    select({title: 1}).
    sort({title: 1}).
    //select({stagename: 1, createdAt: 1, crews:1}).
    exec((err, events) => {
      var query = {$or : [{"partner_owner.owner": req.params.id}]}
      if (req.params.event) query.partnerships = req.params.event;
      if (user._id.toString()=="5be8772bfc39610000007065") query["$or"].push({"is_crew" : true, "activity_as_organization" : {"$gt": 0}});
      User.
      find(query).
      lean().
      sort({stagename: 1}).
      //select({stagename: 1, createdAt: 1, crews:1}).
      populate(populate).
      exec((err, data) => {
        if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
          res.json(data);
        } else {
          if (req.body.subject && req.params.sez=="send") {
            var tosave = {};
            tosave.organization = req.params.id;
            if (req.params.event) tosave.event = req.params.event;
            tosave.user = req.user._id;
            tosave.subject = req.body.subject;
            tosave.messages_tosend = [];
            tosave.messages_sent = [];
            data.forEach((item, index) => {
              var message = {};
              if (item.organizationData && item.organizationData.contacts && item.organizationData.contacts[0] && item.organizationData.contacts[0].email && req.body.exclude.indexOf(item._id.toString())===-1) {
                message.to_html = "";
                message.cc_html = [];

                message.from_name = req.body.from_name;
                message.from_email = req.body.from_email;
                message.user_email = req.body.user_email;
                message.user_password = req.body.user_password;
                message.subject = req.body.subject.split("[org_name]").join(item.stagename);;
                item.organizationData.contacts.forEach((contact, cindex) => {
                  if (contact.email && message.to_html == "") {
                    message.to_html = (contact.name ? contact.name+" " : "")+(contact.surname ? contact.surname+" " : "")+"<"+contact.email+">"
                    message.text = req.body["message_"+(contact.lang=="it" ? "it" : "en")]
                    message.text = message.text.split("[name]").join(contact.name);
                    message.text = message.text.split("[slug]").join(item.slug);
                  } else if (contact.email && message.to_html != "") {
                    message.cc_html.push((contact.name ? contact.name+" " : "")+(contact.surname ? contact.surname+" " : "")+"<"+contact.email+">")
                  }
                });
                if (message.to_html != "") tosave.messages_tosend.push(message)
              } else {
                //logger.debug(item.stagename);
              }
            });
            Emailqueue.create(tosave, function (err) {
              logger.debug("Emailqueue.create")
              var query = {organization: req.params.id};
              if (req.params.event) query.event = req.params.event;
              var populate = [
                {path: "organization", select: {stagename:1, slug:1}, model:"UserShow"},
                {path: "user", select: {stagename:1, slug:1}, model:"UserShow"},
                {path: "event", select: {title:1, slug:1}, model:"EventShow"}
              ];
              Emailqueue.
              find(query).
              //sort({stagename: 1}).
              //select({stagename: 1, createdAt: 1, crews:1}).
              populate(populate).
              exec((err, data) => {
                res.redirect(req.originalUrl)
              });
            });

          } else {
            res.render('adminpro/partners/organization_partners'+(req.params.sez ? "_"+req.params.sez : ""), {
              title: 'Partners: '+user.stagename,
              currentUrl: req.originalUrl,
              map: req.query.map,
              csv: req.query.csv,
              body: req.body,
              event: req.params.event,
              
              owner: req.params.id,
              events: events,
              user: req.user,
              data: data,
              script: false
            });  
          }
        }
      });
    });
  });
}





router.get('/:id/:event/grantsdata', (req, res) => {
  logger.debug('/organizations/'+req.params.event);
  var grantevents = {
    flyer: [{
      "Event Name": "Live Cinema Festival",
      "Event Month": "September (second week)",
      "Event City": "Rome",
      "Event Country": "Italy",
      "Description": "Live Cinema Festival is a live performing exhibition that explores and promotes all the artistic trends which is classified as “Live Cinema”, with performances by artists using this narrative technique as their stylistic code.\n\nLive Cinema Festival is an artistic project that includes, among its main objectives, the enhancement of the territory and the promotion of artistic contents that can actively involve young people by creating inputs that can positively influence their lives.\n\nLive Cinema Festival is an event that reflects the spirit of our era in which the technology has totally invaded every aspect of our lives: in this event machines, arts and technology melt together in order to spread new messages and new perspectives, proposing a new imaginary, breaking down the borders between the medium and the content, manipulating images and using different approaches to make the final content clearly relied on the artists’ improvisation and ability."
    },{
      "Event Name": "Fotonica Festival",
      "Event Month": "December",
      "Event City": "Rome",
      "Event Country": "Italy",
      "Description": "FOTONICA from photon, historically as light, from Greek φωτός (photòs), is an event that investigates art forms related to the light element, in particular digital light by italian artists.\n\nThe main objective of FOTONICA is to create a place of reference for Audio Visual Digital Art from italy where to host more and more audience and the most famous italian artists, thanks to the many various activities in the program. \n\nThe other objectives of the event are no less important:\n.The creation of network of exchanges\n.Become part of an International program\n.Promote the local territory and its cultural program\n.Improve the skills of the public, experts and professionals\n\nFOTONICA is an event capable of interpreting the creative power of light in a thousand different facets, of making the photon, the smallest and brightest fragment of the universe, the original particle of a sparkling creative universe."
    },{
      "Event Name": "LPM Live Performers Meeting",
      "Event Month": "February",
      "Event City": "DECIDED YEARLY BY THE COMMUNITY",
      "Event Country": "",
      "Description": "The event features a full programme of live video performances open to the public, applied in combination with the most varied forms of artistic expression, and a number of initiatives particularly for guests of the meeting.\n\nThe “On” area allows the audience to attend the different applications in live video through the performances of artists and groups from the international scene.\n\nThe “Off” area, aimed at the Meeting, is an occasion of confrontation between vj and video artists working in the themes of Live Visuals Performances and is conceived as a separate area, frequented mainly by “insiders” with a program that alternates spaces meeting, workshops and showcase projects and products.\n\nLPM is a space open to freedom of expression, research and experimentation; the programme flexibility, the openness to new members and contributions, the freedom to participate and the opportunity to perform during the event, are an intrinsic characteristic."
    }],
    telenoika: [{
      "Event Name": "Visual Brasil",
      "Event Month": "September (fourth week)",
      "Event City": "Barcelona",
      "Event Country": "Spain",
      "Description": "The Visual Brasil Festival celebrates together with local and international artists a research\n\nmeeting in the field of contemporary audiovisual: video art, mapping, audiovisual performances, workshops, installations and VJs. An activity that focuses on the production of video in real time, the culture of free creation and new collaborative formats.\n\nStarted in 2006, the festival has 17 editions (http://www.festivalvisualbrasil.com/ediciones), and it has become a reference for the world audiovisual community. Every year, between 40 and 68 artists meet in the space of the Park of the Industrial Spain, in Barcelona city and they celebrate an innovative and experimental music and audiovisual shows during 3 days, normally at the end of september.\n\nThe Visual Brasil festival count on the support of the Sants District of the city of Barcelona and the Multimedia Point of Sants neighborough."
    }],
    photon: [{
      "Event Name": "Patchlab Festival",
      "Event Month": "October (second week)",
      "Event City": "Cracow",
      "Event Country": "Poland",
      "Description": "Patchlab Digital Art Festival is an annual event for art based on the latest technologies and new media, interested in the creative potential in machines, algorithms, programming and databases. Festival explores key phenomena in contemporary culture and art, including VR, augmented reality, artificial intelligence, hacking and digital identities.\n\nPatchlab is exhibitions, performances and audiovisual concerts, films, workshops with artists and technology specialists, meetings and discussions.\n\nThe festival has been held in Krakow since 2012.\n\nPatchlab is organised by the Photon Foundation\n\nIn 2019 Patchlab Festival received the ‘EFFE Label 2019-2020’ – a quality stamp of European Festivals Association (EFA) given for outstanding and innovative approaches, remarkable arts festivals attributed for their work in the field of the arts, community involvement and international openness."    }],
    lunchmeat: [{
      "Event Name": "Lunchmeat Festival",
      "Event Month": "October (fourth week)",
      "Event City": "Prague",
      "Event Country": "Czech Republic",
      "Description": "Lunchmeat is an annual international festival dedicated to advanced electronic music and new media art based in Prague, Czech Republic.\n\nIt brings carefully selected creators from different art spheres together on one stage, creating a truly synesthetic experience.\n\nLunchmeat Festival was born in 2010 and since then it presented more than four hundred artists and art projects from all over the world.\n\nLunchmeat Festival's main program has three nights and is taking place in the National Gallery Prague.\n\nIntegral part of the program is an artistic residency of one musician and visual artist who are brought together to create new audiovisual live act.\n\nThe accompanying program consists of permanent video projections in public space, exhibition, INPUT workshops and INPUT Symposium on Digital Arts.\n\nThe INPUT is an edutainment series for students and professionals in new media and digital arts.\n\nThe Lunchmeat Festival stands in the core of the Prague audiovisual community and is trying to moderate the discussion about the Czech audiovisual arts in the context of the scene worldwide."
    }],
    simultan: [{
      "Event Name": "Simultan Festival",
      "Event Month": "November (second week)",
      "Event City": "Bucharest",
      "Event Country": "Romania",
      "Description": "SIMULTAN is an annual festival dedicated to media art and artistic experiment, creating a bond between different media.\n\nThe festival was born as an artistic project having the goal to create a cultural context of the ‘here and now’ on the local scene, encouraging new and innovative forms of artistic expression, as visual and sound language.\n\nThe festival’s perspective has shifted over the years – going from challenging our audiovisual comprehension experience to exploring the human-machine interactions and experimenting with various tools and technologies to question their social implications and overall impact on our daily lives.\n\nSIMULTAN festival approaches new aesthetics and showcases video art and live events whose main themes include: stylistic eclecticism, the relationship between humans and machine, recycle-environmental themes, dry lyricism, acoustic and electronic instrumental fusion, expanded cinema, jovial live sound collages, and the reflection on the political valences of sonic practice."
    }],
    qvrtv: [{
      "Event Name": "Thetaversal",
      "Event Month": "November (fourth week)",
      "Event City": "Galway",
      "Event Country": "Ireland",
      "Description": "ThetaVersal is an Audiovisual Festival and will be a brand new event in Ireland with the aim to be a Platform for live Audiovisual Performance Art, VJing, Video Mapping, Video and sound art.\n\nThetaVersal which comes from the idea of a universal connection among artists creating imaginative work in new and innovative ways, while implementing Emerging Technologies and how they can be used in the creation of art. It involves immersive events, exhibitions, performances, workshops, happenings, live demonstrations and performances throughout the course of each year. The goal of the project is to expand and work with artists in other countries as well as across Ireland and to connect artists in the community, leading to cross country artist transfers.\n\nThe team members have years of experience in multiple areas including New Media Artists and technicians from groups across Ireland.\nThetaVersal events include skill sharing workshops, as well as providing a way for artists to showcase their work."
    }],
    jetztkultur: [{
      "Event Name": "B-Seite Festival",
      "Event Month": "March",
      "Event City": "Mannheim",
      "Event Country": "Germany",
      "Description": "The B-Seite Festival covers the entire spectrum of audiovisual culture, new media art and digital art. Audiovisual performances, surprise interventions in public space, an curated exhibition and workshops among other co-operations bring international, national and local artists toghether and offer the Mannheim audience the most relevant festival of this kind in Germany.\n\nMore than 10 editions established a cultural icon, where multiple disciplines melt together. The focus was always on the \"flipside of a vinyl\", the B-side. The curators search for new talents and offer a laboratory and the stage for the latest state of creativity.\n \nThe festival nowadays toggles annually between a full week festival and a year of selective showcases. The Jungbusch area and Mannheim, as a figurehead of a modern multicultural european and global city, is the perfect spot and a strong partner to establish this type of art. The association is the perfect independant host to curate the raw diamonds."
    }],
    elasticeye: [{
      "Event Name": "Splice Festival",
      "Event Month": "April",
      "Event City": "London",
      "Event Country": "United Kingdom",
      "Description": "Splice Festival, born in 2016 within AVnode 2015 > 2018 project, explores the overlapping fields of audio-visual art and culture through a collection of live performances, talks and workshops focused around live cinema, AV remixing, VJing, video art and projection mapping."
    }],
    multitrab: [{
      "Event Name": "Athens Digital Art Festival",
      "Event Month": "May",
      "Event City": "Athens",
      "Event Country": "Greece",
      "Description": "Interactive works, audiovisual installations, video art, web art, digital image, creative workshops for adults and kids, artists’ talks, presentations of international festivals, AV performances and music events, highlighting the developments in new technologies and artistic practices."
    }],
    avmov: [{
      "Event Name": "Amorphous Festival",
      "Event Month": "June",
      "Event City": "Caldas da Rainha",
      "Event Country": "Portugal",
      "Description": "Amorphous Festival wants to create an international AV event in Portugal, gathering national artists, both established and emerging ones, local students, programmers and teachers, at an event dedicated to audiovisual performance in Caldas da Rainha with workshops, Lectures, AV installations, micromapping, AV performances, vj/dj sets and live video mapping."
    }],
    avnode: [{
      "Event Name": "AVnode Meeting",
      "Event Month": "July (first week)",
      "Event City": "Amsterdam",
      "Event Country": "Netherlands",
      "Description": "Annual meeting of the partners of the project in Amsterdam. 3 Days of full immersion on project development and report during the day and a selection of artists from every partner will follow in the evening."
    }],
    "debreceni-campus": [{
      "Event Name": "Campus fesztival",
      "Event Month": "July (fourth week)",
      "Event City": "Debrecen",
      "Event Country": "Hungary",
      "Description": "Campus Festival is an annual open-air popular music and multi-art festival held in the Great Forest Park of Debrecen, Hungary.\n\nWith a four-day attendance of 113.000 in 2019, Campus is the biggest open-air youth cultural event in Eastern Hungary.\n\nThe venue is a beloved city park with emblematic buildings like the new stadium and the old water tower.\n\nThe festival has its own accompanying events at the same time: Campus Art is a showcase of local art organizations, Campus Kid is for families and kids and the Campus Olympics are for university sport teams.\n\nToday Campus usually runs with 18 stages and programme venues, representing a wide range of popular music genres and also other branches of art as theatre, literature, cinema, dance and circus art.\n\nWe also welcome several NGO’s to add their activities to our programme.\n\nIn 2017 and 2019, the event got the EFFE (Europe For Festivals, Festivals For Europe) Quality Label and also it recently won the ARTISJUS prize for the best event."
    }]};


  const query = {"partner_owner.owner": req.params.id, "partnerships":req.params.event};
  logger.debug(query);
  User.
  find(query).
  lean().
  sort({"organizationData.legal_name": 1}).
  //select({stagename: 1, createdAt: 1, crews:1}).
  populate(populate).
  exec((err, data) => {
    if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
      res.json(data);
    } else {
      res.render('adminpro/partners/grantsdata', {
        title: 'Partners',
        currentUrl: req.originalUrl,
        
        owner: req.params.id,
        event: req.params.event,
        grantevents: grantevents,
        user: req.user,
        printable: true,
        data: data,
        script: false
      });
    }
  });
});


router.get('/:id/:event/mandates', (req, res) => {
  logger.debug('/organizations/'+req.params.event);
  Event.
  findOne({"_id": req.params.event}).
  select({title: 1}).
  exec((err, event) => {
    const query = {"partner_owner.owner": req.params.id, "partnerships":req.params.event};
    const mandate = "";
    logger.debug(query);
    User.
    find(query).
    lean().
    sort({"organizationData.legal_name": 1}).
    //select({stagename: 1, createdAt: 1, crews:1}).
    populate(populate).
    exec((err, data) => {
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        res.json(data);
      } else {
        res.render('adminpro/partners/mandates', {
          title: 'Partners',
          currentUrl: req.originalUrl,
          
          owner: req.params.id,
          event: req.params.event,
          event_title: event.title,
          mandate: mandate,
          user: req.user,
          printable: true,
          data: data,
          script: false
        });
      }
    });
  });
});


router.get('/:id/:event/grantsdata_table', (req, res) => {
  logger.debug('/organizations/'+req.params.event);
  Event.
  findOne({"_id": req.params.event}).
  select({title: 1}).
  exec((err, event) => {
    const query = {"partner_owner.owner": req.params.id, "partnerships":req.params.event};
    const mandate = "";
    logger.debug(query);
    User.
    find(query).
    lean().
    sort({"organizationData.legal_name": 1}).
    //select({stagename: 1, createdAt: 1, crews:1}).
    populate(populate).
    exec((err, data) => {
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        res.json(data);
      } else {
        res.render('adminpro/partners/grantsdata_table', {
          title: 'Partners',
          currentUrl: req.originalUrl,
          
          owner: req.params.id,
          event: req.params.event,
          event_title: event.title,
          mandate: mandate,
          user: req.user,
          printable: true,
          data: data,
          script: false
        });
      }
    });
  });
});

router.get('/:id/:event/grantsdata_events', (req, res) => {
  var grantevents = {
    flyer: [{
      "Event Name": "Live Cinema Festival",
      "Event Month": "September (second week)",
      "Event City": "Rome",
      "Event Country": "Italy",
      "Description": "Live Cinema Festival is a live performing exhibition that explores and promotes all the artistic trends which is classified as “Live Cinema”, with performances by artists using this narrative technique as their stylistic code.\n\nLive Cinema Festival is an artistic project that includes, among its main objectives, the enhancement of the territory and the promotion of artistic contents that can actively involve young people by creating inputs that can positively influence their lives.\n\nLive Cinema Festival is an event that reflects the spirit of our era in which the technology has totally invaded every aspect of our lives: in this event machines, arts and technology melt together in order to spread new messages and new perspectives, proposing a new imaginary, breaking down the borders between the medium and the content, manipulating images and using different approaches to make the final content clearly relied on the artists’ improvisation and ability."
    },{
      "Event Name": "Fotonica Festival",
      "Event Month": "December",
      "Event City": "Rome",
      "Event Country": "Italy",
      "Description": "FOTONICA from photon, historically as light, from Greek φωτός (photòs), is an event that investigates art forms related to the light element, in particular digital light by italian artists.\n\nThe main objective of FOTONICA is to create a place of reference for Audio Visual Digital Art from italy where to host more and more audience and the most famous italian artists, thanks to the many various activities in the program. \n\nThe other objectives of the event are no less important:\n.The creation of network of exchanges\n.Become part of an International program\n.Promote the local territory and its cultural program\n.Improve the skills of the public, experts and professionals\n\nFOTONICA is an event capable of interpreting the creative power of light in a thousand different facets, of making the photon, the smallest and brightest fragment of the universe, the original particle of a sparkling creative universe."
    },{
      "Event Name": "LPM Live Performers Meeting",
      "Event Month": "February",
      "Event City": "DECIDED YEARLY BY THE COMMUNITY",
      "Event Country": "",
      "Description": "The event features a full programme of live video performances open to the public, applied in combination with the most varied forms of artistic expression, and a number of initiatives particularly for guests of the meeting.\n\nThe “On” area allows the audience to attend the different applications in live video through the performances of artists and groups from the international scene.\n\nThe “Off” area, aimed at the Meeting, is an occasion of confrontation between vj and video artists working in the themes of Live Visuals Performances and is conceived as a separate area, frequented mainly by “insiders” with a program that alternates spaces meeting, workshops and showcase projects and products.\n\nLPM is a space open to freedom of expression, research and experimentation; the programme flexibility, the openness to new members and contributions, the freedom to participate and the opportunity to perform during the event, are an intrinsic characteristic."
    }],
    telenoika: [{
      "Event Name": "Visual Brasil",
      "Event Month": "September (fourth week)",
      "Event City": "Barcelona",
      "Event Country": "Spain",
      "Description": "The Visual Brasil Festival celebrates together with local and international artists a research\n\nmeeting in the field of contemporary audiovisual: video art, mapping, audiovisual performances, workshops, installations and VJs. An activity that focuses on the production of video in real time, the culture of free creation and new collaborative formats.\n\nStarted in 2006, the festival has 17 editions (http://www.festivalvisualbrasil.com/ediciones), and it has become a reference for the world audiovisual community. Every year, between 40 and 68 artists meet in the space of the Park of the Industrial Spain, in Barcelona city and they celebrate an innovative and experimental music and audiovisual shows during 3 days, normally at the end of september.\n\nThe Visual Brasil festival count on the support of the Sants District of the city of Barcelona and the Multimedia Point of Sants neighborough."
    }],
    photon: [{
      "Event Name": "Patchlab Festival",
      "Event Month": "October (second week)",
      "Event City": "Cracow",
      "Event Country": "Poland",
      "Description": "Patchlab Digital Art Festival is an annual event for art based on the latest technologies and new media, interested in the creative potential in machines, algorithms, programming and databases. Festival explores key phenomena in contemporary culture and art, including VR, augmented reality, artificial intelligence, hacking and digital identities.\n\nPatchlab is exhibitions, performances and audiovisual concerts, films, workshops with artists and technology specialists, meetings and discussions.\n\nThe festival has been held in Krakow since 2012.\n\nPatchlab is organised by the Photon Foundation\n\nIn 2019 Patchlab Festival received the ‘EFFE Label 2019-2020’ – a quality stamp of European Festivals Association (EFA) given for outstanding and innovative approaches, remarkable arts festivals attributed for their work in the field of the arts, community involvement and international openness."    }],
    lunchmeat: [{
      "Event Name": "Lunchmeat Festival",
      "Event Month": "October (fourth week)",
      "Event City": "Prague",
      "Event Country": "Czech Republic",
      "Description": "Lunchmeat is an annual international festival dedicated to advanced electronic music and new media art based in Prague, Czech Republic.\n\nIt brings carefully selected creators from different art spheres together on one stage, creating a truly synesthetic experience.\n\nLunchmeat Festival was born in 2010 and since then it presented more than four hundred artists and art projects from all over the world.\n\nLunchmeat Festival's main program has three nights and is taking place in the National Gallery Prague.\n\nIntegral part of the program is an artistic residency of one musician and visual artist who are brought together to create new audiovisual live act.\n\nThe accompanying program consists of permanent video projections in public space, exhibition, INPUT workshops and INPUT Symposium on Digital Arts.\n\nThe INPUT is an edutainment series for students and professionals in new media and digital arts.\n\nThe Lunchmeat Festival stands in the core of the Prague audiovisual community and is trying to moderate the discussion about the Czech audiovisual arts in the context of the scene worldwide."
    }],
    simultan: [{
      "Event Name": "Simultan Festival",
      "Event Month": "November (second week)",
      "Event City": "Bucharest",
      "Event Country": "Romania",
      "Description": "SIMULTAN is an annual festival dedicated to media art and artistic experiment, creating a bond between different media.\n\nThe festival was born as an artistic project having the goal to create a cultural context of the ‘here and now’ on the local scene, encouraging new and innovative forms of artistic expression, as visual and sound language.\n\nThe festival’s perspective has shifted over the years – going from challenging our audiovisual comprehension experience to exploring the human-machine interactions and experimenting with various tools and technologies to question their social implications and overall impact on our daily lives.\n\nSIMULTAN festival approaches new aesthetics and showcases video art and live events whose main themes include: stylistic eclecticism, the relationship between humans and machine, recycle-environmental themes, dry lyricism, acoustic and electronic instrumental fusion, expanded cinema, jovial live sound collages, and the reflection on the political valences of sonic practice."
    }],
    qvrtv: [{
      "Event Name": "Thetaversal",
      "Event Month": "November (fourth week)",
      "Event City": "Galway",
      "Event Country": "Ireland",
      "Description": "ThetaVersal is an Audiovisual Festival and will be a brand new event in Ireland with the aim to be a Platform for live Audiovisual Performance Art, VJing, Video Mapping, Video and sound art.\n\nThetaVersal which comes from the idea of a universal connection among artists creating imaginative work in new and innovative ways, while implementing Emerging Technologies and how they can be used in the creation of art. It involves immersive events, exhibitions, performances, workshops, happenings, live demonstrations and performances throughout the course of each year. The goal of the project is to expand and work with artists in other countries as well as across Ireland and to connect artists in the community, leading to cross country artist transfers.\n\nThe team members have years of experience in multiple areas including New Media Artists and technicians from groups across Ireland.\nThetaVersal events include skill sharing workshops, as well as providing a way for artists to showcase their work."
    }],
    jetztkultur: [{
      "Event Name": "B-Seite Festival",
      "Event Month": "March",
      "Event City": "Mannheim",
      "Event Country": "Germany",
      "Description": "The B-Seite Festival covers the entire spectrum of audiovisual culture, new media art and digital art. Audiovisual performances, surprise interventions in public space, an curated exhibition and workshops among other co-operations bring international, national and local artists toghether and offer the Mannheim audience the most relevant festival of this kind in Germany.\n\nMore than 10 editions established a cultural icon, where multiple disciplines melt together. The focus was always on the \"flipside of a vinyl\", the B-side. The curators search for new talents and offer a laboratory and the stage for the latest state of creativity.\n \nThe festival nowadays toggles annually between a full week festival and a year of selective showcases. The Jungbusch area and Mannheim, as a figurehead of a modern multicultural european and global city, is the perfect spot and a strong partner to establish this type of art. The association is the perfect independant host to curate the raw diamonds."
    }],
    elasticeye: [{
      "Event Name": "Splice Festival",
      "Event Month": "April",
      "Event City": "London",
      "Event Country": "United Kingdom",
      "Description": "Splice Festival, born in 2016 within AVnode 2015 > 2018 project, explores the overlapping fields of audio-visual art and culture through a collection of live performances, talks and workshops focused around live cinema, AV remixing, VJing, video art and projection mapping."
    }],
    multitrab: [{
      "Event Name": "Athens Digital Art Festival",
      "Event Month": "May",
      "Event City": "Athens",
      "Event Country": "Greece",
      "Description": "Interactive works, audiovisual installations, video art, web art, digital image, creative workshops for adults and kids, artists’ talks, presentations of international festivals, AV performances and music events, highlighting the developments in new technologies and artistic practices."
    }],
    avmov: [{
      "Event Name": "Amorphous Festival",
      "Event Month": "June",
      "Event City": "Caldas da Rainha",
      "Event Country": "Portugal",
      "Description": "Amorphous Festival wants to create an international AV event in Portugal, gathering national artists, both established and emerging ones, local students, programmers and teachers, at an event dedicated to audiovisual performance in Caldas da Rainha with workshops, Lectures, AV installations, micromapping, AV performances, vj/dj sets and live video mapping."
    }],
    avnode: [{
      "Event Name": "AVnode Meeting",
      "Event Month": "July (first week)",
      "Event City": "Amsterdam",
      "Event Country": "Netherlands",
      "Description": "Annual meeting of the partners of the project in Amsterdam. 3 Days of full immersion on project development and report during the day and a selection of artists from every partner will follow in the evening."
    }],
    "debreceni-campus": [{
      "Event Name": "Campus fesztival",
      "Event Month": "July (fourth week)",
      "Event City": "Debrecen",
      "Event Country": "Hungary",
      "Description": "Campus Festival is an annual open-air popular music and multi-art festival held in the Great Forest Park of Debrecen, Hungary.\n\nWith a four-day attendance of 113.000 in 2019, Campus is the biggest open-air youth cultural event in Eastern Hungary.\n\nThe venue is a beloved city park with emblematic buildings like the new stadium and the old water tower.\n\nThe festival has its own accompanying events at the same time: Campus Art is a showcase of local art organizations, Campus Kid is for families and kids and the Campus Olympics are for university sport teams.\n\nToday Campus usually runs with 18 stages and programme venues, representing a wide range of popular music genres and also other branches of art as theatre, literature, cinema, dance and circus art.\n\nWe also welcome several NGO’s to add their activities to our programme.\n\nIn 2017 and 2019, the event got the EFFE (Europe For Festivals, Festivals For Europe) Quality Label and also it recently won the ARTISJUS prize for the best event."
    }]};

  logger.debug('/organizations/'+req.params.event);
  Event.
  findOne({"_id": req.params.event}).
  select({title: 1}).
  exec((err, event) => {
    const query = {"partner_owner.owner": req.params.id, "partnerships":req.params.event};
    const mandate = "";
    logger.debug(query);
    User.
    find(query).
    lean().
    sort({"organizationData.legal_name": 1}).
    //select({stagename: 1, createdAt: 1, crews:1}).
    populate(populate).
    exec((err, data) => {
      if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
        res.json(data);
      } else {
        res.render('adminpro/partners/grantsdata_events', {
          title: 'Partners',
          currentUrl: req.originalUrl,
          
          owner: req.params.id,
          event: req.params.event,
          grantevents: grantevents,
          event_title: event.title,
          mandate: mandate,
          user: req.user,
          printable: true,
          data: data,
          script: false
        });
      }
    });
  });
});



getManageables = (req, res) => {
  logger.debug('/organizations/'+req.params.event);
  Category.
  find({ancestor: "5be8708afc396100000001eb"}).
  lean().
  exec((err, categories) => {
    const query = {"partner_owner.owner": req.params.id};
    User.
    find(query).
    lean().
    sort({stagename: 1}).
    //select({stagename: 1, createdAt: 1, crews:1}).
    populate(populate).
    exec((err, data) => {
      var populate = [
        {path: "partners.users", select: {stagename:1}, model:"UserShow"},
        {path: "partners.category", select: {name:1, slug:1}, model:"Category"}
      ];
      Event.
      find({"users": req.params.id}).
      select({title: 1}).
      sort({title: 1}).
      //select({stagename: 1, createdAt: 1, crews:1}).
      exec((err, events) => {
        if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
          res.json(data);
        } else {
  
          Event.
          //find({"users": req.params.id}).
          findOne({_id: req.params.event}).
          populate(populate).
          select({title: 1, partners:1}).
          //sort({title: 1}).
          //select({stagename: 1, createdAt: 1, crews:1}).
          //exec((err, events) => {
          exec((err, event) => {
            var partnerships = event.partners.slice(0);
            logger.debug(existingCat);
            var notassigned = [];
            var notassignedID = [];
            var partnersID = [];

            for (var item=0; item<partnerships.length; item++) partnersID = partnersID.concat(partnerships[item].users.map(item => {return item._id.toString()}));
            for (var item in data) {
              if (partnersID.indexOf(data[item]._id.toString())===-1) {
                if (notassignedID.indexOf(data[item]._id.toString())===-1) {
                  notassignedID.push(data[item]._id.toString());
                  notassigned.push(data[item]);
                }
              }
            }
            var existingCat = partnerships.map(item => {return item.category._id.toString()});
            var pp = partnerships.map(item => {return item});
            
            for (var item in categories) {
              if (existingCat.indexOf(categories[item]._id.toString())===-1) pp.push({category:categories[item], users:[]});
            }
            if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
              res.json(data);
            } else {
              res.render('adminpro/partners/organization_partners_manage', {
                title: 'Partners',
                currentUrl: req.originalUrl,
                hide: req.query.hide ? req.query.hide : [],
                owner: req.params.id,
                //events: events,
                notassigned: notassigned,
                
                events: events,
                event: req.params.event,
                partnerships: pp,
                script: false
              });
            }
          });
        }
      });
    });
  });
}



/*
router.get('/:id/:event', (req, res) => {
  logger.debug('/organizations/'+req.params.event);
  const query = {"partner_owner.owner": req.params.id, "partnerships":req.params.event};
  logger.debug(query);
  User.
  findOne({"_id": req.params.id}).
  lean().
  select({stagename: 1}).
  exec((err, user) => {
    User.
    find(query).
    lean().
    sort({stagename: 1}).
    //select({stagename: 1, createdAt: 1, crews:1}).
    populate(populate).
    exec((err, data) => {
      Event.
      find({"users": req.params.id}).
      select({title: 1}).
      sort({title: 1}).
      //select({stagename: 1, createdAt: 1, crews:1}).
      exec((err, events) => {
        if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
          res.json(data);
        } else {
          res.render('adminpro/partners/organization_partners', {
            title: 'Partners: '+user.stagename,
            currentUrl: req.originalUrl,
            csv: req.query.csv,
            map: req.query.map,
            owner: req.params.id,
            events: events,
            event: req.params.event,
            user: req.user,
            data: data,
            script: false
          });
        }
      });
    });
  });
});


const populate_Partner = [
  { 
    "path": "performance", 
    "select": "title slug image abouts stats duration tech_arts tech_reqs",
    "model": "Performance", 
    "populate": [
      { 
        "path": "users" , 
        "select": "stagename image abouts addresses social web",
        "model": "User",
        "populate": [
          { 
            "path": "members" , 
            "select": "stagename image abouts web social",
            "model": "User"
          }
        ]
      },{ 
        "path": "categories" , 
        "select": "name slug",
        "model": "Category",
        "populate": [
          { 
            "path": "ancestor" , 
            "select": "name slug",
            "model": "Category"
          }
        ]
      }
    ] 
  },{ 
    "path": "reference", 
    "select": "stagename image name surname addresses email mobile", 
    "model": "User"
  },{ 
    "path": "subscriptions.subscriber_id", 
    "select": "stagename image name surname addresses email mobile", 
    "model": "User"
  }
];

const status = [
  '_id',
  'brand',
  'legalentity',
  'delegate',
  'selecta',
  'satellite',
  'event',
  'country',
  'description',
  'address',
  'type',
  'websites',
  'contacts',
  'partnerships',
  'channels',
  'users',
  'user_id'
];
 
router.get('/:event/acts', (req, res) => {
  logger.debug('/organizations/'+req.params.event+'/acts');
  logger.debug(req.query)
  let data = {};
  User.
  findOne({"_id": req.params.event}).
  select({title: 1, schedule: 1, organizationsettings: 1}).
  //populate(populate_event).
  exec((err, event) => {
    if (err) {
      res.json(err);
    } else {
      data.event = event;
      data.status = status;
      let query = {"event": req.params.event};
      if (req.query.call && req.query.call!='none') query.call = req.query.call;
      if (req.query['schedule.categories'] && req.query['schedule.categories']!='0') query['schedule.categories'] = req.query['schedule.categories'];
      logger.debug(query);
      Program.
      find(query).
      //select({title: 1, organizationsettings: 1}).
      populate(populate_program).
      exec((err, program) => {
        logger.debug(program);
        if (err) {
          res.json(err);
        } else {
          data.program = program;
          let admittedO = {};
          for(let a=0;a<event.organizationsettings.call.calls.length;a++) for(let b=0; b<event.organizationsettings.call.calls[a].admitted.length;b++)  admittedO[event.organizationsettings.call.calls[a].admitted[b]._id.toString()] = (event.organizationsettings.call.calls[a].admitted[b]);
          data.admitted = [];
          for(let adm in admittedO) data.admitted.push(admittedO[adm]);
          data.rooms = [];
          for(let a=0;a<event.schedule.length;a++)  if (event.schedule[a].venue && event.schedule[a].venue.room) data.rooms.push(event.schedule[a].venue.room);
          if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
            res.json(data);
          } else {
            res.render('adminpro/organizations/acts', {
              title: 'Events',
              data: data,
              currentUrl: req.originalUrl,
              get: req.query
            });
          }
        }
      });
    }
  });
});

router.get('/:event/peoples', (req, res) => {
  logger.debug('/organizations/'+req.params.event+'/peoples');
  logger.debug(req.query)
  let data = {};
  User.
  findOne({"_id": req.params.event}).
  select({title: 1, schedule: 1, organizationsettings: 1}).
  //populate(populate_event).
  exec((err, event) => {
    if (err) {
      res.json(err);
    } else {
      data.event = event;
      data.status = status;
      let query = {"event": req.params.event};
      if (req.query.call && req.query.call!='none') query.call = req.query.call;
      if (req.query['schedule.categories'] && req.query['schedule.categories']!='0') query['schedule.categories'] = req.query['schedule.categories'];
      logger.debug(query);
      Program.
      find(query).
      //select({title: 1, organizationsettings: 1}).
      populate(populate_program).
      exec((err, program) => {

        logger.debug(program);
        if (err) {
          res.json(err);
        } else {
          data.program = program;
          let days = [];
          for(let a=0;a<program.length;a++) {
            for(let b=0; b<program[a].subscriptions.length;b++) {
              days = days.concat(program[a].subscriptions[b].days);
            }
          }
          days = days.sort(function(a, b) {
            a = new Date(a);
            b = new Date(b);
            return a<b ? -1 : a>b ? 1 : 0;
          });
          data.days = days;
          data.daysN = (data.days[data.days.length-1]-data.days[0])/(24*60*60*1000);
          let admittedO = {};
          for(let a=0;a<event.organizationsettings.call.calls.length;a++) for(let b=0; b<event.organizationsettings.call.calls[a].admitted.length;b++)  admittedO[event.organizationsettings.call.calls[a].admitted[b]._id.toString()] = (event.organizationsettings.call.calls[a].admitted[b]);
          data.admitted = [];
          for(let adm in admittedO) data.admitted.push(admittedO[adm]);
          data.rooms = [];
          for(let a=0;a<event.schedule.length;a++)  if (event.schedule[a].venue && event.schedule[a].venue.room) data.rooms.push(event.schedule[a].venue.room);
          if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
            res.json(data);
          } else {
            res.render('adminpro/organizations/peoples', {
              title: 'Events',
              data: data,
              currentUrl: req.originalUrl,
              get: req.query
            });
          }
        }
      });
    }
  });
});

router.get('/:event/program', (req, res) => {
  logger.debug('/organizations/'+req.params.event+'/program');

  let data = {};
  User.
  findOne({"_id": req.params.event}).
  select({title: 1, schedule: 1, organizationsettings: 1}).
  //populate(populate_event).
  exec((err, event) => {
    if (err) {
      res.json(err);
    } else {
      data.event = event;
      data.status = status;
      Program.
      find({"event": req.params.event}).
      //select({title: 1, organizationsettings: 1}).
      populate(populate_program).
      exec((err, program) => {
        if (err) {
          res.json(err);
        } else {
          data.program = program;
          let admittedO = {};
          for(let a=0;a<event.organizationsettings.call.calls.length;a++) for(let b=0; b<event.organizationsettings.call.calls[a].admitted.length;b++)  admittedO[event.organizationsettings.call.calls[a].admitted[b]._id.toString()] = (event.organizationsettings.call.calls[a].admitted[b]);
          data.admitted = [];
          for(let adm in admittedO) data.admitted.push(admittedO[adm]);
          data.rooms = [];
          for(let a=0;a<event.schedule.length;a++)  if (event.schedule[a].venue && event.schedule[a].venue.room) data.rooms.push(event.schedule[a].venue.room);
          if (req.query.api || req.headers.host.split('.')[0]=='api' || req.headers.host.split('.')[1]=='api') {
            res.json(data);
          } else {
            res.render('adminpro/organizations/program', {
              title: 'Events',
              data: data,
              currentUrl: req.originalUrl,
              get: req.query
            });
          }
        }
      });
    }
  });
});*/

module.exports = router;