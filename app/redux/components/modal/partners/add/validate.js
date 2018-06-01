const validate = values => {

    const errors = {};
    const {partner, category} = values;

    if (!partner || !partner._id) {
        errors.partner = "Mandatory"
    }

    if (!category || !category.value) {
        errors.category = "Mandatory"
    }

    return errors
};

export default validate;