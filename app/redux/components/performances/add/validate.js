const validate = values => {
    const errors = {};

    if (!values.title || values.title.trim() === "") {
        errors.title = 'Name Required';
    }

    return errors
};

export default validate;