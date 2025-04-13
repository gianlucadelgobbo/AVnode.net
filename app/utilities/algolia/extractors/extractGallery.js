// 📁 app/utilities/algolia/extractors/extractGallery.js

import { extractMultilangText } from '../utils/extractMultilangText.js';

export const expandGalleryToRecord = (galleryDoc, langs = ['en']) => {
  const gallery = galleryDoc.toObject({ virtuals: true, getters: true });

  const users = (gallery.users || [])
    .filter(u => u && u._id)
    .map(u => ({
      userId: u._id.toString(),
      stagename: u.stagename,
      role: 'author'
    }));

  const performances = (gallery.performances || [])
    .filter(p => p && p._id)
    .map(p => ({
      performanceId: p._id.toString(),
      title: p.title
    }));

  const events = (gallery.events || [])
    .filter(e => e && e._id)
    .map(e => ({
      eventId: e._id.toString(),
      title: e.title
    }));

  const abouts_by_lang = {};
  langs.forEach(lang => {
    let text = extractMultilangText(gallery.abouts, lang, langs);
    if (typeof text === 'string' && text.length > 2000) {
      text = text.slice(0, 2000) + '...';
    }
    abouts_by_lang[`about_${lang}`] = text;
  });

  const record = {
    objectID: gallery._id.toString(),
    collection: 'galleries',
    type: 'gallery',

    title: gallery.title,
    slug: gallery.slug,
    createdAt: gallery.createdAt,
    updatedAt: gallery.updatedAt,
    image_url: gallery.imageFormats?.medium || null,

    users,
    performances,
    events,

    visits: gallery.stats?.visits || 0,
    likes: gallery.stats?.likes || 0,

    ...abouts_by_lang
  };

  Object.keys(record).forEach(key => (record[key] == null) && delete record[key]);
  return record;
};
