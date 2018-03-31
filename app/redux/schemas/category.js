import { schema } from 'normalizr';

export const category = new schema.Entity('categories', {}, {idAttribute: "value"});
export const arrayOfCategories = new schema.Array(category);