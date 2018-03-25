import { schema } from 'normalizr';

export const crew = new schema.Entity('crews', {});
export const arrayOfCrew = new schema.Array(crew);