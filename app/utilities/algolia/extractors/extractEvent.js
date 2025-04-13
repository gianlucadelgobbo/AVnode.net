// 📁 app/utilities/algolia/extractors/extractEvent.js

import { extractMultilangText } from '../utils/extractMultilangText.js';
import { getActiveProgram } from '../utils/getActiveProgram.js';

export const expandEventToInstances = (eventDoc, langs = ['en']) => {
  const event = eventDoc.toObject({ virtuals: true, getters: true });
  const records = [];

  if (!Array.isArray(event.schedule) || event.schedule.length === 0) return [];

  const users = (event.users || [])
    .filter(u => u && u._id)
    .map(u => ({
      userId: u._id.toString(),
      stagename: u.stagename,
      role: 'producer'
    }));

  const { program: activeProgram, source: program_source } = getActiveProgram(event);

  const performers = [];
  const performances = [];

  activeProgram.forEach(p => {
    if (p.performance?._id) {
      performances.push({
        performanceId: p.performance._id.toString(),
        title: p.performance.title
      });
    }
    if (Array.isArray(p.performance?.users)) {
      p.performance.users.forEach(u => {
        if (u && u._id) {
          performers.push({
            userId: u._id.toString(),
            stagename: u.stagename,
            role: 'performer'
          });
        }
      });
    }
  });

  const partners = [];
  (event.partners || []).forEach(p => {
    (p.users || []).forEach(u => {
      if (u && u._id) {
        partners.push({
          userId: u._id.toString(),
          stagename: u.stagename,
          role: 'partner'
        });
      }
    });
  });

  const videos = (event.videos || [])
    .filter(v => v && v._id)
    .map(v => ({
      videoId: v._id.toString(),
      title: v.title
    }));

  const galleries = (event.galleries || [])
    .filter(g => g && g._id)
    .map(g => ({
      galleryId: g._id.toString(),
      title: g.title
    }));

  const abouts_by_lang = {};
  langs.forEach(lang => {
    let text = extractMultilangText(event.abouts, lang, langs);
    if (typeof text === 'string' && text.length > 2000) {
      text = text.slice(0, 2000) + '...';
    }
    abouts_by_lang[`about_${lang}`] = text;
  });

  event.schedule.forEach(sch => {
    const venue = sch.venue || {};
    const location = venue.location || {};
    const lat = parseFloat(location.geometry?.lat);
    const lng = parseFloat(location.geometry?.lng);
    const geoloc = !isNaN(lat) && !isNaN(lng) ? { lat, lng } : null;

    const record = {
      objectID: `${event._id}_${venue.name || 'novenue'}_${sch.starttime.toISOString()}`,
      record_group_id: event._id.toString(),
      eventId: event._id.toString(),
      collection: 'events',
      type: 'event',
      program_source,
      title: event.title,
      slug: event.slug,
      venue_name: venue.name || null,
      room: venue.room || null,
      locality: location.locality || null,
      country: location.country || null,
      datetime: sch.starttime?.toISOString() || null,
      timestamp: sch.starttime ? Math.floor(new Date(sch.starttime).getTime() / 1000) : null,
      end_timestamp: sch.endtime ? Math.floor(new Date(sch.endtime).getTime() / 1000) : null,
      _geoloc: geoloc,
      categories: event.categories?.map(c => c.name) || [],
      event_type: event.type?.name || null,
      image_url: event.imageFormats?.medium || null,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,

      users,
      performers,
      performances,
      partners,
      videos,
      galleries,

      visits: event.stats?.visits || 0,
      likes: event.stats?.likes || 0,

      ...abouts_by_lang
    };

    Object.keys(record).forEach(key => (record[key] == null) && delete record[key]);
    records.push(record);
  });

  return records;
};
