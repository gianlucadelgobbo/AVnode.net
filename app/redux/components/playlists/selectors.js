/*
* Selector for the whole section:
* - each selector of the section should be placed here
* - used to get model list and single model
* - do not place selectors in the specific component
* */

import {MODELS_NAME as entity} from './constants';

export const getIds = (state) =>
    state[entity].list.ids;

export const getIsFetching = (state) =>
    state[entity].list.isFetching;

export const getErrorMessage = (state) =>
    state[entity].list.errorMessage;

export const getList = (state) =>
    state[entity].list.ids && state[entity].list.ids.map((id) => getModel(state, id));

export const getModel = (state, id) =>
    state[entity].byId[id];

export const getDefaultModel = (state) => {
    const firstId = Object.keys(state[entity].byId);
    return firstId? state[entity].byId[firstId] : null;
};

export const getModelErrorMessage = (state, id) =>
    getModel(state, id) && getModel(state, id).errorMessage;

export const getModelIsFetching = (state, id) =>
    getModel(state, id) && getModel(state, id).isFetching;