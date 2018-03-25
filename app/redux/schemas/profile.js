import { schema } from 'normalizr';

export const profile = new schema.Entity('profiles', {});
export const arrayOfProfile = new schema.Array(profile);