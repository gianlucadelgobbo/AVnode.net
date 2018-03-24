export const getUser = state=> state.user;

export const getSlug = state => getUser(state).slug;

export const getCountries = state => getUser(state)._countrie;