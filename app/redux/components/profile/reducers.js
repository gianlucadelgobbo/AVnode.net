import {combineReducers} from 'redux';
import {SAVE_MODEL_SUCCESS, SAVE_MODEL_REQUEST, SAVE_MODEL_ERROR} from './constants';
import {FETCH_LIST_ERROR, FETCH_LIST_REQUEST, FETCH_LIST_SUCCESS} from './constants';
import {FETCH_MODEL_ERROR, FETCH_MODEL_REQUEST, FETCH_MODEL_SUCCESS} from './constants';

const MODELS_NAME = "profiles";

const byId = (state = {}, action) => {

    let id;

    switch (action.type) {
        case FETCH_LIST_SUCCESS :
        case FETCH_MODEL_SUCCESS :

            // get the updated entities from actions {id_1: {...}, id_2: {...}}
            let models = action.response.entities[MODELS_NAME] || {};

            // get the entities ids
            let modelIds = Object.keys(models);

            // merge current entity with the updated, reset message and isFetching, and store the result in the state
            modelIds.forEach(id => state[id] = Object.assign({}, state[id], models[id], {isFetching: false, error: null}));

            return state;
        case SAVE_MODEL_SUCCESS :
            id = action.result.id;
            state[id] = Object.assign({}, state[id], action.result, {isFetching: false, error: null});

            return state;
        case SAVE_MODEL_REQUEST :
        case FETCH_MODEL_REQUEST:
            id = action.id;

            if (!id){
                return state;
            }

            if (!state[id]) {
                state[id] = {}
            }

            state[id] = Object.assign({}, state[id], {isFetching: true, error: null});

            return state;
        case SAVE_MODEL_ERROR :
        case FETCH_MODEL_ERROR:
            id = action.id;

            if (!id){
                return state;
            }

            if (!state[id]) {
                state[id] = {}
            }

            state[id] = Object.assign({}, state[id], {isFetching: false, error: action.errorMessage});

            return state;
        default:
            return state;
    }
};

const createList = () => {
    const ids = (state = [], action) => {
        switch (action.type) {
            case FETCH_LIST_SUCCESS :
                return action.response.result;
            case FETCH_MODEL_SUCCESS :
                return [...state, action.response.result];
            default:
                return state;
        }
    };

    const errorMessage = (state = null, action) => {
        switch (action.type) {
            case FETCH_LIST_ERROR :
            case FETCH_MODEL_ERROR :
                return action.message;
            case FETCH_LIST_REQUEST :
            case FETCH_LIST_SUCCESS :
                return null;
            default:
                return state;
        }
    };

    const isFetching = (state = false, action) => {
        switch (action.type) {
            case FETCH_LIST_REQUEST:
            case FETCH_MODEL_REQUEST:
                return true;
            case FETCH_LIST_ERROR:
            case FETCH_LIST_SUCCESS:
                return false;
            default:
                return state;
        }
    };

    return combineReducers({
        ids,
        isFetching,
        errorMessage,
    });
};

export default combineReducers({
    byId,
    list: createList()
});