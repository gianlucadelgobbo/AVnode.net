import validatorsObj from '../../../../utilities/validators.js';

const validators = validatorsObj.validators;

const validate = values => {

    const errors = {};

    const { stagename, slug, web, social, abouts } = values;
    
    //Crew Name exist
    if (!stagename || stagename.trim() === "") {
        errors.stagename = 'Crew Name Required';
    }
    else if (!validators.validateStringLength(stagename, 2, 30)) {
        errors.stagename = 'Must be more or equal 2 and less or equal 30 characters';
    }
    //Slug exists
    if (!slug || slug.trim() === "") {
        errors.slug = 'Slug Required';
    }
    if (slug) {
        if (!validators.isSlug(slug)) {
            errors.slug = 'Characters Not Allowed';
        }
    }
    // if exist
    if (Array.isArray(abouts)) {
        const aboutArrayErrors = [];

        // Apply validation to each about
        abouts.forEach((about, index) => {
            const aboutErrors = {};

            // length must be less than 5000 chars
            if (!about || about.value.length > 5000) {
                aboutErrors.value = 'Invalid string length (max 5000)';
                aboutArrayErrors[index] = aboutErrors;
            }
        });

        if (aboutArrayErrors.length) {
            errors.abouts = aboutArrayErrors;
        }
    }
    //web
    if (!web || (web.length < 1 || web.length > 5)) {
        errors.web = {_error: "Invalid length: please insert 1 to 5 values"}
    }

    //social
    if (!social || (social.length < 1 || social.length > 5)) {
        errors.social = {_error: "Invalid length: please insert 1 to 5 values"}
    }

    return errors
};

export default validate;