import mongoose from 'mongoose';
import { expandNewsToRecords } from './extractors/extractNews.js';
import { pushToAlgolia } from './pushToAlgolia.js';
import algoliaService from './algoliaService.js';
import { ALGOLIA_INDEX_NAME, LOCALES } from './constants.js';
import { logger } from '../logger.js';
import { syncUserToAlgolia } from './syncUser.js';

export const syncNewsToAlgolia = async (newsId, { cascade = true } = {}) => {
  const News = mongoose.model('News');

  const news = await News.findById(newsId)
    .populate('categories', 'name slug')
    .populate('users', 'stagename slug')
    .exec();

  if (!news) return;

  const records = expandNewsToRecords(news, LOCALES);
  if (!records || !records.length) return;

  if (news.is_public) {
    await pushToAlgolia(records);
    logger.info('Push News To Algolia success');
  } else {
    const ids = records.map(r => r.objectID).filter(Boolean);
    if (ids.length) await algoliaService.deleteObjects(ALGOLIA_INDEX_NAME, ids);
    logger.info('Delete News From Algolia success');
  }

  if (!cascade) return;

  try {
    const userIds = Array.from(new Set((news.users || [])
      .map(u => u && u._id && u._id.toString())
      .filter(Boolean)));
    userIds.forEach((id) => {
      syncUserToAlgolia(id, { cascade: false }).catch((e) => logger.error('Algolia cascade sync (user from news) failed', e));
    });
  } catch (e) {
    logger.error('Algolia news cascade sync exception', e);
  }
};

export default { syncNewsToAlgolia };


