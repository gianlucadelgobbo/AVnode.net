//mongorestore --drop -d avnode_bruce /data/dumps/avnode_bruce
//mongodump -d avnode_bruce --out /data/dumps/avnode_bruce_fixed
//rsync -a /space/PhpMysql2015/sites/flxer/warehouse/ /sites/avnode/warehouse

db.tvshows.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);
db.gallery.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);
db.footage.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);
db.playlists.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);
db.performances.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);
db.events.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);

db.performances.find({"files.file":{'$regex': '90x68/'}}).forEach(function(e) {
  e.files[0].file = e.files[0].file.replace('90x68/','');
  db.performances.save(e);
});
db.gallery.find({"files.file":{'$regex': '128x96/'}}).forEach(function(e) {
  e.files[0].file = e.files[0].file.replace('128x96/','');
  db.gallery.save(e);
});



db.users.find({}).forEach(function(e) {
  if (e.crews.length) e.stats.crews = e.crews.length;
  if (e.performances.length) e.stats.performances = e.performances.length;
  if (e.events.length) e.stats.events = e.events.length;
  if (e.galleries.length) e.stats.galleries = e.galleries.length;
  if (e.footage.length) e.stats.footage = e.footage.length;
  if (e.playlists.length) e.stats.playlists = e.playlists.length;
  if (e.tvshows.length) e.stats.tvshows = e.tvshows.length;
  db.users.save(e);
});



db.categories.find({}).forEach(function(e) {
  if (!e.slug) e.slug = e.permalink.toLowerCase();
  if (e.permalink) delete e.permalink;
  if (e.ancestors && e.ancestors.length) {
    e.ancestor = e.ancestors[0]._id;
    delete e.ancestors;
  }
  if (e.ancestors) delete e.ancestors;
  db.categories.save(e);
});



db.users.find({"links": {$exists: true}}).forEach(function(e) {
  if (e.links && e.links.length) {
    var web = [];
    var social = [];
    for(var a=0;a<e.links.length;a++){
      if (
        e.links[a].url.indexOf("facebook.com")!==-1 ||
        e.links[a].url.indexOf("fb.com")!==-1 ||
        e.links[a].url.indexOf("twitter.com")!==-1 ||
        e.links[a].url.indexOf("instagram.com")!==-1 ||      
        e.links[a].url.indexOf("youtube.com")!==-1 ||      
        e.links[a].url.indexOf("vimeo.com")!==-1      
      ) {
        e.links[a].type = "social";
        social.push(e.links[a]);
      } else {
        web.push(e.links[a]);
      }
    }
    e.social = social;
    e.web = web;
    delete e.links;
  }
});

db.users.find({"file": {$exists: true}}).forEach(function(e) {
  if (!e.image) e.image = e.file;
  if (e.file) delete e.file;
  db.users.save(e);
});

db.performances.find({"file": {$exists: true}}).forEach(function(e) {
  if (!e.image) e.image = e.file;
  if (e.file) delete e.file;
  db.performances.save(e);
});

db.events.find({}).forEach(function(e) {
  if (!e.image) e.image = e.file;
  if (e.file) delete e.file;
  db.events.save(e);
});

db.events.find({"schedule.venue.location.city":{$exists: true}}).forEach(function(e) {
  if (e.schedule && e.schedule.length) {
    for(var a=0;a<e.schedule.length;a++){
      e.schedule[a].venue.location.locality = e.schedule[a].venue.location.city;
      delete e.schedule[a].venue.location.city;
    }
  }
  db.events.save(e);
});


db.footage.deleteMany({"file.file": { $exists: false}});
db.footage.find({}).forEach(function(e) {
  if (!e.slug) e.slug = e.permalink.toLowerCase();
  if (e.permalink) delete e.permalink;
  if (e.users && e.users.length) {
    var tmpA = [];
    for(var a=0;a<e.users.length;a++){
      tmpA.push(e.users[a]._id);
    }
    e.users = tmpA;
  }
  if (e.playlists && e.playlists.length) {
    var tmpA = [];
    for(var a=0;a<e.playlists.length;a++){
      tmpA.push(e.playlists[a]._id);
    }
    e.playlists = tmpA;
  }
  e.media = e.file;
  delete e.file;
  db.footage.save(e);
});

db.tvshows.find({}).forEach(function(e) {
  if (!e.slug) e.slug = e.permalink.toLowerCase();
  if (e.permalink) delete e.permalink;
  if (e.users && e.users.length) {
    var tmpA = [];
    for(var a=0;a<e.users.length;a++){
      tmpA.push(e.users[a]._id);
    }
    e.users = tmpA;
  }
  if (e.categories && e.categories.length) {
    var tmpA = [];
    for(var a=0;a<e.categories.length;a++){
      tmpA.push(e.categories[a]._id);
    }
    e.categories = tmpA;
  }
  e.media = e.file;
  delete e.file;
  db.tvshows.save(e);
});

db.playlists.find({}).forEach(function(e) {
  if (!e.slug) e.slug = e.permalink.toLowerCase();
  if (e.permalink) delete e.permalink;
  if (e.users && e.users.length) {
    var tmpA = [];
    for(var a=0;a<e.users.length;a++){
      tmpA.push(e.users[a]._id);
    }
    e.users = tmpA;
  }
  if (e.footage && e.footage.length) {
    var tmpA = [];
    for(var a=0;a<e.footage.length;a++){
      tmpA.push(e.footage[a]._id);
    }
    e.footage = tmpA;
    e.stats.footage = e.footage.length;
  }
  e.image = e.file;
  delete e.file;
  db.playlists.save(e);
});

db.galleries.find({}).forEach(function(e) {
  if (!e.slug) e.slug = e.permalink.toLowerCase();
  if (e.permalink) delete e.permalink;
  if (e.users && e.users.length) {
    var tmpA = [];
    for(var a=0;a<e.users.length;a++){
      tmpA.push(e.users[a]._id);
    }
    e.users = tmpA;
  }
  if (e.performances && e.performances.length) {
    var tmpA = [];
    for(var a=0;a<e.performances.length;a++){
      tmpA.push(e.performances[a]._id);
    }
    //e.performances = tmpA;
  }
  if (e.events && e.events.length) {
    var tmpA = [];
    for(var a=0;a<e.events.length;a++){
      tmpA.push(e.events[a]._id);
    }
    e.events = tmpA;
  }
  if (e.medias && e.medias.length) {
    var tmpA = [];
    for(var a=0;a<e.medias.length;a++){
	    var tmpO = {
		  file: e.medias[a].file.file,
		  filename: e.medias[a].file.file.substring(e.medias[a].file.file.lastIndexOf('/') + 1),
		  originalname: e.medias[a].file.file.substring(e.medias[a].file.file.lastIndexOf('/') + 1),
		  size: e.medias[a].file.filesize,
		
		  encoded: e.medias[a].file.encoded,
		  users: [e.medias[a].users[0]._id],
		  stats: e.medias[a].stats,
		  title: e.medias[a].title,
		  slug: e.medias[a].permalink
		}
		tmpA.push(tmpO);
    }
    e.medias = tmpA;
  }
  e.image = e.file;
  delete e.file;
  db.galleries.save(e);
});







//db.runCommand ( { distinct: 'users',key: 'locations'} )
//db.categories.find({"ancestors" :{$exists:false},"ancestor_old_id":{$ne:"0"}});

//{permalink:'lpm-2017-amsterdam'}
db.events.find({}).forEach(function(e) {
  e.is_public = e.is_public===1;
  e.gallery_is_public = e.gallery_is_public===1;
  e.is_freezed = e.is_freezed===1;

  if (e.partners && e.partners.length) {
    var partners_new = [];
    var trovato;
    for(var a=0;a<e.partners.length;a++){
      for(var b=0;b<e.partners[a].categories.length;b++){
        trovato = false;
        for(var c=0;c<partners_new.length;c++){
          if (partners_new[c].category.toString() == e.partners[a].categories[b]._id.toString()) {
            partners_new[c].users.push(e.partners[a].user._id);
            trovato = true;
          }
        }
        if (!trovato) {
          partners_new.push({category: e.partners[a].categories[b]._id, users:[e.partners[a].user._id]});
        }
      }
    }
    e.partners = partners_new;
  }

  if (!e.slug) e.slug = e.permalink.toLowerCase();
  if (e.permalink) delete e.permalink;

  if (e.websites && e.websites.length) {
    e.links = [];
    for(var a=0;a<e.websites.length;a++){
      if (e.websites[a] && e.websites[a].url) {
        var tmp = {};
        tmp.type = "web";
        tmp.url = e.websites[a].url;
        e.links.push(tmp);
      }
    }
    delete e.websites;
  }

  if (e.text) {
    e.abouts = [];
    for (var item in e.text) {
      var tmp = {};
      tmp.lang = item;
      tmp.abouttext = e.text[item];
      e.abouts.push(tmp);
    }
    delete e.text;
  }

  if (e.subtitle) {
    e.subtitles = [];
    if (e.subtitle) {
      for (var item in e.subtitle) {
        var tmp = {};
        tmp.lang = item;
        tmp.abouttext = e.subtitle[item];
        e.subtitles.push(tmp);
      }
    }
    delete e.subtitle;
  }
  if (e.users && e.users.length) {
    var tmpA = [];
    for(var a=0;a<e.users.length;a++){
      tmpA.push(e.users[a]._id);
    }
    e.users = tmpA;
  }

  if (e.tobescheduled && e.tobescheduled.length) {
    var tmpA = [];
    for(var a=0;a<e.tobescheduled.length;a++){
      tmpA.push(e.tobescheduled[a].uid);
    }
    e.tobescheduled = tmpA;
  }

  if (e.categories && e.categories.length) {
    var tmpA = [];
    for(var a=0;a<e.categories.length;a++){
      tmpA.push(e.categories[a]._id);
    }
    e.categories = tmpA;
  }

  if (e.galleries && e.galleries.length) {
    var tmpA = [];
    for(var a=0;a<e.galleries.length;a++){
      tmpA.push(e.galleries[a]._id);
    }
    e.galleries = tmpA;
  }

  if (e.settings.permissions.administrator && e.settings.permissions.administrator.length) {
    var tmpA = [];
    for(var a=0;a<e.settings.permissions.administrator.length;a++){
      tmpA.push(e.settings.permissions.administrator[a]._id);
    }
    e.settings.permissions.administrator = tmpA;
  }

  if (e.program && e.program.length) {
    for(var a=0;a<e.program.length;a++){
      var tmpA = [];
      for(var b=0;b<e.program[a].schedule.categories.length;b++){
        tmpA.push(e.program[a].schedule.categories[b]._id);
      }
      e.program[a].performance = e.program[a].performance._id;
      e.program[a].schedule.categories = tmpA;
    }
  }

  db.events.save(e);
});

//{permalink:'vector-vs-bitmap'}
db.performances.find({}).forEach(function(e) {
  e.is_public = e.is_public===1;
  delete e.img_data_id;
  delete e.img_data_type;
  delete e.img_data_folder;
  delete e.img_data_name;
  delete e.img_data_est;
  if (!e.slug) e.slug = e.permalink.toLowerCase();
  if (e.permalink) delete e.permalink;

  if (e.users && e.users.length) {
    var tmpA = [];
    for(var a=0;a<e.users.length;a++){
      tmpA.push(e.users[a]._id);
    }
    e.users = tmpA;
  }

  if (e.categories && e.categories.length) {
    var tmpA = [];
    for(var a=0;a<e.categories.length;a++){
      tmpA.push(e.categories[a]._id);
    }
    e.categories = tmpA;
  }

  if (e.gallery && e.gallery.length) {
    var tmpA = [];
    for(var a=0;a<e.gallery.length;a++){
      tmpA.push(e.gallery[a]._id);
    }
    e.galleries = tmpA;
    delete e.gallery;
  }

  if (e.text) {
    e.abouts = [];
    for (var item in e.text) {
      var tmp = {};
      tmp.lang = item;
      tmp.abouttext = e.text[item];
      e.abouts.push(tmp);
    }
    delete e.text;
  }

  if (e.tech_req) {
    var tech_req = e.tech_req["en"];
    if (!tech_req) {
      for (var item in e.tech_req) {
        if (!tech_req) tech_req = e.tech_req[item];
      }
    }
    e.tech_req = tech_req;
  } else {
    e.tech_req = "";
  }
  delete e.tech_art;
  e.tech_art = "";

  if (e.locations && e.locations.length) {
    e.addresses = [];
    for(var a=0;a<e.locations.length;a++){
      var tmp = {};
      if(e.locations[a].country) tmp.country = e.locations[a].country;
      if(e.locations[a].city) tmp.locality = e.locations[a].city;
      if(e.locations[a].zip) tmp.postal_code = e.locations[a].zip;
      if(e.locations[a].street) tmp.route = e.locations[a].street;
      e.addresses[a] = tmp;
      e.addresses.push(tmp);
    }
    delete e.locations;
  }

  if (e.emails && e.emails.length) {
    for(var a=0;a<e.emails.length;a++){
      e.emails[a].is_public = e.emails[a].public==="1";
      delete e.emails[a].public;
      e.emails[a].is_confirmed = e.emails[a].valid==="1";
      delete e.emails[a].valid;
      e.emails[a].is_primary = e.emails[a].primary==="1";
      e.emails[a].mailinglists.flxer = e.emails[a].mailinglists.flxer===1;
      e.emails[a].mailinglists.flyer = e.emails[a].mailinglists.flyer===1;
      e.emails[a].mailinglists.livevisuals = e.emails[a].mailinglists.livevisuals===1;
      e.emails[a].mailinglists.updates = e.emails[a].mailinglists.updates===1;
      delete e.emails[a].primary;
      if (e.emails[a].is_primary) {
        e.email = e.emails[a].email;
      }
    }
  }

  if (e.websites && e.websites.length) {
    e.links = [];
    for(var a=0;a<e.websites.length;a++){
      if (e.websites[a] && e.websites[a].url) {
        var tmp = {};
        tmp.type = "web";
        tmp.url = e.websites[a].url;
        e.links.push(tmp);
      }
    }
    delete e.websites;
  }

  if (e.bookings && e.bookings.length) {
    for(var a=0;a<e.bookings.length;a++){
      var tmpA = [];
      for(var b=0;b<e.bookings[a].schedule.categories.length;b++){
        tmpA.push(e.bookings[a].schedule.categories[b]._id);
      }
      e.bookings[a].event = e.bookings[a].event._id;
      e.bookings[a].schedule.categories = tmpA;
    }
  }

  db.performances.save(e);
});

//{surname:"Del Gobbo"}
//{surname:"Del Gobbo"}
db.users.find({}).forEach(function(e) {
  e.is_crew = e.is_crew===1;
  e.is_public = e.is_public===1;
  delete e.public;
  e.image = e.file;
  delete e.file;
  delete e.updated;
  delete e.img_data_id;
  delete e.img_data_type;
  delete e.img_data_folder;
  delete e.img_data_name;
  delete e.img_data_est;
  delete e.login;
  e.stagename = e.display_name;
  delete e.display_name;
  e.birthday = e.birth_date;
  delete e.birth_date;
  if (!e.slug) e.slug = e.permalink.toLowerCase();
  e.username = e.slug;
  if (e.permalink) delete e.permalink;
  if (e.locations && e.locations.length) {
    e.addresses = [];
    for(var a=0;a<e.locations.length;a++){
      var tmp = {};
      if(e.locations[a].country) tmp.country = e.locations[a].country;
      if(e.locations[a].city) tmp.locality = e.locations[a].city;
      if(e.locations[a].zip) tmp.postal_code = e.locations[a].zip;
      if(e.locations[a].street) tmp.route = e.locations[a].street;
      e.addresses[a] = tmp;
      e.addresses.push(tmp);
    }
    delete e.locations;
  }

  if (e.text) {
    e.abouts = [];
    for (var item in e.text) {
      var tmp = {};
      tmp.lang = item;
      tmp.abouttext = e.text[item];
      e.abouts.push(tmp);
    }
    delete e.text;
  }

  if (e.emails && e.emails.length) {
    for(var a=0;a<e.emails.length;a++){
      e.emails[a].is_public = e.emails[a].public==="1";
      delete e.emails[a].public;
      e.emails[a].is_confirmed = e.emails[a].valid==="1";
      delete e.emails[a].valid;
      e.emails[a].is_primary = e.emails[a].primary==="1";
      e.emails[a].mailinglists.flxer = e.emails[a].mailinglists.flxer===1;
      e.emails[a].mailinglists.flyer = e.emails[a].mailinglists.flyer===1;
      e.emails[a].mailinglists.livevisuals = e.emails[a].mailinglists.livevisuals===1;
      e.emails[a].mailinglists.updates = e.emails[a].mailinglists.updates===1;
      delete e.emails[a].primary;
      if (e.emails[a].is_primary) {
        e.email = e.emails[a].email;
      }
    }
  }

  if (e.websites && e.websites.length) {
    e.links = [];
    for(var a=0;a<e.websites.length;a++){
      if (e.websites[a] && e.websites[a].url) {
        var tmp = {};
        tmp.type = "web";
        tmp.url = e.websites[a].url;
        e.links.push(tmp);
      }
    }
    delete e.websites;
  }

  if (!e.is_crew && e.crews && e.crews.length) {
    var tmpA = [];
    for(var a=0;a<e.crews.length;a++){
      tmpA.push(e.crews[a]._id);
    }
    e.crews = tmpA;
  }

  if (e.categories && e.categories.length) {
    var tmpA = [];
    for(var a=0;a<e.categories.length;a++){
      tmpA.push(e.categories[a]._id);
    }
    e.categories = tmpA;
  }

  if (e.performances && e.performances.length) {
    var tmpA = [];
    for(var a=0;a<e.performances.length;a++){
      tmpA.push(e.performances[a]._id);
    }
    e.performances = tmpA;
  }

  if (e.events && e.events.length) {
    var tmpA = [];
    for(var a=0;a<e.events.length;a++){
      tmpA.push(e.events[a]._id);
    }
    e.events = tmpA;
  }

  if (e.tvshow && e.tvshow.length) {
    var tmpA = [];
    for(var a=0;a<e.tvshow.length;a++){
      tmpA.push(e.tvshow[a]._id);
    }
    e.tvshows = tmpA;
    delete e.tvshow;
  }

  if (e.footage && e.footage.length) {
    var tmpA = [];
    for(var a=0;a<e.footage.length;a++){
      tmpA.push(e.footage[a]._id);
    }
    e.footage = tmpA;
  }

  if (e.is_crew && e.members && e.members.length) {
    var tmpA = [];
    for(var a=0;a<e.members.length;a++){
      tmpA.push(e.members[a]._id);
    }
    e.members = tmpA;
  }

  if (e.playlists && e.playlists.length) {
    var tmpA = [];
    for(var a=0;a<e.playlists.length;a++){
      tmpA.push(e.playlists[a]._id);
    }
    e.playlists = tmpA;
  }

  if (e.galleries && e.galleries.length) {
    var tmpA = [];
    for(var a=0;a<e.galleries.length;a++){
      tmpA.push(e.galleries[a]._id);
    }
    e.galleries = tmpA;
  }

  delete e.stats;
  e.stats = {};
  if (e.events && e.events.length) e.stats.events = new NumberInt(e.events.length);
  if (e.performances && e.performances.length) e.stats.performances = new NumberInt(e.performances.length);
  if (e.tvshows && e.tvshows.length) e.stats.tvshows = new NumberInt(e.tvshows.length);
  if (e.playlists && e.playlists.length) e.stats.playlists = new NumberInt(e.playlists.length);
  if (e.footage && e.footage.length) e.stats.footage = new NumberInt(e.footage.length);
  if (e.galleries && e.galleries.length) e.stats.galleries = new NumberInt(e.galleries.length);
  if (e.members && e.members.length) e.stats.members = new NumberInt(e.members.length);
  if (e.crews && e.crews.length) {
    e.stats.crews = new NumberInt(e.crews.length);
  } else if (e.crews && e.crews.length==0) {
    delete e.crews;
  }
  e.activity = 0;
  e.activity+= (e.stats.events ? e.stats.events             * 5 : 0);
  e.activity+= (e.stats.performances ? e.stats.performances * 3 : 0);
  e.activity+= (e.stats.tvshows ? e.stats.tvshows           * 3 : 0);
  e.activity+= (e.stats.footage ? e.stats.footage           * 1 : 0);
  e.activity+= (e.stats.playlists ? e.stats.playlists       * 2 : 0);
  e.activity+= (e.stats.galleries ? e.stats.galleries       * 1 : 0);

  db.users.save(e);
});
db.events.find({slug:'live-cinema-festival-2017'}).forEach(function(e) {
  e.organizationsettings = {
    program_builder: true,
    advanced_proposals_manager: true,
    call_is_active: true,
	  call: {
	    nextEdition: "String nextEdition", 
	    subImg: "teaserImage subImg", 
	    subBkg: "backgroundImage subBkg", 
	    colBkg: "String colBkg", 
	    calls: [{
        title: "LPM 2018 Rome", 
        email: "subscriptions@liveperformersmeeting.net", 
        slug: "lpm2018rome", 
        start_date: new Date('2018-01-01 00:00:00'), 
        end_date: new Date('2018-01-31 23:59:59'), 
        admitted: [
          ObjectId("59fc65d6ff4bcb5a6100018c"), 
          ObjectId("59fc65d6ff4bcb5a6100021d"), 
          ObjectId("59fc65d6ff4bcb5a6100021e")
        ], 
        excerpt: '<p>Are you an artist working in the field of live audiovisual performance? Do you wish to take part in the programme of LPM with presentation of your project?<br>Here is what we are looking for:</p><ul><li><strong>AV performances </strong>LPM is interested to any kind of projects that use very different techniques, but at the same time follow a common thread that evolves throughout the day. From video theater to video dance, from live cinema performances to queer culture, from generative music and visuals to live coding.LPM offer to every show 30 minutes.</li><li><strong>VJ Sets<br></strong>LPM is looking for video wizards wishing to flock to our screens with colors, stories, and visual rhythms in front of more than 10.000 people during the night party. LPM offer to every show 30 minutes.</li><li><strong>Mapping performances</strong>LPM is interested to any kind of live mapping show that are able to enhance the skill of the performer by revisiting the urban architecture of RADION.LPM offer to every show 30 minutes.<strong><br><a href="https://flyer.dev.flyer.it/files/2017/04/LiveMappingContest-LPM2017_KIT.zip" download="LiveMappingContest-LPM2017_KIT.zip">MAPPING KIT DOWNLOAD</a></strong></li><li><strong>Interactive installations</strong>LPM is interested to installation that use sound, video, touch and movement merged in a common language dedicated to the creation of interactive games and perceptual experiences of meaning and image.<br>Installations are visible during all the duration of the event.LPM can not guarantee the full technical support. No technical support request is welcome.</li><li><strong>Project showcase<br></strong>If you have a project that in some way involve live video LPM offer 30 minutes on the stage during the Day programme.<br>The project could be a software or hardware, a product or a free stuff, a web site or an app, realized or just an idea.</li><li><strong>Lecture<br></strong>LPM is interested to offer to participants successful case stories that can be open the minds to the various aspect of live video culture.</li><li><strong>Workshop<br></strong>Once you submit your proposal, LPM will check the feasibility, once accepted you will be able to end your subscription.</li></ul>', 
        terms: '<p><strong>LPM is a meeting.<br> </strong><br> LPM offers sites, resources and technologies to support the encounters among people active in the field of live video. Our goal is to provide both spectators and participants with a wide program of workshops, exhibitions and live audio and video performances. <br> <br> The fact that all the artists play live and the ability to freely participate in the meeting are among the most important aspects of LPM.</p><ol><li>The subscription fee includes access to all activities of the event (except workshop fee), plus the LPM t-shirt, 1 drink per day, slot for your proposal and special prices for software, hardware and workshops.</li><li>The deadline for subscription is <strong>###DEADLINE###</strong>.</li><li>LPM is a meeting, we encourage all who wish to contribute to participate in the event. However, due to the large number of proposals we receive, we are not able to cover the travel expenses of each artist. So we would like to remember that <span style="text-decoration: underline;">travel expenses are the responsibility of artists</span>.</li><li><strong>Accommodation for performing artists is available from 1 to 5 nights from 17 to 22 of May, subject to availability, in triple / quadruple / dormitories.</strong></li><li>Solutions available in single and double rooms.</li><li>Artists, friends and partners can also book accommodation at an affordable price at the <a href="../participate/?lpm_sub_type=visitors">Special Package</a> webpage.</li><li>Due to logistical and time constraints, it may happen that some of the audiovisual performances will not be included in the official programme: priority will be given to those projects that are considered of special interest to most of our participants.</li><li><strong>The maximum duration of each act is 30 minutes</strong>.</li><li>At the discretion of the organizers, activities that include too complicated technical and logistical requirements can be excluded. Do not hesitate to contact us directly via subscriptions [at] liveperformersmeeting [dot] net to discuss your proposal beforehand.</li></ol>', 
        packages: [
          {
            name: "Basic subscription", 
            price: 10, 
            description: "1 pass valid for all activities<br />1 drink per day<br />1 T-Shirt<br />1 Slot for your proposal", 
            personal: true, 
            requested: true, 
            allow_multiple: true, 
            allow_options: true, 
            options_name: "T-Shirt Size", 
            options: "S-Man,L-Man,XL-Man", 
            daily: false, 
            start_date: new Date('2018-01-01 00:00:00'),
            end_date: new Date('2018-01-31 23:59:59')
          },{
            name: "Accommodation", 
            price: 30, 
            description: "1 bed in dorms", 
            personal: true, 
            requested: false, 
            allow_multiple: false, 
            allow_options: false, 
            options_name: "", 
            options: "", 
            daily: true, 
            start_date: new Date('2018-01-01 00:00:00'),
            end_date: new Date('2018-01-31 23:59:59')
          }
        ], 
        topics: [
          {
              name: "String topics name", 
              description: "String topics description"
          }
        ]
      }]
    }
  }
  db.events.save(e);
});
