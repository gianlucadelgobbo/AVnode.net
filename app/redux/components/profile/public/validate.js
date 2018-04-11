import validatorsObj from '../../../../utilities/validators.js';

const validators = validatorsObj.validators;

const profilePublicValidate = values => {

    const errors = {};
    const {stagename, slug, web, social, addresses, abouts} = values;

    // ==== Stage name
    // Must exist
    if (!stagename || stagename.trim() === "") {
        errors.stagename = 'Stage Name Required';
    }
    // If exist, length must be between 3 and 50
    else if (3 >= stagename.length || stagename.length >= 50) {
        errors.stagename = 'Invalid string length (min 3, max 50)';
    }

    // ==== Slug
    // Must exist
    if (!slug || slug.trim() === "") {
        errors.slug = 'Slug Required';
    }
    if (slug) {
        // Cannot contains invalid chars
        if (!validators.isSlug(values.slug)) {
            errors.slug = 'Invalid characters';
        }
    }

    // ==== abouts
    // if exist



    // ==== web
    // Must exists and length must be min 1 max 5
    if (!web || (web.length < 1 || web.length > 5)) {
        errors.web = {_error: "Invalid length: please insert 1 to 5 values"}
    }

    // ==== errors
    // Must exists and length must be min 1 max 5
    if (!social || (social.length < 1 || social.length > 5)) {
        errors.social = {_error: "Invalid length: please insert 1 to 5 values"}
    }

    // ==== addresses
    // Must exists and length must be min 1 max 5
    if (!addresses || (addresses.length < 1 || social.length > 5)) {
        errors.addresses = {_error: "Invalid length: please insert 1 to 5 values"}
    }

    return errors
};

export default profilePublicValidate;