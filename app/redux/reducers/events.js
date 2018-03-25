const events = (state = {}, action) => {
    console.log('event action type: ' + action.type + ' action: ' + JSON.stringify(action));
    switch (action.type) {
        case EDIT_EVENT:
            if (state._id !== action.json._id) {
                return state;
            }
            return Object.assign({}, state, action.json);
        case REQUEST_ADD_EVENT:
            return Object.assign({}, state, {
                ajaxInProgress: true
            });
        case REQUEST_DELETE_EVENT:
            if (state._id !== action.id) {
                return state;
            }
            return Object.assign({}, state, {
                ajaxInProgress: true
            });
        case REQUEST_ADD_EVENTIMAGE:
            if (state._id !== action.payload.eventId) {
                return state;
            }
            return Object.assign({}, state, {
                imageUploadInProgress: true
            });
        default:
            console.log('info, event action not handled: ' + action.type);
            return state;
    }
};

export default events;