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
    }

    return errors
};

export default validate;