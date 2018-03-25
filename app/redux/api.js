/* Ajax requests go here */
import axios from './conf/axios';

// Profile
export const fetchProfilePublic = () => {
    return axios.get("profile/public")
        .then(result => {
            return result.data;
        });
};

export const saveProfilePublic = (model) => {
    return axios.get("profile/public", model)
        .then(result => {
            return result.data;
        });
};

export const fetchSlug = (slug) => {
    return axios.get(`rofile/public/slugs/${slug}`)
        .then(result => {
            return result.data;
        });
}








//
// export const onlyFetchSlug = (slug) =>
//     fetch(`/admin/api/profile/public/slugs/${slug}`)
//         .then(json => {
//             return json
//         });
//
//
// // SLUG
// import {RESPONSE_SLUG} from "./components/profile/public/actions";
//
// export function fetchSlug(slug, dispatch) {
//     return onlyFetchSlug(slug)
//         .then(json => (
//             dispatch({
//                 type: RESPONSE_SLUG,
//                 payload: json
//             })
//         ));
// }
//
// export const onlyFetchSlug = (slug) => fetch(`/admin/api/profile/public/slugs/${slug}`).then(json => {
//     return json
// });