
  var status = ["5c38c57d9d426a9522c15ba5","5be8708afc3961000000019e","5be8708afc39610000000013","5be8708afc39610000000097","5be8708afc3961000000011a","5be8708afc39610000000221"];
  db.events.find({"program.schedule.categories.0":{$exists:true}}).forEach(function(event) {
  //db.events.find({"slug":"lpm-2018-rome"}).limit(1).forEach(function(event) {
    var save = true;
    event.program.forEach(function(program) {
      printjson(program.schedule);
      program.schedule.categories.forEach(function(category, index) {
        printjson(status.indexOf(category.str));
        if(status.indexOf(category.str)>=0) {
          program.schedule.status = db.categories.find({"_id":category}).toArray()[0]._id;
          program.schedule.categories.splice(index,1);
          printjson("stat[0]._id");
          printjson(program.schedule.status);
        }
      });
      printjson(program.schedule);
    });
    if (save) {
      printjson(event.program);  
      db.events.save(event);
    }
  });
  var status = ["5c38c57d9d426a9522c15ba5","5be8708afc3961000000019e","5be8708afc39610000000013","5be8708afc39610000000097","5be8708afc3961000000011a","5be8708afc39610000000221"];
  db.events.find({"program.schedule.categories.0":{$exists:true}}).forEach(function(event) {
  //db.events.find({"slug":"lpm-2018-rome"}).limit(1).forEach(function(event) {
    var save = true;
    event.program.forEach(function(program) {
      printjson(program.schedule);
      program.schedule.categories.forEach(function(category, index) {
        printjson(status.indexOf(category.str));
        if(status.indexOf(category.str)>=0) {
        } else if (program.schedule.venue) {
          program.schedule.venue.room = db.categories.find({"_id":category}).toArray()[0].name;
          program.schedule.categories.splice(index,1);
          printjson("room[0]");
          printjson(program.schedule.venue.room);
        }
      });
      printjson(program.schedule);
    });
    if (save) {
      printjson(event.program);  
      db.events.save(event);
    }
  });


  db.events.find({"program.0":{$exists:true}}).forEach(function(event) {
    //db.events.find({"slug":"lpm-2018-rome"}).limit(1).forEach(function(event) {
      var save = true;
      var program_new = {};
      var program_new_a = [];
      event.program.forEach(function(program) {
        if (!program_new[program.performance.str]) {
          program.schedule = [program.schedule];
          program_new[program.performance.str] = program;
        } else {
          program_new[program.performance.str].schedule.push(program.schedule);
          //printjson(program_new[program.performance.str].schedule);

        }
      });
      for(var item in program_new) {
        program_new_a.push(program_new[item]);
      }
      event.program_new = program_new_a;
      printjson(program_new_a);
      if (save) {
        printjson(event.program);  
        db.events.save(event);
      }
    });

    db.events.find({"program_new.0":{$exists:true}}).forEach(function(event) {
      //db.events.find({"slug":"lpm-2018-rome"}).limit(1).forEach(function(event) {
        var save = true;
        event.program_new.forEach(function(program) {
          program.schedule.forEach(function(schedule) {
            if(schedule.starttime) {
              if ((schedule.endtime-schedule.starttime)/(24*60*60*1000)<0) {
                printjson(schedule.endtime.getTime());
                var endtime = new Date(schedule.endtime.getTime()+(24*60*60*1000));
                schedule.endtime = endtime;
                printjson(endtime);
              }
          }
          });
        });
        if (save) {
          printjson(event.program);  
          db.events.save(event);
        }
      });
  
      db.events.find({"program_new.0":{$exists:true}}).forEach(function(event) {
        //db.events.find({"slug":"lpm-2018-rome"}).limit(1).forEach(function(event) {
          var save = true;
          event.program_new.forEach(function(program) {
            var schedule_new = {};
            var schedule_new_a = [];
            program.schedule.forEach(function(schedule) {
              if(schedule.starttime) {
                schedule_new[schedule.starttime.getTime()+"-"+schedule.endtime.getTime()+"-"+schedule.venue.name+"-"+schedule.venue.room] = schedule;
              }
            });
            for(var item in schedule_new) {
              schedule_new_a.push(schedule_new[item]);
            }
            program.schedule = schedule_new_a;
          });
          if (save) {
            printjson(event.program);  
            db.events.save(event);
          }
        });

        db.events.find({"program_new":{$exists:true}}).forEach(function(event) {
          event.program = event.program_new;
          delete event.program_new;
          db.events.save(event);
        });
      
    


  

  var status = ["5c38c57d9d426a9522c15ba5","5be8708afc3961000000019e","5be8708afc39610000000013","5be8708afc39610000000097","5be8708afc3961000000011a","5be8708afc39610000000221"];
  db.events.find({"program.schedule.categories.0":{$exists:true}}).forEach(function(event) {
    var save = false;
    event.program.forEach(function(program) {
      //printjson(program.schedule);
      program.schedule.categories.forEach(function(category, index) {
        if(status.indexOf(category.str)>=0) {
        } else if (program.schedule.venue) {
          program.schedule.venue.room = db.categories.find({"_id":category}).toArray()[0].name;
          program.schedule.categories.splice(index,1);
          printjson("room[0]");
          printjson(program.schedule.venue.room);
        } else {
          printjson(program);
          printjson(db.categories.find({"_id":category}).toArray()[0].name);
        }
      });
      //printjson(program.schedule);
    });
    if (save) {
      printjson(event.program);  
      db.events.save(event);
    }
  });

var status = ["5c38c57d9d426a9522c15ba5","5be8708afc3961000000019e","5be8708afc39610000000013","5be8708afc39610000000097","5be8708afc3961000000011a","5be8708afc39610000000221"];
db.events.find({"program.schedule.categories.0":{$exists:true}}).forEach(function(event) {
  var save = false;
  event.program.forEach(function(program) {
    //printjson(program.schedule);
    program.schedule.categories.forEach(function(category, index) {
      if(status.indexOf(category.str)>=0) {
      } else if (program.schedule.venue) {
        program.schedule.venue.room = db.categories.find({"_id":category}).toArray()[0].name;
        program.schedule.categories.splice(index,1);
        printjson("room[0]");
        printjson(program.schedule.venue.room);

      }
    });
    //printjson(program.schedule);
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
    booking.schedule = [];
    if (e.program[i].performance) for (a in e.program[i].schedule) if (e.program[i].schedule[a].venue) booking.schedule.push(e.program[i].schedule[a]);
    if (booking.schedule.length) {
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
