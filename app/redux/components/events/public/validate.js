import {validateSchedule, validateLength, isValidSlug, validateMultiLang} from "../../common/form/validators";
import {INVALID_STRING_3_50, INVALID_STRING_1_5, INVALID_STRING_1_3} from "../../common/form/errors";

const profilePublicValidate = values => {

    const errors = {};

    //categories
    validateLength({values, name: "categories", min: 1, max: 3, errorKey:INVALID_STRING_1_3, errors});

    //schedule
    validateSchedule({values, name:"schedule", errors});

    // Slug
    isValidSlug({values,  name: "slug",  errors});

    //title
    validateLength({values, name: "title", min: 3, max: 50, errorKey:INVALID_STRING_3_50, errors});

    //subtitles
    validateMultiLang({values, name: "subtitles", value: "value", errors, max: 50});

    //abouts
    validateMultiLang({values, name: "abouts", value: "value", errors, max: 15000});

    // web
    validateLength({values, name: "web", min: 1, max: 5, errorKey:INVALID_STRING_1_5, errors});

    // social
    validateLength({values, name: "social", min: 1, max: 5, errorKey:INVALID_STRING_1_5, errors});

    // emails
    validateLength({values, name: "emails", min: 1, max: 5, errorKey:INVALID_STRING_1_5, errors});

    // phones
    validateLength({values, name: "phones", min: 1, max: 5, errorKey:INVALID_STRING_1_5, errors});

    return errors
};

export default profilePublicValidate;