//mongodump -d avnode --out /data/dumps/avnode_pure_import

db.playlists.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);
db.footage.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);

db.categories.findOne({"ancestors.0": {$exists: true}});
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



db.footage.findOne({"file.file": { $exists: false}});
db.footage.deleteMany({"file.file": { $exists: false}});
db.footage.findOne({"file.file": { $exists: true}, "file.preview": { $exists: true}, "playlists.0": { $exists: true}});
var folders = {};
function sanitizeOld(folder,defaultFolder) {
  return folder.
  replace("/_flxer/library/hole/", defaultFolder).
  replace("/_flxer/photos/", defaultFolder).
  replace("/_flxer/library/no_hole/", defaultFolder).
  replace("/_flxer/library/koncepts/", defaultFolder);
}
db.footage.find({}).forEach(function(e) {
//db.footage.find({"file.file": { $exists: true}, "file.preview": { $exists: true}, "playlists.0": { $exists: true}}).forEach(function(e) {
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
    if (extoriginal == e.media.originalflxer) {
      delete e.media.originalflxer;
    } else {
      e.media.originalflxer = e.media.originalflxer.substring(0, e.media.originalflxer.lastIndexOf('_')) + "." + extoriginal;
      e.media.original = e.media.originalflxer.replace('/warehouse/', '/glacier/footage_originals/').replace('/original_video/', '/');
      e.media.original = sanitizeOld(e.media.original, defaultFolder)
      printjson("mv -n " + e.media.originalflxer.replace('/warehouse/', '/warehouse_old/') + " " + e.media.original);
    }
  }
  if (e.media.preview) {
    e.media.previewflxer = e.media.preview;
    e.media.preview = e.media.previewflxer.replace('/warehouse/', '/glacier/footage_previews/').replace('/preview_files/', '/');
    e.media.preview = sanitizeOld(e.media.preview, defaultFolder)
    printjson("mv -n " + e.media.previewflxer.replace('/warehouse/', '/warehouse_old/') + " " + e.media.preview);
  }
  e.media.file = e.media.file.replace('/warehouse/', '/warehouse/footage/');
  e.media.file = sanitizeOld(e.media.file, defaultFolder);
  printjson("cp -n " + e.media.fileflxer.replace('/warehouse/', '/warehouse_old/') + " " + e.media.file);

  folders[e.media.file.substring(0, e.media.file.lastIndexOf('/'))] = 1;
  //printjson(e);
  db.footage.save(e);
});
printjson(folders);

//db.footage.findOne({"media.file": { $exists: true}, "media.preview": { $exists: true}, "playlists.0": { $exists: true}})
