export const getModel = (state) => state.profile;

export const getSlug = (state) => getModel(state).slug;