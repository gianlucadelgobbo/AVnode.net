import {combineReducers} from 'redux';

export default ({
                    MODELS_NAME = "__NOT_USED__",
                    FETCH_LIST_ERROR = "__NOT_USED__",
                    FETCH_LIST_REQUEST = "__NOT_USED__",
                    FETCH_LIST_SUCCESS = "__NOT_USED__",
                    FETCH_MODEL_ERROR = "__NOT_USED__",
                    FETCH_MODEL_SUCCESS = "__NOT_USED__",
                    FETCH_MODEL_REQUEST = "__NOT_USED__",
                    SAVE_MODEL_SUCCESS = "__NOT_USED__",
                    SAVE_MODEL_REQUEST = "__NOT_USED__",
                    SAVE_MODEL_ERROR = "__NOT_USED__",
                }) => {

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
                modelIds.forEach(id => state[id] = Object.assign({}, state[id], models[id], {
                    isFetching: false,
                    error: null
                }));

                return state;
            case SAVE_MODEL_SUCCESS :

                id = action.response.result;
                state[id] = Object.assign({}, state[id], action.response.entities[MODELS_NAME][id], {
                    isFetching: false,
                    error: null
                });

                return {...state};
            case SAVE_MODEL_REQUEST :
            case FETCH_MODEL_REQUEST:
                id = action.id || (Object.keys(state).length > 0 ? Object.keys(state)[0] : null);

                if (!id) {
                    return state;
                }

                if (!state[id]) {
                    state[id] = {};
                }

                state[id] = {...state[id], isFetching: true, error: null};

                return {...state};
            case SAVE_MODEL_ERROR :
            case FETCH_MODEL_ERROR:
                id = action.id || (Object.keys(state).length > 0 ? Object.keys(state)[0] : null);

                if (!id) {
                    return state;
                }

                if (!state[id]) {
                    state[id] = {}
                }

                state[id] = {...state[id], isFetching: false, error: action.errorMessage};

                return {...state};
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
                    return action.errorMessage;
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

    return combineReducers({
        byId,
        list: createList()
    });

}