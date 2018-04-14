const validate = values => {

    const errors = {};
    const {images} = values;

    if (!images || (Array.isArray(images) && !images.length)) {
        errors.images = "Invalid amount of images (only 1)";
    }

    if (Array.isArray(images) && images.length > 1) {
        errors.images = "Invalid amount of images (only 1)";
    }

    return errors
};

export default validate;