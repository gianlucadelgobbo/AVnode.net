import {validateLength} from "../../common/form/validators";

const validate = values => {

    const errors = {};

    //name
    validateLength({values, name: "name", min: 3, max: 20, errors});

    //surname
    validateLength({values, name: "surname", min: 3, max: 20, errors});

    return errors
};

export default validate;