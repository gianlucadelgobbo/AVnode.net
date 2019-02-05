import {REQUEST_ADD_PERFORMANCEIMAGE} from "./constants";

const performances = (state = {}, action) => {
    switch (action.type) {
        case REQUEST_ADD_PERFORMANCEIMAGE:
            if (state._id !== action.payload.performanceId) {
                return state;
            }
            return Object.assign({}, state, {
                imageUploadInProgress: true
            });
        default:
            return state;
    }
};

export default performances;