import { schema } from 'normalizr';

export const profile = new schema.Entity('profiles', {}, {idAttribute: "_id"});
export const arrayOfProfile = new schema.Array(profile);