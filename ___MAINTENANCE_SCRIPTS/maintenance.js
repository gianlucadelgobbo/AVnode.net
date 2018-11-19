var USERS = function() {
  //performances_rel_events
  //db.performances.count({"bookings": {$exists: true}})
  //db.events.find({"program": {$exists: true}}).toArray().map(function(item){ item.map(function(item2){ return item2.performance; })});
  db.users.find({}).forEach(function(e) {
    var myids = [e._id];
    for (item in e.crews) {
      myids.push(e.crews[item]);
    }
    var footage =  db.footage.find({"users": {$in: myids}}).toArray().map(function(item){ return item._id; });
    if (footage.length) e.footage = footage;
    if (!footage.length) delete e.footage;
    printjson("e.footage");
    printjson(e.footage);

    var playlists =  db.playlists.find({"users": {$in: myids}}).toArray().map(function(item){ return item._id; });
    if (playlists.length) e.playlists = playlists;
    if (!playlists.length) delete e.playlists;
    printjson("e.playlists");
    printjson(e.playlists);

    var performances =  db.performances.find({"users": {$in: myids}}).toArray().map(function(item){ return item._id; });
    if (performances.length) e.performances = performances;
    if (!performances.length) delete e.performances;
    printjson("e.performances");
    printjson(e.performances);

    var events =  db.events.find({"users": {$in: myids}}).toArray().map(function(item){ return item._id; });
    if (events.length) e.events = events;
    if (!events.length) delete e.events;
    printjson("e.events");
    printjson(e.events);

    var galleries =  db.galleries.find({"users": {$in: myids}}).toArray().map(function(item){ return item._id; });
    if (galleries.length) e.galleries = galleries;
    if (!galleries.length) delete e.galleries;
    printjson("e.galleries");
    printjson(e.galleries);

    var videos =  db.videos.find({"users": {$in: myids}}).toArray().map(function(item){ return item._id; });
    if (videos.length) e.videos = videos;
    if (!videos.length) delete e.videos;
    printjson("e.videos");
    printjson(e.videos);

    var news =  db.news.find({"users": {$in: myids}}).toArray().map(function(item){ return item._id; });
    if (news.length) e.news = news;
    if (!news.length) delete e.news;
    printjson("e.news");
    printjson(e.news);
    e.stats = {};
    if (e.performances && e.performances.length) e.stats.performances = e.performances.length;
    if (e.events && e.events.length) e.stats.events = e.events.length;
    if (e.footage && e.footage.length) e.stats.footage = e.footage.length;
    if (e.playlists && e.playlists.length) e.stats.playlists = e.playlists.length;
    if (e.videos && e.videos.length) e.stats.videos = e.videos.length;
    if (e.galleries && e.galleries.length) e.stats.galleries = e.galleries.length;
    if (e.news && e.news.length) e.stats.news = e.news.length;

    if (e.is_crew && e.members && e.members.length) e.stats.members = e.members.length;
    if (!e.is_crew && e.crews && e.crews.length) e.stats.crews = e.crews.length;

    e.activity = 0;
    e.activity+= (e.stats.performances ? e.stats.performances * 3 : 0);
    e.activity+= (e.stats.events ? e.stats.events             * 5 : 0);
    e.activity+= (e.stats.footage ? e.stats.footage           * 1 : 0);
    e.activity+= (e.stats.playlists ? e.stats.playlists       * 2 : 0);
    e.activity+= (e.stats.videos ? e.stats.videos             * 3 : 0);
    e.activity+= (e.stats.galleries ? e.stats.galleries       * 1 : 0);
    e.activity+= (e.stats.news ? e.stats.news                 * 1 : 0);

    db.users.save(e);
  });

  db.users.find({}).forEach(function(e) {
    //e.news = db.news.find({users:{$in:meandcrews}},{_id: 1}).toArray().map(function(item){ return item._id; });

    e.stats = {};
    if (e.performances && e.performances.length) e.stats.performances = e.performances.length;
    if (e.events && e.events.length) e.stats.events = e.events.length;
    if (e.footage && e.footage.length) e.stats.footage = e.footage.length;
    if (e.playlists && e.playlists.length) e.stats.playlists = e.playlists.length;
    if (e.videos && e.videos.length) e.stats.videos = e.videos.length;
    if (e.galleries && e.galleries.length) e.stats.galleries = e.galleries.length;
    if (e.news && e.news.length) e.stats.news = e.news.length;

    if (e.is_crew && e.members && e.members.length) e.stats.members = e.members.length;
    if (!e.is_crew && e.crews && e.crews.length) e.stats.crews = e.crews.length;

    e.activity = 0;
    e.activity+= (e.stats.performances ? e.stats.performances * 3 : 0);
    e.activity+= (e.stats.events ? e.stats.events             * 5 : 0);
    e.activity+= (e.stats.footage ? e.stats.footage           * 1 : 0);
    e.activity+= (e.stats.playlists ? e.stats.playlists       * 2 : 0);
    e.activity+= (e.stats.videos ? e.stats.videos             * 3 : 0);
    e.activity+= (e.stats.galleries ? e.stats.galleries       * 1 : 0);
    e.activity+= (e.stats.news ? e.stats.news                 * 1 : 0);

    //printjson(e);
    db.users.save(e);
  });  

}

