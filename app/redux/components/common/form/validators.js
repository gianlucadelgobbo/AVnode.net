//import {fetchSlug} from '../../../api';
import {geocodeByAddress} from "react-places-autocomplete";
import moment from 'moment';
import validatorsObj from '../../../../utilities/validators.js';
import {UPLOAD_IMAGE_MAX_SIZE} from "../../../conf";
import {DATE_FORMAT} from '../../../conf';
import {REQUIRED, SLUG_IS_TAKEN, SLUG_REQUIRED, NOT_ALLOWED, INVALID_CITY, INVALID_ADDRESS, INVALID_STRING_LENGTH, INVALID_IMAGE_SIZE, INVALID_STRING_MIN_MAX} from "./errors";

const validators = validatorsObj.validators;

export const validateSlug = ({value, previousValue, promises, result, index, errorArray, fetchSlug}) => {
    // slug
    let slugFromValues = value;
    if (slugFromValues !== previousValue) {
        promises.push(fetchSlug(slugFromValues)
            .then(response => {
                if (response.exist) {
                    Object.assign(result, {slug: SLUG_IS_TAKEN});
                    if (Array.isArray(errorArray)) {
                        errorArray[index] = result;
                    }
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
                addressesErrorArray[index] = {text: {_error: INVALID_CITY}};
                result.addresses = addressesErrorArray;
            })
            .then(result => {
                if (Array.isArray(result) && result.length !== 1) {
                    addressesErrorArray[index] = {text: {_error: INVALID_ADDRESS}};
                    result.addresses_private = addressesErrorArray;
                }
            })
        )
    });

};

export const isValidDate = (date) => {
    if (!date) {
        return false;
    }
    const wrapper = (typeof date === "string" ? moment(date, DATE_FORMAT) : date);
    return wrapper.isValid();
};

export const validateDate = ({values, name, errors, index, errorArray}) => {
const nameIn = values[name];
    if (!nameIn || nameIn.trim() === "") {
        errors[name] = REQUIRED;
    }

    if (Array.isArray(errorArray)) {
        errorArray[index] = errors;
    }
};

export const validateLength = ({values, name, min, max, errorKey, errors, index, errorArray}) => {
    let value = values[name];

    if (value && !!value.trim) {
        value = value.trim();
    }

    if (!value || (value.length < min || value.length > max)) {
        errors[name] = {_error: errorKey};
    }

    if (Array.isArray(errorArray)) {
        errorArray[index] = errors;
    }
};

export const isValidSlug = ({values, name, errors, index, errorArray}) => {
    const slug = values[name];
    if (!slug || slug.trim() === "") {
        errors[name] = SLUG_REQUIRED;
    }
    if (slug) {
        if (!validators.isSlug(slug)) {
            errors[name] = NOT_ALLOWED;
        }
    }

    if (Array.isArray(errorArray)) {
        errorArray[index] = errors;
    }
};

export const isValidName= ({values, name, errors, index, errorArray}) => {
    const stagename = values[name];
    if (!stagename || stagename.trim() === "") {
        errors[name] = REQUIRED;
    }

    if (Array.isArray(errorArray)) {
        errorArray[index] = errors;
    }
};

export const validateMultiLang = ({values, name, value, errors, max, index, errorArray}) => {
    const array = values[name];
    if (Array.isArray(array)) {
        const modelErrors = [];

        // Apply validation to each about
        array.forEach((item, index) => {
            const itemErrors = {};

            if (!item || item[value].length > max) {
                itemErrors[value] = INVALID_STRING_LENGTH;
                modelErrors[index] = itemErrors;
            }
        });

        if (modelErrors.length) {
            errors[name] = modelErrors;
        }

        if (Array.isArray(errorArray)) {
            errorArray[index] = errors;
        }

    }
};

export const validateImageSize = ({image, name, errors}) => {
    if (image.size > UPLOAD_IMAGE_MAX_SIZE) {
        errors[name] = INVALID_IMAGE_SIZE;
    }
};

export const validateSchedule = ({values, name, errors, date = "date"}) => {
    const schedule = values[name];
    if (Array.isArray(schedule)) {
        const scheduleErrors = [];
        const fields = Array.isArray(date) ? date : [date];
        schedule.forEach((s, i) => {
            const modelErrors = {};
            fields.forEach(f => {
                if (!s[f] || !isValidDate(s[f])) {
                    modelErrors[s[f]] = REQUIRED;
                    scheduleErrors[i] = modelErrors;
                }
            })

        });

        if (scheduleErrors.length) {
            errors[name] = scheduleErrors;
        }
    }

};