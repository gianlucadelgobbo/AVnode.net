// 📁 app/utilities/algolia/extractors/extractVideo.js

import { extractMultilangText } from '../utils/extractMultilangText.js';

export const expandVideoToRecord = (videoDoc, langs = ['en']) => {
  const video = videoDoc.toObject({ virtuals: true, getters: true });

  const users = (video.users || [])
    .filter(u => u && u._id)
    .map(u => ({
      userId: u._id.toString(),
      stagename: u.stagename,
      role: 'author'
    }));

  const performances = (video.performances || [])
    .filter(p => p && p._id)
    .map(p => ({
      performanceId: p._id.toString(),
      title: p.title
    }));

  const events = (video.events || [])
    .filter(e => e && e._id)
    .map(e => ({
      eventId: e._id.toString(),
      title: e.title
    }));

  const abouts_by_lang = {};
  langs.forEach(lang => {
    let text = extractMultilangText(video.abouts, lang, langs);
    if (typeof text === 'string' && text.length > 2000) {
      text = text.slice(0, 2000) + '...';
    }
    abouts_by_lang[`about_${lang}`] = text;
  });

  const record = {
    objectID: video._id.toString(),
    collection: 'videos',
    type: 'video',

    title: video.title,
    slug: video.slug,
    createdAt: video.createdAt,
    updatedAt: video.updatedAt,
    image_url: video.imageFormats?.medium || null,
    duration: video.duration ? parseFloat(video.duration) : null,
    programming: !!video.programming && video.programming.length > 0,
    url: video.media?.url || null,
    categories: video.categories?.map(c => c.name) || [],

    users,
    performances,
    events,

    visits: video.stats?.visits || 0,
    likes: video.stats?.likes || 0,

    ...abouts_by_lang
  };

  Object.keys(record).forEach(key => (record[key] == null) && delete record[key]);
  return record;
};
