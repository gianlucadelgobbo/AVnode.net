//export LC_ALL="en_US.UTF-8"
//mongorestore --drop -d avnode /data/dumps/avnode_pure_import/avnode/
//mongodump -d avnode --out /data/dumps/avnode_pure_import
//mongorestore --drop -d avnode /home/hyo/dumps/avnode/avnode/
/* File sync
chmod 775 warehousenew_events.sh
chmod 775 warehousenew_footage.sh
chmod 775 warehousenew_galleries.sh
chmod 775 warehousenew_performances.sh
chmod 775 warehousenew_tvshows.sh
chmod 775 warehousenew_users.sh

./warehousenew_events.sh
./warehousenew_footage.sh
./warehousenew_galleries.sh
./warehousenew_performances.sh
./warehousenew_tvshows.sh
./warehousenew_users.sh

nano warehousenew_events_log.txt
nano warehousenew_footage_log.txt
nano warehousenew_galleries_log.txt
nano warehousenew_performances_log.txt
nano warehousenew_tvshows_log.txt
nano warehousenew_users_log.txt
*/
//db.playlists.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);
//db.footage.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);

var CATEGORIES = function() {
  //db.categories.findOne({"ancestors.0": {$exists: true}});

  db.categories.find({}).forEach(function(e) {
    e.count = 0;
    e.countstr = "";
    var tmp = db.users.count({"categories":e._id});
    e.count += tmp;
    if (tmp) e.countstr += " users "+tmp;
    
    var tmp = db.videos.count({"categories":e._id});
    e.count += tmp;
    if (tmp) e.countstr += " videos "+tmp;
    
    var tmp = db.performances.count({"categories":e._id});
    e.count += tmp;
    if (tmp) e.countstr += " performances "+tmp;
    
    var tmp = db.events.count({"categories":e._id});
    e.count += tmp;
    if (tmp) e.countstr += " events "+tmp;
    
    //e.countstr = e.rel+": "+tmp;
    //if (e.rel == "events") {
      var tmp = db.events.count({"program.schedule.categories":e._id});
      e.count += tmp;
      if (tmp) e.countstr += " events program: "+tmp;

      var tmp = db.events.count({"partners.category":e._id});
      e.count += tmp;
      if (tmp) e.countstr += " events partners: "+tmp;
    //}
    //if (e.rel == "performances") {
      var tmp = db.performances.count({"bookings.schedule.categories":e._id});
      e.count += tmp;
      if (tmp) e.countstr += " performances bookings: "+tmp;
    //}
    printjson(e.rel+" "+e.slug+" "+ e.count+" "+ e.countstr);
    //db.categories.save(e);
  });

}

var FOOTAGE = function() {
  //db.footage.findOne({"file.file": { $exists: false}});
  //db.footage.findOne({"file.file": { $exists: true}, "file.preview": { $exists: true}, "playlists.0": { $exists: true}});

  // 01
  db.footage.deleteMany({"file.file": { $exists: false}});

  // 02
  //db.footage.find({"file.file": { $exists: true}, "file.preview": { $exists: true}, "playlists.0": { $exists: true}}).forEach(function(e) {

  var folders = {};
  function sanitizeOld(folder,defaultFolder) {
    return folder.
    replace("/_flxer/library/hole/", defaultFolder).
    replace("/_flxer/photos/", defaultFolder).
    replace("/_flxer/library/no_hole/", defaultFolder).
    replace("/_flxer/library/koncepts/", defaultFolder).
    replace(/\(|\)/g, "");
  }
  var extoriginals = [];
  var valid = [
    "mov",
    "avi",
    "mp4",
    "MOV",
    "AVI",
    "mpg"
  ];
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
    e.media = e.file;
    delete e.file;
    e.media.fileflxer = e.media.file;
    var ext = e.media.file.substring(e.media.file.lastIndexOf('.') + 1);
    var defaultFolder = "/"+e.creation_date.getFullYear()+"/"+("0" + (e.creation_date.getMonth() + 1)).slice(-2)+"/";
    if (ext == "mp4") {
      e.media.originalflxer = e.media.file.substring(0, e.media.file.lastIndexOf('.'));
      var extoriginal = e.media.originalflxer.substring(e.media.file.lastIndexOf('_') + 1);
      if (extoriginals.indexOf(extoriginal)===-1 && extoriginal.length<5 && extoriginal.length>1) extoriginals.push(extoriginal); 
      if (extoriginal == e.media.originalflxer || valid.indexOf(extoriginal)===-1) {
        delete e.media.originalflxer;
      } else {
        e.media.originalflxer = e.media.originalflxer.substring(0, e.media.originalflxer.lastIndexOf('_')) + "." + extoriginal;
        e.media.original = e.media.originalflxer.replace('/warehouse/', '/glacier/footage_originals/').replace('/original_video/', '/');
        e.media.original = sanitizeOld(e.media.original, defaultFolder)
        var folder = e.media.original.substring(0, e.media.original.lastIndexOf('/'));
        folders[folder] = 1;
        folder = folder.substring(0, folder.lastIndexOf('/'));
        folders[folder] = 1;
        folder = folder.substring(0, folder.lastIndexOf('/'));
        folders[folder] = 1;
        printjson("cp -n " + e.media.originalflxer.replace('/warehouse/', 'warehouse_old/').replace(/\(/g, "\\(").replace(/\)/g, "\\)") + " " + e.media.original.replace('/glacier/', 'glacier/'));
      }
    }
    if (e.media.preview) {
      e.media.previewflxer = e.media.preview;
      e.media.preview = e.media.previewflxer.replace('/warehouse/', '/glacier/footage_previews/').replace('/preview_files/', '/');
      e.media.preview = sanitizeOld(e.media.preview, defaultFolder)
      var folder = e.media.preview.substring(0, e.media.preview.lastIndexOf('/'));
      folders[folder] = 1;
      folder = folder.substring(0, folder.lastIndexOf('/'));
      folders[folder] = 1;
      folder = folder.substring(0, folder.lastIndexOf('/'));
      folders[folder] = 1;
      printjson("cp -n " + e.media.previewflxer.replace('/warehouse/', 'warehouse_old/').replace(/\(/g, "\\(").replace(/\)/g, "\\)") + " " + e.media.preview.replace('/glacier/', 'glacier/'));
    }
    e.media.file = e.media.file.replace('/warehouse/', '/warehouse/footage/');
    e.media.file = sanitizeOld(e.media.file, defaultFolder);
    var folder = e.media.file.substring(0, e.media.file.lastIndexOf('/'));
    folders[folder] = 1;
    folder = folder.substring(0, folder.lastIndexOf('/'));
    folders[folder] = 1;
    folder = folder.substring(0, folder.lastIndexOf('/'));
    folders[folder] = 1;
    printjson("cp -n " + e.media.fileflxer.replace('/warehouse/', 'warehouse_old/').replace(/\(/g, "\\(").replace(/\)/g, "\\)") + " " + e.media.file.replace('/warehouse/', 'warehouse/'));

    //printjson(e);
    db.footage.save(e);
  });
  Object.keys(folders).sort().forEach(function(folder) {printjson("mkdir " + folder.substring(1))});
  //db.footage.findOne({"media.file": { $exists: true}, "media.preview": { $exists: true}, "playlists.0": { $exists: true}})
}

var PERFORMANCES = function() {
  //{permalink:'vector-vs-bitmap'}
  //db.performances.findOne({'categories.0': {$exists:true},'gallery.0': {$exists:true},text: {$exists:true},tech_req: {$exists:true},'bookings.0': {$exists:true}});
  //db.performances.find({'categories.0': {$exists:true},'gallery.0': {$exists:true},text: {$exists:true},tech_req: {$exists:true},'bookings.0': {$exists:true}}).forEach(function(e) {
  var folders = {};
  function sanitizeOld(folder,defaultFolder) {
    return folder.
    replace("/mainImg/", defaultFolder).
    replace("/_flxer/avatar/", defaultFolder).
    replace(/\(|\)/g, "");
  }
  db.performances.find({}).forEach(function(e) {
    e.is_public = e.is_public===1;
    delete e.img_data_id;
    delete e.img_data_type;
    delete e.img_data_folder;
    delete e.img_data_name;
    delete e.img_data_est;
    if (!e.slug) e.slug = e.permalink.toLowerCase();
    if (e.permalink) delete e.permalink;

    if (e.file) {
      if (e.file.file && e.file.file.length>2) {
        e.image = e.file;
        e.image.fileflxer = e.image.file;
        var defaultFolder = "/"+e.creation_date.getFullYear()+"/"+("0" + (e.creation_date.getMonth() + 1)).slice(-2)+"/";
        e.image.file = e.image.file.replace('/warehouse/', '/glacier/performances_originals/');
        e.image.file = sanitizeOld(e.image.file, defaultFolder);
        printjson("cp -n " + e.image.fileflxer.replace('/warehouse/', 'warehouse_old/').replace(/\(/g, "\\(").replace(/\)/g, "\\)") + " " + e.image.file.replace('/warehouse/', 'glacier/performances_originals/'));
        var folder = e.image.file.substring(0, e.image.file.lastIndexOf('/'));
        folders[folder] = 1;
        folder = folder.substring(0, folder.lastIndexOf('/'));
        folders[folder] = 1;
        folder = folder.substring(0, folder.lastIndexOf('/'));
        folders[folder] = 1;
      }
      delete e.file;
    }

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

    if (e.bookings && e.bookings.length) {
      for(var a=0;a<e.bookings.length;a++){
        var tmpA = [];
        for(var b=0;b<e.bookings[a].schedule.categories.length;b++){
          tmpA.push(e.bookings[a].schedule.categories[b]._id);
        }
        e.bookings[a].event = e.bookings[a].event._id;
        e.bookings[a].schedule.categories = tmpA;
        e.bookings[a].schedule.venue.location.locality = e.bookings[a].schedule.venue.location.city;
        delete e.bookings[a].schedule.venue.location.city;
      }
    }
    if (e.tags && !e.tags.length) delete e.tags

    //printjson(e);
    db.performances.save(e);
  });
  Object.keys(folders).sort().forEach(function(folder) {printjson("mkdir " + folder.substring(1))});

  //db.performances.findOne({'categories.0': {$exists:true},'galleries.0': {$exists:true},abouts: {$exists:true},tech_req: {$exists:true},'bookings.0': {$exists:true}});
}

var EVENTS = function() {
  //db.events.findOne({permalink:'lpm-2017-amsterdam'});
  //db.events.find({permalink:'lpm-2017-amsterdam'}).forEach(function(e) {
  var folders = {};
  function sanitizeOld(folder,defaultFolder) {
    return folder.
    replace("/mainImg/", defaultFolder).
    replace("/_flxer/avatar/", defaultFolder).
    replace(/\(|\)/g, "");
  }
  db.events.find({}).forEach(function(e) {
    e.is_public = e.is_public===1;
    e.gallery_is_public = e.gallery_is_public===1;
    e.is_freezed = e.is_freezed===1;
    if (e.permalink) {
      e.slug = e.permalink.toLowerCase();
      delete e.permalink;
    }
    if (e.websites && e.websites.length) {
      var web = [];
      var social = [];
      for(var a=0;a<e.websites.length;a++){
        if (e.websites[a] && e.websites[a].url) {
          if (
            e.websites[a].url.indexOf("facebook.com")!==-1 ||
            e.websites[a].url.indexOf("fb.com")!==-1 ||
            e.websites[a].url.indexOf("twitter.com")!==-1 ||
            e.websites[a].url.indexOf("instagram.com")!==-1 ||      
            e.websites[a].url.indexOf("youtube.com")!==-1 ||      
            e.websites[a].url.indexOf("vimeo.com")!==-1      
          ) {
            e.websites[a].type = "social";
            social.push(e.websites[a]);
          } else {
            web.push(e.websites[a]);
          }
        }
      }
      if (social.length) e.social = social;
      if (web.length) e.web = web;
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
    if (e.file) {
      if (e.file.file && e.file.file.length>2) {
        e.image = e.file;
        e.image.fileflxer = e.image.file;
        var defaultFolder = "/"+e.creation_date.getFullYear()+"/"+("0" + (e.creation_date.getMonth() + 1)).slice(-2)+"/";
        e.image.file = e.image.file.replace('/warehouse/', '/glacier/events_originals/');
        e.image.file = sanitizeOld(e.image.file, defaultFolder);
        printjson("cp -n " + e.image.fileflxer.replace('/warehouse/', 'warehouse_old/').replace(/\(/g, "\\(").replace(/\)/g, "\\)") + " " + e.image.file.replace('/warehouse/', 'glacier/events_originals/'));
        var folder = e.image.file.substring(0, e.image.file.lastIndexOf('/'));
        folders[folder] = 1;
        folder = folder.substring(0, folder.lastIndexOf('/'));
        folders[folder] = 1;
        folder = folder.substring(0, folder.lastIndexOf('/'));
        folders[folder] = 1;
      }
      delete e.file;
    }
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
    if (e.tobescheduled && e.tobescheduled.length) {
      var tmpA = [];
      for(var a=0;a<e.tobescheduled.length;a++){
        tmpA.push(e.tobescheduled[a].uid);
      }
      e.tobescheduled = tmpA;
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
        e.program[a].schedule.venue.location.locality = e.program[a].schedule.venue.location.city;
        delete e.program[a].schedule.venue.location.city;
      }
    }
    if (e.schedule && e.schedule.length) {
      for(var a=0;a<e.schedule.length;a++){
        e.schedule[a].venue.location.locality = e.schedule[a].venue.location.city;
        delete e.schedule[a].venue.location.city;
      }
    }
    //printjson(e);
    db.events.save(e);
  });
  Object.keys(folders).sort().forEach(function(folder) {printjson("mkdir " + folder.substring(1))});
}

var USERS = function() {
  //{surname:"Del Gobbo"}
  //db.users.findOne({"location.country":{$exists: true},"location.city":{$exists: false}});
  //db.users.findOne({surname:"Del Gobbo"});
  //db.users.find({surname:"Del Gobbo"}).forEach(function(e) {
  //db.users.find({"file.file":{$exists: true}}).forEach(function(e) {
  var folders = {};
  function sanitizeOld(folder,defaultFolder) {
    return folder.
    replace("/mainImg/", defaultFolder).
    replace("/_flxer/avatar/", defaultFolder).
    replace(/\(|\)/g, "");
  }
  db.users.find({}).forEach(function(e) {
    e.is_crew = e.is_crew===1;
    e.is_public = e.is_public===1;
    delete e.public;
    delete e.updated;
    delete e.img_data_id;
    delete e.img_data_type;
    delete e.img_data_folder;
    delete e.img_data_name;
    delete e.img_data_est;
    delete e.login;
    e.stagename = e.display_name;
    delete e.display_name;

    if (e.birth_date) {
      e.birthday = e.birth_date;
      delete e.birth_date;
    }

    if (e.permalink) {
      e.slug = e.permalink.toLowerCase();
      e.username = e.slug;
      delete e.permalink;
    }

    if (e.file) {
      if (e.file.file && e.file.file.length>2) {
        e.image = e.file;
        e.image.fileflxer = e.image.file;
        var defaultFolder = "/"+e.creation_date.getFullYear()+"/"+("0" + (e.creation_date.getMonth() + 1)).slice(-2)+"/";
        e.image.file = e.image.file.replace('/warehouse/', '/glacier/users_originals/');
        e.image.file = sanitizeOld(e.image.file, defaultFolder);
        var folder = e.image.file.substring(0, e.image.file.lastIndexOf('/'));
        folders[folder] = 1;
        folder = folder.substring(0, folder.lastIndexOf('/'));
        folders[folder] = 1;
        folder = folder.substring(0, folder.lastIndexOf('/'));
        folders[folder] = 1;
        printjson("cp -n " + e.image.fileflxer.replace('/warehouse/', 'warehouse_old/').replace(/\(/g, "\\(").replace(/\)/g, "\\)") + " " + e.image.file.replace('/glacier/users_originals/', 'glacier/users_originals/'));
      }
      delete e.file;
    }

    if (e.locations && e.locations.length) {
      e.addresses = [];
      var addressesO = {};
      for(var a=0;a<e.locations.length;a++){
        if (!addressesO[e.locations[a].country]) addressesO[e.locations[a].country] = [];
        if (addressesO[e.locations[a].country].indexOf(e.locations[a].city)===-1) addressesO[e.locations[a].country].push(e.locations[a].city);
      }
      for(var country in addressesO){
        if (addressesO[country].length) {
          for(var locality in addressesO[country]){
            var tmp = {
              country: country,
              locality: addressesO[country][locality]
            };
            e.addresses.push(tmp);
          }
        } else {
          var tmp = {
            country: country
          };
          e.addresses.push(tmp);      
        }
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
      var web = [];
      var social = [];
      for(var a=0;a<e.websites.length;a++){
        if (e.websites[a] && e.websites[a].url) {
          if (
            e.websites[a].url.indexOf("facebook.com")!==-1 ||
            e.websites[a].url.indexOf("fb.com")!==-1 ||
            e.websites[a].url.indexOf("twitter.com")!==-1 ||
            e.websites[a].url.indexOf("instagram.com")!==-1 ||      
            e.websites[a].url.indexOf("youtube.com")!==-1 ||      
            e.websites[a].url.indexOf("vimeo.com")!==-1      
          ) {
            e.websites[a].type = "social";
            social.push(e.websites[a]);
          } else {
            web.push(e.websites[a]);
          }
        }
      }
      if (social.length) e.social = social;
      if (web.length) e.web = web;
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
    if (e.events && e.events.length) e.stats.events = e.events.length;
    if (e.performances && e.performances.length) e.stats.performances = e.performances.length;
    if (e.tvshows && e.tvshows.length) e.stats.tvshows = e.tvshows.length;
    if (e.playlists && e.playlists.length) e.stats.playlists = e.playlists.length;
    if (e.footage && e.footage.length) e.stats.footage = e.footage.length;
    if (e.galleries && e.galleries.length) e.stats.galleries = e.galleries.length;
    if (e.members && e.members.length) e.stats.members = e.members.length;
    if (e.crews && e.crews.length) {
      e.stats.crews = e.crews.length;
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

    //printjson(e);
    db.users.save(e);
  });
  Object.keys(folders).sort().forEach(function(folder) {printjson("mkdir " + folder.substring(1))});

  db.users.find({surname:"Del Gobbo"}).forEach(function(e) {
    var tmp = {
      country: "Netherlands",
      locality: "Amsterdam",
      geometry : {
          lat : 52.3702157, 
          lng : 4.895167900000001
      }, 
    };
    e.addresses.push(tmp);
    var tmp = {
      url: "https://flyer.it"
    };
    e.web.push(tmp);
    e.social = [{
      url: "https://facebook.com/gianlucadelgobbo"
    }, {
      url: "https://twitter.com/flxer"
    }];
    e.emails[0].is_public = true;
    db.users.save(e);
  });

}

var PLAYLISTS = function() {
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
  
    //e.image = e.file;
    delete e.file;
    if (e.footage[0]=== undefined) {
      printjson(e.footage[0]);
      db.playlists.remove(e);
    } else {
      var footage = db.footage.findOne({_id:e.footage[0]});
      if (footage && footage.media) e.media = footage.media;
      printjson(e);
      db.playlists.save(e);
    }
  });  
}

var TVSHOWS = function() {
  var folders = {};
  var extoriginals = [];
  var valid = [
    "mov",
    "avi",
    "mp4",
    "MOV",
    "AVI",
    "mpg"
  ];
  function sanitizeOld(folder,defaultFolder) {
    return folder.
    replace("/_flxer/library/hole/", defaultFolder).
    replace("/_flxer/liveset/", defaultFolder).
    replace("/_videos/", defaultFolder).
    replace("/_flxer/library/no_hole/", defaultFolder).
    replace(/\(|\)/g, "");
  }
  db.tvshows.find({}).forEach(function(e) {
    if (e.permalink) {
      e.slug = e.permalink.toLowerCase();
      delete e.permalink;
    }
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
    e.media = e.file;
    delete e.file;
    e.media.fileflxer = e.media.file;
    var ext = e.media.file.substring(e.media.file.lastIndexOf('.') + 1);
    var defaultFolder = "/"+e.creation_date.getFullYear()+"/"+("0" + (e.creation_date.getMonth() + 1)).slice(-2)+"/";
    if (ext == "mp4") {
      e.media.originalflxer = e.media.file.substring(0, e.media.file.lastIndexOf('.'));
      var extoriginal = e.media.originalflxer.substring(e.media.file.lastIndexOf('_') + 1);
      if (extoriginals.indexOf(extoriginal)===-1 && extoriginal.length<5 && extoriginal.length>1) extoriginals.push(extoriginal); 
      if (extoriginal == e.media.originalflxer || valid.indexOf(extoriginal)===-1) {
        delete e.media.originalflxer;
      } else {
        e.media.originalflxer = e.media.originalflxer.substring(0, e.media.originalflxer.lastIndexOf('_')) + "." + extoriginal;
        e.media.original = e.media.originalflxer.replace('/warehouse/', '/glacier/videos_originals/').replace('/original_video/', '/');
        e.media.original = sanitizeOld(e.media.original, defaultFolder)
        var folder = e.media.original.substring(0, e.media.original.lastIndexOf('/'));
        folders[folder] = 1;
        folder = folder.substring(0, folder.lastIndexOf('/'));
        folders[folder] = 1;
        folder = folder.substring(0, folder.lastIndexOf('/'));
        folders[folder] = 1;
        printjson("cp -n " + e.media.originalflxer.replace('/warehouse/', 'warehouse_old/').replace(/\(/g, "\\(").replace(/\)/g, "\\)") + " " + e.media.original.replace('/glacier/', 'glacier/'));
      }
    }
    if (e.media.preview) {
      e.media.previewflxer = e.media.preview;
      e.media.preview = e.media.previewflxer.replace('/warehouse/', '/glacier/videos_previews/').replace('/preview_files/', '/');
      e.media.preview = sanitizeOld(e.media.preview, defaultFolder)
      var folder = e.media.preview.substring(0, e.media.preview.lastIndexOf('/'));
      folders[folder] = 1;
      folder = folder.substring(0, folder.lastIndexOf('/'));
      folders[folder] = 1;
      folder = folder.substring(0, folder.lastIndexOf('/'));
      folders[folder] = 1;
      printjson("cp -n " + e.media.previewflxer.replace('/warehouse/', 'warehouse_old/').replace(/\(/g, "\\(").replace(/\)/g, "\\)") + " " + e.media.preview.replace('/glacier/', 'glacier/'));
    }
    e.media.file = e.media.file.replace('/warehouse/', '/warehouse/videos/');
    e.media.file = sanitizeOld(e.media.file, defaultFolder);
    var folder = e.media.file.substring(0, e.media.file.lastIndexOf('/'));
    folders[folder] = 1;
    folder = folder.substring(0, folder.lastIndexOf('/'));
    folders[folder] = 1;
    folder = folder.substring(0, folder.lastIndexOf('/'));
    folders[folder] = 1;
    printjson("cp -n " + e.media.fileflxer.replace('/warehouse/', 'warehouse_old/').replace(/\(/g, "\\(").replace(/\)/g, "\\)") + " " + e.media.file.replace('/glacier/', 'glacier/'));

    //printjson(e);
    db.tvshows.save(e);
  });
  Object.keys(folders).sort().forEach(function(folder) {printjson("mkdir " + folder.substring(1))});
}

var GALLERIES = function() {
  // 01
  //db.galleries.count({"medias.file": {$exists: false}});
  db.galleries.remove({"medias.0": {$exists: false}});

  // 02
  var folders = {};
  var extoriginals = [];
  var ext = [];
  var valid = [
    "mp4",
    "mov",
    "MOV",
    "m4v",
    "MP4",
    "AVI",
    "flv",
    "avi",
    "mpg"
  ];
  function sanitizeOld(folder,defaultFolder) {
    return folder.
    replace("/_flxer/photos/", defaultFolder).
    replace("/_videos/", defaultFolder).
    replace("/_spot/", defaultFolder).
    replace("/_flxer/liveset/", defaultFolder).
    replace("/_photos/", defaultFolder).
    replace("/_flxer/library/hole/", defaultFolder).
    replace("/_audios/", defaultFolder).
    replace("/_flxer/library/no_hole/", defaultFolder).
    replace(/\(|\)/g, "");
  }
  //db.galleries.find({"medias.0":{$exists:true},"events.0":{$exists:true},"performances.0":{$exists:true}}).forEach(function(e) {
  db.galleries.find({}).forEach(function(e) {
    e.slug = e.permalink;
    delete e.permalink;

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
    delete e.file;

    var perf = [];
    for (var p in e.performances) perf.push(e.performances[p].id);
    e.performances = db.performances.find({old_id:{$in:perf}},{_id: 1}).toArray().map(function(item){ return item._id; });
    
    var evt = [];
    for (var p in e.events) evt.push(e.events[p].id);
    e.events = db.events.find({old_id:{$in:evt}},{_id: 1}).toArray().map(function(item){ return item._id; });
    
    var users = [];
    for (var p in e.users) users.push(e.users[p].old_id);
    e.users = db.users.find({old_id:{$in:users}},{_id: 1}).toArray().map(function(item){ return item._id; });
    
    e.users = db.users.find({old_id:{$in:users}},{_id: 1}).toArray().map(function(item){ return item._id; });
    
    var medias = [];
    for (var p in e.medias) {
      var media = e.medias[p].file;
      media.title = e.medias[p].title;
      media.slug = e.medias[p].permalink;
      medias.push(media);
    }
    e.medias = medias;
    printjson(medias.length);

    var conta = 0;
    var newMedias = [];
    var newVideos = [];
    var defaultFolder = "/"+e.creation_date.getFullYear()+"/"+("0" + (e.creation_date.getMonth() + 1)).slice(-2)+"/";
    e.medias.forEach(function(media) {
      media.fileflxer = media.file;
      const serverPath = media.file;
      const localFileNameExtension = serverPath.substring(serverPath.lastIndexOf('.') + 1);
      const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1);
      if (localFileName.substring(0,1)==='.') {
        printjson("HIDDEN FILE "+localFileName);
      } else {
        if (localFileNameExtension == "flv" || localFileNameExtension == "mp4" || localFileNameExtension == "swf" || localFileNameExtension == "mp3" || localFileNameExtension == "mov") {
          const localPath = serverPath.substring(0, serverPath.lastIndexOf('/'));
          const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
          const localFileNameOriginalExtension = localFileName.substring(localFileName.lastIndexOf('_') + 1, localFileName.lastIndexOf('.'));
          let localFileNameWithoutOriginalExtension = localFileNameWithoutExtension.substring(0, localFileNameWithoutExtension.lastIndexOf('_'));
          media.file = sanitizeOld(media.file, defaultFolder).replace('/warehouse/', '/warehouse/videos/');
          if (ext.indexOf(localFileNameExtension)===-1 && localFileNameExtension.length<5 && localFileNameExtension.length>1) ext.push(localFileNameExtension); 
          if (localFileNameExtension == "flv" || localFileNameExtension == "mp4") {
            media.previewflxer = `${localPath}/preview_files/${localFileNameWithoutExtension}.png`;
            //media.previewFileOld = `${localPath.replace('galleries/', '')}/preview_files/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
            if (extoriginals.indexOf(localFileNameOriginalExtension)===-1 && localFileNameOriginalExtension.length<5 && localFileNameOriginalExtension.length>1) extoriginals.push(localFileNameOriginalExtension); 
            if (valid.indexOf(localFileNameOriginalExtension)!==-1) {
              media.originalflxer = `${localPath}/original_video/${localFileNameWithoutOriginalExtension}.${localFileNameOriginalExtension}`;
              media.original = sanitizeOld(media.originalflxer, defaultFolder).replace('/warehouse/','/glacier/videos_originals/').replace('/original_video/','/');
            }
            media.preview = sanitizeOld(media.previewflxer, defaultFolder).replace('/warehouse/','/glacier/videos_previews/').replace('/preview_files/','/');
            /*
            media.folderNew = media.fileNew.substring(0, media.fileNew.lastIndexOf('/'));
            media.folderNew = media.folderNew.substring(media.folderNew.lastIndexOf('/'));
            folders[media.folderNew.replace('/warehouse/','/warehouse_new/')] = 1;
            printjson(Object.keys(folders));
            */
            var folder = media.file.substring(0, media.file.lastIndexOf('/'));
            folders[folder] = 1;
            folder = folder.substring(0, folder.lastIndexOf('/'));
            folders[folder] = 1;
            folder = folder.substring(0, folder.lastIndexOf('/'));
            folders[folder] = 1;
            var folder = media.preview.substring(0, media.preview.lastIndexOf('/'));
            folders[folder] = 1;
            folder = folder.substring(0, folder.lastIndexOf('/'));
            folders[folder] = 1;
            folder = folder.substring(0, folder.lastIndexOf('/'));
            folders[folder] = 1;
            if (localFileNameExtension == "flv") {
              //printjson("cp -n "+media.fileflxer.replace('/warehouse/','warehouse_old/')+" "+media.file.replace('/warehouse/','warehouse/'));
              //printjson("cp -n "+media.previewflxer.replace('/warehouse/','warehouse_old/')+" "+media.preview.replace('/glacier/','glacier/'));
            } else {
              //printjson("cp -n "+media.fileflxer.replace('/warehouse/','warehouse_old/')+" "+media.file.replace('/warehouse/','warehouse/'));
              //printjson("cp -n "+media.previewflxer.replace('/warehouse/','warehouse_old/')+" "+media.preview.replace('/glacier/','glacier/'));
              if (media.originalflxer) {
                //printjson("cp -n "+media.originalflxer.replace('/warehouse/','warehouse_old/')+" "+media.original.replace('/glacier/','glacier/'));
                var folder = media.original.substring(0, media.original.lastIndexOf('/'));
                folders[folder] = 1;
                folder = folder.substring(0, folder.lastIndexOf('/'));
                folders[folder] = 1;
                folder = folder.substring(0, folder.lastIndexOf('/'));
                folders[folder] = 1;
              }
            }
          }
          if (localFileNameExtension == "swf") {
            media.previewflxer = media.fileflxer.replace('.swf', '.jpg');
            media.preview = sanitizeOld(media.previewflxer, defaultFolder).replace('/warehouse/','/glacier/videos_previews/').replace('/preview_files/','/');
            //printjson("cp -n "+media.fileflxer.replace('/warehouse/','warehouse_old/')+" "+media.file.replace('/warehouse/','warehouse/'));
            //printjson("cp -n "+media.previewflxer.replace('/warehouse/','warehouse_old/')+" "+media.preview.replace('/glacier/','glacier/'));
          }
          if (localFileNameExtension == "mov") {
            media.previewflxer = `${localPath}/preview_files/${localFileNameWithoutExtension}_mov.png`;
            media.preview = sanitizeOld(media.previewflxer, defaultFolder).replace('/warehouse/','/glacier/videos_previews/').replace('/preview_files/','/');
            //printjson("cp -n "+media.fileflxer.replace('/warehouse/','warehouse_old/')+" "+media.file.replace('/warehouse/','warehouse/'));
          }
          if (localFileNameExtension == "mp3") {
            //printjson("cp -n "+media.fileflxer.replace('/warehouse/','warehouse_old/')+" "+media.file.replace('/warehouse/','warehouse/'));
          }
          let video = e;
          video.media = media;
          newVideos.push(video);
        } else {
          media.file = sanitizeOld(media.file, defaultFolder).replace('/warehouse/', '/glacier/galleries_originals/');
          var folder = media.file.substring(0, media.file.lastIndexOf('/'));
          folders[folder] = 1;
          folder = folder.substring(0, folder.lastIndexOf('/'));
          folders[folder] = 1;
          folder = folder.substring(0, folder.lastIndexOf('/'));
          folders[folder] = 1;
          delete media.encoded;
          //printjson("cp -n "+media.fileflxer.replace('/warehouse/','warehouse_old/')+" "+media.file.replace('/glacier/','glacier/'));
          newMedias.push(media);
        }
      }
      conta++;
      if (conta == e.medias.length) {
        //if (!e.text || !Object.keys(e.text).length) delete e.text;
        if (e.stats.video) delete e.stats.video;
        if (newMedias.length) {
          //delete e.media;
          e.image = newMedias[0];
          e.stats.img = newMedias.length;
          e.medias = newMedias;
          printjson('SAVEEEEEE GALLERY');
          printjson(e);
          //db.galleries.save(e);
        } else {
          printjson('REMOVE GALLERY');
          printjson(e);
        }
        if (newVideos.length) {
          newVideos.forEach(function(video) {
            if (video.stats.img) delete video.stats.img;
            if (!video.text || !Object.keys(video.text).length) delete video.text;
            delete video.stats.img;
            delete video.stats.video;
            delete video.medias;
            delete video.image;
            delete video._id;
            printjson('SAVEEEEEE VIDEO!!!');
            printjson(video);
            //db.videos.save(video);
          });
        }
      }
    });
  });
  printjson(ext);
  Object.keys(folders).sort().forEach(function(folder) {printjson("mkdir " + folder.substring(1))});

  db.galleries.find({}).forEach(function(gallery) {
    gallery.performances2 = [];
    var res = db.performances.find({"galleries": gallery._id}).toArray();
    var conta = 0;
    if (res.length) {
      res.forEach(function(performance) {
        conta++;
        gallery.performances2.push(performance._id);
        printjson(gallery.title+' performance: '+performance.title+' conta: '+conta+' res.length: '+res.length);
        if (conta == res.length) {
          printjson('SAVEEEEEE');
          printjson(gallery);
          //db.galleries.save(gallery);
        }
      });
    }
  });

  // 03
  db.galleries.find({}).forEach(function(gallery) {
    gallery.events2 = [];
    var res = db.events.find({"galleries": gallery._id}).toArray();
    var conta = 0;
    if (res.length) {
      res.forEach(function(event) {
        conta++;
        gallery.events2.push(event._id);
        printjson(gallery.title+' event: '+event.title+' conta: '+conta+' res.length: '+res.length);
        if (conta == res.length) {
          printjson('SAVEEEEEE');
          //printjson(gallery);
          db.galleries.save(gallery);
        }
      });
    }
  });

  // 05
  db.galleries.remove({"medias.0": {$exists: false}});

  // 06
  db.galleries.find({media: {$exists: true}}).forEach(function(video) {
    delete video.media;
    db.galleries.save(video);
  });

  // 07
  db.tvshows.find({}).forEach(function(tvshow) {
    //var res = db.performances.find({"galleries": gallery._id}).toArray();
    var conta = 0;
    var videos = db.videos.find({"media.file": tvshow.media.file}).toArray();
    if (videos.length) {
      videos.forEach(function(video) {
        video.categories = tvshow.categories;
        video.programming = tvshow.programming;
        video.stats.visits += tvshow.stats.visits;
        video.abouts = tvshow.abouts;
        printjson("Update video");
        printjson(video);
        db.videos.save(video);
      });
    } else {
      printjson("Insert video");
      delete tvshow._id;
      if (!tvshow.tags.length) delete tvshow.tags;
      printjson(tvshow);
      db.videos.save(tvshow);
    }
  });
  
  // 08
  db.videos.find({"events.0": {$exists: true}}).forEach(function(video) {
    //var res = db.performances.find({"galleries": gallery._id}).toArray();
    var conta = 0;
    if (video.events) {
      video.events.forEach(function(event) {
        db.events.find({_id: event}).forEach(function(e) {
          if (!e.videos) e.videos = [];
          e.videos.push(video._id);
          printjson(e.title);
          printjson(e.videos);
          db.events.save(e);
        });
      });
    }
  });
  
  // 09
  db.videos.find({"performances.0": {$exists: true}}).forEach(function(video) {
    //var res = db.performances.find({"galleries": gallery._id}).toArray();
    var conta = 0;
    if (video.performances) {
      video.performances.forEach(function(performance) {
        db.performances.find({_id: performance}).forEach(function(e) {
          if (!e.videos) e.videos = [];
          e.videos.push(video._id);
          printjson(e.title);
          printjson(e.videos);
          db.performances.save(e);
        });
      });
    }
  });
  
  // 10
  db.videos.find({}, {users: 1}).forEach(function(e) {
    e.users.forEach(function(user) {
      db.users.find({"_id": user}).forEach(function(user) {
        if (!user.videos) user.videos = [];
        user.videos.push(e._id);
        printjson(user.videos);
        db.users.save(user);
      });  
    });  
  });
}
  // GENERATE ALL NEWS!!!

  // 11
  db.news.find({}, {users: 1}).forEach(function(e) {
    e.users.forEach(function(user) {
      db.users.find({"_id": user}).forEach(function(user) {
        if (!user.news) user.news = [];
        user.news.push(e._id);
        printjson(user.news);
        db.users.save(user);
      });  
    });  
  });


  // 12
  db.users.find({}).forEach(function(e) {
    e.stats = {};
    if (e.events && e.events.length) e.stats.events = e.events.length;
    if (e.performances && e.performances.length) e.stats.performances = e.performances.length;
    if (e.news && e.news.length) e.stats.news = e.news.length;
    if (e.videos && e.videos.length) e.stats.videos = e.videos.length;
    if (e.galleries && e.galleries.length) e.stats.galleries = e.galleries.length;
    if (e.playlists && e.playlists.length) e.stats.playlists = e.playlists.length;
    if (e.footage && e.footage.length) e.stats.footage = e.footage.length;

    if (e.is_crew && e.members && e.members.length) e.stats.members = e.members.length;
    if (!e.is_crew && e.crews && e.crews.length) e.stats.crews = e.crews.length;

    e.activity = 0;
    e.activity+= (e.stats.events ? e.stats.events             * 5 : 0);
    e.activity+= (e.stats.performances ? e.stats.performances * 3 : 0);
    e.activity+= (e.stats.news ? e.stats.news                 * 1 : 0);
    e.activity+= (e.stats.videos ? e.stats.videos             * 3 : 0);
    e.activity+= (e.stats.galleries ? e.stats.galleries       * 1 : 0);
    e.activity+= (e.stats.playlists ? e.stats.playlists       * 2 : 0);
    e.activity+= (e.stats.footage ? e.stats.footage           * 1 : 0);

    printjson(e.activity);
    //printjson(e.stats);
    db.users.save(e);
  });  
}

var USERS_ADDRESSES = function() {
  // 01 countryfix
  var fix = [
    {find: 'Cote D Ivoire (Ivory Coast)', replace: "Côte d'Ivoire"},
    {find: '00179', replace: 'Italy'},
    {find: '3582 CC', replace: 'Netherlands'},
    {find: 'Be', replace: 'Belgium'},
    {find: 'Ca', replace: 'Canada'},
    {find: 'Cn', replace: 'China'},
    {find: 'De', replace: 'Germany'},
    {find: 'Curitiba / Brasil', replace: 'Brasil'},
    {find: 'Deutschland', replace: 'Germany'},
    {find: 'Es', replace: 'Spain'},
    {find: 'Espana', replace: 'Spain'},
    {find: 'Fi', replace: 'Finland'},
    {find: 'It', replace: 'Italy'},
    {find: 'Jan Mayen', replace: 'Italy'},
    {find: 'Jp', replace: 'Japan'},
    {find: 'Korea North', replace: 'South Korea'},
    {find: 'Korea South', replace: 'South Korea'},
    {find: 'Korea', replace: 'South Korea'},
    {find: 'Korea, South', replace: 'South Korea'},
    {find: 'Loano, Italy', replace: 'Italy'},
    {find: 'Melbourne-australia', replace: 'Australia'},
    {find: 'Mx', replace: 'Mexico'},
    {find: 'Nakano,tokyo,japan', replace: 'Japan'},
    {find: 'Nederland', replace: 'Netherlands'},
    {find: 'Netherland', replace: 'Netherlands'},
    {find: 'New Zeland', replace: 'New Zealand'},
    {find: 'Ph', replace: 'Philippines'},
    {find: 'Rsa', replace: 'South Africa'},
    {find: 'Russian Federation', replace: 'Russia'},
    {find: 'Saint Helena', replace: 'Japan'},
    {find: 'San Jose/ San Francisco', replace: 'United States'},
    {find: 'USA', replace: 'United States'},
    {find: 'UK', replace: 'United Kingdom'},
    {find: 'argentuza', replace: 'Aregentina'},
    {find: 'australia', replace: 'Australia'},
    {find: 'BE', replace: 'Belgium'},
    {find: 'CA', replace: 'United States'},
    {find: 'CN', replace: 'China'},
    {find: 'Croatia, Republic of', replace: 'Croatia'},
    {find: 'cyprus', replace: ''},
    {find: 'DE', replace: 'Germany'},
    {find: 'deutschland', replace: 'Germany'},
    {find: 'ecuador', replace: 'Ecuador'},
    {find: 'ECUADOR', replace: 'Ecuador'},
    {find: 'England', replace: 'United Kingdom'},
    {find: 'england', replace: 'United Kingdom'},
    {find: 'ENGLAND', replace: 'United Kingdom'},
    {find: 'ES', replace: 'Spain'},
    {find: 'estonia', replace: 'Estonia'},
    {find: 'Fukui JAPAN', replace: 'Japan'},
    {find: 'GB', replace: 'United Kingdom'},
    {find: 'IE', replace: 'Ireland'},
    {find: 'IT', replace: 'Italy'},
    {find: 'jakarta', replace: ''},
    {find: 'JP', replace: 'Japan'},
    {find: 'Melbourne-Australia', replace: 'Australia'},
    {find: 'MX', replace: 'Mexico'},
    {find: 'nakano,tokyo,japan', replace: 'Japan'},
    {find: 'Piacenza-Italy-Curitiba-Brazil', replace: 'Italy'},
    {find: 'RSA', replace: 'South Africa'},
    {find: 'Seattle', replace: 'United States'},
    {find: 'TR', replace: 'Turkey'},
    {find: 'UA', replace: 'United States'},
    {find: 'US', replace: 'United States'},
    {find: 'venezia', replace: 'Italy'},
    {find: 'Cote d Ivoire (Ivory Coast)', replace: "Côte d'Ivoire"},
    {find: 'HU', replace: 'Hungary'},
    {find: 'Hungaria', replace: 'Hungary'},
    {find: 'PH', replace: 'Philippines'},
    {find: 'Hungaria', replace: 'Hungary'},
    {find: 'The Netherlands', replace: 'Netherlands'},
    {find: 'Fayetteville, Arkansas', replace: 'United States'},
    {find: 'Glendale, Arizona', replace: 'United States'},
    {find: 'Yugoslavia', replace: 'Serbia'},
    {find: 'Gabon Republic', replace: 'Gabon'},
    {find: 'Aregentina', replace: 'Argentina'},
    {find: 'FI', replace: 'Finland'},
    {find: 'IL', replace: 'Israel'},
    {find: 'Tokyo', replace: 'Japan'},
    {find: 'Tonga', replace: 'South Africa'},
    {find: 'Tuvalu', replace: 'Israel'},
    {find: 'SG', replace: 'Singapore'},
    {find: 'CUBA', replace: 'Cuba'}
  ];
  for(var b=0;b<fix.length;b++){
    printjson(fix[b]);
    db.users.find({"addresses.country": fix[b].find},{addresses: 1}).forEach(function(e) {
      if (e.addresses && e.addresses.length) {
        for(var a=0;a<e.addresses.length;a++){
          if (e.addresses[a].country == fix[b].find) e.addresses[a].country = fix[b].replace;
          if (e.addresses[a].country === "") {
            if (e.addresses[a].locality === "jakrata") {
              e.addresses[a].country = "Indonesia";
            }
            if (e.addresses[a].locality === "nicosia") {
              e.addresses[a].country = "Italy";
            }
          }
        }
      }
      db.users.update({_id: e._id}, {$set: {addresses: e.addresses}}, { upsert: true });
    });
  }

  // 02 Sanitize
  var sanitize = function (str) {
    return str. 
    replace('\u0000', '').  
    replace('\u009a', 'š').  
    replace('\u008e', 'é').  
    replace('\u009f', 'ü').  
    replace('\u009c', 'œ').  
    replace('å\u0082', 'ł').  
    replace('u00e9', 'é').  
    replace('\u0092', "'").  
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
    replace('u010c', 'č').  
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
    replace('u0041', 'a').  
    replace('u0042', 'b').  
    replace('u0043', 'c').  
    replace('u0044', 'd').  
    replace('u0045', 'e').  
    replace('u0046', 'f').  
    replace('u0047', 'g').  
    replace('u0048', 'h').  
    replace('u0049', 'i').  
    replace('u004a', 'j').  
    replace('u004b', 'k').  
    replace('u004c', 'l').  
    replace('u004d', 'm').  
    replace('u004e', 'n').  
    replace('u004f', 'o').  
    replace('u0050', 'p').  
    replace('u0051', 'q').  
    replace('u0052', 'r').  
    replace('u0053', 's').  
    replace('u0054', 't').  
    replace('u0055', 'u').  
    replace('u0056', 'v').  
    replace('u0057', 'w').  
    replace('u0058', 'x').  
    replace('u0059', 'y').  
    replace('u005a', 'z').  
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
    replace('u00c0', 'à').  
    replace('u00c1', 'á').  
    replace('u00c2', 'â').  
    replace('u00c3', 'ã').  
    replace('u00c4', 'ä').  
    replace('u00c5', 'å').  
    replace('u00c6', 'æ').  
    replace('u00c7', 'ç').  
    replace('u00c8', 'è').  
    replace('u00c9', 'é').  
    replace('u00ca', 'ê').  
    replace('u00cb', 'ë').  
    replace('u00cc', 'ì').  
    replace('u00cd', 'í').  
    replace('u00ce', 'î').  
    replace('u00cf', 'ï').  
    replace('u00d0', 'ð').  
    replace('u00d1', 'ñ').  
    replace('u00d2', 'ò').  
    replace('u00d3', 'ó').  
    replace('u00d4', 'ô').  
    replace('u00d5', 'õ').  
    replace('u00d6', 'ö').  
    replace('u00d7', '×').  
    replace('u00d8', 'ø').  
    replace('u00d9', 'ù').  
    replace('u00da', 'ú').  
    replace('u00db', 'û').  
    replace('u00dc', 'ü').  
    replace('u00dd', 'ý').  
    replace('u00de', 'þ').  
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
    replace('u0e1b', 'ป').  
    replace('u0e30', 'ะ').  
    replace('u0e40', 'เ').  
    replace('u0e27', 'ว').  
    replace('u0e28', 'ศ').  
    replace('u4e0a', '上').  
    replace('u6d77', 'u0e1b').  
    replace('u0e30', 'u0e1b').  
    replace('u0e30', 'u0e1b').  
    replace('u0e30', 'u0e1b').  
    replace('u0e30', 'u0e1b')
  };
  var sanitize2 = function (str) {
    return str. 
    replace('u00fa', 'ú').  
    replace('u00fb', 'û').  
    replace('u00fc', 'ü').  
    replace('u00fd', 'ý').  
    replace('u00fe', 'þ').  
    replace('u00ff', 'ÿ').  
    replace('u0100', 'ā').  
    replace('u0101', 'ā').  
    replace('u0102', 'ă').  
    replace('u0103', 'ă').  
    replace('u0104', 'ą').  
    replace('u0105', 'ą').  
    replace('u0106', 'ć').  
    replace('u0107', 'ć').  
    replace('u0108', 'ĉ').  
    replace('u0109', 'ĉ').  
    replace('u010a', 'ċ').  
    replace('u010b', 'ċ').  
    replace('u010c', 'č').  
    replace('u010d', 'č').  
    replace('u010e', 'ď').  
    replace('u010f', 'ď').  
    replace('u0110', 'đ').  
    replace('u0111', 'đ').  
    replace('u0112', 'ē').  
    replace('u0113', 'ē').  
    replace('u0114', 'ĕ').  
    replace('u0115', 'ĕ').  
    replace('u0116', 'ė').  
    replace('u0117', 'ė').  
    replace('u0118', 'ę').  
    replace('u0119', 'ę').  
    replace('u011a', 'ě').  
    replace('u011b', 'ě').  
    replace('u011c', 'ĝ').  
    replace('u011d', 'ĝ').  
    replace('u011e', 'ğ').  
    replace('u011f', 'ğ').  
    replace('u0120', 'ġ').  
    replace('u0121', 'ġ').  
    replace('u0122', 'ģ').  
    replace('u0123', 'ģ').  
    replace('u0124', 'ĥ').  
    replace('u0125', 'ĥ').  
    replace('u0126', 'ħ').  
    replace('u0127', 'ħ').  
    replace('u0128', 'ĩ').  
    replace('u0129', 'ĩ').  
    replace('u012a', 'ī').  
    replace('u012b', 'ī').  
    replace('u012c', 'ĭ').  
    replace('u012d', 'ĭ').  
    replace('u012e', 'į').  
    replace('u012f', 'į').  
    replace('u0130', 'İ').  
    replace('u0131', 'ı').  
    replace('u0132', 'ĳ').  
    replace('u0133', 'ĳ').  
    replace('u0134', 'ĵ').  
    replace('u0135', 'ĵ').  
    replace('u0136', 'ķ').  
    replace('u0137', 'ķ').  
    replace('u0138', 'ĸ').  
    replace('u0139', 'ĺ').  
    replace('u013a', 'ĺ').  
    replace('u013b', 'ļ').  
    replace('u013c', 'ļ').  
    replace('u013d', 'ľ').  
    replace('u013e', 'ľ').  
    replace('u013f', 'ŀ').  
    replace('u0140', 'ŀ').  
    replace('u0141', 'ł').  
    replace('u0142', 'ł').  
    replace('u0143', 'ń').  
    replace('u0144', 'ń').  
    replace('u0145', 'ņ').  
    replace('u0146', 'ņ').  
    replace('u0147', 'ň').  
    replace('u0148', 'ň').  
    replace('u0149', 'ŉ').  
    replace('u014a', 'ŋ').  
    replace('u014b', 'ŋ').  
    replace('u014c', 'ō').  
    replace('u014d', 'ō').  
    replace('u014e', 'ŏ').  
    replace('u014f', 'ŏ').  
    replace('u0150', 'ő').  
    replace('u0151', 'ő').  
    replace('u0152', 'œ').  
    replace('u0153', 'œ').  
    replace('u0154', 'ŕ').  
    replace('u0155', 'ŕ').  
    replace('u0156', 'ŗ').  
    replace('u0157', 'ŗ').  
    replace('u0158', 'ř').  
    replace('u0159', 'ř').  
    replace('u015a', 'ś').  
    replace('u015b', 'ś').  
    replace('u015c', 'ŝ').  
    replace('u015d', 'ŝ').  
    replace('u015e', 'ş').  
    replace('u015f', 'ş').  
    replace('u0160', 'š').  
    replace('u0161', 'š').  
    replace('u0162', 'ţ').  
    replace('u0163', 'ţ').  
    replace('u0164', 'ť').  
    replace('u0165', 'ť').  
    replace('u0166', 'ŧ').  
    replace('u0167', 'ŧ').  
    replace('u0168', 'ũ').  
    replace('u0169', 'ũ').  
    replace('u016a', 'ū').  
    replace('u016b', 'ū').  
    replace('u016c', 'ŭ').  
    replace('u016d', 'ŭ').  
    replace('u016e', 'ů').  
    replace('u016f', 'ů').  
    replace('u0170', 'ű').  
    replace('u0171', 'ű').  
    replace('u0172', 'ų').  
    replace('u0173', 'ų').  
    replace('u0174', 'ŵ').  
    replace('u0175', 'ŵ').  
    replace('u0176', 'ŷ').  
    replace('u0177', 'ŷ').  
    replace('u0178', 'ÿ').  
    replace('u0179', 'ź').  
    replace('u017a', 'ź').  
    replace('u017b', 'ż').  
    replace('u017c', 'ż').  
    replace('u017d', 'ž').  
    replace('u017e', 'ž').  
    replace('u017f', 'ſ').  
    replace('u0180', 'ƀ').  
    replace('u0181', 'ɓ').  
    replace('u0182', 'ƃ').  
    replace('u0183', 'ƃ').  
    replace('u0184', 'ƅ').  
    replace('u0185', 'ƅ').  
    replace('u0186', 'ɔ').  
    replace('u0187', 'ƈ').  
    replace('u0188', 'ƈ').  
    replace('u0189', 'ɖ').  
    replace('u018a', 'ɗ').  
    replace('u018b', 'ƌ').  
    replace('u018c', 'ƌ').  
    replace('u018d', 'ƍ').  
    replace('u018e', 'ǝ').  
    replace('u018f', 'ə').  
    replace('u0190', 'ɛ').  
    replace('u0191', 'ƒ').  
    replace('u0192', 'ƒ').  
    replace('u0193', 'ɠ').  
    replace('u0194', 'ɣ').  
    replace('u0195', 'ƕ').  
    replace('u0196', 'ɩ').  
    replace('u0197', 'ɨ').  
    replace('u0198', 'ƙ').  
    replace('u0199', 'ƙ').  
    replace('u019a', 'ƚ').  
    replace('u019b', 'ƛ').  
    replace('u019c', 'ɯ').  
    replace('u019d', 'ɲ').  
    replace('u019e', 'ƞ').  
    replace('u019f', 'ɵ').  
    replace('u01a0', 'ơ').  
    replace('u01a1', 'ơ').  
    replace('u01a2', 'ƣ').  
    replace('u01a3', 'ƣ').  
    replace('u01a4', 'ƥ').  
    replace('u01a5', 'ƥ').  
    replace('u01a6', 'ʀ').  
    replace('u01a7', 'ƨ').  
    replace('u01a8', 'ƨ').  
    replace('u01a9', 'ʃ').  
    replace('u01aa', 'ƪ').  
    replace('u01ab', 'ƫ').  
    replace('u01ac', 'ƭ').  
    replace('u01ad', 'ƭ').  
    replace('u01ae', 'ʈ').  
    replace('u01af', 'ư').  
    replace('u01b0', 'ư').  
    replace('u01b1', 'ʊ').  
    replace('u01b2', 'ʋ').  
    replace('u01b3', 'ƴ').  
    replace('u01b4', 'ƴ').  
    replace('u01b5', 'ƶ').  
    replace('u01b6', 'ƶ').  
    replace('u01b7', 'ʒ').  
    replace('u01b8', 'ƹ').  
    replace('u01b9', 'ƹ').  
    replace('u01ba', 'ƺ').  
    replace('u01bb', 'ƻ')
  }
  var sanitize3 = function (str) {
    return str. 
    replace('u01bc', 'ƽ').  
    replace('u01bd', 'ƽ').  
    replace('u01be', 'ƾ').  
    replace('u01bf', 'ƿ').  
    replace('u01c0', 'ǀ').  
    replace('u01c1', 'ǁ').  
    replace('u01c2', 'ǂ').  
    replace('u01c3', 'ǃ').  
    replace('u01c4', 'ǆ').  
    replace('u01c5', 'ǅ').  
    replace('u01c6', 'ǆ').  
    replace('u01c7', 'ǉ').  
    replace('u01c8', 'ǈ').  
    replace('u01c9', 'ǉ').  
    replace('u01ca', 'ǌ').  
    replace('u01cb', 'ǋ').  
    replace('u01cc', 'ǌ').  
    replace('u01cd', 'ǎ').  
    replace('u01ce', 'ǎ').  
    replace('u01cf', 'ǐ').  
    replace('u01d0', 'ǐ').  
    replace('u01d1', 'ǒ').  
    replace('u01d2', 'ǒ').  
    replace('u01d3', 'ǔ').  
    replace('u01d4', 'ǔ').  
    replace('u01d5', 'ǖ').  
    replace('u01d6', 'ǖ').  
    replace('u01d7', 'ǘ').  
    replace('u01d8', 'ǘ').  
    replace('u01d9', 'ǚ').  
    replace('u01da', 'ǚ').  
    replace('u01db', 'ǜ').  
    replace('u01dc', 'ǜ').  
    replace('u01dd', 'ǝ').  
    replace('u01de', 'ǟ').  
    replace('u01df', 'ǟ').  
    replace('u01e0', 'ǡ').  
    replace('u01e1', 'ǡ').  
    replace('u01e2', 'ǣ').  
    replace('u01e3', 'ǣ').  
    replace('u01e4', 'ǥ').  
    replace('u01e5', 'ǥ').  
    replace('u01e6', 'ǧ').  
    replace('u01e7', 'ǧ').  
    replace('u01e8', 'ǩ').  
    replace('u01e9', 'ǩ').  
    replace('u01ea', 'ǫ').  
    replace('u01eb', 'ǫ').  
    replace('u01ec', 'ǭ').  
    replace('u01ed', 'ǭ').  
    replace('u01ee', 'ǯ').  
    replace('u01ef', 'ǯ').  
    replace('u01f0', 'ǰ').  
    replace('u01f1', 'ǳ').  
    replace('u01f2', 'ǲ').  
    replace('u01f3', 'ǳ').  
    replace('u01f4', 'ǵ').  
    replace('u01f5', 'ǵ').  
    replace('u01f6', 'ƕ').  
    replace('u01f7', 'ƿ').  
    replace('u01f8', 'ǹ').  
    replace('u01f9', 'ǹ').  
    replace('u01fa', 'ǻ').  
    replace('u01fb', 'ǻ').  
    replace('u01fc', 'ǽ').  
    replace('u01fd', 'ǽ').  
    replace('u01fe', 'ǿ').  
    replace('u01ff', 'ǿ').  
    replace('u0200', 'ȁ').  
    replace('u0201', 'ȁ').  
    replace('u0202', 'ȃ').  
    replace('u0203', 'ȃ').  
    replace('u0204', 'ȅ').  
    replace('u0205', 'ȅ').  
    replace('u0206', 'ȇ').  
    replace('u0207', 'ȇ').  
    replace('u0208', 'ȉ').  
    replace('u0209', 'ȉ').  
    replace('u020a', 'ȋ').  
    replace('u020b', 'ȋ').  
    replace('u020c', 'ȍ').  
    replace('u020d', 'ȍ').  
    replace('u020e', 'ȏ').  
    replace('u020f', 'ȏ').  
    replace('u0210', 'ȑ').  
    replace('u0211', 'ȑ').  
    replace('u0212', 'ȓ').  
    replace('u0213', 'ȓ').  
    replace('u0214', 'ȕ').  
    replace('u0215', 'ȕ').  
    replace('u0216', 'ȗ').  
    replace('u0217', 'ȗ').  
    replace('u0218', 'ș').  
    replace('u0219', 'ș').  
    replace('u021a', 'ț').  
    replace('u021b', 'ț').  
    replace('u021c', 'ȝ').  
    replace('u021d', 'ȝ').  
    replace('u021e', 'ȟ').  
    replace('u021f', 'ȟ').  
    replace('u0220', 'Ƞ').  
    replace('u0221', 'ȡ').  
    replace('u0222', 'ȣ').  
    replace('u0223', 'ȣ').  
    replace('u0224', 'ȥ').  
    replace('u0225', 'ȥ').  
    replace('u0226', 'ȧ').  
    replace('u0227', 'ȧ').  
    replace('u0228', 'ȩ').  
    replace('u0229', 'ȩ').  
    replace('u022a', 'ȫ').  
    replace('u022b', 'ȫ').  
    replace('u022c', 'ȭ').  
    replace('u022d', 'ȭ').  
    replace('u022e', 'ȯ').  
    replace('u022f', 'ȯ').  
    replace('u0230', 'ȱ').  
    replace('u0231', 'ȱ').  
    replace('u0232', 'ȳ').  
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
    replace('u011b', 'ě').  
    replace('u00f8', 'ø').  
    replace('u00f8', 'ø').  
    replace('u00f8', 'ø').  
    replace('u00f8', 'ø').  
    replace('u00f8', 'ø').  
    replace('u00f8', 'ø').  
    replace('u00f8', 'ø').  
    replace('u00f8', 'ø').  
    replace('u00f8', 'ø').  
    replace('u00f8', 'ø');
  }
  var sanitize4 = function (str) {
    return str. 
    replace('u0370', 'Ͱ').
    replace('u0371', 'ͱ').
    replace('u0372', 'Ͳ').
    replace('u0373', 'ͳ').
    replace('u0374', 'ʹ').
    replace('u0375', '͵').
    replace('u0376', 'Ͷ').
    replace('u0377', 'ͷ').
    replace('u037a', 'ͺ').
    replace('u037b', 'ͻ').
    replace('u037c', 'ͼ').
    replace('u037d', 'ͽ').
    replace('u037e', ';').
    replace('u0384', '΄').
    replace('u0385', '΅').
    replace('u0386', 'ά').
    replace('u0387', '·').
    replace('u0388', 'έ').
    replace('u0389', 'ή').
    replace('u038a', 'ί').
    replace('u038c', 'ό').
    replace('u038e', 'ύ').
    replace('u038f', 'ώ').
    replace('u0390', 'ΐ').
    replace('u0391', 'α').
    replace('u0392', 'β').
    replace('u0393', 'γ').
    replace('u0394', 'δ').
    replace('u0395', 'ε').
    replace('u0396', 'ζ').
    replace('u0397', 'η').
    replace('u0398', 'θ').
    replace('u0399', 'ι').
    replace('u039a', 'κ').
    replace('u039b', 'λ').
    replace('u039c', 'μ').
    replace('u039d', 'ν').
    replace('u039e', 'ξ').
    replace('u039f', 'ο').
    replace('u03a0', 'π').
    replace('u03a1', 'ρ').
    replace('u03a3', 'σ').
    replace('u03a4', 'τ').
    replace('u03a5', 'υ').
    replace('u03a6', 'φ').
    replace('u03a7', 'χ').
    replace('u03a8', 'ψ').
    replace('u03a9', 'ω').
    replace('u03aa', 'ϊ').
    replace('u03ab', 'ϋ').
    replace('u03ac', 'ά').
    replace('u03ad', 'έ').
    replace('u03ae', 'ή').
    replace('u03af', 'ί').
    replace('u03b0', 'ΰ').
    replace('u03b1', 'α').
    replace('u03b2', 'β').
    replace('u03b3', 'γ').
    replace('u03b4', 'δ').
    replace('u03b5', 'ε').
    replace('u03b6', 'ζ').
    replace('u03b7', 'η').
    replace('u03b8', 'θ').
    replace('u03b9', 'ι').
    replace('u03ba', 'κ').
    replace('u03bb', 'λ').
    replace('u03bc', 'μ').
    replace('u03bd', 'ν').
    replace('u03be', 'ξ').
    replace('u03bf', 'ο').
    replace('u03c0', 'π').
    replace('u03c1', 'ρ').
    replace('u03c2', 'ς').
    replace('u03c3', 'σ').
    replace('u03c4', 'τ').
    replace('u03c5', 'υ').
    replace('u03c6', 'φ').
    replace('u03c7', 'χ').
    replace('u03c8', 'ψ').
    replace('u03c9', 'ω').
    replace('u03ca', 'ϊ').
    replace('u03cb', 'ϋ').
    replace('u03cc', 'ό').
    replace('u03cd', 'ύ').
    replace('u03ce', 'ώ').
    replace('u03cf', 'Ϗ').
    replace('u03d0', 'ϐ').
    replace('u03d1', 'ϑ').
    replace('u03d2', 'ϒ').
    replace('u03d3', 'ϓ').
    replace('u03d4', 'ϔ').
    replace('u03d5', 'ϕ').
    replace('u03d6', 'ϖ').
    replace('u03d7', 'ϗ').
    replace('u03d8', 'Ϙ').
    replace('u03d9', 'ϙ').
    replace('u03da', 'ϛ').
    replace('u03db', 'ϛ').
    replace('u03dc', 'ϝ').
    replace('u03dd', 'ϝ').
    replace('u03de', 'ϟ').
    replace('u03df', 'ϟ').
    replace('u03e0', 'ϡ').
    replace('u03e1', 'ϡ').
    replace('u03e2', 'ϣ').
    replace('u03e3', 'ϣ').
    replace('u03e4', 'ϥ').
    replace('u03e5', 'ϥ').
    replace('u03e6', 'ϧ').
    replace('u03e7', 'ϧ').
    replace('u03e8', 'ϩ').
    replace('u03e9', 'ϩ').
    replace('u03ea', 'ϫ').
    replace('u03eb', 'ϫ').
    replace('u03ec', 'ϭ').
    replace('u03ed', 'ϭ').
    replace('u03ee', 'ϯ').
    replace('u03ef', 'ϯ').
    replace('u03f0', 'ϰ').
    replace('u03f1', 'ϱ').
    replace('u03f2', 'ϲ').
    replace('u03f3', 'ϳ').
    replace('u03f4', 'θ').
    replace('u03f5', 'ϵ').
    replace('u03f6', '϶').
    replace('u03f7', 'Ϸ').
    replace('u03f8', 'ϸ').
    replace('u03f9', 'Ϲ').
    replace('u03fa', 'Ϻ').
    replace('u03fb', 'ϻ').
    replace('u03fc', 'ϼ').
    replace('u03fd', 'Ͻ').
    replace('u03fe', 'Ͼ').
    replace('u03ff', 'Ͽ').
    replace('u0400', 'ѐ').
    replace('u0401', 'ё').
    replace('u0402', 'ђ').
    replace('u0403', 'ѓ').
    replace('u0404', 'є').
    replace('u0405', 'ѕ').
    replace('u0406', 'і').
    replace('u0407', 'ї').
    replace('u0408', 'ј').
    replace('u0409', 'љ').
    replace('u040a', 'њ').
    replace('u040b', 'ћ').
    replace('u040c', 'ќ').
    replace('u040d', 'ѝ').
    replace('u040e', 'ў').
    replace('u040f', 'џ').
    replace('u0410', 'а').
    replace('u0411', 'б').
    replace('u0412', 'в').
    replace('u0413', 'г').
    replace('u0414', 'д').
    replace('u0415', 'е').
    replace('u0416', 'ж').
    replace('u0417', 'з').
    replace('u0418', 'и').
    replace('u0419', 'й').
    replace('u041a', 'к').
    replace('u041b', 'л').
    replace('u041c', 'м').
    replace('u041d', 'н').
    replace('u041e', 'о').
    replace('u041f', 'п').
    replace('u0420', 'р').
    replace('u0421', 'с').
    replace('u0422', 'т').
    replace('u0423', 'у').
    replace('u0424', 'ф').
    replace('u0425', 'х').
    replace('u0426', 'ц').
    replace('u0427', 'ч').
    replace('u0428', 'ш').
    replace('u0429', 'щ').
    replace('u042a', 'ъ').
    replace('u042b', 'ы').
    replace('u042c', 'ь').
    replace('u042d', 'э').
    replace('u042e', 'ю').
    replace('u042f', 'я').
    replace('u0430', 'а').
    replace('u0431', 'б').
    replace('u0432', 'в').
    replace('u0433', 'г').
    replace('u0434', 'д').
    replace('u0435', 'е').
    replace('u0436', 'ж').
    replace('u0437', 'з').
    replace('u0438', 'и').
    replace('u0439', 'й').
    replace('u043a', 'к').
    replace('u043b', 'л').
    replace('u043c', 'м').
    replace('u043d', 'н').
    replace('u043e', 'о').
    replace('u043f', 'п').
    replace('u0440', 'р').
    replace('u0441', 'с').
    replace('u0442', 'т').
    replace('u0443', 'у').
    replace('u0444', 'ф').
    replace('u0445', 'х').
    replace('u0446', 'ц').
    replace('u0447', 'ч').
    replace('u0448', 'ш').
    replace('u0449', 'щ').
    replace('u044a', 'ъ').
    replace('u044b', 'ы').
    replace('u044c', 'ь').
    replace('u044d', 'э').
    replace('u044e', 'ю').
    replace('u044f', 'я').
    replace('u0450', 'ѐ').
    replace('u0451', 'ё').
    replace('u0452', 'ђ').
    replace('u0453', 'ѓ').
    replace('u0454', 'є').
    replace('u0455', 'ѕ').
    replace('u0456', 'і').
    replace('u0457', 'ї').
    replace('u0458', 'ј').
    replace('u0459', 'љ').
    replace('u045a', 'њ').
    replace('u045b', 'ћ').
    replace('u045c', 'ќ').
    replace('u045d', 'ѝ').
    replace('u045e', 'ў').
    replace('u045f', 'џ').
    replace('u0460', 'ѡ').
    replace('u0461', 'ѡ').
    replace('u0462', 'ѣ').
    replace('u0463', 'ѣ').
    replace('u0464', 'ѥ').
    replace('u0465', 'ѥ').
    replace('u0466', 'ѧ').
    replace('u0467', 'ѧ').
    replace('u0468', 'ѩ').
    replace('u0469', 'ѩ').
    replace('u046a', 'ѫ').
    replace('u046b', 'ѫ').
    replace('u046c', 'ѭ').
    replace('u046d', 'ѭ').
    replace('u046e', 'ѯ').
    replace('u046f', 'ѯ');
  }
  var sanitize5 = function (str) {
    return str. 
    replace('u0e00', '฀').
    replace('u0e01', 'ก').
    replace('u0e02', 'ข').
    replace('u0e03', 'ฃ').
    replace('u0e04', 'ค').
    replace('u0e05', 'ฅ').
    replace('u0e06', 'ฆ').
    replace('u0e07', 'ง').
    replace('u0e08', 'จ').
    replace('u0e09', 'ฉ').
    replace('u0e0a', 'ช').
    replace('u0e0b', 'ซ').
    replace('u0e0c', 'ฌ').
    replace('u0e0d', 'ญ').
    replace('u0e0e', 'ฎ').
    replace('u0e0f', 'ฏ').
    replace('u0e10', 'ฐ').
    replace('u0e11', 'ฑ').
    replace('u0e12', 'ฒ').
    replace('u0e13', 'ณ').
    replace('u0e14', 'ด').
    replace('u0e15', 'ต').
    replace('u0e16', 'ถ').
    replace('u0e17', 'ท').
    replace('u0e18', 'ธ').
    replace('u0e19', 'น').
    replace('u0e1a', 'บ').
    replace('u0e1b', 'ป').
    replace('u0e1c', 'ผ').
    replace('u0e1d', 'ฝ').
    replace('u0e1e', 'พ').
    replace('u0e1f', 'ฟ').
    replace('u0e20', 'ภ').
    replace('u0e21', 'ม').
    replace('u0e22', 'ย').
    replace('u0e23', 'ร').
    replace('u0e24', 'ฤ').
    replace('u0e25', 'ล').
    replace('u0e26', 'ฦ').
    replace('u0e27', 'ว').
    replace('u0e28', 'ศ').
    replace('u0e29', 'ษ').
    replace('u0e2a', 'ส').
    replace('u0e2b', 'ห').
    replace('u0e2c', 'ฬ').
    replace('u0e2d', 'อ').
    replace('u0e2e', 'ฮ').
    replace('u0e2f', 'ฯ').
    replace('u0e30', 'ะ').
    replace('u0e31', 'ั').
    replace('u0e32', 'า').
    replace('u0e33', 'ำ').
    replace('u0e34', 'ิ').
    replace('u0e35', 'ี').
    replace('u0e36', 'ึ').
    replace('u0e37', 'ื').
    replace('u0e38', 'ุ').
    replace('u0e39', 'ู').
    replace('u0e3a', 'ฺ').
    replace('u0e3f', '฿').
    replace('u0e40', 'เ').
    replace('u0e41', 'แ').
    replace('u0e42', 'โ').
    replace('u0e43', 'ใ').
    replace('u0e44', 'ไ').
    replace('u0e45', 'ๅ').
    replace('u0e46', 'ๆ').
    replace('u0e47', '็').
    replace('u0e48', '่').
    replace('u0e49', '้').
    replace('u0e4a', '๊').
    replace('u0e4b', '๋').
    replace('u0e4c', '์').
    replace('u0e4d', 'ํ').
    replace('u0e4e', '๎').
    replace('u0e4f', '๏').
    replace('u0e50', '๐').
    replace('u0e51', '๑').
    replace('u0e52', '๒').
    replace('u0e53', '๓').
    replace('u0e54', '๔').
    replace('u0e55', '๕').
    replace('u0e56', '๖').
    replace('u0e57', '๗').
    replace('u0e58', '๘').
    replace('u0e59', '๙').
    replace('u0e5a', '๚').
    replace('u0e5b', '๛');
  }
  var sanitize6 = function (str) {
    return str. 
    replace('u0370', 'Ͱ').
    replace('u0410', 'а').
    replace('u0430', 'а').
    replace('u0411', 'б').
    replace('u0431', 'б').
    replace('u0412', 'в').
    replace('u0432', 'в').
    replace('u0413', 'г').
    replace('u0433', 'г').
    replace('u0490', 'ґ').
    replace('u0491', 'ґ').
    replace('u0414', 'д').
    replace('u0434', 'д').
    replace('u0415', 'е').
    replace('u0454', 'е').
    replace('u0435', 'є').
    replace('u0404', 'є').
    replace('u0416', 'ж').
    replace('u0436', 'ж').
    replace('u0417', 'з').
    replace('u0437', 'з').
    replace('u0418', 'и').
    replace('u0438', 'и').
    replace('u0406', 'і').
    replace('u0456', 'і').
    replace('u0407', 'ї').
    replace('u0457', 'ї').
    replace('u0419', 'й').
    replace('u0439', 'й').
    replace('u041a', 'к').
    replace('u043a', 'к').
    replace('u041b', 'л').
    replace('u043b', 'л').
    replace('u041c', 'м').
    replace('u043c', 'м').
    replace('u041d', 'н').
    replace('u043d', 'н').
    replace('u041e', 'о').
    replace('u043e', 'о').
    replace('u041f', 'п').
    replace('u043f', 'п').
    replace('u0420', 'р').
    replace('u0440', 'р').
    replace('u0421', 'с').
    replace('u0441', 'с').
    replace('u0422', 'т').
    replace('u0442', 'т').
    replace('u0423', 'у').
    replace('u0443', 'у').
    replace('u0424', 'ф').
    replace('u0444', 'ф').
    replace('u0425', 'х').
    replace('u0445', 'х').
    replace('u0426', 'ц').
    replace('u0446', 'ц').
    replace('u0427', 'ч').
    replace('u0447', 'ч').
    replace('u0428', 'ш').
    replace('u0448', 'ш').
    replace('u0429', 'щ').
    replace('u0449', 'щ').
    replace('u042c', 'ь').
    replace('u044c', 'ь').
    replace('u042e', 'ю').
    replace('u044e', 'ю').
    replace('u042f', 'я').
    replace('u044f', 'я').
    replace('u4e00', '一').
    replace('u4e01', '丁').
    replace('u4e02', '丂').
    replace('u4e03', '七').
    replace('u4e04', '丄').
    replace('u4e05', '丅').
    replace('u4e06', '丆').
    replace('u4e07', '万').
    replace('u4e08', '丈').
    replace('u4e09', '三').
    replace('u4e0a', '上').
    replace('u4e0b', '下').
    replace('u4e0c', '丌').
    replace('u4e0d', '不').
    replace('u4e0e', '与').
    replace('u4e0f', '丏').
    replace('u4e10', '丐').
    replace('u4e11', '丑').
    replace('u4e12', '丒').
    replace('u4e13', '专').
    replace('u4e14', '且').
    replace('u4e15', '丕').
    replace('u4e16', '世').
    replace('u4e17', '丗').
    replace('u4e18', '丘').
    replace('u4e19', '丙').
    replace('u4e1a', '业').
    replace('u4e1b', '丛').
    replace('u4e1c', '东').
    replace('u4e1d', '丝').
    replace('u4e1e', '丞').
    replace('u4e1f', '丟').
    replace('u4e20', '丠').
    replace('u4e21', '両').
    replace('u4e22', '丢').
    replace('u4e23', '丣').
    replace('u4e24', '两').
    replace('u4e25', '严').
    replace('u4e26', '並').
    replace('u4e27', '丧').
    replace('u4e28', '丨').
    replace('u4e29', '丩').
    replace('u4e2a', '个').
    replace('u4e2b', '丫').
    replace('u4e2c', '丬').
    replace('u4e2d', '中').
    replace('u4e2e', '丮').
    replace('u4e2f', '丯').
    replace('u4e30', '丰').
    replace('u4e31', '丱').
    replace('u4e32', '串').
    replace('u4e33', '丳').
    replace('u4e34', '临').
    replace('u4e35', '丵').
    replace('u4e36', '丶').
    replace('u4e37', '丷').
    replace('u4e38', '丸').
    replace('u4e39', '丹').
    replace('u4e3a', '为').
    replace('u4e3b', '主').
    replace('u4e3c', '丼').
    replace('u4e3d', '丽').
    replace('u4e3e', '举').
    replace('u0370', 'Ͱ').
    replace('u4e0a', '上').
    replace('u6d77', '海').
    replace('u5317', '北').
    replace('u4eac', '京').
    replace('u5357', '南').
    replace('u4eac', '京').
    replace('u53a6', '厦').
    replace('u95e8', '门').
    replace('u5609', '嘉').
    replace('u5174', '兴').
    replace('u592a', '太').
    replace('u539f', '原').
    replace('u5ba3', '宣').
    replace('u6b66', '武').
    replace('u5e7f', '广').
    replace('u5dde', '州').
    replace('u6210', '成').
    replace('u90fd', '都').
    replace('u6625', '春').
    replace('u65e5', '日').
    replace('u90e8', '部').
    replace('u5e02', '市').
    replace('u6b66', '武').
    replace('u6c49', '汉').
    replace('u6c55', '汕').
    replace('u5934', '头').
    replace('u6c5f', '江').
    replace('u82cf', '苏').
    replace('u6c88', '沈').
    replace('u9633', '阳').
    replace('u6d1b', '洛').
    replace('u6749', '杉').
    replace('u77f6', '矶').
    replace('u6d1b', '洛').
    replace('u6749', '杉').
    replace('u77f6', '矶').
    replace('u6d59', '浙').
    replace('u6c5f', '江').
    replace('u6d59', '浙').
    replace('u6c5f', '江').
    replace('u7ecd', '绍').
    replace('u5174', '兴').
    replace('u6e29', '温').
    replace('u5dde', '州').
    replace('u8944', '襄').
    replace('u9633', '阳').
    replace('u897f', '西').
    replace('u5b89', '安').
    replace('u8fbd', '辽').
    replace('u5b81', '宁').
    replace('u6c88', '沈').
    replace('u9633', '阳').
    replace('u90d1', '郑').
    replace('u5dde', '州').
    replace('u91cd', '重').
    replace('u5e86', '庆').
    replace('u4e3f', '丿');
  }

  var locs = {}
  db.users.find({"addresses.0": {$exists: true}},{addresses: 1}).forEach(function(e) {
    if (e.addresses && e.addresses.length) {
      for(var a=0;a<e.addresses.length;a++){
        e.addresses[a].country = e.addresses[a].country.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
        if (e.addresses[a].locality) {
          e.addresses[a].locality = sanitize(sanitize2(sanitize3(sanitize4(sanitize5(sanitize6(e.addresses[a].locality.toLowerCase()))))));
          e.addresses[a].locality = e.addresses[a].locality.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
        }
        if (e.addresses[a].country === "") {
          printjson(e.addresses[a].locality);
          if (e.addresses[a].locality === "jakrata") {
            e.addresses[a].country = "Indonesia";
          }
          if (e.addresses[a].locality === "nicosia") {
            e.addresses[a].country = "Italy";
          }
        }
        if (!locs[e.addresses[a].country]) locs[e.addresses[a].country] = [];
        if (e.addresses[a].locality && locs[e.addresses[a].country].indexOf(e.addresses[a].locality)===-1) locs[e.addresses[a].country].push(e.addresses[a].locality);
      }
    }
    db.users.update({_id: e._id}, {$set: {addresses: e.addresses}}, { upsert: true });
  });
  var countries = Object.keys(locs).sort();
  printjson(locs);
  printjson(countries);


  // 03 cityfix #2
  var fix = [
    {country: 'Austria', find: '8753 - Fohnsdorf', replace: 'Fohnsdorf'},
    {country: 'Austria', find: '9500 Villach', replace: 'Villach'},
    {country: 'Italy', find: 'Alghero-bologna', replace: 'Alghero'},
    {country: 'Latvia', find: ' Paesi Bassi  - Amsterdam', replace: 'Amsterdam'},
    {country: 'Latvia', find: ' Russia - Mosca', replace: 'Moskva'},
    {country: 'France', find: '05350', replace: 'Molines-en-Queyras'},
    {country: 'Italy', find: '00041', replace: 'Rome'},
    {country: 'Italy', find: '00196', replace: 'Rome'},
    {country: 'Italy', find: '0ristano', replace: 'Oristano'},
    {country: 'Italy', find: '13032', replace: 'Asigliano Vercellese'},
    {country: 'Italy', find: '30174', replace: 'Venice'},
    {country: 'Germany', find: '30451 Hannover', replace: 'Hannover'},
    {country: 'Italy', find: '41026', replace: 'Pavullo nel Frignano'},
    {country: 'Italy', find: '50121', replace: 'Florence'},
    {country: 'Austria', find: '95013', replace: 'Fiumefreddo di Sicilia'},
    {country: 'Italy', find: '50121', replace: 'Florence'},
    {country: 'United States', find: '09134', replace: 'Eden'},
    {country: 'Vietnam', find: 'Hcm', replace: 'Ho Chi Minh'},
    {country: 'Vietnam', find: 'Ho Chi Minh City', replace: 'Ho Chi Minh'},
    {country:'United Kingdom', find:'London', replace:'London'},
    {country:'United Kingdom', find:'london', replace:'London'},
    {country:'Italy', find:'Rome', replace:'Roma'},
    {country:'Italy', find:'Italy', replace:'Roma'},
    {country:'Italy', find:'Milan', replace:'Milano'},
    {country:'Italy', find:'Milani', replace:'Milano'},
    {country:'United States', find:'Nyc', replace:'New York'},
    {country:'United States', find:'New Orleans, La', replace:'New Orleans'},
    {country:'United States', find:'New-york', replace:'New York'},
    {country:'United States', find:'New york', replace:'New York'},
    {country:'United States', find:'new york', replace:'New York'},
    {country:'United States', find:'newyork', replace:'New York'},
    {country:'United States', find:'Newyork', replace:'New York'},
    {country:'United States', find:'New York, Ny 10003', replace:'New York'},
    {country:'United States', find:'New York, NY 10025', replace:'New York'},
    {country:'United States', find:'New York,', replace:'New York'},
    {country:'United States', find:'NEW YORK', replace:'New York'},
    {country:'United States', find:'Newyok', replace:'New York'},
    {country:'Denmark', find:'Newyork', replace:'New York'},
    {country:'Afghanistan', find:'Newyork', replace:'New York'},
    {country:'Virgin Islands (U.S.)', find:'Newyork', replace:'New York'},
    {country:'Virgin Islands (U.S.)', find:'Newyork', replace:'New York'},
    {country:'Bangladesh', find:'Newyork', replace:'New York'},
    {country:'China', find:'Newyourk', replace:'New York'},
    {country:'United States', find:'New York City', replace:'New York'},
    {country:'United States', find:'New York, Ny', replace:'New York'},
    {country:'United States', find:'New York,', replace:'New York'},
    {country:'United States', find:'New York, Ny 10025', replace:'New York'},
    {country:'United States', find:'New York, Ny 10003', replace:'New York'},
    {country:'Russia', find:'moscow', replace:'Moscow'},
    {country:'Russia', find:'Moscow', replace:'Moscow'},
    {country:'Russia', find:'Moscow Region', replace:'Moscow'},
    {country:'Russia', find:'Moscow ', replace:'Moscow'},
    {country:'Mexico', find:'mexico', replace:'Mexico City'},
    {country:'Mexico', find:'Mexico City', replace:'Mexico City'},
    {country:'Mexico', find:'distrito federal', replace:'Mexico City'},
    {country:'Mexico', find:'DF', replace:'Mexico City'},
    {country:'Mexico', find:'Ciudad de Mu00e9xico', replace:'Mexico City'},
    {country:'Mexico', find:'México City ', replace:'Mexico City'},
    {country:'Mexico', find:'Mexico', replace:'Mexico City'},
    {country:'Mexico', find:'Mexico D.f.', replace:'Mexico City'},
    {country:'Mexico', find:'Mexico, Df', replace:'Mexico City'},
    {country:'Mexico', find:'Cdmx', replace:'Mexico City'},
    {country:'Mexico', find:'C.d.m,x', replace:'Mexico City'},
    {country:'Mexico', find:'Df', replace:'Mexico City'},
    {country:'Mexico', find:'Emxico', replace:'Mexico City'},
    {country:'Mexico', find:'México', replace:'Mexico City'},
    {country:'Mexico', find:'México D.f ', replace:'Mexico City'},
    {country:'Mexico', find:'México D.f', replace:'Mexico City'},
    {country:'Mexico', find:'Mexico Df', replace:'Mexico City'},
    {country:'Mexico', find:'Mex', replace:'Mexico City'},
    {country:'Mexico', find:'Mx', replace:'Mexico City'},
    {country:'Mexico', find:'Ciudad De México', replace:'Mexico City'},
    {country:'Mexico', find:'Cd. De México', replace:'Mexico City'},
    {country:'Mexico', find:'Distrito Federal', replace:'Mexico City'},
    {country:'Mexico', find:'D.f', replace:'Mexico City'},
    {country:'Mexico', find:'D.f.', replace:'Mexico City'},
    {country:'Mexico', find:'México City', replace:'Mexico City'},
    {country:'Mexico', find:'México Df', replace:'Mexico City'},
    {country:'Mexico', find:'Ciudad De Mex', replace:'Mexico City'},
    {country:'Mexico', find:'Ciudad De Mxico', replace:'Mexico City'},
    {country:'Mexico', find:'Mexico Distrito Federal', replace:'Mexico City'},
    {country:'Mexico', find:'Mexico   City', replace:'Mexico City'},
    {country:'Mexico', find:'Mecico City', replace:'Mexico City'},
    {country:'Mexico', find:'Mexicodf', replace:'Mexico City'},
    {country:'Mexico', find:'México D.f.', replace:'Mexico City'},
    {country:'Mexico', find:'México, Df', replace:'Mexico City'},
    {country:'Mexico', find:'México.', replace:'Mexico City'},
    {country:'Mexico', find:'Xalapa,ver', replace:'Xalapa'},
    {country:'Mexico', find:'Xalapa,ver.', replace:'Xalapa'},
    {country:'Mexico', find:'Xalapa, Ver.', replace:'Xalapa'},
    {country:'Mexico', find:'Xalapa, Ver', replace:'Xalapa'},
    {country:'Brazil', find:'San Paolo', replace:'Sao Paolo'},
    {country:'Hong Kong', find:'hk', replace:'Hong Kong'},
    {country:'Hong Kong', find:'Hk', replace:'Hong Kong'},
    {country:'Hong Kong', find:'hK', replace:'Hong Kong'},
    {country:'Hong Kong', find:'HK', replace:'Hong Kong'},
    {country:'Hong Kong', find:'hongkong', replace:'Hong Kong'},
    {country:'Hong Kong', find:'Hongkong', replace:'Hong Kong'},
    {country:'Hong Kong', find:'HongKong', replace:'Hong Kong'},
    {country:'Poland', find:'#322;upsk', replace:'Słupsk'},
    {country:'Taiwan', find:'#39640;&amp;#38596;&amp;#24066;', replace:'高雄市'},
    {country:'Italy', find:' di Castello', replace:'Città di Castello'},
    {country:'Italy', find:' Di Castello', replace:'Città di Castello'},
    {country:'Italy', find:'#146; di csatello', replace:'Città di Castello'},
    {country:'Italy', find:'#146; Di Csatello', replace:'Città di Castello'},
    {country:'Italy', find:' Di Csatello', replace:'Città di Castello'},
    {country:'Italy', find:' di piave', replace:'San Donà di Piave'},
    {country:'Italy', find:' Di Piave', replace:'San Donà di Piave'},
    {country:'Italy', find:'#146;adda', replace:"Trezzo sull'Adda"},
    {country:'Iceland', find:'#146;alessio siculo', replace:"Sant'Alessio Siculo"},
    {country:'Italy', find:"#146;aquila", replace:"L'Aquila"},
    {country:'Italy', find:'#146;Aquila', replace:"L'Aquila"},
    {country:'Italy', find:'#146;Elpidio', replace:"Porto Sant'Elpidio"},
    {country:'Italy', find:'#146;elpidio', replace:"Porto Sant'Elpidio"},
    {country:'Italy', find:'#8217;ilario d’enza (RE)', replace:"Sant'Ilario d'Enza"},
    {country:'Italy', find:'#8217;ilario D&#8217;enza (Re)', replace:"Sant'Ilario d'Enza"},
    {country:'United States', find:'(Sf) Bay Area', replace:"San Francisco"},
    {country:'Poland', find:'#322;awiec', replace:"Bolesławiec"},
    {country:'Italy', find:'-Napoli', replace:"Napoli"},
    {country: 'Latvia', find: 'Russia - Mosca', replace: 'Moskva'},
    {country: 'Italy', find: '#146;arco', replace: 'Arco'},
    {country: 'Italy', find: '#146;artico', replace: 'Padulle'},
    {country: 'Italy', find: '#146;ete', replace: 'More Corraxe'},
    {country: 'Germany', find: 'A', replace: 'San Jose'},
    {country: 'Mexico', find: 'A', replace: 'Mexico City'},
    {country: 'France', find: 'Aa', replace: 'Paris'},
    {country: 'Finland', find: 'Aberdee', replace: 'Helsinki'},
    {country: 'United States', find: 'Ad', replace: 'Detroit'},
    {country: 'United Kingdom', find: 'Adasd', replace: 'Bradley Stoke'},
    {country: 'Germany', find: 'Adasdas', replace: 'Berlin'},
    {country: 'United States', find: 'Alta Loma', replace: 'Rancho Cucamonga'},
    {country: 'Israel', find: 'Amsterdam', replace: 'Petah Tikva'},
    {country: 'Ireland', find: 'Amsterdam', replace: 'Fort Johnson'},
    {country: 'Germany', find: 'Ast', replace: 'Waldmünchen'},
    {country: 'India', find: 'Az', replace: 'Tempe'},
    {country: 'Guatemala', find: 'Barcelona', replace: 'Guatemala'},
    {country: 'Germany', find: 'Barcelona', replace: 'Köln'},
    {country: 'India', find: 'Bdn', replace: 'Nagpur'},
    {country: 'Germany', find: 'Bdng', replace: 'Köln'},
    {country: 'Russia', find: 'Be', replace: 'Are'},
    {country: 'Ireland', find: 'Berlin', replace: 'Tramore'},
    {country: 'Israel', find: 'Berlin', replace: 'Netanya'},
    {country: 'United States', find: 'Chugiak', replace: 'Anchorage'},
    {country: 'Guatemala', find: 'China', replace: 'Guatemala'},
    {country: 'United States', find: 'Chatsworth', replace: 'Los Angeles'},
    {country: 'France', find: 'Bzh', replace: 'Marolles'},
    {country: 'Denmark', find: 'Brønshøj', replace: 'Copenhagen'},
    {country: 'France', find: 'Borde', replace: 'Saugues'},
    {country: 'Germany', find: 'Beucha', replace: 'Brandis'},
    {country: 'France', find: 'Beyond', replace: 'Stratton'},
    {country: 'Germany', find: 'Bi', replace: 'Ingelheim am Rhein'},
    {country: 'Germany', find: 'Blubb', replace: 'Berlin'},
    {country: 'Greece', find: 'Braxami', replace: 'Agios Dimitrios'},
    {country: 'Bosnia and Herzegovina', find: 'Brest', replace: 'Zaugline'},
    {country: 'France', find: 'Bsm', replace: 'Rennes'},
    {country: 'Germany', find: 'C-r', replace: 'Duisburg'},
    {country: 'United States', find: 'Canyon Country', replace: 'Santa Clarita'},
    {country: 'United States', find: 'Chitown', replace: 'Chicago'},
    {country: 'Tuvalu', find: 'City', replace: 'Tuval'},
    {country: 'Tonga', find: 'City', replace: 'Tonga'},
    {country: 'United Arab Emirates', find: 'City', replace: 'Los Angeles'},
    {country: 'United States', find: 'Cityplace', replace: 'West Palm Beach'},
    {country: 'Germany', find: 'Ck', replace: 'Osnabrück'},
    {country: 'Germany', find: 'Dewed', replace: 'Bremen'},
    {country: 'United States', find: 'Dfg', replace: 'Washington'},
    {country: 'United Arab Emirates', find: 'Diera City', replace: 'Dubai'},
    {country: 'Germany', find: 'Diestqdt', replace: 'Weil der Stadt'},
    {country: 'Spain', find: 'Dinamarca', replace: 'Oviedo'},
    {country: 'Spain', find: 'Dj', replace: 'Estepona'},
    {country: 'Germany', find: 'Dle', replace: 'Delmenhorst'},
    {country: 'Germany', find: 'Daran', replace: 'Berlin'},
    {country: 'United States', find: 'Davenport, Ia', replace: 'Davenport'},
    {country: 'Thailand', find: 'Dc', replace: 'Washington'},
    {country: 'United Kingdom', find: 'Cuba', replace: 'Havana'},
    {country: 'United States', find: 'Chugiak', replace: 'Anchorage'},
    {country: 'Guatemala', find: 'China', replace: 'Guatemala'},
    {country: 'United States', find: 'Chatsworth', replace: 'Los Angeles'},
    {country: 'France', find: 'Bzh', replace: 'Marolles'},
    {country: 'Denmark', find: 'Brønshøj', replace: 'Copenhagen'},
    {country: 'France', find: 'Borde', replace: 'Saugues'},
    {country: 'Germany', find: 'Beucha', replace: 'Brandis'},
    {country: 'France', find: 'Beyond', replace: 'Stratton'},
    {country: 'Germany', find: 'Bi', replace: 'Ingelheim am Rhein'},
    {country: 'Germany', find: 'Blubb', replace: 'Berlin'},
    {country: 'Greece', find: 'Braxami', replace: 'Agios Dimitrios'},
    {country: 'Bosnia and Herzegovina', find: 'Brest', replace: 'Zaugline'},
    {country: 'France', find: 'Bsm', replace: 'Rennes'},
    {country: 'Germany', find: 'C-r', replace: 'Duisburg'},
    {country: 'United States', find: 'Canyon Country', replace: 'Santa Clarita'},
    {country: 'United States', find: 'Chitown', replace: 'Chicago'},
    {country: 'Tuvalu', find: 'City', replace: 'Tuval'},
    {country: 'Tonga', find: 'City', replace: 'Tonga'},
    {country: 'United Arab Emirates', find: 'City', replace: 'Los Angeles'},
    {country: 'United States', find: 'Cityplace', replace: 'West Palm Beach'},
    {country: 'Germany', find: 'Ck', replace: 'Osnabrück'},
    {country: 'United States', find: 'Dc', replace: 'Washington'},
    {country: 'France', find: 'Fd', replace: 'Tiffin'},
    {country: 'France', find: 'Fdf', replace: 'Le Lamentin'},
    {country: 'United States', find: 'Fg', replace: 'Stowe Township'},
    {country: 'Germany', find: 'Ficken', replace: 'Berlin'},
    {country: 'United States', find: 'Fc', replace: 'Chicago'},
    {country: 'India', find: 'Esfhan', replace: 'Kalyan'},
    {country: 'Germany', find: 'Esa', replace: 'Eisenach'},
    {country: 'United States', find: 'Enterprise', replace: 'Independence'},
    {country: 'France', find: 'Enderson', replace: 'Pendleton'},
    {country: 'France', find: 'Ee', replace: 'Bobigny'},
    {country: 'Spain', find: 'Eaf', replace: 'Madrid'},
    {country: 'France', find: 'Drag', replace: 'Colmar'},
    {country: 'Spain', find: 'Donosti', replace: 'San Sebastián'},
    {country: 'Spain', find: 'Donostia', replace: 'San Sebastián'},
    {country: 'United States', find: 'Dorchester, Ma', replace: 'Boston'},
    {country: 'Germany', find: 'G.', replace: 'Gera'},
    {country: 'Georgia', find: 'Gdl', replace: 'Fayetteville'},
    {country: 'Germany', find: 'God', replace: 'Elliottsburg'},
    {country: 'Germany', find: 'Graupa', replace: 'Pirna'},
    {country: 'United States', find: 'Grayscale', replace: 'Murphysboro'},
    {country: 'Germany', find: 'Greenberg', replace: 'Berlin'},
    {country: 'Germany', find: 'Gtown', replace: 'Washington'},
    {country: 'Georgia', find: 'Halle', replace: 'Atlanta'},
    {country: 'United States', find: 'Harvard', replace: 'Cambridge'},
    {country: 'France', find: 'Hellemmes', replace: 'Lille'},
    {country: 'British Virgin Islands', find: 'Here', replace: 'Road Town'},
    {country: 'United States', find: 'Here', replace: 'Atlanta'},
    {country: 'United States', find: 'Hollydale', replace: 'South Gate'},
    {country: 'Germany', find: 'Hometown', replace: 'Göttingen'},
    {country: 'Germany', find: 'Hro', replace: 'Rostock'},
    {country: 'Germany', find: 'Htown', replace: 'Bonn'},
    {country: 'France', find: 'Hugh', replace: 'New Market'},
    {country: 'Uganda', find: 'Iceland', replace: 'Kampala'},
    {country: 'United States', find: 'Jazz', replace: 'Kansas City'},
    {country: 'France', find: 'Juju', replace: 'Toulouse'},
    {country: 'Germany', find: 'Kingstone', replace: 'Köln'},
    {country: 'Iceland', find: 'La', replace: 'Los Angeles'},
    {country: 'Germany', find: 'Leipzig-sax', replace: 'Schkeuditz'},
    {country: 'Bangladesh', find: 'Leverga', replace: 'Dhaka'},
    {country: 'Tanzania', find: 'Lifr', replace: 'Dar es Salaam'},
    {country: 'France', find: 'London', replace: 'Savigny-sur-Seille'},
    {country: 'Sweden', find: 'London', replace: 'Gothenburg'},
    {country: 'Australia', find: 'London', replace: 'Sundown'},
    {country: 'Argentina', find: 'London', replace: 'Guadalupe'},
    {country: 'Andorra', find: 'London', replace: 'Andorra la Vella'},
    {country: 'Austria', find: 'Lten', replace: 'Wien'},
    {country: 'Germany', find: 'Lu', replace: 'Lech'},
    {country: 'Spain', find: 'Mali', replace: 'Xàbia'},
    {country: 'France', find: 'Marbella', replace: 'Paris'},
    {country: 'Norway', find: 'Mexico City', replace: 'Ciudad de México'},
    {country: 'Greece', find: 'Milan', replace: 'Ferno'},
    {country: 'Australia', find: 'Milan', replace: 'Pier Milan'},
    {country: 'Switzerland', find: 'Min', replace: 'Yens'},
    {country: 'Germany', find: 'Mmmmm', replace: 'Planegg'},
    {country: 'Germany', find: 'Mod', replace: 'Erfurt'},
    {country: 'Switzerland', find: 'Monte', replace: 'Castel San Pietro'},
    {country: 'Afghanistan', find: 'Moscow', replace: 'Moskva'},
    {country: 'Australia', find: 'Moscow', replace: 'Moskva'},
    {country: 'Germany', find: 'Mu', replace: 'Munich'},
    {country: 'Spain', find: 'Mu', replace: 'Columbia'},
    {country: 'Germany', find: 'Musterstadt', replace: 'Berlin'},
    {country: 'Germany', find: 'Mutzschen', replace: 'Grimma'},
    {country: 'India', find: 'Napoli', replace: 'San Diego'},
    {country: 'Armenia', find: 'New York', replace: 'Yerevan'},
    {country: 'China', find: 'New York', replace: 'Oak Ridge'},
    {country: 'Argentina', find: 'New York', replace: 'Haedo'},
    {country: 'Poland', find: 'New York', replace: 'Poland'},
    {country: 'Albania', find: 'New York', replace: 'Tiranë'},
    {country: 'Angola', find: 'New York', replace: 'Angola'},
    {country: 'Suriname', find: 'New York', replace: 'Paramaribo'},
    {country: 'American Samoa', find: 'New York, Ny 10003', replace: 'New York'},
    {country: 'Belize', find: 'Newyork', replace: 'New York'},
    {country: 'United Kingdom', find: 'Newyork', replace: 'New York'},
    {country: 'Australia', find: 'Newyork', replace: 'New York'},
    {country: 'Albania', find: 'Newyork', replace: 'New York'},
    {country: 'Antigua and Barbuda', find: 'Newyork', replace: 'New York'},
    {country: 'American Samoa', find: 'Newyork', replace: 'New York'},
    {country: 'Algeria', find: 'Newyork', replace: 'Chekfa'},
    {country: 'Angola', find: 'Newyork', replace: 'Angola'},
    {country: 'Andorra', find: 'Newyork', replace: 'New York'},
    {country: 'Argentina', find: 'Newyork', replace: 'Haedo'},
    {country: 'Ukraine', find: 'Nikolaev', replace: 'Mykolaiv'},
    {country: 'United Kingdom', find: 'Nirmingham', replace: 'Birmingham'},
    {country: 'Hungary', find: 'Nk', replace: 'Debrecen'},
    {country: 'France', find: 'Nn', replace: 'Isigny-le-Buat'},
    {country: 'Germany', find: 'No Need', replace: 'Berlin'},
    {country: 'Germany', find: 'None', replace: 'Oakland'},
    {country: 'Hungary', find: 'None', replace: 'Budapest'},
    {country: 'Germany', find: 'Nt', replace: 'Osnabrück'},
    {country: 'Grenada', find: 'Of Angles', replace: 'Los Angeles'},
    {country: 'France', find: 'Ontheroadagain', replace: 'Nozay'},
    {country: 'France', find: 'Paname', replace: 'Paris'},
    {country: 'Turkey', find: 'Paris', replace: 'Orlando'},
    {country: 'French Guiana', find: 'Paris', replace: 'Kourou'},
    {country: 'Ukraine', find: 'Paris', replace: 'Veselyi Kut'},
    {country: 'Georgia', find: 'Passau', replace: 'Ering'},
    {country: 'Germany', find: 'Peans', replace: 'Aachen'},
    {country: 'Glendale, Arizona', find: 'Phoenix', replace: 'Glendale'},
    {country: 'France', find: 'Plo', replace: 'Arthès'},
    {country: 'Bosnia and Herzegovina', find: 'Rajvosa', replace: 'Sarajevo'},
    {country: 'Germany', find: 'Rde', replace: 'Pulheim'},
    {country: 'Spain', find: 'Renteria', replace: 'Errenteria'},
    {country: 'Switzerland', find: 'Rich', replace: 'Ansted'},
    {country: 'Uganda', find: 'Roma', replace: 'Kampala'},
    {country: 'Italy', find: 'Roma Barcelona', replace: 'Barcellona Pozzo di Gotto'},
    {country: 'Honduras', find: 'Rome', replace: 'Roma'},
    {country: 'Germany', find: 'Rome', replace: 'Berlin'},
    {country: 'Afghanistan', find: 'Rome', replace: 'Roma'},
    {country: 'Iceland', find: 'Roms', replace: 'Roma'},
    {country: 'Germany', find: 'Ruhrgebiet', replace: 'Mülheim'},
    {country: 'France', find: 'Saint A Pitre', replace: 'Miremont'},
    {country: 'Germany', find: 'Samanyolu', replace: 'Berlin'},
    {country: 'France', find: '5350', replace: 'Molines-en-Queyras'},
    {country: 'United States', find: '9134', replace: 'Eden'},
    {country: 'United States', find: '111 North Delancy Place', replace: 'Atlantic City'},
    {country: 'Gabon Republic', find: '123', replace: 'Libreville'},
    {country: 'United States', find: '19103', replace: 'Philadelphia'},
    {country: 'Germany', find: '39590', replace: 'Storkau'},
    {country: 'Germany', find: '48485 Neuenkirchen', replace: 'Neuenkirchen'},
    {country: 'Germany', find: '55131', replace: 'Mainz'},
    {country: 'Germany', find: '60487 Frankfurt', replace: 'Frankfurt'},
    {country: 'Germany', find: '65618', replace: 'Selters'},
    {country: 'Germany', find: '71665', replace: 'Vaihingen an der Enz'},
    {country: 'Switzerland', find: '8004 Zürich', replace: 'Zürich'},
    {country: 'Portugal', find: 'A Da Palmeira', replace: 'Palmeira'},
    {country: 'Chile', find: 'A Del Mar', replace: 'Viña del Mar'},
    {country: 'United Arab Emirates', find: 'Abu Dhabi - Al-ain', replace: 'Al Ain'},
    {country: 'United Arab Emirates', find: 'Abudabi', replace: 'Abu Dhabi'},
    {country: 'United Arab Emirates', find: 'Abudhabi', replace: 'Abu Dhabi'},
    {country: 'Israel', find: 'Acco', replace: 'Acre'},
    {country: 'Greece', find: 'Agia Paraskeyi', replace: 'Agia Paraskevi'},
    {country: 'Hungary', find: 'Agykovacsi', replace: 'Nagykovácsi'},
    {country: 'France', find: 'Aix En Provence', replace: 'Aix-en-Provence'},
    {country: 'Germany', find: 'Ajrensburg', replace: 'Ahrensburg'},
    {country: 'Israel', find: 'Akko', replace: 'Acre'},
    {country: 'United Arab Emirates', find: 'Al-ain', replace: 'Al Ain'},
    {country: 'France', find: 'Ales', replace: 'Alès'},
    {country: 'Hungary', find: 'Algyo', replace: 'Algyő'},
    {country: 'France', find: 'Andresy', replace: 'Andrésy'},
    {country: 'France', find: 'Angers / Sens', replace: 'Angers'},
    {country: 'France', find: 'Angouleme', replace: 'Angoulême'},
    {country: 'Italy', find: 'Areggio', replace: 'Viareggio'},
    {country: 'France', find: 'Argeles Sur Mer', replace: 'Argelès-sur-Mer'},
    {country: 'France', find: 'Asnieres', replace: 'Asnières-sur-Seine'},
    {country: 'France', find: 'Asnières', replace: 'Asnières-sur-Seine'},
    {country: 'United States', find: 'Atl', replace: 'Atlanta'},
    {country: 'Germany', find: 'Auerbach/vogtl.', replace: 'Auerbach'},
    {country: 'France', find: 'Auvers Sur Oise', replace: 'Auvers-sur-Oise'},
    {country: 'France', find: 'Aux', replace: 'Aix-en-Provence'},
    {country: 'France', find: 'Auxi Le Chateau', replace: 'Auxi-le-Château'},
    {country: 'Ukraine', find: 'Bachmach', replace: 'Bakhmach'},
    {country: 'United States', find: 'Bakersfeild', replace: 'Bakersfield'},
    {country: 'United States', find: 'Baldwinville', replace: 'Templeton'},
    {country: 'India', find: 'Bangalore', replace: 'Bengaluru'},
    {country: 'India', find: 'Banglore', replace: 'Bengaluru'},
    {country: 'United Kingdom', find: 'Barrow In Furness', replace: 'Barrow-in-Furness'},
    {country: 'United States', find: 'Basking Ridge', replace: 'Bernards'},
    {country: 'Switzerland', find: 'Basle', replace: 'Basel'},
    {country: 'Indonesia', find: 'Bdg', replace: 'Bandung'},
    {country: 'France', find: 'Bdx', replace: 'Blanquefort'},
    {country: 'Germany', find: 'Beck', replace: 'Beckum'},
    {country: 'Israel', find: 'Beer Seva', replace: "Be'er Sheva"},
    {country: 'Israel', find: 'Beer Sheva', replace: "Be'er Sheva"},
    {country: 'France', find: 'Beire Le Chatel', replace: 'Beire-le-Châtel'},
    {country: 'United States', find: 'Bellefontaine Oh', replace: 'Bellefontaine'},
    {country: 'Italy', find: 'Bergamo Roma', replace: 'Bergamo'},
    {country: 'Germany', find: 'Berlin', replace: 'Berlin'},
    {country: 'Germany', find: 'Berlun', replace: 'Berlin'},
    {country: 'Germany', find: 'Bernau', replace: 'Bernau bei Berlin'},
    {country: 'Switzerland', find: 'Berne', replace: 'Bern'},
    {country: 'United States', find: 'Beverlyhills', replace: 'Beverly Hills'},
    {country: 'Bosnia and Herzegovina', find: 'Bihac', replace: 'Bihać'},
    {country: 'United Kingdom', find: 'Birm', replace: 'Birmingham'},
    {country: 'Germany', find: 'Bitterfeld', replace: 'Bitterfeld-Wolfen'},
    {country: 'Thailand', find: 'Bkk', replace: 'Bangkok'},
    {country: 'Thailand', find: 'Bkk.', replace: 'Bangkok'},
    {country: 'United States', find: 'Bloomingtown', replace: 'Bloomington'},
    {country: 'Turkey', find: 'Bodrum Mugla', replace: 'Bodrum'},
    {country: 'Switzerland', find: 'Bogno', replace: 'Lugano'},
    {country: 'Poland', find: 'Bolesławiec', replace: 'Boleslawiec'},
    {country: 'Italy', find: 'Bolo', replace: 'Bologna'},
    {country: 'Sweden', find: 'Boras', replace: 'Borås'},
    {country: 'France', find: 'Boulogne-billancourt', replace: 'Boulogne-Billancourt'},
    {country: 'United Kingdom', find: 'Bourenmouth', replace: 'Bournemouth'},
    {country: 'France', find: 'Bourg-en-bresse', replace: 'Bourg-en-Bresse'},
    {country: 'France', find: 'Bourgoin Jallieu', replace: 'Bourgoin-Jallieu'},
    {country: 'Switzerland', find: 'Bouveret', replace: 'Port-Valais'},
    {country: 'Hungaria', find: 'Bp', replace: 'Budapest'},
    {country: 'Hungary', find: 'Bp', replace: 'Budapest'},
    {country: 'Germany', find: 'Braunschweig', replace: 'Brunswick'},
    {country: 'France', find: 'Breau Et Salagosse', replace: 'Bréau-et-Salagosse'},
    {country: 'France', find: 'Breze', replace: 'Brézé'},
    {country: 'Germany', find: 'Bruddelstadt', replace: 'Rudolstadt'},
    {country: 'Germany', find: 'Bruehl', replace: 'Brühl'},
    {country: 'France', find: 'Brussel', replace: 'Brussels'},
    {country: 'Hungary', find: 'Buapest', replace: 'Budapest'},
    {country: 'Hungary', find: 'Bud', replace: 'Budapest'},
    {country: 'Hungary', find: 'Budapesr', replace: 'Budapest'},
    {country: 'Hungary', find: 'Budapesz', replace: 'Budapest'},
    {country: 'Hungary', find: 'Budapset', replace: 'Budapest'},
    {country: 'Hungary', find: 'Budepast', replace: 'Budapest'},
    {country: 'France', find: 'Buis', replace: 'Cour-et-Buis'},
    {country: 'France', find: 'Buis Les Baronnies', replace: 'Buis-les-Baronnies'},
    {country: 'Israel', find: 'Caesaria', replace: 'Caesarea'},
    {country: 'France', find: 'Cagnes Sur Mer', replace: 'Cagnes-sur-Mer'},
    {country: 'Spain', find: 'Carracedo Del Monasterio', replace: 'Carracedo del Monasterio'},
    {country: 'Spain', find: 'Castellon De La Plana', replace: 'Castellón de la Plana'},
    {country: 'Spain', find: 'Castro', replace: 'O Castro'},
    {country: 'France', find: 'Cavalaire', replace: 'Cavalaire-sur-Mer'},
    {country: 'France', find: "Cazouls D'herault", replace: "Cazouls-d'Hérault"},
    {country: 'France', find: 'Cenon Sur Vienne', replace: 'Cenon-sur-Vienne'},
    {country: 'France', find: 'Chalon/saône', replace: 'Chalon-sur-Saône'},
    {country: 'France', find: 'Chambery', replace: 'Chambéry'},
    {country: 'France', find: 'Champs Sur Marne', replace: 'Champs-sur-Marne'},
    {country: 'France', find: 'Charleville', replace: 'Charleville-Mézières'},
    {country: 'United States', find: 'Charlottesville, Va', replace: 'Charlottesville'},
    {country: 'France', find: 'Chateaubriant', replace: 'Châteaubriant'},
    {country: 'France', find: 'Chateauroux', replace: 'Châteauroux'},
    {country: 'France', find: 'Chatellerault', replace: 'Châtellerault'},
    {country: 'France', find: 'Chatyou', replace: 'Chatou'},
    {country: 'United States', find: 'Cherokee,nc', replace: 'Cherokee'},
    {country: 'France', find: 'Chetbourg', replace: 'Cherbourg'},
    {country: 'Thailand', find: 'Chiangmai', replace: 'Chiang Mai'},
    {country: 'Thailand', find: 'Chiangrai', replace: 'Mueang Chiang Rai'},
    {country: 'United States', find: 'Chicago, Il', replace: 'Chicago'},
    {country: 'United States', find: 'Chichago', replace: 'Chicago'},
    {country: 'France', find: 'Choisy', replace: 'Choisy-le-Roi'},
    {country: 'France', find: 'Ch�teauroux', replace: 'Châteauroux'},
    {country: 'United States', find: 'City', replace: 'Kansas City'},
    {country: 'France', find: 'Clermont', replace: 'Clermont-Ferrand'},
    {country: 'France', find: 'Clermont Ferrand', replace: 'Clermont-Ferrand'},
    {country: 'France', find: 'Clermont-ferrand', replace: 'Clermont-Ferrand'},
    {country: 'France', find: 'Clesse', replace: 'Clessé'},
    {country: 'United States', find: 'Colton California', replace: 'Colton'},
    {country: 'United States', find: 'Coluumbia', replace: 'Columbia'},
    {country: 'Denmark', find: 'Copenhagen ø', replace: 'Copenhagen'},
    {country: 'Ireland', find: 'Cor', replace: 'Cork'},
    {country: 'Spain', find: 'Cordoba', replace: 'Córdoba'},
    {country: 'Spain', find: 'Coruña', replace: 'A Coruña'},
    {country: 'France', find: 'Coudequerke', replace: 'Coudekerque-Village'},
    {country: 'France', find: 'Cregy Les Meaux', replace: 'Crégy-lès-Meaux'},
    {country: 'France', find: 'Creteil', replace: 'Créteil'},
    {country: 'Spain', find: 'Cuelllar', replace: 'Cuéllar'},
    {country: 'United States', find: 'Dekalb', replace: 'DeKalb'},
    {country: 'United States', find: 'Delran, Nj', replace: 'Delran'},
    {country: 'Ireland', find: 'Derry', replace: 'Londonderry'},
    {country: 'United States', find: 'Des Moines, Iowa', replace: 'Des Moines'},
    {country: 'United States', find: 'Des Plaines Il.', replace: 'Des Plaines'},
    {country: 'United States', find: 'Desoto', replace: 'DeSoto'},
    {country: 'United States', find: 'Dever', replace: 'Denver'},
    {country: 'Ukraine', find: 'Dnipropetrovsk', replace: 'Dnipro'},
    {country: 'United Kingdom', find: 'Domfries', replace: 'Dumfries'},
    {country: 'Germany', find: 'Dormtund', replace: 'Dortmund'},
    {country: 'France', find: 'Doucy', replace: 'DOUCY COMBELOUVIERE'},
    {country: 'United States', find: 'Downey, California', replace: 'Downey'},
    {country: 'Poland', find: 'Dublin', replace: 'Dubliny'},
    {country: 'Germany', find: 'Duesseldorf', replace: 'Düsseldorf'},
    {country: 'Hungary', find: 'Dunaujvaros', replace: 'Dunaújváros'},
    {country: 'United Kingdom', find: 'Dundeee', replace: 'Dundee'},
    {country: 'France', find: 'Dunkerque', replace: 'Dunkirk'},
    {country: 'United States', find: 'Durahm', replace: 'Durham'},
    {country: 'France', find: 'Durban', replace: 'Durban-Corbières'},
    {country: 'Germany', find: 'Düs', replace: 'Düsseldorf'},
    {country: 'United States', find: 'Eagle Pass Texas', replace: 'Eagle Pass'},
    {country: 'United States', find: 'Eaglecreek', replace: 'Eagle Creek'},
    {country: 'France', find: 'Eauze', replace: 'Éauze'},
    {country: 'France', find: 'Echirolles', replace: 'Échirolles'},
    {country: 'United Kingdom', find: 'Edinbburgh', replace: 'Edinburgh'},
    {country: 'United Kingdom', find: 'Edinburah', replace: 'Edinburgh'},
    {country: 'France', find: 'Elancourt', replace: 'Élancourt'},
    {country: 'Turkey', find: 'Elazig', replace: 'Elâzığ'},
    {country: 'United States', find: 'Ellicott', replace: 'Ellicott City'},
    {country: 'United States', find: 'Ellijay, Ga', replace: 'Ellijay'},
    {country: 'United States', find: 'Elmonte', replace: 'El Monte'},
    {country: 'United States', find: 'Endicott, Ny', replace: 'Endicott'},
    {country: 'Ukraine', find: 'Energodar', replace: 'Enerhodar'},
    {country: 'Spain', find: 'Entregu', replace: 'El Entrego'},
    {country: 'France', find: 'Epernay', replace: 'Épernay'},
    {country: 'France', find: 'Epinay Sur Orge', replace: 'Épinay-sur-Orge'},
    {country: 'Turkey', find: 'Eskisehir', replace: 'Eskişehir'},
    {country: 'France', find: 'Esquize-sere', replace: 'Esquièze-Sère'},
    {country: 'France', find: 'Etables Sur Mer', replace: 'Étables-sur-Mer'},
    {country: 'France', find: 'Etang Salé', replace: 'Etang-Salé les Hauts'},
    {country: 'France', find: 'Etang Salé Les Hauts', replace: 'Etang-Salé les Hauts'},
    {country: 'France', find: 'Etrelles', replace: 'Étrelles'},
    {country: 'France', find: 'Evreux', replace: 'Évreux'},
    {country: 'France', find: 'Eysine', replace: 'Eysines'},
    {country: 'United States', find: 'Fayetteville, Ar', replace: 'Fayetteville'},
    {country: 'United States', find: 'Fort Payne, Al', replace: 'Fort Payne'},
    {country: 'France', find: 'Fort-de-france', replace: 'Fort-de-France Bay'},
    {country: 'Germany', find: 'Frankfurt Am  Main', replace: 'Frankfurt'},
    {country: 'Germany', find: 'Frankfurt Am Main', replace: 'Frankfurt'},
    {country: 'Germany', find: 'Frankfurt/oder', replace: 'Frankfurt an der Oder'},
    {country: 'France', find: 'Frejus', replace: 'Fréjus'},
    {country: 'United States', find: 'Ft Lauderdale', replace: 'Fort Lauderdale'},
    {country: 'United States', find: 'Ft Meade', replace: 'Fort Meade'},
    {country: 'United States', find: 'Ft Wayne', replace: 'Fort Wayne'},
    {country: 'Germany', find: 'Fuerth', replace: 'Fürth'},
    {country: 'United States', find: 'Fullerton, Ca', replace: 'Fullerton'},
    {country: 'United States', find: 'Gardner, Ks', replace: 'Gardner'},
    {country: 'Sweden', find: 'Gbg', replace: 'Gothenburg'},
    {country: 'Switzerland', find: 'Geneve', replace: 'Geneva'},
    {country: 'Spain', find: 'Gernika', replace: 'Guernica'},
    {country: 'Spain', find: 'Gerona', replace: 'Girona'},
    {country: 'Spain', find: 'Gijon', replace: 'Gijón'},
    {country: 'France', find: 'Gimel', replace: 'Gimel-les-Cascades'},
    {country: 'Switzerland', find: 'Ginevra', replace: 'Geneva'},
    {country: 'United States', find: 'Glen Ellyn, Illinois', replace: 'Glen Ellyn'},
    {country: 'United States', find: 'Glenn-dale', replace: 'Glenn Dale'},
    {country: 'Germany', find: 'Goettingen', replace: 'Göttingen'},
    {country: 'United States', find: 'Golab', replace: 'Flower Mound'},
    {country: 'Sweden', find: 'Goteborg', replace: 'Gothenburg'},
    {country: 'Sweden', find: 'Gotheburg', replace: 'Gothenburg'},
    {country: 'Sweden', find: 'Gothenbourg', replace: 'Gothenburg'},
    {country: 'Spain', find: 'Grana', replace: 'Granada'},
    {country: 'United States', find: 'Greater Nashville', replace: 'Nashville'},
    {country: 'United States', find: 'Greenvile', replace: 'Greenville'},
    {country: 'France', find: 'Guerande', replace: 'Guérande'},
    {country: 'Hungary', find: 'Gyor', replace: 'Győr'},
    {country: 'Hungary', find: 'Gyõr', replace: 'Győr'},
    {country: 'Sweden', find: 'Göteborg', replace: 'Gothenburg'},
    {country: 'Guam', find: 'Hagatna', replace: 'Hagåtña'},
    {country: 'United States', find: 'Haiku', replace: 'Haiku-Pauwela'},
    {country: 'Germany', find: 'Hal', replace: 'Halle (Saale)'},
    {country: 'Germany', find: 'Halle', replace: 'Halle (Saale)'},
    {country: 'Germany', find: 'Hann Muenden', replace: 'Hann. Münden'},
    {country: 'Thailand', find: 'Hatyai', replace: 'Hat Yai'},
    {country: 'United States', find: 'Haywrad', replace: 'Hayward'},
    {country: 'Turkey', find: 'Helsinki/istanbul', replace: 'Istanbul'},
    {country: 'France', find: 'Herouville Saint Clair', replace: 'Hérouville-Saint-Clair'},
    {country: 'Germany', find: 'Hh', replace: 'Hollern-Twielenfleth'},
    {country: 'United States', find: 'Housten', replace: 'Houston'},
    {country: 'United States', find: 'Hunstville City', replace: 'Huntsville'},
    {country: 'United States', find: 'Huntsville City', replace: 'Huntsville'},
    {country: 'India', find: 'Hydbd', replace: 'Hyderabad'},
    {country: 'India', find: 'Hyderbad', replace: 'Hyderabad'},
    {country: 'United States', find: 'Indianapolis, In', replace: 'Indianapolis'},
    {country: 'Spain', find: 'Iruña', replace: 'Pamplona'},
    {country: 'France', find: 'Issy', replace: 'Issy-les-Moulineaux'},
    {country: 'France', find: 'Issy Les Moulineaux', replace: 'Issy-les-Moulineaux'},
    {country: 'Ukraine', find: 'Ivano-frankivsk', replace: 'Ivano-Frankivsk'},
    {country: 'Spain', find: 'Jaen', replace: 'Jaén'},
    {country: 'Spain', find: 'Jerez De La Frontera', replace: 'Jerez'},
    {country: 'Indonesia', find: 'Jogja', replace: 'Yogyakarta'},
    {country: 'Indonesia', find: 'Jogjakarta', replace: 'Yogyakarta'},
    {country: 'France', find: 'Joinville Le Pont', replace: 'Joinville-le-Pont'},
    {country: 'India', find: 'Kchi', replace: 'Kochi'},
    {country: 'Ukraine', find: 'Kharkov', replace: 'Kharkiv'},
    {country: 'Thailand', find: 'Khonkaen', replace: 'Khon Kaen'},
    {country: 'Ukraine', find: 'Kiew', replace: 'Kyiv'},
    {country: 'United Kingdom', find: 'Kingston', replace: 'Kingston upon Thames'},
    {country: 'Hungaria', find: 'Kiskoros', replace: 'Kiskőrös'},
    {country: 'Ukraine', find: 'Kiyv', replace: 'Kyiv'},
    {country: 'Switzerland', find: 'Klignau', replace: 'Klingnau'},
    {country: 'Ukraine', find: 'Kyev', replace: 'Kyiv'},
    {country: 'Denmark', find: 'København ø', replace: 'Copenhagen'},
    {country: 'Spain', find: 'La Coruña', replace: 'A Coruña'},
    {country: 'France', find: 'La Ferté Sous Jouarre', replace: 'La Ferté-sous-Jouarre'},
    {country: 'France', find: 'La Fleche', replace: 'La Flèche'},
    {country: 'Spain', find: 'La Laguna', replace: 'San Cristóbal de La Laguna'},
    {country: 'France', find: 'La Roche Bernard', replace: 'La Roche-Bernard'},
    {country: 'France', find: 'La Roche Sur Yon', replace: 'La Roche-sur-Yon'},
    {country: 'France', find: 'La Teste', replace: 'La Teste-de-Buch'},
    {country: 'Honduras', find: 'Laceiba', replace: 'La Ceiba'},
    {country: 'Spain', find: 'Lanjaron', replace: 'Lanjarón'},
    {country: 'Spain', find: 'Las Palmas', replace: 'Las Palmas de Gran Canaria'},
    {country: 'Spain', find: 'Las Palmas De Gc', replace: 'Las Palmas de Gran Canaria'},
    {country: 'Spain', find: 'Las Palmas De Gran Canaria', replace: 'Las Palmas de Gran Canaria'},
    {country: 'France', find: 'Le Faux', replace: 'Lefaux'},
    {country: 'France', find: 'Le Perreux Sur Marne', replace: 'Le Perreux-sur-Marne'},
    {country: 'France', find: 'Le Puy-en-velay', replace: 'Le Puy'},
    {country: 'United Kingdom', find: 'Leamington Spa', replace: 'Royal Leamington Spa'},
    {country: 'Germany', find: 'Leipzsch', replace: 'Leipzig'},
    {country: 'Spain', find: 'Leon', replace: 'León'},
    {country: 'France', find: "Les Sables D'olonne", replace: "Les Sables-d'Olonne"},
    {country: 'Germany', find: 'Lheim', replace: 'Talheim'},
    {country: 'Germany', find: 'Lof', replace: 'Löf'},
    {country: 'United Kingdom', find: 'Londo N', replace: 'London'},
    {country: 'United Kingdom', find: 'London, Greater London', replace: 'London'},
    {country: 'United Kingdom', find: 'Londra', replace: 'London'},
    {country: 'Germany', find: 'Ludwigshafen Am Rhein', replace: 'Ludwigshafen'},
    {country: 'Ukraine', find: 'Lugansk', replace: 'Luhansk'},
    {country: 'Switzerland', find: 'Luzern', replace: 'Lucerne'},
    {country: 'Ukraine', find: 'Lvov', replace: 'Lviv'},
    {country: 'United Kingdom', find: 'Lyme', replace: 'Lyme Regis'},
    {country: 'France', find: 'Lys Lez Lannoy', replace: 'Lys-lez-Lannoy'},
    {country: 'Germany', find: 'Lörrac', replace: 'Lörrach'},
    {country: 'Spain', find: 'Mad', replace: 'Madrid'},
    {country: 'Turkey', find: 'Madin', replace: 'Mardin'},
    {country: 'Sweden', find: 'Malmo', replace: 'Malmö'},
    {country: 'United Kingdom', find: 'Man', replace: 'Manchester'},
    {country: 'United Kingdom', find: 'Manchaster', replace: 'Manchester'},
    {country: 'Ireland', find: 'Manchester', replace: 'Manchester Township'},
    {country: 'Finland', find: 'Manse', replace: 'Tampere'},
    {country: 'Macau', find: 'Mexico', replace: 'Aguascalientes'},
    {country: 'France', find: 'Marcq En Baroeul', replace: 'Marcq-en-Barœul'},
    {country: 'Spain', find: 'Marin', replace: 'Marín'},
    {country: 'Ukraine', find: 'Mariupol', replace: 'Mariupol'},
    {country: 'Tunisia', find: 'Marsa', replace: 'La Marsa'},
    {country: 'France', find: 'Marsiglia', replace: 'Marseille'},
    {country: 'Switzerland', find: 'Martigny-croix', replace: 'Martigny-Combe'},
    {country: 'Mexico', find: 'Matalvaro', replace: 'Álvaro'},
    {country: 'Germany', find: 'Md', replace: 'Magdeburg'},
    {country: 'Indonesia', find: 'Medan-indonesia', replace: 'Medan'},
    {country: 'Germany', find: 'Meerbuwch', replace: 'Meerbusch'},
    {country: 'Spain', find: 'Miranda De Ebro', replace: 'Miranda de Ebro'},
    {country: 'Germany', find: 'Moenchengladbach', replace: 'Mönchengladbach'},
    {country: 'France', find: 'Mont De Marsan', replace: 'Mont-de-Marsan'},
    {country: 'France', find: 'Montfort En Chalosse', replace: 'Montfort-en-Chalosse'},
    {country: 'France', find: 'Montreal', replace: 'Montréal'},
    {country: 'Spain', find: 'Moro Jable', replace: 'Morro Jable'},
    {country: 'Germany', find: 'Muelheim An Der Ruhr', replace: 'Mülheim'},
    {country: 'Germany', find: 'Muenchen', replace: 'Munich'},
    {country: 'Germany', find: 'München', replace: 'Munich'},
    {country: 'Russia', find: 'Nadum', replace: 'Nadym'},
    {country: 'Greece', find: 'Naoussa', replace: 'Naousa'},
    {country: 'Germany', find: 'Nbg', replace: 'Burglengenfeld'},
    {country: 'Germany', find: 'Near Düsseldorf', replace: 'Düsseldorf'},
    {country: 'Switzerland', find: 'Neuchatel', replace: 'Neuchâtel'},
    {country: 'France', find: 'Neuilly', replace: 'Neuilly-sur-Seine'},
    {country: 'France', find: 'Neuville-les-this', replace: 'Neuville-lès-This'},
    {country: 'United Kingdom', find: 'Newcastle', replace: 'Newcastle upon Tyne'},
    {country: 'United Kingdom', find: 'Newcastle Upon Tyne', replace: 'Newcastle upon Tyne'},
    {country: 'United Kingdom', find: 'Newcstle Upon Tyne', replace: 'Newcastle upon Tyne'},
    {country: 'Germany', find: 'Newhof', replace: 'Neuhof'},
    {country: 'Hong Kong', find: 'Newtown Square', replace: 'Kennett Square'},
    {country: 'France', find: 'Noisy Le Grand', replace: 'Noisy-le-Grand'},
    {country: 'Sweden', find: 'Nollberga', replace: 'Gillberga'},
    {country: 'United States', find: 'North Fond Du Lac', replace: 'North Fond du Lac'},
    {country: 'United Kingdom', find: 'Nottinghm', replace: 'Nottingham'},
    {country: 'United Kingdom', find: 'Nottinham', replace: 'Nottingham'},
    {country: 'Germany', find: 'Nu-ulm', replace: 'Neu-Ulm'},
    {country: 'Germany', find: 'Nueremberg', replace: 'Nuremberg'},
    {country: 'Germany', find: 'Nuernberg', replace: 'Nuremberg'},
    {country: 'Germany', find: 'Nuertingen', replace: 'Nürtingen'},
    {country: 'France', find: 'Nîmes', replace: 'Nimes'},
    {country: 'Germany', find: 'Nürnberg', replace: 'Nuremberg'},
    {country: 'Germany', find: 'N�rnberg', replace: 'Altdorf bei Nürnberg'},
    {country: 'Brazil', find: 'O Paulo', replace: 'São Paulo'},
    {country: 'Germany', find: 'Oltenburg', replace: 'Oldenburg'},
    {country: 'Spain', find: 'Orense', replace: 'Ourense'},
    {country: 'France', find: 'Orleans', replace: 'Orléans'},
    {country: 'Japan', find: 'Os', replace: 'Ōsaka-shi'},
    {country: 'France', find: 'Oui', replace: 'Paris'},
    {country: 'France', find: 'Pagny Sur Moselle', replace: 'Pagny-sur-Moselle'},
    {country: 'Thailand', find: 'Pakretnonthaburi', replace: 'Pak Kret'},
    {country: 'Spain', find: 'Palma De Malloca', replace: 'Palma'},
    {country: 'Spain', find: 'Palma De Mallorca', replace: 'Palma'},
    {country: 'Indonesia', find: 'Pangkalpinang', replace: 'Pangkal Pinang'},
    {country: 'Haiti', find: 'Pap', replace: 'Port-au-Prince'},
    {country: 'Suriname', find: 'Parbo', replace: 'Paramaribo'},
    {country: 'France', find: 'Pari', replace: 'Paris'},
    {country: 'France', find: 'Parigi/nizza', replace: 'Puteaux'},
    {country: 'France', find: 'Paris (France)', replace: 'Paris'},
    {country: 'France', find: 'Paris/berlin', replace: 'Paris'},
    {country: 'France', find: 'Paris/orleans', replace: 'Orléans'},
    {country: 'Thailand', find: 'Patong Beach, Kathu', replace: 'Patong'},
    {country: 'Hungary', find: 'Pecs', replace: 'Pécs'},
    {country: 'Hungaria', find: 'Pecs', replace: 'Pécs'},
    {country: 'Spain', find: 'Pelao', replace: 'Pollo Pelao'},
    {country: 'France', find: 'Pelussin', replace: 'Pélussin'},
    {country: 'France', find: 'Perigueux', replace: 'Périgueux'},
    {country: 'France', find: 'Perpi', replace: 'Perpignan'},
    {country: 'France', find: 'Plelan Le Grand', replace: 'Plélan-le-Grand'},
    {country: 'France', find: 'Ploeuc Sur Lié', replace: 'Plœuc-sur-Lié'},
    {country: 'France', find: 'Plouzane', replace: 'Plouzané'},
    {country: 'India', find: 'Pondicherry', replace: 'Puducherry'},
    {country: 'France', find: 'Pont Ste Maxence', replace: 'Pont-Sainte-Maxence'},
    {country: 'Haiti', find: 'Port Au Prince', replace: 'Port-au-Prince'},
    {country: 'Trinidad and Tobago', find: 'Port Of Spain', replace: 'Port of Spain'},
    {country: 'Falkland Islands (Islas Malvinas)', find: 'Port Stanley', replace: 'Stanley'},
    {country: 'Italy', find: "Porto Sant'elpidio", replace: "Porto Sant'Elpidio"},
    {country: 'Trinidad and Tobago', find: 'Pos', replace: 'Port of Spain'},
    {country: 'Ukraine', find: 'Poznan', replace: 'Poznan'},
    {country: 'Ukraine', find: 'Pripyat', replace: "Pryp'yat"},
    {country: 'India', find: 'Puna', replace: 'Pune'},
    {country: 'France', find: 'Ravines Des Cabris', replace: 'Ravine des Cabris'},
    {country: 'Iceland', find: 'Reykjavik', replace: 'Reykjavík'},
    {country: 'Germany', find: 'Ruesselsheim', replace: 'Rüsselsheim'},
    {country: 'Iceland', find: 'Rvk', replace: 'Reykjavík'},
    {country: 'Spain', find: 'S/c De Tenerife', replace: 'Santa Cruz de Tenerife'},
    {country: 'Germany', find: 'Saarbruecken', replace: 'Saarbrücken'},
    {country: 'France', find: 'Saigon', replace: 'Saignon'},
    {country: 'France', find: 'Saint Etienne', replace: 'Saint-Étienne'},
    {country: 'France', find: 'Saint Fargeau Ponthierry', replace: 'Saint-Fargeau-Ponthierry'},
    {country: 'France', find: 'Saint Laurent Du Var', replace: 'St-Laurent-du-Var'},
    {country: 'France', find: 'Saint Leu La Foret', replace: 'Saint-Leu-la-Forêt'},
    {country: 'France', find: 'Saint Marcel Sur Aude', replace: 'Saint-Marcel-sur-Aude'},
    {country: 'France', find: 'Saint Nicolas Les Citeaux', replace: 'Saint-Nicolas-lès-Cîteaux'},
    {country: 'France', find: 'Saint-amé', replace: 'Saint-Amé'},
    {country: 'France', find: 'Saint-denis', replace: 'Saint-Denis'},
    {country: 'France', find: 'Saint-denis De La Reunion', replace: 'Saint-Denis'},
    {country: 'France', find: 'Saint-etienne', replace: 'Saint-Étienne'},
    {country: 'France', find: 'Saint-lô', replace: 'Saint-Lô'},
    {country: 'France', find: 'Saint-maur', replace: 'Saint-Maur-des-Fossés'},
    {country: 'France', find: 'Saint-ouen', replace: 'Saint-Ouen'},
    {country: 'France', find: 'Saint-quentin', replace: 'Saint-Quentin'},
    {country: 'France', find: 'Saint-valery', replace: 'Saint-Valery-sur-Somme'},
    {country: 'Spain', find: 'Salaamanac', replace: 'Salamanca'},
    {country: 'France', find: 'Salon De Provence', replace: 'Salon-de-Provence'},
    {country: 'Greece', find: 'Salonico', replace: 'Thessaloniki'},
    {country: 'Greece', find: 'Salonika', replace: 'Thessaloniki'},
    {country: 'United Kingdom', find: 'Saltburn', replace: 'Saltburn-by-the-Sea'},
    {country: 'Spain', find: 'San Sebastian', replace: 'San Sebastián'},
    {country: 'Spain', find: 'San Sebatian', replace: 'San Sebastián'},
    {country: 'Italy', find: "Sant'ilario D'enza", replace: "Sant'Ilario d'Enza"},
    {country: 'Spain', find: 'Santa Cruz De Tenerife', replace: 'Santa Cruz de Tenerife'},
    {country: 'Spain', find: 'Santiago', replace: 'Santiago de Compostela'},
    {country: 'Spain', find: 'Santiago De Compostela', replace: 'Santiago de Compostela'},
    {country: 'Brazil', find: 'Santo âNgelo', replace: 'Santo Ângelo'},
    {country: 'Spain', find: 'Santurce', replace: 'Santurtzi'},
    {country: 'Spain', find: 'Saragozza', replace: 'Zaragoza'},
    {country: 'France', find: 'Sarlat', replace: 'Sarlat-la-Canéda'},
    {country: 'Germany', find: 'Schwaebisch Hall', replace: 'Schwäbisch Hall'},
    {country: 'Germany', find: 'Schwenningen', replace: 'Villingen-Schwenningen'},
    {country: 'Hungary', find: 'Sd', replace: 'Budapest'},
    {country: 'Bosnia and Herzegovina', find: 'Sekovici', replace: 'Šekovići'},
    {country: 'Hungary', find: 'Siklos', replace: 'Siklós'},
    {country: 'United Arab Emirates', find: 'Silicon Oasis Dubai', replace: 'Dubai'},
    {country: 'Ukraine', find: 'Simferpool', replace: 'Simferopol'},
    {country: 'RU', find: 'Sob', replace: 'Sobra'},
    {country: 'Spain', find: 'South Chiclana', replace: 'Chiclana de la Frontera'},
    {country: 'France', find: 'Space', replace: 'Nice'},
    {country: 'Croatia', find: 'Spalato', replace: 'Split'},
    {country: 'Germany', find: 'Sseldorf', replace: 'Düsseldorf'},
    {country: 'France', find: 'St André', replace: 'Saint-André'},
    {country: 'France', find: 'St Brieuc', replace: 'Saint-Brieuc'},
    {country: 'France', find: 'St Denis', replace: 'Saint-Denis'},
    {country: 'France', find: 'St Denis, La Reunion', replace: 'Saint-Denis'},
    {country: 'United Kingdom', find: 'St Ives', replace: 'Saint Ives'},
    {country: 'Spain', find: 'St. Sebastian', replace: 'San Sebastián'},
    {country: 'France', find: 'St_rambert', replace: 'Saint-Rambert-en-Bugey'},
    {country: 'Turkey', find: 'Stbnul', replace: 'Istanbul'},
    {country: 'Germany', find: 'Steinbach-hallenberg', replace: 'Steinbach-Hallenberg'},
    {country: 'Sweden', find: 'Sterås', replace: 'Västerås'},
    {country: 'Sweden', find: 'Sthlm', replace: 'Stockholm'},
    {country: 'Indonesia', find: 'Surabya', replace: 'Surabaya'},
    {country: 'Thailand', find: 'Suratthani', replace: 'Surat Thani'},
    {country: 'Hungary', find: 'Szekszard', replace: 'Szekszárd'},
    {country: 'Hungary', find: 'Szexhard', replace: 'Szekszárd'},
    {country: 'Hungary', find: 'Szigetszentmikós', replace: 'Szigetszentmiklós'},
    {country: 'Poland', find: 'Słupsk', replace: 'Slupsk'},
    {country: 'IL', find: 'Tel Aviv', replace: 'Tel Aviv-Yafo'},
    {country: 'France', find: 'Tolosa', replace: 'Toulouse'},
    {country: 'France', find: 'Toulours', replace: 'Toulouse'},
    {country: 'Vietnam', find: 'Tphcm', replace: 'Ho Chi Minh City'},
    {country: 'France', find: 'Trelissac', replace: 'Trélissac'},
    {country: 'India', find: 'Trivandrum', replace: 'Thiruvananthapuram'},
    {country: 'Spain', find: 'Trobajo Del Camino', replace: 'Trobajo del Camino'},
    {country: 'Ukraine', find: 'Tschernobyl', replace: 'Chornobyl'},
    {country: 'France', find: 'Tt', replace: 'Tourves'},
    {country: 'India', find: 'Tuticorin', replace: 'Thoothukudi'},
    {country: 'India', find: 'Tutukurin', replace: 'Thoothukudi'},
    {country: 'Mexico', find: 'Tzcuaro', replace: 'Pátzcuaro'},
    {country: 'Hungary', find: 'Tàpiószele', replace: 'Tápiószele'},
    {country: 'Germany', find: 'Ulma', replace: 'Ulm'},
    {country: 'Turkey', find: 'Urfa', replace: 'Şanlıurfa'},
    {country: 'Spain', find: 'Valderrobres(teruel)', replace: 'Valderrobres'},
    {country: 'Spain', find: 'Valencia-palermo', replace: 'Valencia'},
    {country: 'Sweden', find: 'Vargarda', replace: 'Vårgårda'},
    {country: 'France', find: "Vern D'anjou", replace: "Vern-d'Anjou"},
    {country: 'Greece', find: 'Veroia', replace: 'Veria'},
    {country: 'Spain', find: 'Vilafranca De Bonany', replace: 'Vilafranca de Bonany'},
    {country: 'Spain', find: 'Vilafranca Del Penedès', replace: 'Vilafranca del Penedès'},
    {country: 'Spain', find: 'Vilanova I La Geltru', replace: 'Vilanova i la Geltrú'},
    {country: 'Spain', find: 'Vilanova I La Geltrú', replace: 'Vilanova i la Geltrú'},
    {country: 'Germany', find: 'Villingen', replace: 'Villingen-Schwenningen'},
    {country: 'Germany', find: 'Weil', replace: 'Weil am Rhein'},
    {country: 'Germany', find: 'Weissenfels', replace: 'Weißenfels'},
    {country: 'India', find: 'Vizag', replace: 'Visakhapatnam'},
    {country: 'Indonesia', find: 'Yogya', replace: 'Yogyakarta'},
    {country: 'Switzerland', find: 'Yverdon', replace: 'Yverdon-les-Bains'},
    {country: 'Switzerland', find: 'Zuerich', replace: 'Zürich'},
    {country: 'Switzerland', find: 'Zuricgo', replace: 'Zürich'},
    {country: 'Switzerland', find: 'Zurich', replace: 'Zürich'},
    {country: 'Norway', find: 'åLesund', replace: 'Alesund'},
    {country: 'Turkey', find: 'çOrum', replace: 'Çorum'},
    {country: 'Greece', find: 'αθήνα', replace: 'Athens'},
    {country: 'Greece', find: 'αθηνα', replace: 'Athens'},
    {country: 'Greece', find: 'δοξάτο', replace: 'Doxato'},
    {country: 'Turkmenistan', find: 'ашхабад', replace: 'Ashgabat'},
    {country: 'Russia', find: 'благовєщенск', replace: 'Blagoveshchensk'},
    {country: 'Russia', find: 'екатєринбург', replace: 'Yekaterinburg'},
    {country: 'Ukraine', find: 'житомир', replace: 'Zhytomyr'},
    {country: 'Russia', find: 'йошкар-ола', replace: 'Yoshkar-Ola'},
    {country: 'Ukraine', find: 'києв', replace: 'Kyiv'},
    {country: 'Russia', find: 'новосибирск', replace: 'Novosibirsk'},
    {country: 'Russia', find: 'норильск', replace: 'Norilsk'},
    {country: 'Russia', find: 'санкт-пєтербург', replace: 'Saint Petersburg'},
    {country: 'Russia', find: 'саранск', replace: 'Saransk'},
    {country: 'Russia', find: 'туапсє', replace: 'Tuapse'},
    {country: 'Ukraine', find: 'харьков', replace: 'Kharkiv'},
    {country: 'China', find: '南京', replace: 'Nanjing'},
    {country: 'China', find: '厦门', replace: 'Xiamen'},
    {country: 'China', find: '嘉兴', replace: 'Jiaxing'},
    {country: 'China', find: '太原', replace: 'Taiyuan'},
    {country: 'China', find: '成都', replace: 'Chengdu'},
    {country: 'Japan', find: '春日部市', replace: 'Kasukabe'},
    {country: 'China', find: '武汉', replace: 'Wuhan'},
    {country: 'China', find: '汕头', replace: 'Shantou'},
    {country: 'China', find: '沈阳', replace: 'Shenyang'},
    {country: 'China', find: '浙江绍兴', replace: 'Shaoxing'},
    {country: 'China', find: '温州', replace: 'Wenzhou'},
    {country: 'China', find: '襄阳', replace: 'Xiangyang'},
    {country: 'China', find: '西安', replace: "Xi'an"},
    {country: 'China', find: '辽宁沈阳', replace: 'Shenyang'}
  ];

  for(var b=0;b<fix.length;b++){
    db.users.find({"addresses.country": fix[b].country, "addresses.locality": fix[b].find},{addresses: 1}).forEach(function(e) {
      if (e.addresses && e.addresses.length) {
        for(var a=0;a<e.addresses.length;a++){
          if (e.addresses[a].country == fix[b].country && e.addresses[a].locality == fix[b].find) e.addresses[a].locality = fix[b].replace;
        }
      }
      db.users.update({_id: e._id}, {$set: {addresses: e.addresses}}, { upsert: true });
    });
  }

  //04 Add geometry
  db.addressdbs.find({"country": {$exists: true}, "locality": {$exists: true}}).forEach(function(e) {
    db.users.find({"addresses.country": e.country, "addresses.locality": e.locality, "addresses.geometry": {$exists: false}},{addresses: 1}).forEach(function(user) {
      if (user.addresses && user.addresses.length) {
        for(var a=0;a<user.addresses.length;a++){
          if (user.addresses[a].country == e.country && user.addresses[a].locality == e.locality) {
            user.addresses[a].geometry = e.geometry;
            printjson(user.addresses);
          }
          db.users.update({_id: user._id}, {$set: {addresses: user.addresses}}, { upsert: true });
        }
      }
    });
  });

  //05 Add geometry
  db.addressdbs.find({"country": {$exists: true}, "locality": {$exists: false}}).forEach(function(e) {
    db.users.find({"addresses.country": e.country, "addresses.locality": "", "addresses.geometry": {$exists: false}},{addresses: 1}).forEach(function(user) {
      if (user.addresses && user.addresses.length) {
        for(var a=0;a<user.addresses.length;a++){
          if (user.addresses[a].country == e.country) {
            user.addresses[a].geometry = e.geometry;
            delete user.addresses[a].locality;
            printjson(user.addresses);
          }
          db.users.update({_id: user._id}, {$set: {addresses: user.addresses}}, { upsert: true });
        }
      }
    });
  });

  //06 Add geometry
  db.addressdbs.find({"locality": {$exists: true}}).forEach(function(e) {
    db.users.find({"addresses.locality": e.locality, "addresses.geometry": {$exists: false}},{_id: 1, addresses: 1}).forEach(function(user) {
      printjson("addresses.locality: " + e.locality);
      if (user.addresses && user.addresses.length) {
        for(var a=0;a<user.addresses.length;a++){
          if (user.addresses[a].locality == e.locality) {
            user.addresses[a].country = e.country;
            user.addresses[a].geometry = e.geometry;
            printjson(user.addresses);
          }
          db.users.update({_id: user._id}, {$set: {addresses: user.addresses}}, { upsert: true });
        }
      }
    });
  });


  // check
  var locs = {};
  var locs2 = {};
  db.users.find({"addresses.0": {$exists: true}, "addresses.geometry": {$exists: false}},{addresses: 1}).forEach(function(e) {
    if (e.addresses && e.addresses.length) {
      for(var a=0;a<e.addresses.length;a++){
        if (!locs[e.addresses[a].country]) locs[e.addresses[a].country] = [];
        if (locs[e.addresses[a].country].indexOf(e.addresses[a].locality)===-1) locs[e.addresses[a].country].push(e.addresses[a].locality);
      }
    }
  });
  var countries = Object.keys(locs).sort();
  for(var item in countries){
    locs2[countries[item]] = locs[countries[item]].sort();
  }
  printjson(locs2);
}
