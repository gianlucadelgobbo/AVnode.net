import {INVALID_PASSWORD} from "../../common/form/errors";

const validate = values => {

    const errors = {};
    let {password, confirmPassword} = values;

    // password and confirmPassword must match
    if (password !== confirmPassword) {
        errors.confirmPassword = INVALID_PASSWORD;
    }


    return errors
};

export default validate;