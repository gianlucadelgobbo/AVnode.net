import { schema } from 'normalizr';

export const country = new schema.Entity('countries', {}, {idAttribute: "key"});
export const arrayOfCountry = new schema.Array(country);