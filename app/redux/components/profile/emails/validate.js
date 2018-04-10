import validatorsObj from '../../../../utilities/validators.js';

const validate = values => {
    const errors = {};

    if (!values.emails) {
        errors.emails = {_error: "Define at least one email"};
    } else {
        // check only one email is primary
        const isMultiplePrimary = values.emails.filter(e => e.is_primary).length > 1;
        if (isMultiplePrimary) {
            errors.emails = {_error: "Multiple primary"};
        }

        // check that are all valid emails
        const emailArrayErrors = [];
        values.emails.forEach((email, index) => {
            const emailErrors = {};
            if (!email || !email.email) {
                emailErrors.email = 'Required';
                emailArrayErrors[index] = emailErrors
            }

            if (!email || !validatorsObj.validators.isEmail(email.email)) {
                emailErrors.email = 'Invalid email';
                emailArrayErrors[index] = emailErrors
            }
        });

        if (emailArrayErrors.length) {
            errors.emails = emailArrayErrors
        }
    }

    return errors
};

export default validate;