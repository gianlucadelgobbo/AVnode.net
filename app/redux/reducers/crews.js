import {
    REQUEST_ADD_CREWIMAGE,
    REQUEST_ADD_CREWMEMBER, REQUEST_ADD_CREWORGLOGO, REQUEST_ADD_CREWTEASERIMAGE, REQUEST_CREW_EDITABOUT,
    REQUEST_DELETE_CREWMEMBER
} from "./constants";

const crews = (state = {}, action) => {
    console.log('crew action type: ' + action.type + ' action: ' + JSON.stringify(action));
    switch (action.type) {
        case REQUEST_ADD_CREWMEMBER:
            console.log('--> crew BL FIXME not called, useless?');
            // BL FIXME crewId undefined if (state._id !== action.payload.crewId) {
            return state;
        /* }
        return Object.assign({}, state, {
          members: R.append(action.payload.member, state.members)
        }); */
        case REQUEST_ADD_CREWIMAGE:
            console.log('--> crew REQUEST_ADD_CREWIMAGE');
            if (state._id !== action.payload.crewId) {
                return state;
            }
            return Object.assign({}, state, {
                imageUploadInProgress: true
            });
        case REQUEST_ADD_CREWTEASERIMAGE:
            if (state._id !== action.payload.crewId) {
                return state;
            }
            return Object.assign({}, state, {
                imageUploadInProgress: true
            });
        case REQUEST_ADD_CREWORGLOGO:
            if (state._id !== action.payload.crewId) {
                return state;
            }
            return Object.assign({}, state, {
                imageUploadInProgress: true
            });
        case REQUEST_DELETE_CREWMEMBER:
            console.log('--> crew BL FIXME WHY DUPLICATE  REQUEST_DELETE_CREWMEMBER REQUEST_CREW_EDITABOUT IN CREW AND USER');

            if (state._id !== action.payload.crewId) {
                return state;
            }
            return Object.assign({}, state, {
                members: state.members.map((m) => {
                    if (m._id === action.payload.memberId) {
                        return Object.assign({}, m, {
                            deletionInProgress: true
                        });
                    } else {
                        return m;
                    }
                })
            });
        case REQUEST_CREW_EDITABOUT:
            console.log('--> crew BL FIXME WHY DUPLICATE  REQUEST_DELETE_CREWMEMBER REQUEST_CREW_EDITABOUT IN CREW AND USER');

            return state;
        default:
            console.log('info, crew action not handled: ' + action.type);
            return state;
    }
};

export default crews;