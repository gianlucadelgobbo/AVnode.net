import mongoose from 'mongoose';
import { expandUserToRecord } from './extractors/extractUser.js';
import { pushToAlgolia } from './pushToAlgolia.js';
import algoliaService from './algoliaService.js';
import { ALGOLIA_INDEX_NAME, LOCALES } from './constants.js';
import { logger } from '../logger.js';
import { syncPerformanceToAlgolia } from './syncPerformance.js';
import { syncEventToAlgolia } from './syncEvent.js';
import { syncGalleryToAlgolia } from './syncGallery.js';
import { syncVideoToAlgolia } from './syncVideo.js';

export const syncUserToAlgolia = async (userId, { cascade = true } = {}) => {
  const UserShow = mongoose.model('UserShow');

  const user = await UserShow.findById(userId)
    .populate('performances', 'title')
    .populate('events', 'title')
    .populate('galleries', 'title')
    .populate('videos', 'title')
    .populate('partnerships', 'name')
    .populate('members', 'stagename')
    .populate('crews', 'stagename')
    .exec();

  if (!user) return;

  const record = expandUserToRecord(user, LOCALES);
  if (!record || !record.objectID) return;

  if (user.is_public) {
    await pushToAlgolia(record);
    logger.info('Push User To Algolia success');
  } else {
    await algoliaService.deleteObject(ALGOLIA_INDEX_NAME, record.objectID);
    logger.info('Delete User From Algolia success');
  }

  if (!cascade) return;

  try {
    const performanceIds = Array.from(new Set((user.performances || [])
      .map(p => p && p._id && p._id.toString())
      .filter(Boolean)));
    performanceIds.forEach((id) => {
      syncPerformanceToAlgolia(id, { cascade: false }).catch((e) => logger.error('Algolia cascade sync (performance from user) failed', e));
    });

    const eventIds = Array.from(new Set((user.events || [])
      .map(e => e && e._id && e._id.toString())
      .filter(Boolean)));
    eventIds.forEach((id) => {
      syncEventToAlgolia(id, { cascade: false }).catch((e) => logger.error('Algolia cascade sync (event from user) failed', e));
    });

    const galleryIds = Array.from(new Set((user.galleries || [])
      .map(g => g && g._id && g._id.toString())
      .filter(Boolean)));
    galleryIds.forEach((id) => {
      syncGalleryToAlgolia(id, { cascade: false }).catch((e) => logger.error('Algolia cascade sync (gallery from user) failed', e));
    });

    const videoIds = Array.from(new Set((user.videos || [])
      .map(v => v && v._id && v._id.toString())
      .filter(Boolean)));
    videoIds.forEach((id) => {
      syncVideoToAlgolia(id, { cascade: false }).catch((e) => logger.error('Algolia cascade sync (video from user) failed', e));
    });

    const relatedUserIds = new Set();
    (user.crews || []).forEach(c => c && c._id && relatedUserIds.add(c._id.toString()));
    (user.members || []).forEach(m => m && m._id && relatedUserIds.add(m._id.toString()));
    Array.from(relatedUserIds).forEach((id) => {
      syncUserToAlgolia(id, { cascade: false }).catch((e) => logger.error('Algolia cascade sync (crew/member user from user) failed', e));
    });
  } catch (e) {
    logger.error('Algolia user cascade sync exception', e);
  }
};

export default { syncUserToAlgolia };
