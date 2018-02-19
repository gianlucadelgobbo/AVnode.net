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

var folders = {};
function sanitizeOld(folder,defaultFolder) {
  return folder.
  replace("/_photos/", defaultFolder).
  replace("/_videos/", defaultFolder).
  replace("/liveset/", defaultFolder).
  replace("/photos/", defaultFolder).
  replace("/_audios/", defaultFolder).
  replace("/hole/", defaultFolder).
  replace("/no_hole/", defaultFolder).
  replace("/_spot/", defaultFolder);
}
db.galleries.find({}).forEach(function(gallery) {
  conta = 0;
  var newMedias = [];
  var newVideos = [];
  var defaultFolder = "/"+gallery.creation_date.getFullYear()+"/"+("0" + (gallery.creation_date.getMonth() + 1)).slice(-2)+"/";
  gallery.medias.forEach(function(media) {
    const serverPath = media.file;
    const localFileNameExtension = serverPath.substring(serverPath.lastIndexOf('.') + 1);
    if (localFileNameExtension == "flv" || localFileNameExtension == "mp4") {
      const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1);
      const localPath = serverPath.substring(0, serverPath.lastIndexOf('/'));
      const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
      const localFileNameOriginalExtension = localFileName.substring(localFileName.lastIndexOf('_') + 1, localFileName.lastIndexOf('.'));
      let localFileNameWithoutOriginalExtension = localFileName.substring(0, localFileName.lastIndexOf('_'));
      if (localFileNameWithoutOriginalExtension.length>4) {
        localFileNameWithoutOriginalExtension = localFileNameExtension;
      } 
      const files = {
        file: media.file,
        previewFile: `${localPath}/preview_files/${localFileNameWithoutExtension}.png`,
        previewFileOld: `${localPath.replace('galleries/', '')}/preview_files/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`,
        originalFile: `${localPath}/original_video/${localFileNameWithoutOriginalExtension}.${localFileNameOriginalExtension}`,
        fileNew: sanitizeOld(media.file, defaultFolder).replace('/warehouse/galleries/', '/warehouse/videos/'),
        previewFileNew: sanitizeOld(`${localPath}/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`.replace('/warehouse/','/warehouse/videos_previews/').replace('/warehouse/videos_previews/galleries/','/warehouse/videos_previews/'), defaultFolder),
        originalFileNew: sanitizeOld(`${localPath}/${localFileNameWithoutOriginalExtension}.${localFileNameOriginalExtension}`.replace('/warehouse/','/warehouse/videos_originals/'), defaultFolder),
      };
      /*
      files.folderNew = files.fileNew.substring(0, files.fileNew.lastIndexOf('/'));
      files.folderNew = files.folderNew.substring(files.folderNew.lastIndexOf('/'));
      folders[files.folderNew.replace('/warehouse/','/warehouse_new/')] = 1;
      printjson(folders);
      */
      if (localFileNameExtension == "flv") {
        printjson("mv "+files.file.replace('/warehouse/','/warehouse_new/')+" "+files.fileNew.substring(0, files.fileNew.lastIndexOf('/')).replace('/warehouse/','/warehouse_new/'));
        printjson("mv "+files.previewFileOld+" "+files.previewFileNew.replace('/warehouse/','/warehouse_new/'));
      } else {
        printjson("cp "+files.file+" "+files.fileNew.substring(0, files.fileNew.lastIndexOf('/')).replace('/warehouse/','/warehouse_new/'));
        printjson("mv "+files.previewFile+" "+files.previewFileNew.substring(0, files.previewFileNew.lastIndexOf('/')).replace('/warehouse/','/warehouse_new/'));
        printjson("mv "+files.originalFile+" "+files.originalFileNew.substring(0, files.originalFileNew.lastIndexOf('/')).replace('/warehouse/','/warehouse_new/'));
      }
      if (conta == 0) gallery.image.file = files.fileNew;
      media.file = files.fileNew;
      media.preview = files.previewFileNew;
      if (localFileNameExtension == "mp4") media.original = files.originalFileNew;
      let video = gallery;
      video.media = media;
      newVideos.push(video);
    } else {
      const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1);
      const localPath = serverPath.substring(0, serverPath.lastIndexOf('/'));
      const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
      const localFileNameOriginalExtension = localFileName.substring(localFileName.lastIndexOf('_') + 1, localFileName.lastIndexOf('.'));
      const localFileNameWithoutOriginalExtension = localFileName.substring(0, localFileName.lastIndexOf('_'));
      const files = {
        file: media.file,
        fileNew: sanitizeOld(media.file.replace('/warehouse/', '/warehouse/galleries/'), defaultFolder)
      };
      /*
      files.folderNew = files.fileNew.substring(0, files.fileNew.lastIndexOf('/'));
      files.folderNew = files.folderNew.substring(files.folderNew.lastIndexOf('/'));
      folders[files.folderNew.replace('/warehouse/','/warehouse_new/')] = 1;
      printjson(folders);
      */
      //printjson("cp "+files.file+" "+files.fileNew.substring(0, files.fileNew.lastIndexOf('/')).replace('/warehouse/','/warehouse_new/'));
      if (conta == 0) gallery.image.file = files.fileNew;
      //media.file = files.fileNew;
      newMedias.push(media);
    }

    conta++;
    if (conta == gallery.medias.length) {
      if (gallery.medias.length != newMedias.length) {
        if (!gallery.text || !Object.keys(gallery.text).length) delete gallery.text;
        delete gallery.stats.video;
        //delete gallery.media;
        gallery.stats.img = newMedias.length;
        gallery.medias = newMedias;
        //printjson('SAVEEEEEE GALLERY');
        //printjson(gallery);
        db.galleries.save(gallery);
      }
      newVideos.forEach(function(video) {
        if (video.stats.img) delete video.stats.img;
        if (!video.text || !Object.keys(video.text).length) delete video.text;
        delete video.medias;
        delete video.image;
        delete video._id;
        //printjson('SAVEEEEEE VIDEO!!!');
        //printjson(video);
        db.videos.save(video);
      });
    }
  });
});

db.galleries.remove({"medias.0": {$exists: false}});

db.videos.find({}).forEach(function(video) {
  //var res = db.performances.find({"galleries": gallery._id}).toArray();
  var conta = 0;
  if (video.performances) {
    video.performances.forEach(function(performance) {
      db.performances.find({_id:performance}).forEach(function(perf) {
        if (!perf.videos) perf.videos = [];
        perf.videos.push(video._id);
        printjson(perf.videos);
        db.performances.save(perf);
      });
    });  
  }
});

db.videos.find({}).forEach(function(video) {
  //var res = db.performances.find({"galleries": gallery._id}).toArray();
  var conta = 0;
  if (video.performances) {
    video.events.forEach(function(event) {
      db.events.find({_id:event}).forEach(function(e) {
        if (!e.videos) e.videos = [];
        e.videos.push(video._id);
        printjson(e.videos);
        db.events.save(e);
      });
    });
  }
});

function sanitizeOld(folder,defaultFolder) {
  return folder.
  replace("/_photos/", defaultFolder).
  replace("/_videos/", defaultFolder).
  replace("/liveset/", defaultFolder).
  replace("/photos/", defaultFolder).
  replace("/_audios/", defaultFolder).
  replace("/hole/", defaultFolder).
  replace("/no_hole/", defaultFolder).
  replace("/_spot/", defaultFolder);
}
db.videos.find({}).forEach(function(video) {
  var defaultFolder = "/"+video.creation_date.getFullYear()+"/"+("0" + (video.creation_date.getMonth() + 1)).slice(-2)+"/";
  var sanitized = sanitizeOld(video.media.file, defaultFolder);
  sanitized = sanitized.replace("/warehouse/", "/warehouse/videos/");
  if (sanitized != video.media.file) {
    printjson("cp "+video.media.file+" "+sanitized.substring(0, sanitized.lastIndexOf('/')).replace('/warehouse/','/warehouse_new/'));
    video.media.file = sanitized;
    db.videos.save(video);
  }
});


db.videos.find({}).forEach(function(video) {
  var search = video.media.file;
  var res = db.tvshows.find({"media.file":search}).toArray();
  printjson(res.length);
  var conta = 0;
  if (res.length) {
    res.forEach(function(e) {
      if (!e.categories) e.categories = [];
      e.categories = e.categories.concat(video.categories);
      e.programming = video.programming;
      e.stats.visits+= video.stats.visits;
      e.stats.likes+= video.stats.likes;
      e.stats.visits+= video.stats.visits;
      delete e.stats.img;
      if (video.text) {
        e.abouts = [];
        for (var item in video.text) {
          var tmp = {};
          tmp.lang = item;
          tmp.abouttext = video.text[item];
          e.abouts.push(tmp);
        }
      }
      for (var a=0; a<video.users.length; a++) {
        var add = true;
        for (var b=0; b<e.users.length; b++) {
          if(e.users[b].toString()==video.users[a].toString()) {
            add = false;
          }
        }
        if(add) {
          e.users.push(video.users[a]);
        }
      }
    
      //printjson(e);
      for(var item in video) {
        /*
        printjson(item);
        printjson(video[item]);
        printjson(e[item]);
        printjson("------------------------");
        */
      }
      //db.videos.save(e);
    });  
  } else {
    if (video.text) {
      video.abouts = [];
      for (var item in video.text) {
        var tmp = {};
        tmp.lang = item;
        tmp.abouttext = video.text[item];
        video.abouts.push(tmp);
      }
      delete video.text;
    }
    db.videos.save(video);
    printjson(video);
  }
});

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
