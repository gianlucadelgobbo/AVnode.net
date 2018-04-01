import { schema } from 'normalizr';

export const preference = new schema.Entity('preferences', {}, {idAttribute: "_id"});
export const arrayOfPreference = new schema.Array(preference);