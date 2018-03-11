const validate = values => {

    const errors = {};
    let {password, confirmPassword} = values;

    // password and confirmPassword must match
    if (password !== confirmPassword) {
        errors.confirmPassword = "Passowrd don't match"
    }


    return errors
};

export default validate;