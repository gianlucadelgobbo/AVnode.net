import {schema} from 'normalizr';

export const event = new schema.Entity('events', {}, {idAttribute: "_id"});
export const arrayOfEvent = new schema.Array(event);