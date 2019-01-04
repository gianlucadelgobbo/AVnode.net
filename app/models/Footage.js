const config = require("getconfig");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const indexPlugin = require("../utilities/elasticsearch/Footage");
const helper = require("../utilities/helper");

const About = require("./shared/About");
const Media = require("./shared/Media");

const adminsez = "footage";

const footageSchema = new Schema(
  {
    old_id: String,
    creation_date: Date,
    slug: { type: String, unique: true },
    title: String,
    is_public: { type: Boolean, default: false },
    media: Media,
    abouts: [About],
    stats: {},
    users: [{ type: Schema.ObjectId, ref: "UserShow" }],
    playlists: [{ type: Schema.ObjectId, ref: "Playlist" }],
    tags: [
      {
        old_id: String,
        tag: String,
        tot: Number,
        required: Boolean,
        exclusive: Boolean
      }
    ]
  },
  {
    collection: "footage",
    timestamps: true,
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

// Return thumbnail
footageSchema.virtual("imageFormats").get(function() {
  let imageFormats = {};
  /*if (this.media.encoded) {
    for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
      imageFormats[format] = config.cpanel[adminsez].forms.public.components.media.config.sizes[format].default;
    }  */
  //} else {
  for (let format in config.cpanel[adminsez].forms.public.components.media
    .config.sizes) {
    imageFormats[format] =
      config.cpanel[adminsez].forms.public.components.media.config.sizes[
        format
      ].tobeencoded;
    console.log(
      config.cpanel[adminsez].forms.public.components.media.config.sizes[format]
    );
    //}
  }
  if (this.media && this.media.preview) {
    const serverPath = this.media.preview;
    const localFileName = serverPath.substring(serverPath.lastIndexOf("/") + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath
      .substring(0, serverPath.lastIndexOf("/"))
      .replace(
        "/glacier/footage_previews/",
        process.env.WAREHOUSE + "/warehouse/footage_previews/"
      ); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(
      0,
      localFileName.lastIndexOf(".")
    );
    const localFileNameExtension = localFileName.substring(
      localFileName.lastIndexOf(".") + 1
    );
    // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
    for (let format in config.cpanel[adminsez].forms.public.components.media
      .config.sizes) {
      imageFormats[format] = `${localPath}/${
        config.cpanel[adminsez].forms.public.components.media.config.sizes[
          format
        ].folder
      }/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
    }
  }
  return imageFormats;
});

footageSchema.virtual("about").get(function(req) {
  let about = __("Text is missing");
  let aboutA = [];
  if (this.abouts && this.abouts.length) {
    aboutA = this.abouts.filter(item => item.lang === global.getLocale());
    if (aboutA.length && aboutA[0].abouttext) {
      about = aboutA[0].abouttext.replace(/\r\n/g, "<br />");
    } else {
      aboutA = this.abouts.filter(item => item.lang === config.defaultLocale);
      if (aboutA.length && aboutA[0].abouttext) {
        about = aboutA[0].abouttext.replace(/\r\n/g, "<br />");
      }
    }
    about = about.replace(new RegExp(/\n/gi), " <br />");

    about = helper.linkify(about);

    return about;
  }
});

footageSchema.virtual("description").get(function(req) {
  let about = __("Text is missing");
  let aboutA = [];
  if (this.abouts && this.abouts.length) {
    aboutA = this.abouts.filter(item => item.lang === global.getLocale());
    if (aboutA.length && aboutA[0].abouttext) {
      about = aboutA[0].abouttext.replace(/\r\n/g, "<br />");
    } else {
      aboutA = this.abouts.filter(item => item.lang === config.defaultLocale);
      if (aboutA.length && aboutA[0].abouttext) {
        about = aboutA[0].abouttext.replace(/\r\n/g, "<br />");
      }
    }
    about = about
      .replace(new RegExp(/<(?:.|\n)*?>/gm), "")
      .trim()
      .replace(/  /g, " ");

    descriptionA = about.split(" ");
    let descriptionShort = "";
    for (let item in descriptionA)
      if ((descriptionShort + " " + descriptionA[item]).trim().length < 300)
        descriptionShort += descriptionA[item] + " ";
    descriptionShort = descriptionShort.trim();
    if (descriptionShort.length < about.length) descriptionShort + "...";
    return descriptionShort;
  }
});

/*
footageSchema.virtual('teaserImageFormats').get(function () {
  let teaserImageFormats = {};
  //console.log(config.cpanel[adminsez].sizes.teaserImage);
  if (this.teaserImage && this.teaserImage.file) {
    for(let format in config.cpanel[adminsez].media.teaserImage.sizes) {
      teaserImageFormats[format] = config.cpanel[adminsez].media.teaserImage.sizes[format].default;
    }
    const serverPath = this.teaserImage.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/warehouse/', process.env.WAREHOUSE+'/warehouse/'); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
    for(let format in config.cpanel[adminsez].media.teaserImage.sizes) {
      teaserImageFormats[format] = `${localPath}/${config.cpanel[adminsez].media.teaserImage.sizes[format].folder}/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
    }
  } else {
    for(let teaserFormat in config.cpanel[adminsez].media.teaserImage.sizes) {
      teaserImageFormats[teaserFormat] = `${config.cpanel[adminsez].media.teaserImage.sizes[teaserFormat].default}`;
    }
  }
  return teaserImageFormats;
});

footageSchema.virtual('editUrl').get(function () {
  return `/admin/footage/public/${this.slug}`;
});

footageSchema.virtual('publicUrl').get(function () {
  return `/footage/${this.slug}`;
});
*/

footageSchema.pre("remove", function(next) {
  const footage = this;
  footage.model("User").updateMany({ $pull: { footage: footage._id } }, next);
  footage.model("Crew").updateMany({ $pull: { footage: footage._id } }, next);
});

/*
// FIXME: Rename in performer?
footageSchema.virtual('performers', {
  ref: 'User',
  localField: '_id',
  foreignField: 'footage'
});

footageSchema.virtual('crews', {
  ref: 'User',
  localField: '_id',
  foreignField: 'footage'
});
// return thumbnail
footageSchema.virtual('squareThumbnailUrl').get(function () {
  let squareThumbnailUrl = '/images/profile-default.svg';

  if (this.file && this.file.file) {
    const serverPath = this.file.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(1, serverPath.lastIndexOf('/')); // warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
    squareThumbnailUrl = `${process.env.WAREHOUSE}/${localPath}/55x55/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
  }
  return squareThumbnailUrl;
});
// return card img
footageSchema.virtual('cardUrl').get(function () {
  let cardUrl = '/images/profile-default.svg';

  if (this.file && this.file.file) {
    const serverPath = this.file.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(1, serverPath.lastIndexOf('/')); // warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    // console.log('localFileName:' + localFileName + ' localPath:' + localPath + ' localFileNameWithoutExtension:' + localFileNameWithoutExtension);
    cardUrl = `${process.env.WAREHOUSE}/${localPath}/400x300/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;
  }
  return cardUrl;
});

// return original image
footageSchema.virtual('imageUrl').get(function () {
  let image = '/images/profile-default.svg';
  if (this.media) {
    image = `/storage/${this.media}/512/200`;
  }
  if (this.file && this.file.file) {
    image = `${process.env.WAREHOUSE}${this.file.file}`;
  }
  // console.log(image);
  return image;
});
*/

footageSchema.plugin(indexPlugin());

const Footage = mongoose.model("Footage", footageSchema);

module.exports = Footage;
