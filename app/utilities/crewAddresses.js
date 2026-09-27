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
  // Don't rely on user.crews being loaded on the passed-in document - many save paths
  // (e.g. the generic admin form save) fetch it with a restricted .select() that leaves
  // `crews` undefined even though it's set in the database. Query from the crew side
  // instead (members is the authoritative source of truth for membership).
  const User = mongoose.model('User');
  const crews = await User.find({ is_crew: true, members: user._id }).select({ _id: 1 }).exec();
  for (const crew of crews) {
    try {
      await syncCrewAddresses(crew._id);
    } catch (err) {
      logger.error('syncCrewAddresses failed for crew ' + crew._id, err);
    }
  }
}
