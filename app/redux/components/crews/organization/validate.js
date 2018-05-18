import validatorsObj from '../../../../utilities/validators.js';

const validators = validatorsObj.validators;

const validate = values => {

    const errors = {};

    if (!values.name || values.name.trim() === "") {
        errors.name = 'Organization Name Required';
    }
    else if (!validators.validateStringLength(values.name, 3, 50)) {
        errors.name = 'Must be more or equal 3 and less or equal 50 characters';
    }

    return errors
};

export default validate;