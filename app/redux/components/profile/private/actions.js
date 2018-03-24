// countries
import {RESPONSE_COUNTRIES} from "./constants";

export const fetchCountries = () => (dispatch) => {
    return fetch('/admin/api/user/countries')
        .then(json => (
            dispatch({
                type: RESPONSE_COUNTRIES,
                payload: {
                    countries: json
                }
            })
        ));
};