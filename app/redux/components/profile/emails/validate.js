import validatorsObj from '../../../../utilities/validators.js';
import {REQUIRED, INVALID_EMAIL, DEFINE_LEAST_EMAIL, MULTIPLE_PRIMARY_EMAIL, NO_PRIMARY_EMAIL} from "../../common/form/errors";

const validate = values => {
    const errors = {};

    // If no email is defined
    if (!values.emails) {
        errors.emails = DEFINE_LEAST_EMAIL;
        return errors;
    }

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