import {onlyFetchSlug} from './actions';
import {getSlug} from './selectors'
import {geocodeByAddress, getLatLng} from "react-places-autocomplete";

const asyncValidate = (values, dispatch, state) => {
    
   alert("ASYNC", )

    const promises = [];
    const result = {};

    // slug
    let slugFromValues = values.slug;
    let slugFromState = getSlug(state);
    if (slugFromValues !== slugFromState) {
        promises.push(onlyFetchSlug(slugFromValues, dispatch)
            .then(response => {
                if(response.exist) {
                    Object.assign(result, {slug: 'That slug is taken'})
                }
            }))
    }

    // addresses
    console.log("async values", values.addresses)
    const addressesToCheck = values.addresses || [];
    const addressesErrorArray = [];
    addressesToCheck.forEach((a, index) => {
        promises.push(geocodeByAddress(a.text)
            .catch(error => {
                console.error('Error', error);
                addressesErrorArray[index] = {text: {_error: "Invalid city"}}
            }))
    });

    return Promise.all(promises).then(() => result);

};

export default asyncValidate
