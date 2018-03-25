import {fetchSlug} from '../../../api';
import {geocodeByAddress, getLatLng} from "react-places-autocomplete";

const asyncValidate = (values, dispatch, state) => {

    const promises = [];
    const result = {};

    // slug
    let slugFromValues = values.slug;
    let slugFromState = state.initialValues.slug;
    if (slugFromValues !== slugFromState) {
        promises.push(fetchSlug(slugFromValues)
            .then(response => {
                if(response.exist) {
                    Object.assign(result, {slug: 'That slug is taken'})
                }
            }))
    }

    // addresses
    console.log("async values", values.addresses);
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
