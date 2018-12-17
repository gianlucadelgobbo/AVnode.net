var USERS = function() {
  //performances_rel_events
  //db.performances.count({"bookings": {$exists: true}})
  //db.events.find({"program": {$exists: true}}).toArray().map(function(item){ item.map(function(item2){ return item2.performance; })});

  var partnerships =  db.events.find({"partners.users": ObjectId("5be87f15fc3961000000a669")}).toArray().map(function(item){ return item._id; });
  if (partnerships.length) e.partnerships = partnerships;
  if (!partnerships.length) delete e.partnerships;
  printjson("e.partnerships");
  printjson(e.partnerships);


  //db.users.find({slug:"diablos"}).forEach(function(e) {
    
  var query = {
    "scriptupdate": {$lt: 5},
    $or: [
      {"performances.0": {$exists: true}}, 
      {"events.0": {$exists: true}}, 
      {"news.0": {$exists: true}}, 
      {"videos.0": {$exists: true}}, 
      {"galleries.0": {$exists: true}}, 
      {"partnerships.0": {$exists: true}}, 
      {"footage.0": {$exists: true}}, 
      {"playlists.0": {$exists: true}}
    ]
  };
  //query = {_id:ObjectId("5be881a7fc3961000000b69b")};
  db.users.find(query).forEach(function(e) {
    printjson(e._id);
    e.scriptupdate = 5;
    var myids = [e._id];
    for (item in e.crews) {
      //myids.push(e.crews[item]);
    }
    var footage =  db.footage.find({"users": {$in: myids}, "is_public": true}).toArray().map(function(item){ return item._id; });
    if (footage.length) e.footage = footage;
    if (!footage.length) delete e.footage;
    printjson("e.footage");
    printjson(footage);

    var playlists =  db.playlists.find({"users": {$in: myids}, "is_public": true}).toArray().map(function(item){ return item._id; });
    if (playlists.length) e.playlists = playlists;
    if (!playlists.length) delete e.playlists;
    printjson("e.playlists");
    printjson(playlists);

    var performances =  db.performances.find({"users": {$in: myids}, "is_public": true}).toArray().map(function(item){ return item._id; });
    if (performances.length) e.performances = performances;
    if (!performances.length) delete e.performances;
    printjson("e.performances");
    printjson(performances);

    var perf = {};
    perf["lights-installation"] = db.performances.count({"users": {$in: myids}, "is_public": true, "categories": ObjectId("5be8708afc39610000000017")});
    perf["mapping"] = db.performances.count({"users": {$in: myids}, "is_public": true, "categories": ObjectId("5be8708afc39610000000016")});
    perf["vj-set"] = db.performances.count({"users": {$in: myids}, "is_public": true, "categories": ObjectId("5be8708afc39610000000014")});
    perf["workshop"] = db.performances.count({"users": {$in: myids}, "is_public": true, "categories": ObjectId("5be8708afc39610000000099")});
    perf["av-performance"] = db.performances.count({"users": {$in: myids}, "is_public": true, "categories": ObjectId("5be8708afc3961000000011b")});
    perf["project-showcase"] = db.performances.count({"users": {$in: myids}, "is_public": true, "categories": ObjectId("5be8708afc3961000000011c")});
    perf["dj-set"] = db.performances.count({"users": {$in: myids}, "is_public": true, "categories": ObjectId("5be8708afc3961000000011d")});
    perf["video-installation"] = db.performances.count({"users": {$in: myids}, "is_public": true, "categories": ObjectId("5be8708afc3961000000019f")});
    perf["lecture"] = db.performances.count({"users": {$in: myids}, "is_public": true, "categories": ObjectId("5be8708afc396100000001a1")});
    printjson("perf");
    printjson(perf);

    var events =  db.events.find({"users": {$in: myids}, "is_public": true}).toArray().map(function(item){ return item._id; });
    if (events.length) e.events = events;
    if (!events.length) delete e.events;
    printjson("e.events");
    printjson(events);

    var partnerships =  db.events.find({"partners.users": e._id, "is_public": true}).toArray().map(function(item){ return item._id; });
    printjson("e.partnerships");
    if (partnerships.length) e.partnerships = partnerships;
    if (!partnerships.length) delete e.partnerships;
    printjson(partnerships);

    var galleries =  db.galleries.find({"users": {$in: myids}, "is_public": true}).toArray().map(function(item){ return item._id; });
    if (galleries.length) e.galleries = galleries;
    if (!galleries.length) delete e.galleries;
    printjson("e.galleries");
    printjson(galleries);

    var videos =  db.videos.find({"users": {$in: myids}, "is_public": true}).toArray().map(function(item){ return item._id; });
    if (videos.length) e.videos = videos;
    if (!videos.length) delete e.videos;
    printjson("e.videos");
    printjson(videos);

    var news =  db.news.find({"users": {$in: myids}, "is_public": true}).toArray().map(function(item){ return item._id; });
    if (news.length) e.news = news;
    if (!news.length) delete e.news;
    printjson("e.news");
    printjson(news);
    
    e.stats = {};
    if (e.performances && e.performances.length) e.stats.performances = e.performances.length;
    if (e.events && e.events.length) e.stats.events = e.events.length;
    if (e.partnerships && e.partnerships.length) e.stats.partnerships = e.partnerships.length;
    if (e.footage && e.footage.length) e.stats.footage = e.footage.length;
    if (e.playlists && e.playlists.length) e.stats.playlists = e.playlists.length;
    if (e.videos && e.videos.length) e.stats.videos = e.videos.length;
    if (e.galleries && e.galleries.length) e.stats.galleries = e.galleries.length;
    if (e.news && e.news.length) e.stats.news = e.news.length;

    if (perf["lights-installation"]) e.stats["lights-installation"] = perf["lights-installation"];
    if (perf["mapping"]) e.stats["mapping"] = perf["mapping"];
    if (perf["vj-set"]) e.stats["vj-set"] = perf["vj-set"];
    if (perf["workshop"]) e.stats["workshop"] = perf["workshop"];
    if (perf["av-performance"]) e.stats["av-performance"] = perf["av-performance"];
    if (perf["project-showcase"]) e.stats["project-showcase"] = perf["project-showcase"];
    if (perf["dj-set"]) e.stats["dj-set"] = perf["dj-set"];
    if (perf["video-installation"]) e.stats["video-installation"] = perf["video-installation"];
    if (perf["lecture"]) e.stats["lecture"] = perf["lecture"];
    

    if (e.is_crew && e.members && e.members.length) e.stats.members = e.members.length;
    if (!e.is_crew && e.crews && e.crews.length) e.stats.crews = e.crews.length;

    e.activity = 0;
    e.activity+= (e.stats.performances ? e.stats.performances * 100 : 0);
    e.activity+= (e.stats.events ? e.stats.events             * 50 : 0);
    e.activity+= (e.stats.partnerships ? e.stats.partnerships * 5 : 0);
    e.activity+= (e.stats.footage ? e.stats.footage           * 1 : 0);
    e.activity+= (e.stats.playlists ? e.stats.playlists       * 2 : 0);
    e.activity+= (e.stats.videos ? e.stats.videos             * 3 : 0);
    e.activity+= (e.stats.galleries ? e.stats.galleries       * 1 : 0);
    e.activity+= (e.stats.news ? e.stats.news                 * 1 : 0);

    e.activity_as_performer = 0;
    e.activity_as_performer+= (e.stats.performances ? e.stats.performances * 100 : 0);
    e.activity_as_performer+= (e.stats.footage ? e.stats.footage           * 1 : 0);
    e.activity_as_performer+= (e.stats.playlists ? e.stats.playlists       * 1 : 0);

    e.activity_as_organization = 0;
    e.activity_as_organization+= (e.stats.events ? e.stats.events             * 10 : 0);
    e.activity_as_organization+= (e.stats.partnerships ? e.stats.partnerships * 1 : 0);
    e.activity_as_organization+= (e.stats.videos ? e.stats.videos             * 1 : 0);
    e.activity_as_organization+= (e.stats.galleries ? e.stats.galleries       * 1 : 0);
    e.activity_as_organization+= (e.stats.news ? e.stats.news                 * 1 : 0);

    printjson("pre save");
    db.users.save(e);
  });

  db.users.find({}).forEach(function(e) {
    //e.news = db.news.find({users:{$in:meandcrews}},{_id: 1}).toArray().map(function(item){ return item._id; });
    e.activity = 0;
    e.activity+= (e.stats.performances ? e.stats.performances * 100 : 0);
    e.activity+= (e.stats.events ? e.stats.events             * 50 : 0);
    e.activity+= (e.stats.partnerships ? e.stats.partnerships * 5 : 0);
    e.activity+= (e.stats.footage ? e.stats.footage           * 1 : 0);
    e.activity+= (e.stats.playlists ? e.stats.playlists       * 2 : 0);
    e.activity+= (e.stats.videos ? e.stats.videos             * 3 : 0);
    e.activity+= (e.stats.galleries ? e.stats.galleries       * 1 : 0);
    e.activity+= (e.stats.news ? e.stats.news                 * 1 : 0);

    e.activity_as_performer = 0;
    e.activity_as_performer+= (e.stats.performances ? e.stats.performances * 100 : 0);
    e.activity_as_performer+= (e.stats.footage ? e.stats.footage           * 1 : 0);
    e.activity_as_performer+= (e.stats.playlists ? e.stats.playlists       * 1 : 0);

    e.activity_as_organization = 0;
    e.activity_as_organization+= (e.stats.events ? e.stats.events             * 10 : 0);
    e.activity_as_organization+= (e.stats.partnerships ? e.stats.partnerships * 1 : 0);
    e.activity_as_organization+= (e.stats.videos ? e.stats.videos             * 1 : 0);
    e.activity_as_organization+= (e.stats.galleries ? e.stats.galleries       * 1 : 0);
    e.activity_as_organization+= (e.stats.news ? e.stats.news                 * 1 : 0);

    db.users.save(e);
  });


}

db.venuedb.find({status: "OK"}).forEach(function(e) {
  if (!e.geometry.lat || !e.geometry.lng || e.geometry.lat.toString()!=Number(e.geometry.lat).toString() || e.geometry.lng.toString()!=Number(e.geometry.lng).toString()) {
    delete e.status;
    delete e.geometry;
    //db.venuedb.save(e);
    printjson(e);  
  }
});
db.venuedb.find({geometry_new:{$exists:true}}).forEach(function(e) {
  printjson(e);  
});

db.venuedb.find({geometry:{$exists:true}}).forEach(function(e) {
  //if (e.geometry.lat!=Number(e.geometry.lat) || e.geometry.lng!=Number(e.geometry.lng)) {
    e.geometry.lng = Number(e.geometry.lng);
    e.geometry.lat = Number(e.geometry.lat);
    db.venuedb.save(e);
    printjson(e);  
  //}
});

db.venuedb.find({}).forEach(function(e) {
  ok = db.events.count({"schedule.venue.name": e.name, "schedule.venue.location.country": e.country, "schedule.venue.location.locality": e.locality});
  if (ok && e.geometry && e.geometry.lat && e.geometry.lng && e.route_new && e.name == e.name_new && e.locality == e.locality_new && e.country == e.country_new) {
    e.status = "OK";
    db.venuedb.save(e);
  } else {
    check = db.events.count({"schedule.venue.name": e.name});
    if (check) {
      e.status = "CHECK";
    } else {
      e.status = "NOT IN USE";  
      printjson(e.name);  
    }
    db.venuedb.save(e);
  }
});

db.venuedb.find({}).forEach(function(e) {
  if (e.geometry && e.geometry.lat && e.geometry.lng && e.route_new && e.name == e.name_new && e.locality == e.locality_new && e.country == e.country_new) {
    e.status = "OK";
    db.venuedb.save(e);
    printjson(e);
  }
});

db.venuedb.find({route_new:{$exists: false}}).forEach(function(e) {
  delete e.status;
  db.venuedb.save(e);
});

db.venuedb.find({status: "OK"}).forEach(function(e) {
  db.events.find({"schedule.venue.name": e.name, "schedule.venue.location.country": e.country, "schedule.venue.location.locality": e.locality}).forEach(function(event) {
    var save = false;
    event.schedule.forEach(function(schedule) {
      if (e.name == schedule.venue.name && e.locality == schedule.venue.location.locality && e.country == schedule.venue.location.country) {
        schedule.venue.name = e.name;
        schedule.venue.location.postal_code = e.postal_code_new;
        schedule.venue.location.street_number = e.street_number_new;
        schedule.venue.location.route = e.route_new;
        schedule.venue.location.country = e.country;
        schedule.venue.location.locality = e.locality;
        schedule.venue.location.geometry = e.geometry;
        schedule.venue.location.formatted_address = e.formatted_address;
        save = true;
      }
    });
    if (save) {
      printjson(event.schedule);  
      db.events.save(event);
    }
  });
});

db.events.find({"program.schedule.venue.name": {$exists:true}}).forEach(function(event) {
  var venues =   event.schedule.map(function(schedule){ return schedule.venue.name; });
  var save = false;

  event.program.forEach(function(program) {
    if (program.schedule.venue) {
      if (venues.indexOf(program.schedule.venue.name)===-1) {
        //printjson(venues);  
        printjson(program.schedule.venue.name+" > "+venues[0]);
        //if (program.schedule.venue.name=="Macro Via Nizza") {
          program.schedule.venue.name = venues[0];
          save = true;
        //}
      }
    }
  });
  if (save) {
    printjson(event.program);  
    db.events.save(event);
  }
});

db.events.find({"program.schedule.venue.name": {$exists:true}}).forEach(function(event) {
  var save = false;
  event.program.forEach(function(program) {
    if (program.schedule.venue) {
      var venue = db.venuedb.findOne({status: "OK",name: program.schedule.venue.name});
      if (venue) {
        program.schedule.venue.location.postal_code = venue.postal_code_new;
        program.schedule.venue.location.street_number = venue.street_number_new;
        program.schedule.venue.location.route = venue.route_new;
        program.schedule.venue.location.country = venue.country;
        program.schedule.venue.location.locality = venue.locality;
        program.schedule.venue.location.geometry = venue.geometry;
        program.schedule.venue.location.formatted_address = venue.formatted_address;

        //printjson(venue);  
        //printjson(program.schedule.venue.name+" > "+venues[0]);
        //if (program.schedule.venue.name=="Macro Via Nizza") {
          //program.schedule.venue.name = venues[0];
          save = true;
        //}
      }
    }
  });
  if (save) {
    printjson(event.program);  
    db.events.save(event);
  }
});

db.events.find({"program.schedule.venue.name": {$exists:true},"program.schedule.venue.location.geometry": {$exists:false}}).forEach(function(event) {
  var venues =   event.program.map(function(program){ if (program.schedule.venue) return program.schedule.venue.name; });
  printjson(venues);  
});

db.categories.find({"ancestor":ObjectId("5be8708afc3961000000008f")}).toArray().map(function(item){ return item._id; });

db.performances.find({"bookings":{$exists:true}}).forEach(function(e) {
  delete e.bookings;
  db.performances.save(e);
});

db.events.find({"program.0": {$exists:true}}).forEach(function(e) {
  for (i in e.program) {
    var booking = {};
    booking.event = e._id;
    booking.schedule = e.program[i].schedule;
    if (e.program[i].performance && e.program[i].schedule.venue) {
      printjson(e.program[i].performance);
      var perf = db.performances.findOne({_id:e.program[i].performance});
      if (!perf.bookings) perf.bookings = [];
      perf.bookings.push(booking);
      printjson(perf.bookings);
      db.performances.save(perf);
    }
  }
});
db.performances.find({"tech_req":{$exists:true}}).forEach(function(e) {
  var tech_reqs = [];
  printjson(e.tech_req);
  for (var i in e.tech_req) {
    var tech_req = {
      "lang" : i, 
      "abouttext" : e.tech_req[i]
    };
    tech_reqs.push(tech_req);
  }
  e.tech_reqs = tech_reqs;
  printjson(e.tech_reqs);
  delete e.tech_req;
  db.performances.save(e);
});


db.events.find({"program.0": {$exists:true}}).forEach(function(e) {
  var partners = [{
    "category" : ObjectId("5be8708afc3961000000005d"), 
    "users" : []
  }];
});

db.categories.find({"ancestor":ObjectId("5be8708afc3961000000008f")}).toArray().map(function(item){ return item._id; });
db.categories.find({"ancestor":ObjectId("5be8708afc3961000000008f")}).forEach(function(e) {
  //printjson('"'+e.slug+'": {"categories": "'+e_id+'" }');
  //printjson(e.slug);
  printjson(e.slug+"\": \""+e.name);
});



.toArray().map(function(item){ return ""item.name+" "+item._id; });

printjson(db.performances.count({"categories": ObjectId("5be8708afc39610000000017")}));
printjson(db.performances.count({"categories": ObjectId("5be8708afc39610000000016")}));
printjson(db.performances.count({"categories": ObjectId("5be8708afc39610000000014")}));
printjson(db.performances.count({"categories": ObjectId("5be8708afc39610000000098")}));
printjson(db.performances.count({"categories": ObjectId("5be8708afc39610000000099")}));
printjson(db.performances.count({"categories": ObjectId("5be8708afc3961000000009a")}));
printjson(db.performances.count({"categories": ObjectId("5be8708afc3961000000011b")}));
printjson(db.performances.count({"categories": ObjectId("5be8708afc3961000000011c")}));
printjson(db.performances.count({"categories": ObjectId("5be8708afc3961000000011d")}));
printjson(db.performances.count({"categories": ObjectId("5be8708afc3961000000011e")}));
printjson(db.performances.count({"categories": ObjectId("5be8708afc3961000000019f")}));
printjson(db.performances.count({"categories": ObjectId("5be8708afc396100000001a1")}));
printjson(db.performances.count({"categories": ObjectId("5be8708afc39610000000222")}));
printjson(db.performances.count({"categories": ObjectId("5be8708afc39610000000223")}));
printjson(db.performances.count({"categories": ObjectId("5be8708afc39610000000224")}));



[
	"ObjectId(\"5be8708afc39610000000013\")",
	"ObjectId(\"5be8708afc39610000000097\")",
	"ObjectId(\"5be8708afc3961000000011a\")",
	"ObjectId(\"5be8708afc3961000000019e\")",
	"ObjectId(\"5be8708afc39610000000221\")"
]

var status_search = db.categories.find({"ancestor":ObjectId("5be8708afc3961000000000b")}).toArray().map(function(item){ return item._id; });
var status = db.categories.find({"ancestor":ObjectId("5be8708afc3961000000000b")}).toArray().map(function(item){ return item._id.toString(); });
printjson(status);

db.performances.find({"categories":{$in:status_search}}).forEach(function(e) {
  printjson("e.categories PRIMA");
  printjson(e.categories);
  for (a=0;a<e.categories.length;a++) {
    printjson(e.categories[a]);
    if (status.indexOf(e.categories[a].toString())!==-1) printjson(a+" "+status.indexOf(e.categories[a].toString()));
    if (status.indexOf(e.categories[a].toString())!==-1) {
      e.categories.splice(a,1);
      a-=1;
    }
  }
  printjson("e.categories DOPO");
  printjson(e.categories);
  db.performances.save(e);
});

var status_search = db.categories.find({"name":{$regex:".*Rooms"}}).toArray().map(function(item){ return item._id; });
printjson(status_search);

var ancestor = [
	ObjectId("5be8708afc3961000000000d"),
	ObjectId("5be8708afc39610000000012"),
	ObjectId("5be8708afc3961000000000c"),
	ObjectId("5be8708afc39610000000011"),
	ObjectId("5be8708afc3961000000000e"),
	ObjectId("5be8708afc3961000000000f"),
	ObjectId("5be8708afc39610000000090"),
	ObjectId("5be8708afc39610000000091"),
	ObjectId("5be8708afc39610000000092"),
	ObjectId("5be8708afc39610000000094"),
	ObjectId("5be8708afc39610000000095"),
	ObjectId("5be8708afc39610000000096"),
	ObjectId("5be8708afc39610000000114"),
	ObjectId("5be8708afc39610000000117"),
	ObjectId("5be8708afc39610000000118"),
	ObjectId("5be8708afc39610000000119"),
	ObjectId("5be8708afc39610000000197"),
	ObjectId("5be8708afc3961000000019a"),
	ObjectId("5be8708afc3961000000019b"),
	ObjectId("5be8708afc3961000000019c"),
	ObjectId("5be8708afc3961000000019d"),
	ObjectId("5be8708afc3961000000021a"),
	ObjectId("5be8708afc3961000000021b"),
	ObjectId("5be8708afc3961000000021d"),
	ObjectId("5be8708afc3961000000021e"),
	ObjectId("5be8708afc3961000000021f"),
	ObjectId("5be8708afc39610000000220")
];
var status_search = db.categories.find({"ancestor":{$in:ancestor}}).toArray().map(function(item){ return item._id; });
var status = db.categories.find({"ancestor":{$in:ancestor}}).toArray().map(function(item){ return item._id.toString(); });
printjson(status);

db.performances.find({"categories":{$in:status_search}}).forEach(function(e) {
  printjson(e.slug);
  printjson("e.categories PRIMA");
  printjson(e.categories);
  for (a=0;a<e.categories.length;a++) {
    printjson(e.categories[a]);
    if (status.indexOf(e.categories[a].toString())!==-1) printjson(a+" "+status.indexOf(e.categories[a].toString()));
    if (status.indexOf(e.categories[a].toString())!==-1) {
      e.categories.splice(a,1);
      a-=1;
    }
  }
  printjson("e.categories DOPO");
  printjson(e.categories);
  db.performances.save(e);
});

makeTextPlainToRich = function(str) {
  return str
      //.replace(/"/gi,'&quot;')
      .replace(/###b###/gi,"<b>")
      .replace(/###\/b###/gi,"</b>")
      .replace(/\r\n/gi,"<br />")
      .replace(/\n/gi,"<br />");
};
linkify = function(str) {

  // http://, https://, ftp://
  var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

  // www. sans http:// or https://
  var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

  // Email addresses
  var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

  return str
      .replace(urlPattern, '<a href="$&">$&</a>')
      .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
      .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
};

var str = '###b###The quick brown\r\n fox g.delgobbo@flyer.it  fox https://flyer.it  fox http://flyer.it jumped \r\nover the lazy ###/b###. If the dog \nreacted, was \nit really lazy?';
c
onsole.log(makeTextPlainToRich(str));
/* .replace(/“/gi, "\\\"")
.replace(/<em>/gi, "###em###")
.replace(/<\/em>/gi, "###/em###")
.replace(/<strong>/gi, "###b###")
.replace(/<\/strong>/gi, "###/b###")
.replace(/<p>/gi, "")
.replace(/<br\/>/gi, "\n")
.replace(/<br \/>/gi, "\n")
.replace(/<br>/gi, "\n")
.replace(/<\/p>/gi, "\n\n")
.replace(/\n\n\n/gi, "\n\n")
.replace(/\n\n\n/gi, "\n\n");
replace(/<(?:.|\n)*?>/gm, '')
.trim()
.replace(/###em###/gi, "<em>")
.replace(/###\/em###/gi, "</em>")
.replace(/###b###/gi, "<b>")
.replace(/###\/b###/gi, "</b>");
 */

 printjson(makeTextPlainToRich("<em><script>aaaaa</script>"));

function makeTextPlainToRich(str) {
  str = str.replace(new RegExp(/&#8211;/gi), "-");
  str = str.replace(new RegExp(/<u>/gi), "###u###");
  str = str.replace(new RegExp(/<\/u>/gi), "###/u###");
  str = str.replace(new RegExp(/<i>/gi), "###i###");
  str = str.replace(new RegExp(/<\/i>/gi), "###/i###");
  str = str.replace(new RegExp(/<em>/gi), "###i###");
  str = str.replace(new RegExp(/<\/em>/gi), "###/i###");
  str = str.replace(new RegExp(/<strong>/gi), "###b###");
  str = str.replace(new RegExp(/<\/strong>/gi), "###/b###");
  str = str.replace(new RegExp(/<br\/>/gi), "\n");
  str = str.replace(new RegExp(/<br \/>/gi), "\n");
  str = str.replace(new RegExp(/<br>/gi), "\n");
  str = str.replace(new RegExp(/<\/p>/gi), "<\/p>\n\n");
  str = str.replace(new RegExp(/<(?:.|\n)*?>/gm), "");
  str = str.replace(new RegExp(/\n\n+/gi), "\n\n");
  str = str.replace(new RegExp(/\t/gi), " ");
  str = str.replace(new RegExp(/ +/gi), " ");
  str = str.replace(new RegExp(/\r\n/gi), "\n");
  str = str.replace(new RegExp(/ \n/gi), "\n");
  str = str.replace(new RegExp(/\n /gi), "\n");
  str = str.replace(new RegExp(/\n\n+/gi), "\n\n");
  str = str.trim();
  str = str.replace(new RegExp(/###u###/gi), "<u>");
  str = str.replace(new RegExp(/###\/u###/gi), "</u>");
  str = str.replace(new RegExp(/###i###/gi), "<i>");
  str = str.replace(new RegExp(/###\/i###/gi), "</i>");
  str = str.replace(new RegExp(/###b###/gi), "<b>");
  str = str.replace(new RegExp(/###\/b###/gi), "</b>");
  return str;
}
db.performances.find({"abouts.abouttext":{$regex:".*###.*"}}).forEach(function(e) {
  e.aboutsbkp = JSON.parse(JSON.stringify(e.abouts));
  for (a=0;a<e.abouts.length;a++) {
    //printjson(e.abouts[a].abouttext);
    e.abouts[a].abouttext = makeTextPlainToRich(e.abouts[a].abouttext);
    //printjson(e.abouts[a].abouttext);
    db.performances.save(e);
  }
});
db.events.find({}).forEach(function(e) {
  e.aboutsbkp = JSON.parse(JSON.stringify(e.abouts));
  for (a=0;a<e.abouts.length;a++) {
    //printjson(e.abouts[a].abouttext);
    e.abouts[a].abouttext = makeTextPlainToRich(e.abouts[a].abouttext);
    //printjson(e.abouts[a].abouttext);
    db.events.save(e);
  }
});
db.users.find({"abouts.abouttext":{$regex:"/.*###.*/"}}).forEach(function(e) {
  for (a=0;a<e.abouts.length;a++) {
    printjson(e.abouts[a].abouttext);
    e.abouts[a].abouttext = makeTextPlainToRich(e.abouts[a].abouttext);
    printjson(e.abouts[a].abouttext);
    db.users.save(e);
  }
});
db.videos.find({"abouts.abouttext":{$regex:"/.*###.*/"}}).forEach(function(e) {
  for (a=0;a<e.abouts.length;a++) {
    printjson(e.abouts[a].abouttext);
    e.abouts[a].abouttext = makeTextPlainToRich(e.abouts[a].abouttext);
    printjson(e.abouts[a].abouttext);
    db.videos.save(e);
  }
});
db.footage.find({"abouts.abouttext":{$regex:"/.*###.*/"}}).forEach(function(e) {
  for (a=0;a<e.abouts.length;a++) {
    printjson(e.abouts[a].abouttext);
    e.abouts[a].abouttext = makeTextPlainToRich(e.abouts[a].abouttext);
    printjson(e.abouts[a].abouttext);
    db.footage.save(e);
  }
});


db.galleries.find({}).forEach(function(gallery) {
  gallery.events = db.events.find({galleries:gallery._id}).toArray().map(function(item){ return item._id; });
  gallery.performances = db.performances.find({galleries:gallery._id}).toArray().map(function(item){ return item._id; });
  printjson(gallery.events.length+gallery.performances.length);
  if (gallery.events.length+gallery.performances.length>0) {
    db.galleries.save(gallery);
  } else {
    printjson(gallery.events);
    printjson(gallery.performances);
    db.galleries.remove({_id:gallery._id});
    db.galleries_not_in_use.save(gallery);
  }
});

db.galleries.find({'medias.file':{$regex: '.*avi.*'}}).forEach(function(gallery) {
  printjson(gallery);
  for (var a=0; a<gallery.medias.length; a++) {
    if (gallery.medias[a].file.indexOf(".avi")!==-1) {
      video = JSON.parse(JSON.stringify(gallery));
      video.media = gallery.medias[a];
      video.users = gallery.users;
      video.events = gallery.events;
      video.performances = gallery.performances;
      video.media.original = gallery.medias[a].file.replace("glacier/galleries_originals", "glacier/videos_originals");
      video.media.encoded = 1;
      video.media.file = gallery.medias[a].file.replace(".avi", "_avi.mp4").replace("glacier/galleries_originals", "warehouse/videos");
      video.media.preview = video.media.original.replace(".avi", "_avi.png").replace("glacier/videos_originals", "glacier/videos_previews");
      delete video.medias;
      delete video.image;
      delete video._id;
      gallery.medias.splice(a, 1);
      a--;

      printjson("video");
      printjson(video);
      printjson("gallery");
      printjson(gallery);
      db.galleries.save(gallery);
      db.videos.save(video);
      if (video.performances.length) {
        db.performances.find({_id:{$in: video.performances}}).forEach(function(performance) {
          performance.galleries = db.galleries.find({performances:performance._id}).toArray().map(function(item){ return item._id; });
          printjson("performance.galleries");
          printjson(performance.galleries);
          performance.videos = db.videos.find({performances:performance._id}).toArray().map(function(item){ return item._id; });
          printjson("performance.videos");
          printjson(performance.videos);
          db.performances.save(performance);
        });
      }
      if (video.events.length) {
        db.events.find({_id:{$in: video.events}}).forEach(function(performance) {
          event.galleries = db.galleries.find({events:event._id}).toArray().map(function(item){ return item._id; });
          printjson("performance.galleries");
          printjson(performance.galleries);
          event.videos = db.videos.find({events:event._id}).toArray().map(function(item){ return item._id; });
          printjson("performance.videos");
          printjson(performance.videos);
         db.events.save(event);
        });
      }    
    }
  }
});

db.performances.find({"bookings.0": {$exists: false},"image.file": {$exists: false}}).forEach(function(performance) {
  performance.is_public = false;
  db.performances.save(performance);
});


db.galleries.find({}).forEach(function(e) {
  e.is_public = true;
  db.galleries.save(e);
  printjson(e);  
});

db.performances.find({}).forEach(function(performance) {
  var videos = db.videos.find({"performances":performance._id}).toArray().map(function(item){ return item._id; });
  if (videos.length) {
    printjson("performance.videos");  
    printjson(performance.videos && performance.videos.length ? performance.videos.length : 0);  
    performance.videos = videos;
    printjson(performance.videos.length);  
  }
  db.performances.save(performance);
});

db.performances.find({}).forEach(function(performance) {
  var galleries = db.galleries.find({"performances":performance._id}).toArray().map(function(item){ return item._id; });
  if (galleries.length && galleries.length!=performance.galleries.length) {
    printjson("performance.galleries");  
    printjson(performance.galleries && performance.galleries.length ? performance.galleries.length : 0);  
    performance.galleries = galleries;
    printjson(performance.galleries);  
  }
  db.performances.save(performance);
});

db.videos.find({"performance.0":{$exists:true}}).forEach(function(performance) {
  printjson("performance.videos");  
  printjson(video.performances.length);  
  performance.videos = db.videos.find({"_id":{$in:performance.videos}}).toArray().map(function(item){ return item._id; });
  printjson(performance.videos.length);  
  //db.performances.save(performance);
});


db.events.find({}).forEach(function(event) {
  var videos = db.videos.find({"events":event._id}).toArray().map(function(item){ return item._id; });
  if (videos.length && videos.length!=event.videos.length) {
    printjson("event.videos");  
    printjson(event.videos && event.videos.length ? event.videos.length : 0);  
    event.videos = videos;
    printjson(event.videos.length);  
    db.events.save(event);
  }
});

db.events.find({}).forEach(function(event) {
  var galleries = db.galleries.find({"events":event._id}).toArray().map(function(item){ return item._id; });
  if (galleries.length && galleries.length!=event.galleries.length) {
    printjson("event.galleries");  
    printjson(event.galleries && event.galleries.length ? event.galleries.length : 0);  
    event.galleries = galleries;
    printjson(event.galleries.length);  
    db.events.save(event);
  }
});
