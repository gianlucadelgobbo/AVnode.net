const validate = values => {

    const errors = {};
    let {password, confirmPassword} = values;

    // password and confirmPassword must match
    if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords don't match"
    }


    return errors
};

export default validate;