import {geocodeByAddress, getLatLng} from "react-places-autocomplete";

const asyncValidate = (values, dispatch, state) => {
    const promises = [];
    const result = {};

    // addresses
    const addressesToCheck = values.addresses_private || [];

    const addressesErrorArray = [];
    addressesToCheck.forEach((a, index) => {
        promises.push(geocodeByAddress(a.text)
            .catch(error => {
                addressesErrorArray[index] = {text: {_error: "Invalid address"}};
                result.addresses_private = addressesErrorArray;
            })
            .then(result => {
                if (Array.isArray(result) && result.length !== 1) {
                    addressesErrorArray[index] = {text: {_error: "Invalid address"}};
                    result.addresses_private = addressesErrorArray;
                }
            })
        )
    });


    return Promise.all(promises)
        .then(() => {
            return checkIfError(result)
        }).catch(() => {
            return checkIfError(result)
        })
};

const checkIfError = (result) => {
    const keys = Object.keys(result);
    if (!!keys.length) {
        throw result;
    } else {
        return true
    }
};

export default asyncValidate
