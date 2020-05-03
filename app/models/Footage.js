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
    createdAt: Date,
    title: { type: String, trim: true, required: true, maxlength: 100 },
    slug: { type: String, unique: true, trim: true, required: true, minlength: 3, maxlength: 100,
      validate: [(slug) => {
        var re = /^[a-z0-9-_]+$/;
        return re.test(slug)
      }, 'URL_IS_NOT_VALID']
    },
    is_public: { type: Boolean, default: false },
    media: Media,
    abouts: [About],
    stats: {
      visits: { type: Number, default: 0 },
      likes: { type: Number, default: 0 }
    },
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
  if (this.media && (!this.media.encoded || this.media.encoded === 0)) {
    for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
      imageFormats[format] = process.env.WAREHOUSE + config.cpanel[adminsez].forms.public.components.media.config.sizes[format].tobeencoded;
    }  
  } else {
    for(let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
      imageFormats[format] = process.env.WAREHOUSE + config.cpanel[adminsez].forms.public.components.media.config.sizes[format].default;
    }  
  }
  if (this.media && this.media.preview) {
    const serverPath = this.media.preview;
    const localFileName = serverPath.substring(serverPath.lastIndexOf("/") + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(0, serverPath.lastIndexOf("/")).replace("/glacier/footage_previews/", "/warehouse/footage_previews/"); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf("."));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf(".") + 1);
    for (let format in config.cpanel[adminsez].forms.public.components.media.config.sizes) {
      imageFormats[format] = process.env.WAREHOUSE + localPath+"/"+config.cpanel[adminsez].forms.public.components.media.config.sizes[format].folder+"/"+localFileNameWithoutExtension+"_"+localFileNameExtension+".jpg";
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

/* footageSchema.pre("remove", function(next) {
  const footage = this;
  footage.model("User").updateMany({ $pull: { footage: footage._id } }, next);
  footage.model("Crew").updateMany({ $pull: { footage: footage._id } }, next);
}); */

//footageSchema.plugin(indexPlugin());

const Footage = mongoose.model("Footage", footageSchema);

module.exports = Footage;
