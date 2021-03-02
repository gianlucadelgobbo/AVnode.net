const config = require('getconfig');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const helper = require('../utilities/helper');

//const indexPlugin = require('../utilities/elasticsearch/News');

const About = require('./shared/About');
const Link = require('./shared/Link');
const MediaImage = require('./shared/MediaImage');
const Media = require('./shared/Media');

const adminsez = 'news';

const newsSchema = new Schema({
  old_id : String,

  createdAt: Date,
  title: { type: String, trim: true, required: true, maxlength: 100 },
  slug: { type: String, unique: true, trim: true, required: true, minlength: 3, maxlength: 100,
    validate: [(slug) => {
      var re = /^[a-z0-9-_]+$/;
      return re.test(slug)
    }, 'URL_IS_NOT_VALID']
  },
  is_public: { type: Boolean, default: false },
  image: MediaImage,
  media: Media,
  abouts: [About],
  stats: {
    visits: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  },
  web: [Link],
  social: [Link],

  users: [{ type : Schema.ObjectId, ref : 'User' }],
  categories: [{ type : Schema.ObjectId, ref : 'Category' }]
}, {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

/* newsSchema.virtual('about').get(function (req) {
  let about = __('Text is missing');
  let aboutA = [];
  if (this.abouts && this.abouts.length) {
    aboutA = this.abouts.filter(item => item.lang === global.getLocale());
    if (aboutA.length && aboutA[0].abouttext) {
      about = aboutA[0].abouttext.replace(/\r\n/g, '<br />');
    } else {
      aboutA = this.abouts.filter(item => item.lang === "en");
      if (aboutA.length && aboutA[0].abouttext) {
        about = aboutA[0].abouttext.replace(/\r\n/g, '<br />');
      }
    }
    return about;
  }
}); */
newsSchema.virtual('about').get(function (req) {
  let about = __('Text is missing');
  let aboutA = [];
  if (this.abouts && this.abouts.length) {
    aboutA = this.abouts.filter(item => item.lang === global.getLocale());
    if (aboutA.length && aboutA[0].abouttext) {
      about = aboutA[0].abouttext.replace(/\r\n/g, '<br />');
    } else {
      aboutA = this.abouts.filter(item => item.lang === "en");
      if (aboutA.length && aboutA[0].abouttext) {
        about = "["+__("Text available only in English")+"] "+aboutA[0].abouttext.replace(/\r\n/g, '<br />');
      }
    }
    str = about;
    str = str.replace(new RegExp(/\n/gi)," <br />"); 

    str = helper.linkify(str);

    /* var options = {
      TruncateLength: 100,
      TruncateBy : "words",
      Strict : true,
      StripHTML : false,
    };
    str = truncatise(str, options); */
  
    return str;
  }
});

newsSchema.virtual('description').get(function (req) {
  if (this.abouts && this.abouts.length) {
    return helper.makeDescription(this.abouts);
  }
});

newsSchema.virtual('excerpt').get(function (req) {
  let about = __('Text is missing');
  let aboutA = [];
  if (this.abouts && this.abouts.length) {
    aboutA = this.abouts.filter(item => item.lang === global.getLocale());
    if (aboutA.length && aboutA[0].abouttext) {
      about = aboutA[0].abouttext.replace(/\r\n/g, '<br />');
    } else {
      aboutA = this.abouts.filter(item => item.lang === "en");
      if (aboutA.length && aboutA[0].abouttext) {
        about = "["+__("Text available only in English")+"] "+aboutA[0].abouttext.replace(/\r\n/g, '<br />');
      }
    }
  }
  let excerpt = '';
  aboutA = about.replace(/<[^>]+>/g, '').split(' ');
  for (const item in aboutA) if ((excerpt+" "+aboutA[item]).length<160) excerpt+= aboutA[item]+" ";
  return excerpt.trim();
});

// Return thumbnail
newsSchema.virtual('imageFormats').get(function () {
  let imageFormats = {};
  for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
    imageFormats[format] = process.env.WAREHOUSE+config.cpanel[adminsez].forms.public.components.image.config.sizes[format].default;
  }
  if (this.image && this.image.file) {
    const serverPath = this.image.file;
    const localFileName = serverPath.substring(serverPath.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
    const localPath = serverPath.substring(0, serverPath.lastIndexOf('/')).replace('/glacier/news_originals/', '/warehouse/news/'); // /warehouse/2017/03
    const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
    const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
    for(let format in config.cpanel[adminsez].forms.public.components.image.config.sizes) {
      imageFormats[format] = process.env.WAREHOUSE+localPath+"/"+config.cpanel[adminsez].forms.public.components.image.config.sizes[format].folder+"/"+localFileNameWithoutExtension+"_"+localFileNameExtension+".jpg";
    }
  }
  return imageFormats;
});

newsSchema.virtual('creation_dateFormatted').get(function () {
  const lang = global.getLocale();
  return moment(this.createdAt).format(config.dateFormat[lang].weekdaydaymonthyear);
});

/* newsSchema.pre('remove', function(next) {
  const news = this;
  news.model('User').updateMany(
    { $pull: { news: news._id } },
    next
  );
  news.model('Crew').updateMany(
    { $pull: { news: news._id } },
    next
  );
}); */


//newsSchema.plugin(indexPlugin());

const News = mongoose.model('News', newsSchema);

module.exports = News;
