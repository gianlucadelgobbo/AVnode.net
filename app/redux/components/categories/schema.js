import { schema } from 'normalizr';

export const category = new schema.Entity('categories', {}, {idAttribute: "_id"});
export const arrayOfCategories = new schema.Array(category);