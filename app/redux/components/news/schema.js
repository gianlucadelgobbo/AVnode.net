import { schema } from 'normalizr';

export const news = new schema.Entity('news', {}, {idAttribute: "_id"});
export const arrayOfNews = new schema.Array(news);