import {fetchSlug} from '../../../api';
import {geocodeByAddress} from "react-places-autocomplete";
import moment from 'moment';
import validatorsObj from '../../../../utilities/validators.js';

const validators = validatorsObj.validators;

export const validateSlug = ({value, previousValue, promises, result}) => {
    // slug
    let slugFromValues = value;
    let slugFromState = previousValue;
    if (slugFromValues !== slugFromState) {
        promises.push(fetchSlug(slugFromValues)
            .then(response => {
                if (response.exist) {
                    Object.assign(result, {slug: 'That slug is taken'})
                }
            }).catch())
    }
};

export const validateAddress = ({values, promises, result}) => {

    // addresses
    const addressesToCheck = values || [];
    const addressesErrorArray = [];
    addressesToCheck.forEach((a, index) => {
        promises.push(geocodeByAddress(a.text)
            .catch(error => {
                addressesErrorArray[index] = {text: {_error: "Invalid city"}};
                result.addresses = addressesErrorArray;
            })
            .then(result => {
                if (Array.isArray(result) && result.length !== 1) {
                    addressesErrorArray[index] = {text: {_error: "Invalid address"}};
                    result.addresses_private = addressesErrorArray;
                }
            })
        )
    });

};

export const isValidDate = (date) => moment(date).isValid();

export const validateLength = ({values, name, min, max, errors}) => {
    if (!values[name] || (values[name].length < min || values[name].length > max)) {
        errors.categories = {_error: `Invalid length: please insert ${min} to ${max} values`}
    }
};

export const isValidSlug = ({slug, errors}) => {
    if (!slug || slug.trim() === "") {
        errors.slug = 'Slug Required';
    }
    if (slug) {
        if (!validators.isSlug(slug)) {
            errors.slug = 'Characters Not Allowed';
        }
    }
};

export const validateMultiLang = ({values, name, value, errors, max}) => {
    const array = values[name];
    if (Array.isArray(array)) {
        const modelErrors = [];

        // Apply validation to each about
        array.forEach((item, index) => {
            const itemErrors = {};

            if (!item || item[value].length > max) {
                itemErrors[value] = 'Invalid string length (max 5000)';
                modelErrors[index] = itemErrors;
            }
        });

        if (modelErrors.length) {
            errors[name] = modelErrors;
        }

    }
};