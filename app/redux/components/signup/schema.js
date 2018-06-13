import { schema } from 'normalizr';

export const signup = new schema.Entity('profiles', {}, {idAttribute: "_id"});
export const arrayOfSignUp = new schema.Array(signup);