var USERS = function() {
  //performances_rel_events
  //db.performances.count({"bookings": {$exists: true}})
  //db.events.find({"program": {$exists: true}}).toArray().map(function(item){ item.map(function(item2){ return item2.performance; })});

  var partnerships =  db.events.find({"partners.users": ObjectId("5be87f15fc3961000000a669")}).toArray().map(function(item){ return item._id; });
  if (partnerships.length) e.partnerships = partnerships;
  if (!partnerships.length) delete e.partnerships;
  printjson("e.partnerships");
  printjson(e.partnerships);


  db.users.find({activity_as_performer:{$exists:false}}).forEach(function(e) {
    var myids = [e._id];
    for (item in e.crews) {
      //myids.push(e.crews[item]);
    }
    var footage =  db.footage.find({"users": {$in: myids}}).toArray().map(function(item){ return item._id; });
    if (footage.length) e.footage = footage;
    if (!footage.length) delete e.footage;
    printjson("e.footage");
    printjson(footage);

    var playlists =  db.playlists.find({"users": {$in: myids}}).toArray().map(function(item){ return item._id; });
    if (playlists.length) e.playlists = playlists;
    if (!playlists.length) delete e.playlists;
    printjson("e.playlists");
    printjson(playlists);

    var performances =  db.performances.find({"users": {$in: myids}}).toArray().map(function(item){ return item._id; });
    if (performances.length) e.performances = performances;
    if (!performances.length) delete e.performances;
    printjson("e.performances");
    printjson(performances);

    var perf = {};
    perf["lights-installation"] = db.performances.count({"users": {$in: myids}, "categories": ObjectId("5be8708afc39610000000017")});
    perf["mapping"] = db.performances.count({"users": {$in: myids}, "categories": ObjectId("5be8708afc39610000000016")});
    perf["vj-set"] = db.performances.count({"users": {$in: myids}, "categories": ObjectId("5be8708afc39610000000014")});
    perf["workshop"] = db.performances.count({"users": {$in: myids}, "categories": ObjectId("5be8708afc39610000000099")});
    perf["av-performance"] = db.performances.count({"users": {$in: myids}, "categories": ObjectId("5be8708afc3961000000011b")});
    perf["project-showcase"] = db.performances.count({"users": {$in: myids}, "categories": ObjectId("5be8708afc3961000000011c")});
    perf["dj-set"] = db.performances.count({"users": {$in: myids}, "categories": ObjectId("5be8708afc3961000000011d")});
    perf["video-installation"] = db.performances.count({"users": {$in: myids}, "categories": ObjectId("5be8708afc3961000000019f")});
    perf["lecture"] = db.performances.count({"users": {$in: myids}, "categories": ObjectId("5be8708afc396100000001a1")});
    printjson("perf");
    printjson(perf);

    var events =  db.events.find({"users": {$in: myids}}).toArray().map(function(item){ return item._id; });
    if (events.length) e.events = events;
    if (!events.length) delete e.events;
    printjson("e.events");
    printjson(events);

    var partnerships =  db.events.find({"partners.users": e._id}).toArray().map(function(item){ return item._id; });
    printjson("e.partnerships");
    if (partnerships.length) e.partnerships = partnerships;
    if (!partnerships.length) delete e.partnerships;
    printjson(partnerships);

    var galleries =  db.galleries.find({"users": {$in: myids}}).toArray().map(function(item){ return item._id; });
    if (galleries.length) e.galleries = galleries;
    if (!galleries.length) delete e.galleries;
    printjson("e.galleries");
    printjson(galleries);

    var videos =  db.videos.find({"users": {$in: myids}}).toArray().map(function(item){ return item._id; });
    if (videos.length) e.videos = videos;
    if (!videos.length) delete e.videos;
    printjson("e.videos");
    printjson(videos);

    var news =  db.news.find({"users": {$in: myids}}).toArray().map(function(item){ return item._id; });
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

db.performances.find({bookings:{$exists: true}}).forEach(function(e) {
  e.bookings = [];
  db.performances.save(e);
});

db.categories.find({"ancestor":ObjectId("5be8708afc3961000000008f")}).toArray().map(function(item){ return item._id; });

db.events.find({"program.0": {$exists:true}}).forEach(function(e) {
  for (i in e.program) {
    var booking = {};
    booking.event = e._id;
    booking.schedule = e.program[i].schedule;
    if (e.program[i].performance) {
      var perf = db.performances.findOne({_id:e.program[i].performance});
      if (!perf.bookings) perf.bookings = [];
      perf.bookings.push(booking);
      printjson(perf.bookings);
      db.performances.save(perf);
    }
  }
});

db.events.find({"program.0": {$exists:true}}).forEach(function(e) {
  var partners = [{
    "category" : ObjectId("5be8708afc3961000000005d"), 
    "users" : []
  }];
});

db.categories.find({"ancestor":ObjectId("5be8708afc3961000000008f")}).toArray().map(function(item){ return item._id; });
db.categories.find({"ancestor":ObjectId("5be8708afc3961000000008f")}).forEach(function(e) {
  printjson(e.slug);
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
