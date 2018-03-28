import {fetchSlug} from '../../../api';
import {geocodeByAddress, getLatLng} from "react-places-autocomplete";

const asyncValidate = (values, dispatch, state, fieldName) => {
    const promises = [];
    const result = {};

    // slug
    let slugFromValues = values.slug;
    let slugFromState = state.initialValues.slug;
    if (slugFromValues !== slugFromState) {
        promises.push(fetchSlug(slugFromValues)
            .then(response => {
                if (response.exist) {
                    Object.assign(result, {slug: 'That slug is taken'})
                }
            }))
    }

    // addresses
    const addressesToCheck = values.addresses || [];

    const addressesErrorArray = [];
    addressesToCheck.forEach((a, index) => {
        promises.push(geocodeByAddress(a.text)
            .catch(error => {
                addressesErrorArray[index] = {text: {_error: "Invalid city"}};
                result.addresses = addressesErrorArray;
            })
        )
    });

    return Promise.all(promises)
        .then(() => {
            console.log("result OK", result)
            return result;
        }).catch(() => {
            console.log("result error", result)
            return result;
        })

};

export default asyncValidate
