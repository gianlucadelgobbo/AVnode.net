const validate = values => {
    const errors = {};

    // check only one email is primary
    const isMultiplePrimary = values.emails.filter(e => e.is_primary).length > 1;
    if (isMultiplePrimary) {
        errors.emails = {_error: "Multiple primary"};
    }

    return errors
};

export default validate;