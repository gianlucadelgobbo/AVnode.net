// 📁 app/utilities/algolia/extractors/extractUser.js

import { extractMultilangText } from '../utils/extractMultilangText.js';

export const expandUserToRecord = (userDoc, langs = ['en']) => {
  const user = userDoc.toObject({ virtuals: true, getters: true });

  const performances = (user.performances || [])
    .filter(p => p && p._id)
    .map(p => ({ id: p._id.toString(), title: p.title }));

  const events = (user.events || [])
    .filter(e => e && e._id)
    .map(e => ({ id: e._id.toString(), title: e.title }));

  const galleries = (user.galleries || [])
    .filter(g => g && g._id)
    .map(g => ({ id: g._id.toString(), title: g.title }));

  const videos = (user.videos || [])
    .filter(v => v && v._id)
    .map(v => ({ id: v._id.toString(), title: v.title }));

  const partnerships = (user.partnerships || [])
    .filter(p => p && p._id)
    .map(p => ({ id: p._id.toString(), title: p.name }));

  const abouts_by_lang = {};
  langs.forEach(lang => {
    let text = extractMultilangText(user.abouts, lang, langs);
    if (typeof text === 'string' && text.length > 2000) {
      text = text.slice(0, 2000) + '...';
    }
    abouts_by_lang[`about_${lang}`] = text;
  });

  const record = {
    objectID: user._id.toString(),
    collection: 'users',
    type: 'user',

    stagename: user.stagename,
    slug: user.slug,
    is_crew: user.is_crew || false,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,

    nationality: user.nationality || null,
    gender: user.gender || null,
    birthyear: user.birthyear || null,

    performances,
    events,
    galleries,
    videos,
    partnerships,

    addresses: (user.addresses || []).map(addr => ({
      country: addr.country || null,
      region: addr.region || null,
      locality: addr.locality || null,
      geo: addr.location?.geometry || null
    })),

    ...abouts_by_lang
  };

  if (user.is_crew) {
    record.members = (user.members || [])
      .filter(m => m && m._id)
      .map(m => ({
        id: m._id.toString(),
        stagename: m.stagename
      }));
  } else {
    record.name = user.name || null;
    record.surname = user.surname || null;
    record.crews = (user.crews || []).map(c => ({
      id: c._id.toString(),
      stagename: c.stagename
    }));
  }

  Object.keys(record).forEach(key => (record[key] == null) && delete record[key]);
  return record;
};
