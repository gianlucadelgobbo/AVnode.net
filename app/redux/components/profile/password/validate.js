import {INVALID_PASSWORD, INVALID_PASSWORD_LENGTH, INVALID_PASSWORD_CONTENT} from "../../common/form/errors";
import {PASSWORD_MIN_LENGTH} from "./constants";

const validate = values => {

    const errors = {};
    let {password, confirmPassword} = values;

    // password and confirmPassword must match
    if (password !== confirmPassword) {
        errors.confirmPassword = INVALID_PASSWORD;
    }

    // Check password length
    if (!password || password.length < PASSWORD_MIN_LENGTH) {
        errors.password = INVALID_PASSWORD_LENGTH;
    }

    // Check password content
    // Must contain at least a number, a capital letter and a lower case letter
    if (!hasNumber(password) || !hasLowerCase(password) || !hasUpperCase(password)){
        errors.password = INVALID_PASSWORD_CONTENT;
    }

    return errors
};

const hasNumber = (str) => /\d/.test(str);
const hasLowerCase = (str) => /[a-z]/.test(str);
const hasUpperCase = (str) => /[A-Z]/.test(str);


export default validate;