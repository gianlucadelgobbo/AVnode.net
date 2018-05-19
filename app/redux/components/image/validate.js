import {validateImageSize, validateLength} from "../common/form/validators";

const validate = values => {

    const errors = {};
    const {images} = values;

    //images
    validateLength({values, name: "images", min: 1, max: 1, errors});

    if (Array.isArray(images) && images.length === 1) {
        const image = images[0];
        validateImageSize({image, name: "images", errors });
    }

    return errors
};

export default validate;