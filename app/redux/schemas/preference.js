import { schema } from 'normalizr';

export const preference = new schema.Entity('preferences', {});
export const arrayOfPreference = new schema.Array(preference);