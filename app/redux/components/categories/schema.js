import { schema } from 'normalizr';

export const category = new schema.Entity('categories', {}, {idAttribute: "key"});
export const arrayOfCategories = new schema.Array(category);