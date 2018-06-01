import { schema } from 'normalizr';

export const category = new schema.Entity('partnerCategories', {}, {idAttribute: "_id"});
export const arrayOfCategories = new schema.Array(category);