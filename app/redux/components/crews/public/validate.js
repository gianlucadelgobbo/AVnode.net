import {isValidName, isValidSlug, validateLength, validateMultiLang} from "../../common/form/validators";
import {INVALID_STRING_3_100, INVALID_STRING_1_15} from "../../common/form/errors";

const crewPublicValidate = values => {

    const errors = {};

    //Stage name
    validateLength({values, name: "stagename", min: 3, max: 100, errorKey:INVALID_STRING_3_100, errors});

    isValidName({values, name:"stagename", errors});

    // Slug
    isValidSlug({values,  name: "slug",  errors});

     // Abouts
    validateMultiLang({values, name: "abouts", value: "value", errors, max: 20000});

    // Social
    validateLength({values, name: "social", min: 1, max: 15, errorKey:INVALID_STRING_1_15, errors});
    
    // Web
    validateLength({values, name: "web", min: 1, max: 15, errorKey:INVALID_STRING_1_15, errors});

    return errors
};

export default crewPublicValidate;
