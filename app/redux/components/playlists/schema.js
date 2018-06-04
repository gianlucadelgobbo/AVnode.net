import { schema } from 'normalizr';

export const playlists = new schema.Entity('playlists', {}, {idAttribute: "_id"});
export const arrayOfPlaylists = new schema.Array(playlists);