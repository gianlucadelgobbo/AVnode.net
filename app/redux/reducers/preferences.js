import {REQUEST_ADD_PERFORMANCEIMAGE} from "./constants";

const performances = (state = {}, action) => {
    console.log('performance action type: ' + action.type + ' action: ' + JSON.stringify(action));
    switch (action.type) {
        case REQUEST_ADD_PERFORMANCEIMAGE:
            if (state._id !== action.payload.performanceId) {
                return state;
            }
            return Object.assign({}, state, {
                imageUploadInProgress: true
            });
        default:
            console.log('info, performance action not handled: ' + action.type);
            return state;
    }
};

export default performances;