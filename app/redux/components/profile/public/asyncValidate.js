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
            }).catch())
    }

    // addresses
    const addressesToCheck = values.addresses || [];

    const addressesErrorArray = [];
    addressesToCheck.forEach((a, index) => {
        promises.push(geocodeByAddress(a.text)
            .catch(error => {
                console.log(error)
                addressesErrorArray[index] = {text: {_error: "Invalid city"}};
                result.addresses = addressesErrorArray;
            })
        )
    });


    return Promise.all(promises)
        .then(() => {

            return checkIfError(result)

        }).catch(() => {
            console.log("Error", result)
            return checkIfError(result)
        })

};

const checkIfError = (result) => {
    const keys = Object.keys(result);
    if (!!key.length) {
        throw result;
    } else {
        return true
    }

}

export default asyncValidate
