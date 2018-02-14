//mongorestore --drop -d avnode_bruce /data/dumps/avnode_bruce_fixed/avnode_bruce
//mongodump -d avnode_bruce --out /data/dumps/avnode_bruce_fixed
//rsync -a /space/PhpMysql2015/sites/flxer/warehouse/ /sites/avnode/warehouse


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
    if (localFileNameExtension == "mp4") {
      const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1);
      const localPath = serverPath.substring(0, serverPath.lastIndexOf('/'));
      const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
      const localFileNameOriginalExtension = localFileName.substring(localFileName.lastIndexOf('_') + 1, localFileName.lastIndexOf('.'));
      const localFileNameWithoutOriginalExtension = localFileName.substring(0, localFileName.lastIndexOf('_'));
      const files = {
        file: media.file,
        previewFile: `${localPath}/preview_files/${localFileNameWithoutExtension}.png`,
        originalFile: `${localPath}/original_video/${localFileNameWithoutOriginalExtension}.${localFileNameOriginalExtension}`,
        fileNew: sanitizeOld(media.file.replace('/warehouse/', '/warehouse/videos/'), defaultFolder),
        previewFileNew: sanitizeOld(`${localPath}/${localFileNameWithoutExtension}.png`.replace('/warehouse/','/warehouse/videos_previews/'), defaultFolder),
        originalFileNew: sanitizeOld(`${localPath}/${localFileNameWithoutOriginalExtension}.${localFileNameOriginalExtension}`.replace('/warehouse/','/warehouse/videos_originals/'), defaultFolder),
      };
      /*
      files.folderNew = files.fileNew.substring(0, files.fileNew.lastIndexOf('/'));
      files.folderNew = files.folderNew.substring(files.folderNew.lastIndexOf('/'));
      folders[files.folderNew.replace('/warehouse/','/warehouse_new/')] = 1;
      printjson(folders);
      */
      printjson("cp "+files.file+" "+files.fileNew.substring(0, files.fileNew.lastIndexOf('/')).replace('/warehouse/','/warehouse_new/'));
      printjson("mv "+files.previewFile+" "+files.previewFileNew.substring(0, files.previewFileNew.lastIndexOf('/')).replace('/warehouse/','/warehouse_new/'));
      printjson("mv "+files.originalFile+" "+files.originalFileNew.substring(0, files.originalFileNew.lastIndexOf('/')).replace('/warehouse/','/warehouse_new/'));
      if (conta == 0) gallery.image.file = files.fileNew;
      media.file = files.fileNew;
      var video = gallery;
      video.media = media;
      newVideos.push(video);
    } else {
      newMedias.push(media);
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
      printjson("cp "+files.file+" "+files.fileNew.substring(0, files.fileNew.lastIndexOf('/')).replace('/warehouse/','/warehouse_new/'));
      if (conta == 0) gallery.image.file = files.fileNew;
      media.file = files.fileNew;      
    }

    conta++;
    if (conta == gallery.medias.length) {
      if (!gallery.text || !Object.keys(gallery.text).length) delete gallery.text;
      delete gallery.stats.video;
      gallery.stats.img = newMedias.length;
      gallery.medias = newMedias;
      printjson('SAVEEEEEE GALLERY');
      //printjson(gallery);
      db.galleries.save(gallery);
      newVideos.forEach(function(video) {
        if (video.stats.img) delete video.stats.img;
        if (!video.text || !Object.keys(video.text).length) delete video.text;
        delete video.medias;
        delete video.image;
        delete video._id;
        printjson('SAVEEEEEE VIDEO!!!');
        //printjson(video);
        db.videos.save(video);
      });
    }
  });
});

db.videos.find({}).forEach(function(video) {
  //var res = db.performances.find({"galleries": gallery._id}).toArray();
  var conta = 0;
  video.performances.forEach(function(performance) {
    db.performances.find({_id:performance}).forEach(function(perf) {
      if (!perf.videos) perf.videos = [];
      perf.videos.push(video._id);
      printjson(perf.videos);
      db.performances.save(perf);
    });
  });
});

db.videos.find({}).forEach(function(video) {
  //var res = db.performances.find({"galleries": gallery._id}).toArray();
  var conta = 0;
  video.events.forEach(function(event) {
    db.events.find({_id:event}).forEach(function(e) {
      if (!e.videos) e.videos = [];
      e.videos.push(video._id);
      printjson(e.videos);
      db.events.save(e);
    });
  });
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
  var res = db.videos.find({"media.file":search}).toArray();
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
