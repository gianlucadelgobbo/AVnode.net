import { schema } from 'normalizr';

export const crew = new schema.Entity('crews', {}, {idAttribute: "_id"});
export const arrayOfCrew = new schema.Array(crew);