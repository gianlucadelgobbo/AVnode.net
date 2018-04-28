import {UPLOAD_IMAGE_MAX_SIZE} from '../../../../conf'

const validate = values => {

    const errors = {};
    const {images} = values;

    if (!images || (Array.isArray(images) && !images.length)) {
        errors.images = "Invalid amount of images (only 1)";
    }

    if (Array.isArray(images) && images.length > 1) {
        errors.images = "Invalid amount of images (only 1)";
    }

    if (Array.isArray(images) && images.length === 1) {
        const image = images[0];

        if (image.size > UPLOAD_IMAGE_MAX_SIZE) {
            errors.images = "Invalid image size";
        }
    }

    return errors
};

export default validate;