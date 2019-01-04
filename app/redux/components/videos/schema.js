import { schema } from "normalizr";

export const videos = new schema.Entity("videos", {}, { idAttribute: "_id" });
export const arrayOfVideos = new schema.Array(videos);
