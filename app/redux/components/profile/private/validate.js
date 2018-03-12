import validatorsObj from '../../../../utilities/validators.js';

const validators = validatorsObj.validators;

const validate = values => {

    const errors = {};

    if (!values.name || values.name.trim() === "") {
        errors.name = 'Name Required';
    }
    else if (!validators.validateStringLength(values.name, 3, 50)) {
        errors.name = 'Must be more or equal 3 and less or equal 50 characters';
    }
    if (!values.surname || values.surname.trim() === "") {
        errors.surname = 'Surname Required';
    }
    else if (!validators.validateStringLength(values.surname, 3, 50)) {
        errors.surname = 'Must be more or equal 3 and less or equal 50 characters';
    }

    return errors
};

export default validate;