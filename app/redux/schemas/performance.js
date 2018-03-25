import { schema } from 'normalizr';

export const performance = new schema.Entity('performances', {});
export const arrayOfPerformance = new schema.Array(performance);