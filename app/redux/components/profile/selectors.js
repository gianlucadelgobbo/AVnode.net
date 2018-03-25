export const getIds = (state) =>
    state.profile.list.ids;

export const getIsFetching = (state) =>
    state.profile.list.isFetching;

export const getErrorMessage = (state) =>
    state.profile.list.errorMessage;

export const getList = (state) =>
    state.profile.list.ids && state.profile.list.ids.map((id) => getModel(state, id));

export const getModel = (state, id) =>
    state.profile.byId[id];


export const getDefaultModel = (state) => {
    const firstId = Object.keys(state.profile.byId);
    return firstId? state.profile.byId[firstId] : null;
};

export const getModelErrorMessage = (state, id) =>
    getModel(state, id).errorMessage;

export const getModelisFetching = (state, id) =>
    getModel(state, id).isFetching;
