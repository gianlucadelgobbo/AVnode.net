const validate = (values, {hideCategory}) => {

    const errors = {};
    const {partner, category} = values;

    if (!partner || !partner._id) {
        errors.partner = "Mandatory"
    }

    if (!hideCategory && (!category || !category.value)) {
        errors.category = "Mandatory"
    }

    return errors
};

export default validate;