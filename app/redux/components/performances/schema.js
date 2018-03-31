import { schema } from 'normalizr';

export const performance = new schema.Entity('performances', {}, {idAttribute: "_id"});
export const arrayOfPerformance = new schema.Array(performance);