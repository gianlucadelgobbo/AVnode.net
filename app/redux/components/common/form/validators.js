import {fetchSlug} from '../../../api';
import {geocodeByAddress} from "react-places-autocomplete";
import moment from 'moment';
import validatorsObj from '../../../../utilities/validators.js';
import {UPLOAD_IMAGE_MAX_SIZE} from "../../../conf";
import {DATE_FORMAT} from '../../../conf'

const validators = validatorsObj.validators;

export const validateSlug = ({value, previousValue, promises, result, index, errorArray}) => {
    // slug
    let slugFromValues = value;
    if (slugFromValues !== previousValue) {
        promises.push(fetchSlug(slugFromValues)
            .then(response => {
                if (response.exist) {
                    Object.assign(result, {slug: 'That slug is taken'});
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

export const isValidDate = (date) => {
    if (!date) {
        return false;
    }
    const wrapper = (typeof date === "string" ? moment(date, DATE_FORMAT) : date);
    return wrapper.isValid();
};

export const validateLength = ({values, name, min, max, errors, index, errorArray}) => {
    let value = values[name];

    if (value && !!value.trim) {
        value = value.trim();
    }

    if (!value || (value.length < min || value.length > max)) {
        errors[name] = {_error: `Invalid length: please insert ${min} to ${max} values`};
    }

    if (Array.isArray(errorArray)) {
        errorArray[index] = errors;
    }
};

export const isValidSlug = ({values, name, errors, index, errorArray}) => {
    const slug = values[name];
    if (!slug || slug.trim() === "") {
        errors[name] = 'Slug Required';
    }
    if (slug) {
        if (!validators.isSlug(slug)) {
            errors[name] = 'Characters Not Allowed';
        }
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
                itemErrors[value] = 'Invalid string length (max 5000)';
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
        errors[name] = "Invalid image size";
    }
};

export const validateSchedule = ({values, name, errors, date = "date"}) => {
    const schedule = values[name];
    console.log("values ->", values, name, schedule)
    if (Array.isArray(schedule)) {
        const scheduleErrors = [];
        const fields = Array.isArray(date) ? date : [date];
        console.log("fields", fields)
        schedule.forEach((s, i) => {
            const modelErrors = {};
            fields.forEach(f => {
                if (!s[f] || !isValidDate(s[f])) {
                    modelErrors[s[f]] = 'Required';
                    scheduleErrors[i] = modelErrors;
                }
            })

        });

        if (scheduleErrors.length) {
            errors[name] = scheduleErrors;
        }
    }

};