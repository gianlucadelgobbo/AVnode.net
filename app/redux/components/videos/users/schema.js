import { schema } from 'normalizr';

export const users = new schema.Entity('users', {}, {idAttribute: "value"});
export const arrayOfUsers = new schema.Array(users);
