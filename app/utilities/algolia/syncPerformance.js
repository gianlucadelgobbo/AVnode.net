import mongoose from 'mongoose';
import { expandPerformanceToRecord } from './extractors/extractPerformance.js';
import { pushToAlgolia } from './pushToAlgolia.js';
import algoliaService from './algoliaService.js';
import { ALGOLIA_INDEX_NAME, LOCALES } from './constants.js';
import { logger } from '../logger.js';
import { syncEventToAlgolia } from './syncEvent.js';
import { syncUserToAlgolia } from './syncUser.js';
import { syncGalleryToAlgolia } from './syncGallery.js';
import { syncVideoToAlgolia } from './syncVideo.js';

export const syncPerformanceToAlgolia = async (performanceId) => {
  const Performance = mongoose.model('Performance');

  const perf = await Performance.findById(performanceId)
    .populate('type', 'name slug')
    .populate('categories', 'name slug')
    .populate('users', 'stagename slug')
    .populate('videos', 'title slug url')
    .populate('galleries', 'title slug')
    .populate({
      path: 'bookings.event',
      select: 'title slug'
    })
    .exec();

  if (!perf) return;

  const record = expandPerformanceToRecord(perf, LOCALES);
  if (!record || !record.objectID) return;

  if (perf.is_public) {
    await pushToAlgolia(record);
    logger.info('Push Performance To Algolia success');
  } else {
    await algoliaService.deleteObject(ALGOLIA_INDEX_NAME, record.objectID);
    logger.info('Delete Performance From Algolia success');
  }

  // Cascade: update all related events and authors in Algolia
  try {
    const eventIds = Array.from(new Set((perf.bookings || [])
      .map(b => b && b.event && b.event._id && b.event._id.toString())
      .filter(Boolean)));
    eventIds.forEach((eventId) => {
      syncEventToAlgolia(eventId).catch((e) => logger.error('Algolia cascade sync (event) failed', e));
    });

    const userIds = Array.from(new Set((perf.users || [])
      .map(u => u && u._id && u._id.toString())
      .filter(Boolean)));
    userIds.forEach((userId) => {
      syncUserToAlgolia(userId).catch((e) => logger.error('Algolia cascade sync (user) failed', e));
    });

    const galleryIds = Array.from(new Set((perf.galleries || [])
      .map(g => g && g._id && g._id.toString())
      .filter(Boolean)));
    galleryIds.forEach((galleryId) => {
      syncGalleryToAlgolia(galleryId).catch((e) => logger.error('Algolia cascade sync (gallery) failed', e));
    });

    const videoIds = Array.from(new Set((perf.videos || [])
      .map(v => v && v._id && v._id.toString())
      .filter(Boolean)));
    videoIds.forEach((videoId) => {
      syncVideoToAlgolia(videoId).catch((e) => logger.error('Algolia cascade sync (video) failed', e));
    });
  } catch (e) {
    logger.error('Algolia cascade sync exception', e);
  }
};

export default { syncPerformanceToAlgolia };


