import { schema } from 'normalizr';

export const footage = new schema.Entity('footage', {}, {idAttribute: "_id"});
export const arrayOfFootage = new schema.Array(footage);