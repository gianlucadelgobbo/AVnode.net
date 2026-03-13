import mongoose from 'mongoose';
import { expandGalleryToRecord } from './extractors/extractGallery.js';
import { pushToAlgolia } from './pushToAlgolia.js';
import algoliaService from './algoliaService.js';
import { ALGOLIA_INDEX_NAME, LOCALES } from './constants.js';
import { logger } from '../logger.js';
import { syncPerformanceToAlgolia } from './syncPerformance.js';
import { syncEventToAlgolia } from './syncEvent.js';
import { syncUserToAlgolia } from './syncUser.js';

export const syncGalleryToAlgolia = async (galleryId) => {
  const Gallery = mongoose.model('Gallery');

  const gallery = await Gallery.findById(galleryId)
    .populate('users', 'stagename slug')
    .populate('performances', 'title slug')
    .populate('events', 'title slug')
    .exec();

  if (!gallery) return;

  const record = expandGalleryToRecord(gallery, LOCALES);
  if (!record || !record.objectID) return;

  if (gallery.is_public) {
    await pushToAlgolia(record);
    logger.info('Push Gallery To Algolia success');
  } else {
    await algoliaService.deleteObject(ALGOLIA_INDEX_NAME, record.objectID);
    logger.info('Delete Gallery From Algolia success');
  }

  // Cascade: update related performances, events, and users in Algolia
  try {
    const performanceIds = Array.from(new Set((gallery.performances || [])
      .map(p => p && p._id && p._id.toString())
      .filter(Boolean)));
    const eventIds = Array.from(new Set((gallery.events || [])
      .map(e => e && e._id && e._id.toString())
      .filter(Boolean)));
    const userIds = Array.from(new Set((gallery.users || [])
      .map(u => u && u._id && u._id.toString())
      .filter(Boolean)));

    performanceIds.forEach((id) => {
      syncPerformanceToAlgolia(id).catch((e) => logger.error('Algolia cascade sync (performance from gallery) failed', e));
    });
    eventIds.forEach((id) => {
      syncEventToAlgolia(id).catch((e) => logger.error('Algolia cascade sync (event from gallery) failed', e));
    });
    userIds.forEach((id) => {
      syncUserToAlgolia(id).catch((e) => logger.error('Algolia cascade sync (user from gallery) failed', e));
    });
  } catch (e) {
    logger.error('Algolia gallery cascade sync exception', e);
  }
};

export default { syncGalleryToAlgolia };


