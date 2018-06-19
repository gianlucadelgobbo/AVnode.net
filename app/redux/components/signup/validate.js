import {isValidSlug, validateLength} from "../common/form/validators";

const signupValidate = values => {

    const errors = {};

    let {password, confirmPassword} = values;

    //Stage name
    validateLength({values, name: "stagename", min: 3, max: 5, errors});

    // Slug
    //isValidSlug({values,  name: "slug",  errors});

    // addresses
    //validateLength({values, name: "addresses", min: 1, max: 5, errors});

    // password and confirmPassword must match
    if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords don't match"
    }

    return errors
};

export default signupValidate;