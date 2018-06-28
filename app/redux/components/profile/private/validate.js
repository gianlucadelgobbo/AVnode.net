import {validateLength, isValidName} from "../../common/form/validators";
import {INVALID_STRING_3_20, INVALID_STRING_1_5} from "../../common/form/errors";


const validate = values => {

    const errors = {};

    //name
    validateLength({values, name: "name", min: 3, max: 20, errorKey:INVALID_STRING_3_20, errors});

    isValidName({values, name:"name", errors});

    //surname
    validateLength({values, name: "surname", min: 3, max: 20, errorKey:INVALID_STRING_3_20,  errors});
    
    isValidName({values, name:"surname", errors});

    //private addresses
    validateLength({values, name: "addresses_private", min: 1, max: 5, errorKey:INVALID_STRING_1_5, errors});
    //phone
    validateLength({values, name: "phone", min: 1, max: 5, errorKey:INVALID_STRING_1_5, errors});
    //mobile
    validateLength({values, name: "mobile", min: 1, max: 5, errorKey:INVALID_STRING_1_5, errors});
    //skype
    validateLength({values, name: "skype", min: 1, max: 5, errorKey:INVALID_STRING_1_5, errors});

    return errors
};

export default validate;