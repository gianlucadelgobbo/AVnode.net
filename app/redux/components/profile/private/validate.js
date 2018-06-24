import {validateLength, isValidName} from "../../common/form/validators";

const validate = values => {

    const errors = {};

    //name
    validateLength({values, name: "name", min: 3, max: 20, errors});

    isValidName({values, name:"name", errors});

    //surname
    validateLength({values, name: "surname", min: 3, max: 20, errors});
    
    isValidName({values, name:"surname", errors});

    //addresses
    validateLength({values, name: "addresses_private", min: 1, max: 5, errors});

    return errors
};

export default validate;