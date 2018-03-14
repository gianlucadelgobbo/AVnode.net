import isomorphicFetch from 'isomorphic-fetch';

export const GOT_USER = 'GOT_USER';

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
