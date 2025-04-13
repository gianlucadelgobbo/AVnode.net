// 📁 app/utilities/algolia/extractors/extractNews.js

import { extractMultilangText } from '../utils/extractMultilangText.js';

export const expandNewsToRecords = (newsDoc, langs = ['en']) => {
  const news = newsDoc.toObject({ virtuals: true, getters: true });

  const users = (news.users || [])
    .filter(u => u && u._id)
    .map(u => ({
      userId: u._id.toString(),
      stagename: u.stagename,
      role: 'author'
    }));

  const categories = news.categories?.map(c => c.name).filter(Boolean) || [];

  const abouts_by_lang = {};
  langs.forEach(lang => {
    abouts_by_lang[`about_${lang}`] = extractMultilangText(news.abouts, lang);
  });

  const record = {
    objectID: news._id.toString(),
    collection: 'news',
    type: 'news',

    title: news.title,
    slug: news.slug,

    datetime: news.createdAt?.toISOString(),
    timestamp: news.createdAt ? Math.floor(new Date(news.createdAt).getTime() / 1000) : null,

    categories,
    image_url: news.imageFormats?.medium || null,

    createdAt: news.createdAt,
    updatedAt: news.updatedAt,

    users,

    visits: news.stats?.visits || 0,
    likes: news.stats?.likes || 0,

    ...abouts_by_lang
  };

  Object.keys(record).forEach(key => (record[key] == null) && delete record[key]);

  return [record]; // Singolo record per news
};
