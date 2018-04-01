/*
* Common actions goes here!
* If several components need for the same action this is the place
* where it should be defined. In case you have actions used by a single
* component, it should be placed within folder of the components itself
* in a file named actions.js
*
* */


import isomorphicFetch from 'isomorphic-fetch';

import {
    NAVIGATE,
    CREW_NAVIGATE,
    PERFORMANCE_NAVIGATE,
    EVENT_NAVIGATE,
    GOT_USER,
    REQUEST_EDIT_USER,
    CHANGE_LANGUAGE,
    RESPONSE_LINKTYPES,
    REQUEST_ADD_USERPROFILEIMAGE,
    REQUEST_ADD_USERTEASERIMAGE,
    OPEN_STAGENAME_MODAL,
    CLOSE_STAGENAME_MODAL,
    OPEN_PASSWORD_MODAL,
    CLOSE_PASSWORD_MODAL,
    OPEN_EDITUSER_MODAL,
    CLOSE_EDITUSER_MODAL,
    REQUEST_USER_EDITABOUT,
    REQUEST_USER_DELETEABOUT,
    REQUEST_USER_EDITLINK,
    REQUEST_USER_MAKELINKPRIMARY,
    REQUEST_USER_MAKELINKPRIVATE,
    REQUEST_USER_MAKELINKPUBLIC,
    REQUEST_USER_LINKCONFIRM,
    REQUEST_USER_DELETELINK,
    REQUEST_USER_DELETEEMAIL,
    REQUEST_USER_MAKEEMAILPRIMARY,
    REQUEST_USER_MAKEEMAILPRIVATE,
    REQUEST_USER_MAKEEMAILPUBLIC,
    REQUEST_USER_TOGGLEPRIVACY,
    REQUEST_USER_EMAILCONFIRM,
    REQUEST_USER_MAKEADDRESSPRIMARY,
    REQUEST_USER_MAKEADDRESSPRIVATE,
    REQUEST_USER_MAKEADDRESSPUBLIC,
    REQUEST_USER_DELETEADDRESS,
    REQUEST_ADD_USER_LINK,
    RESPONSE_SLUG,

    EDIT_EVENT,
    REQUEST_DELETE_EVENT,
    REQUEST_EDIT_EVENT,
    REQUEST_ADD_EVENT,
    REQUEST_ADD_EVENT_CATEGORY,
    REQUEST_ADD_EVENTIMAGE,
    REQUEST_SUGGEST_EVENT_PERFORMANCE,
    RESPONSE_SUGGEST_EVENT_PERFORMANCE,
    REQUEST_SUGGEST_EVENT_ORGANIZER,
    RESPONSE_SUGGEST_EVENT_ORGANIZER,
    REQUEST_SUGGEST_EVENT_ORGANIZINGCREW,
    RESPONSE_SUGGEST_EVENT_ORGANIZINGCREW,
    REQUEST_DELETE_EVENT_CATEGORY,

    REQUEST_ADD_CREW,
    REQUEST_SUGGEST_CREWMEMBER,
    RESPONSE_SUGGEST_CREWMEMBER,
    REQUEST_ADD_CREWIMAGE,
    REQUEST_ADD_CREWTEASERIMAGE,
    REQUEST_ADD_CREWORGLOGO,
    REQUEST_ADD_CREWMEMBER,
    REQUEST_DELETE_CREWMEMBER,
    REQUEST_CREW_EDITABOUT,
    REQUEST_CREW_DELETEABOUT,

    REQUEST_ADD_PERFORMANCE,
    REQUEST_ADD_PERFORMANCEIMAGE,
    REQUEST_PERFORMANCE_EDITABOUT,
    REQUEST_PERFORMANCE_DELETEABOUT,
    REQUEST_ADD_PERFORMANCE_CATEGORY,
    REQUEST_SUGGEST_PERFORMANCE_CREW,
    RESPONSE_SUGGEST_PERFORMANCE_CREW,
    REQUEST_SUGGEST_PERFORMANCE_PERFORMER,
    RESPONSE_SUGGEST_PERFORMANCE_PERFORMER
} from './constants';


const fetch = (path, options = {}, json = true) => {
    const opts = Object.assign({}, {
        credentials: 'same-origin'
    }, options);
    if (json === true) {
        opts.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }
    return isomorphicFetch(path, opts)
        .then(response => response.json());
};

export function gotData(json) {
    return {type: GOT_USER, json};
}

export function fetchData() {
    return dispatch => {
        return fetch(window.location.pathname.replace('/admin/','/admin/api/'))
            .then(json => dispatch(gotData(json)));
    };
}
