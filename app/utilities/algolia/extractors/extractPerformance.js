// 📁 app/utilities/algolia/extractors/extractPerformance.js

import { extractMultilangText } from '../utils/extractMultilangText.js';

export const expandPerformanceToRecord = (performanceDoc, langs = ['en']) => {
  const performance = performanceDoc.toObject({ virtuals: true, getters: true });

  const users = (performance.users || [])
    .filter(u => u && u._id)
    .map(u => ({
      userId: u._id.toString(),
      stagename: u.stagename,
      role: 'performer'
    }));

  const videos = (performance.videos || [])
    .filter(v => v && v._id)
    .map(v => ({
      videoId: v._id.toString(),
      title: v.title
    }));

  const galleries = (performance.galleries || [])
    .filter(g => g && g._id)
    .map(g => ({
      galleryId: g._id.toString(),
      title: g.title
    }));

  // semplificato: solo eventId e title, gli altri dati sono nei record events
  const events = (performance.bookings || [])
    .map(b => b.event)
    .filter(e => e && e._id)
    .map(e => ({
      eventId: e._id.toString(),
      title: e.title
    }));

  const abouts_by_lang = {};
  langs.forEach(lang => {
    abouts_by_lang[`about_${lang}`] = extractMultilangText(performance.abouts, lang);
  });

  const record = {
    objectID: performance._id.toString(),
    collection: 'performances',
    type: 'performance',

    title: performance.title,
    slug: performance.slug,
    duration: parseFloat(performance.duration),
    genre: performance.genre?.name || null,
    tecnique: performance.tecnique?.name || null,

    categories: performance.categories?.map(c => c.name) || [],
    performance_type: performance.type?.name || null,

    image_url: performance.imageFormats?.medium || null,
    createdAt: performance.createdAt,
    updatedAt: performance.updatedAt,

    users,
    videos,
    galleries,
    events,

    visits: performance.stats?.visits || 0,
    likes: performance.stats?.likes || 0,

    ...abouts_by_lang
  };

  Object.keys(record).forEach(key => (record[key] == null) && delete record[key]);
  return record;
};
