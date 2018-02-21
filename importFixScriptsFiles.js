//export LC_ALL="en_US.UTF-8"
//mongorestore --drop -d avnode_bruce /data/dumps/avnode_bruce_fixed/avnode_bruce
//mongodump -d avnode_bruce --out /data/dumps/avnode_bruce_fixed
//rsync -a /space/PhpMysql2015/sites/flxer/warehouse/ /sites/avnode/warehouse
//find '/sites/flxer/warehouse' -name "original_video"  | xargs du -sh
//rsync -a /space_fisica/PhpMysql2015/sites/flxer/warehouse_new/ /space_fisica/MongoNodeJS/sites/avnode.net/warehouse_new

db.galleries.find({}).forEach(function(e) {
  e.image = {file: e.medias[0].file};
  db.galleries.save(e);
});


//db.galleries.find({}).forEach(function(gallery) {
//db.galleries.find({"stats.video": "2", "stats.img": "4"}).limit(1).forEach(function(gallery) {



db.galleries.find({}).forEach(function(e) {
  e.image = {file: e.medias[0].file};
  db.galleries.save(e);
});


function sanitizeOld(folder,defaultFolder) {
  return folder.
  replace("/_flxer/library/koncepts/", defaultFolder).
  replace("/_flxer/library/photos/", defaultFolder).
  replace("/_flxer/library/hole/", defaultFolder).
  replace("/_flxer/library/no_hole/", defaultFolder);
}
db.footage.find({}).forEach(function(video) {
  var defaultFolder = "/"+video.creation_date.getFullYear()+"/"+("0" + (video.creation_date.getMonth() + 1)).slice(-2)+"/";
  if (sanitized != video.media.file) {
    var sanitized = sanitizeOld(video.media.file, defaultFolder);
    sanitized = sanitized.replace("/warehouse/", "/warehouse/footage/");
    if (sanitized != video.media.file) {
      printjson("cp "+video.media.file+" "+sanitized.substring(0, sanitized.lastIndexOf('/')).replace('/warehouse/','/warehouse_new/'));
      //printjson(" "+sanitizedFolder.substring(sanitizedFolder.lastIndexOf('/')).replace('/warehouse/','/warehouse_new/'));
      video.media.file = sanitized;
    }
  }
  if (video.media.preview) {
    var sanitizedPreview = sanitizeOld(video.media.preview, defaultFolder);
    sanitizedPreview = sanitizedPreview.replace("/preview_files/", "/").replace("/warehouse/", "/warehouse/footage_preview/");
    if (sanitizedPreview != video.media.preview) {
      printjson("cp "+video.media.preview+" "+sanitizedPreview.substring(0, sanitizedPreview.lastIndexOf('/')).replace('/warehouse/','/warehouse_new/'));
      video.media.preview = sanitizedPreview;
    }
  }
  db.footage.save(video);
});

db.footage.find({}).forEach(function(e) {
  if (e.text) {
    e.abouts = [];
    for (var item in e.text) {
      var tmp = {};
      tmp.lang = item;
      tmp.abouttext = e.text[item];
      e.abouts.push(tmp);
    }
    delete e.text;
    db.footage.save(e);
  }
});

function sanitizeOld(folder,defaultFolder) {
  return folder.
  replace("/_flxer/avatar/", defaultFolder).
  replace("/mainImg/", defaultFolder);
}
var check = {};
db.users.find({}).forEach(function(user) {
  var defaultFolder = "/"+user.creation_date.getFullYear()+"/"+("0" + (user.creation_date.getMonth() + 1)).slice(-2)+"/";
  if (sanitized != user.image.file) {
    var sanitized = sanitizeOld(user.image.file, defaultFolder);
    sanitized = sanitized.replace("/warehouse/", "/warehouse/users/");
    var sanitizedFolder = sanitized.substring(0, sanitized.lastIndexOf('/'));
    sanitizedFolder = sanitizedFolder.substring(sanitizedFolder.lastIndexOf('/'));
    if (sanitized != user.image.file) {
      printjson("cp "+user.image.file+" "+sanitized.substring(0, sanitized.lastIndexOf('/')).replace('/warehouse/','/warehouse_new/'));
      check[sanitizedFolder] = 1;
      //printjson(check);
      //printjson(" "+sanitized.substring(sanitized.lastIndexOf('/')).replace('/warehouse/','/warehouse_new/'));
      user.image.file = sanitized;
      db.users.save(user);
    }
  }
});

db.users.find({"image.file": {$exists: true}}).forEach(function(user) {
  user.image.file = user.image.file.replace('/warehouse/users_originals/', '/glacier/users_originals/');
  db.users.save(user);
});
db.events.find({"image.file": {$exists: true}}).forEach(function(user) {
  user.image.file = user.image.file.replace('/warehouse/events/', '/glacier/events_originals/');
  db.events.save(user);
});
db.performances.find({"image.file": {$exists: true}}).forEach(function(user) {
  user.image.file = user.image.file.replace('/warehouse/performances/', '/glacier/performances_originals/');
  db.performances.save(user);
});
db.footage.find({"media.preview": {$exists: true}}).forEach(function(user) {
  user.media.preview = user.media.preview.replace('/warehouse/', '/glacier/footage_previews/').replace('/preview_files', '').replace('/glacier/footage_previews/footage_preview/', '/glacier/footage_previews/');
  db.footage.save(user);
});
db.videos.find({"media.preview": {$exists: true}}).forEach(function(user) {
  user.media.preview = user.media.preview.replace('/warehouse/', '/glacier/videos_previews/').replace('/preview_files', '').replace('/glacier/videos_previews/videos_previews/', '/glacier/videos_previews/');
  db.videos.save(user);
});


function sanitizeOld(folder,defaultFolder) {
  return folder.
  replace("/_flxer/avatar/", defaultFolder).
  replace("/mainImg/", defaultFolder);
}
var check = {};
db.performances.find({}).forEach(function(performance) {
  var defaultFolder = "/"+performance.creation_date.getFullYear()+"/"+("0" + (performance.creation_date.getMonth() + 1)).slice(-2)+"/";
  if (sanitized != performance.image.file) {
    var sanitized = sanitizeOld(performance.image.file, defaultFolder);
    sanitized = sanitized.replace("/warehouse/", "/warehouse/performances/");
    var sanitizedFolder = sanitized.substring(0, sanitized.lastIndexOf('/'));
    sanitizedFolder = sanitizedFolder.substring(sanitizedFolder.lastIndexOf('/'));
    if (sanitized != performance.image.file) {
      printjson("cp "+performance.image.file+" "+sanitized.substring(0, sanitized.lastIndexOf('/')).replace('/warehouse/','/warehouse_new/'));
      check[sanitizedFolder] = 1;
      //printjson(check);
      //printjson(" "+sanitized.substring(sanitized.lastIndexOf('/')).replace('/warehouse/','/warehouse_new/'));
      performance.image.file = sanitized;
      db.performances.save(performance);
    }
  }
});

function sanitizeOld(folder,defaultFolder) {
  return folder.
  replace("/mainImg/", defaultFolder);
}
var check = {};
db.events.find({}).forEach(function(event) {
  var defaultFolder = "/"+event.creation_date.getFullYear()+"/"+("0" + (event.creation_date.getMonth() + 1)).slice(-2)+"/";
  if (sanitized != event.image.file) {
    var sanitized = sanitizeOld(event.image.file, defaultFolder);
    sanitized = sanitized.replace("/warehouse/", "/warehouse/events/");
    var sanitizedFolder = sanitized.substring(0, sanitized.lastIndexOf('/'));
    sanitizedFolder = sanitizedFolder.substring(sanitizedFolder.lastIndexOf('/'));
    if (sanitized != event.image.file) {
      printjson("cp "+event.image.file+" "+sanitized.substring(0, sanitized.lastIndexOf('/')).replace('/warehouse/','/warehouse_new/'));
      check[sanitizedFolder] = 1;
      //printjson(check);
      //printjson(" "+sanitized.substring(sanitized.lastIndexOf('/')).replace('/warehouse/','/warehouse_new/'));
      event.image.file = sanitized;
      db.events.save(event);
    }
  }
});


db.playlists.find({}).forEach(function(playlist) {
  //printjson(playlist.footage[0]);
  if (playlist.footage[0]) {
    db.footage.find({_id: playlist.footage[0]}).forEach(function(footage) {
      if (footage && footage.media && footage.media.file) {
        playlist.image.file = footage.media.file;
      } else {
      }
      printjson(playlist);
      db.playlists.save(playlist);
    });
  } else {
    db.playlists.remove(playlist);
  }
});

/*
db.performances.find({"files.file":{'$regex': '90x68/'}}).forEach(function(e) {
  e.files[0].file = e.files[0].file.replace('90x68/','');
  db.performances.save(e);
});
db.galleries.find({"files.file":{'$regex': '128x96/'}}).forEach(function(e) {
  e.files[0].file = e.files[0].file.replace('128x96/','');
  db.galleries.save(e);
});
*/
