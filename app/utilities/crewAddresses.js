import mongoose from 'mongoose';
import { logger } from './logger.js';

// Recomputes a crew's addresses as the deduped union (by country+locality) of its
// current members' own addresses. Called whenever a member is added/removed, or
// whenever a member saves their own profile with a changed address.
export async function syncCrewAddresses(crewId) {
  const User = mongoose.model('User');
  const crew = await User
    .findOne({ _id: crewId, is_crew: true })
    .select({ addresses: 1, members: 1 })
    .populate({ path: 'members', select: 'addresses', model: 'User' })
    .exec();
  if (!crew) return;

  const merged = [];
  const seen = new Set();
  for (const member of crew.members || []) {
    for (const address of member.addresses || []) {
      const key = (address.country || '').trim().toLowerCase() + '|' + (address.locality || '').trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(address);
    }
  }

  crew.addresses = merged;
  await crew.save();
}

export async function syncCrewsForMember(user) {
  if (!user.crews || !user.crews.length) return;
  for (const crewId of user.crews) {
    try {
      await syncCrewAddresses(crewId);
    } catch (err) {
      logger.error('syncCrewAddresses failed for crew ' + crewId, err);
    }
  }
}
