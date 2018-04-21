import validatorsObj from '../../../../utilities/validators.js';

const validators = validatorsObj.validators;

const profilePublicValidate = values => {

    const errors = {};
    const {title, slug, abouts, price, duration, tech_art, tech_req} = values;

    if (!title || title.trim() === "") {
        errors.title = 'Title Required';
    }
    else if (!validators.validateStringLength(title, 2, 50)) {
        errors.title = 'Must be more or equal 2 and less or equal 50 characters';
    }
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

    if (!price|| price.trim() === "") {
        errors.price = 'Price Required';
    }

    if (!duration|| duration.trim() === "") {
        errors.duration = 'Duration Required';
    }
    //tech_art
    if (Array.isArray(tech_art)) {
        const techArrayErrors = [];

        // Apply validation to each tech_art
        tech_art.forEach((tech, index) => {
            const techErrors = {};

            // length must be less than 5000 chars
            if (!tech || tech.value.length > 5000) {
                techErrors.value = 'Invalid string length (max 500)';
                techArrayErrors[index] = techErrors;
            }
        });

        if (techArrayErrors.length) {
            errors.tech_art = techArrayErrors;
        }
    }
    //tech_req
    if (Array.isArray(tech_req)) {
        const techArrayErrors = [];

        // Apply validation to each tech_req
        tech_req.forEach((tech, index) => {
            const techErrors = {};

            // length must be less than 5000 chars
            if (!tech || tech.value.length > 5000) {
                techErrors.value = 'Invalid string length (max 500)';
                techArrayErrors[index] = techErrors;
            }
        });

        if (techArrayErrors.length) {
            errors.tech_req = techArrayErrors;
        }
    }
       
    return errors
};

export default profilePublicValidate;