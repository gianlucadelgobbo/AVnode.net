import validatorsObj from '../../../../utilities/validators.js';

const validators = validatorsObj.validators;

const profilePublicValidate = values => {

    const errors = {};

    if (!values.stagename || values.stagename.trim() === "") {
        errors.stagename = 'Stage Name Required';
    }
    else if (!validators.validateStringLength(values.stagename, 2, 30)) {
        errors.stagename = 'Must be more or equal 2 and less or equal 30 characters';
    }
    if (!values.slug || values.slug.trim() === "") {
        errors.slug = 'Slug Required';
    }
    if (values.slug) {
        if (!validators.isSlug(values.slug)) {
            errors.slug = 'Characters Not Allowed';
        }
    }

    //web
    if (values.web.length < 1 || values.web.length > 5) {
        errors.web = {_error: "Invalid length: please insert 1 to 5 values"}
    }

    //social
    if (values.social.length < 1 || values.social.length > 5) {
        errors.social = {_error: "Invalid length: please insert 1 to 5 values"}
    }

    //addresses
    if (values.addresses.length < 1 || values.social.length > 5) {
        errors.addresses = {_error: "Invalid length: please insert 1 to 5 values"}
    }

    return errors
};

export default profilePublicValidate;