import { schema } from "normalizr";

export const user = new schema.Entity("user", {}, { idAttribute: "_id" });
export const arrayOfUser = new schema.Array(user);
