import {isValidSlug, validateLength, validateMultiLang} from "../../common/form/validators";

const profilePublicValidate = values => {

    const errors = {};

    //Stage name
    validateLength({values, name: "stagename", min: 3, max: 5, errors});

    // Slug
    isValidSlug({values,  name: "slug",  errors});

    //abouts
    validateMultiLang({values, name: "abouts", value: "value", errors, max: 5000});

    // web
    validateLength({values, name: "web", min: 1, max: 5, errors});

    // social
    validateLength({values, name: "social", min: 1, max: 5, errors});

    // addresses
    validateLength({values, name: "addresses", min: 1, max: 5, errors});

    return errors
};

export default profilePublicValidate;