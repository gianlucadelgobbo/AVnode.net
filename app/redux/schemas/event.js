import {schema} from 'normalizr';

export const event = new schema.Entity('events', {});
export const arrayOfEvent = new schema.Array(event);