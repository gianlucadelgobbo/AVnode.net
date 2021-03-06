import validatorsObj from '../../../../utilities/validators.js';
import {isValidName, isValidSlug, validateLength, validateMultiLang} from "../../common/form/validators";
import {INVALID_STRING_3_100} from "../../common/form/errors";

const validators = validatorsObj.validators;

const validate = values => {

    const errors = {};

    //Title name
    validateLength({values, name: "title", min: 3, max: 100, errorKey:INVALID_STRING_3_100, errors});

    isValidName({values, name:"title", errors});

    // Slug
    isValidSlug({values,  name: "slug",  errors});

     // Abouts
    validateMultiLang({values, name: "abouts", value: "value", errors, max: 20000});

    return errors
};

export default validate;