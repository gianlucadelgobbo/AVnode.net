import isomorphicFetch from 'isomorphic-fetch';
import {geocodeByAddress, getLatLng} from 'react-places-autocomplete'

export const REQUEST_EDIT_USER = 'REQUEST_EDIT_USER';
export const GOT_USER = 'GOT_USER';
export const RESPONSE_SLUG = 'RESPONSE_SLUG';


/*
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

export const getUser = (data) => (dispatch) => {

    dispatch({
        type: REQUEST_GET_USER,
        id: data._id
    });

    return Promise.all(promises).then(() => {
        return fetch(
            `/admin/api/profile/public/`, {
                method: 'GET',
                body: JSON.stringify(data)
            })
            .then(json => dispatch(gotUser(json)));
    });
};
*/
export const editUser = (data) => (dispatch) => {

    dispatch({
        type: REQUEST_EDIT_USER,
        id: data._id
    });

    const promises = [];
    const addressesToConvert = data.addresses || [];

    addressesToConvert.forEach(a => {
        promises.push(geocodeByAddress(a.originalString)
            .then(results => getLatLng(results[0]))
            .then(latLng => a.latLng = latLng)
            .catch(error => console.error('Error', error)))
    });

    return Promise.all(promises).then(() => {
        return fetch(
            `/admin/api/profile/public/`, {
                method: 'POST',
                body: JSON.stringify(data)
            })
            .then(json => dispatch(gotUser(json)));
    });
};

export function gotUser(json) {
    return {type: GOT_USER, json};
}

// slugs
export function fetchSlug(slug, dispatch) {
    return onlyFetchSlug(slug)
        .then(json => (
            dispatch({
                type: RESPONSE_SLUG,
                payload: json
            })
        ));
};

export const onlyFetchSlug = (slug) => fetch(`/admin/api/profile/public/slugs/${slug}`).then(json => {
    console.log("jsonjsonjsonjsonjson", json);
    return json
});

