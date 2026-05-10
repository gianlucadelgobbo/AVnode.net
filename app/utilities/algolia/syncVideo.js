import mongoose from 'mongoose';
import { expandVideoToRecord } from './extractors/extractVideo.js';
import { pushToAlgolia } from './pushToAlgolia.js';
import algoliaService from './algoliaService.js';
import { ALGOLIA_INDEX_NAME, LOCALES } from './constants.js';
import { logger } from '../logger.js';
import { syncPerformanceToAlgolia } from './syncPerformance.js';
import { syncEventToAlgolia } from './syncEvent.js';
import { syncUserToAlgolia } from './syncUser.js';

export const syncVideoToAlgolia = async (videoId, { cascade = true } = {}) => {
  const Video = mongoose.model('Video');

  const video = await Video.findById(videoId)
    .populate('users', 'stagename slug')
    .populate('performances', 'title')
    .populate('events', 'title')
    .populate('categories', 'name')
    .exec();

  if (!video) return;

  const record = expandVideoToRecord(video, LOCALES);
  if (!record || !record.objectID) return;

  if (video.is_public) {
    await pushToAlgolia(record);
    logger.info('Push Video To Algolia success');
  } else {
    await algoliaService.deleteObject(ALGOLIA_INDEX_NAME, record.objectID);
    logger.info('Delete Video From Algolia success');
  }

  if (!cascade) return;

  try {
    const performanceIds = Array.from(new Set((video.performances || [])
      .map(p => p && p._id && p._id.toString())
      .filter(Boolean)));
    const eventIds = Array.from(new Set((video.events || [])
      .map(e => e && e._id && e._id.toString())
      .filter(Boolean)));
    const userIds = Array.from(new Set((video.users || [])
      .map(u => u && u._id && u._id.toString())
      .filter(Boolean)));

    performanceIds.forEach((id) => {
      syncPerformanceToAlgolia(id, { cascade: false }).catch((e) => logger.error('Algolia cascade sync (performance from video) failed', e));
    });
    eventIds.forEach((id) => {
      syncEventToAlgolia(id, { cascade: false }).catch((e) => logger.error('Algolia cascade sync (event from video) failed', e));
    });
    userIds.forEach((id) => {
      syncUserToAlgolia(id, { cascade: false }).catch((e) => logger.error('Algolia cascade sync (user from video) failed', e));
    });
  } catch (e) {
    logger.error('Algolia video cascade sync exception', e);
  }
};

export default { syncVideoToAlgolia };
