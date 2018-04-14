import {geocodeByAddress, getLatLng} from "react-places-autocomplete";

const asyncValidate = (values, dispatch, state) => {
    const promises = [];
    const result = {};

    console.log("ASYNC")

    // addresses
    const addressesToCheck = values.addresses_private || [];

    const addressesErrorArray = [];
    addressesToCheck.forEach((a, index) => {
        console.log("check ", a.text)
        promises.push(geocodeByAddress(a.text)
            .catch(error => {
                console.log("error", error)
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

    console.log("result", result)
    if (!!keys.length) {
        throw result;
    } else {
        return true
    }
};

export default asyncValidate
