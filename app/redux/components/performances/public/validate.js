import validatorsObj from '../../../../utilities/validators.js';

const validators = validatorsObj.validators;

const validate = values => {

    const errors = {};
    const {title, slug, abouts, price, duration} = values;

    if (!title || title.trim() === "") {
        errors.title = 'Title Required';
    }
    else if (!validators.validateStringLength(title, 2, 30)) {
        errors.title = 'Must be more or equal 2 and less or equal 30 characters';
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
       
    return errors
};

export default validate;