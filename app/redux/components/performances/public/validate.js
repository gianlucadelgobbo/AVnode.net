import {isValidName, isValidSlug, validateLength, validateMultiLang, isValidNumber} from "../../common/form/validators";
import {INVALID_STRING_3_100, INVALID_STRING_1_5} from "../../common/form/errors";

const performancePublicValidate = values => {

    const errors = {};

    //Title name
    validateLength({values, name: "title", min: 3, max: 100, errorKey:INVALID_STRING_3_100, errors});

    isValidName({values, name:"title", errors});

    // Slug
    isValidSlug({values,  name: "slug",  errors});

     // Abouts
    validateMultiLang({values, name: "abouts", value: "value", errors, max: 20000});
    
    //Price
    isValidName({values, name:"price", errors});

    //Duration
    isValidName({values, name:"duration", errors});

    //isValidName({values, name:"categories", errors});

    // Tech_art
    //validateMultiLang({values, name: "tech_arts", value: "value", errors, max: 100});
    
    // Tech_req
    //validateMultiLang({values, name: "tech_reqs", value: "value", errors, max: 100});

    return errors
};

export default performancePublicValidate;
