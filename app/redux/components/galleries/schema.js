import { schema } from "normalizr";

export const galleries = new schema.Entity(
  "galleries",
  {},
  { idAttribute: "_id" }
);
export const arrayOfGalleries = new schema.Array(galleries);
