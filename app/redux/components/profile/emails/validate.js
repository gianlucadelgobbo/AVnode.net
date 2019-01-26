import validatorsObj from '../../../../utilities/validators.js';
import {
    DEFINE_LEAST_EMAIL,
    DUPLICATED_EMAIL,
    INVALID_EMAIL,
    MULTIPLE_PRIMARY_EMAIL,
    NO_PRIMARY_EMAIL,
    REQUIRED
} from "../../common/form/errors";

const find_duplicate_in_array = (arra1) => {
    let object = {};
    let result = [];

    arra1.forEach(function (item) {
        if (!object[item])
            object[item] = 0;
        object[item] += 1;
    });

    for (let prop in object) {
        if (object[prop] >= 2) {
            result.push(prop);
        }
    }

    return result;

};

const validate = values => {
    const errors = {};

    // If no email is defined
    if (!values.emails || !Array.isArray(values.emails)) {
        errors.emails = DEFINE_LEAST_EMAIL;
        return errors;
    }
    const duplicates = find_duplicate_in_array(values.emails.map(e => e.email));

    // check that are all valid emails
    const emailArrayErrors = [];
    values.emails.forEach((email, index) => {
        const emailErrors = {};
        if (!email || !email.email) {
            emailErrors.email = REQUIRED;
            emailArrayErrors[index] = emailErrors
        }

        if (!email || !validatorsObj.validators.isEmail(email.email)) {
            emailErrors.email = INVALID_EMAIL;
            emailArrayErrors[index] = emailErrors
        }

        if (duplicates.indexOf(email.email) >= 0) {
            emailErrors.email = DUPLICATED_EMAIL;
            emailArrayErrors[index] = emailErrors
        }

    });
    if (emailArrayErrors.length) {
        errors.emails = emailArrayErrors
    }

    // check that only one and only one email is primary
    const primaryEmailAmount = values.emails.filter(e => e.is_primary).length;
    const isMultiplePrimary = primaryEmailAmount > 1;
    const noMultiplePrimary = primaryEmailAmount === 0;

    if (isMultiplePrimary) {
        errors.emails = {_error: MULTIPLE_PRIMARY_EMAIL};
    }
    if (noMultiplePrimary) {
        errors.emails = {_error: NO_PRIMARY_EMAIL};
    }

    // Selector already implement the check that if an email is not confirmed
    // it cannot be set as primary email

    return errors
};

export default validate;