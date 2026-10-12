import config from 'getconfig';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
//import indexPlugin from '../utilities/elasticsearch/Footage.js';
import helpers from '../utilities/helpers.js';

import About from './shared/About.js';
import Media from './shared/Media.js';

const adminsez = "footage";

const footageSchema = new Schema({
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
});

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

footageSchema.virtual("about").get(function() {
  const __ = (this.$locals && this.$locals.__) || ((text) => text);
  const locale = (this.$locals && this.$locals.locale) || "en";
  let about = __("Text is missing");
  let aboutA = [];
  if (this.abouts && this.abouts.length) {
    aboutA = this.abouts.filter(item => item.lang === locale);
    if (aboutA.length && aboutA[0].abouttext) {
      about = aboutA[0].abouttext.replace(/\r\n/g, "<br />");
    } else {
      aboutA = this.abouts.filter(item => item.lang === "en");
      if (aboutA.length && aboutA[0].abouttext) {
        about = "[Text available only in English] "+aboutA[0].abouttext.replace(/\r\n/g, "<br />");
      }
    }
    about = about.replace(new RegExp(/\n/gi), " <br />");

    about = helpers.linkify(about);

    return about;
  }
});

footageSchema.virtual("description").get(function() {
  if (this.abouts && this.abouts.length) {
    return helpers.makeDescription(this.abouts, this.$locals);
  }
});

/* footageSchema.pre("remove", function(next) {
  const footage = this;
  footage.model("User").updateMany({ $pull: { footage: footage._id } }, next);
  footage.model("Crew").updateMany({ $pull: { footage: footage._id } }, next);
}); */

//footageSchema.plugin(indexPlugin());

const Footage = mongoose.model("Footage", footageSchema);

export default Footage;
