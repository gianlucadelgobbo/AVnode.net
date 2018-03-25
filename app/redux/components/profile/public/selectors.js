import {getModel} from "../selectors";

export const getSlug = (state) => getModel(state).slug;