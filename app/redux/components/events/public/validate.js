import {validateSchedule, validateLength, isValidSlug, validateMultiLang} from "../../common/form/validators";

const profilePublicValidate = values => {

    const errors = {};

    //categories
    validateLength({values, name: "categories", min: 1, max: 2, errors});

    //schedule
    validateSchedule({values, name:"schedule", errors});

    // Slug
    isValidSlug({values,  name: "slug",  errors});

    //title
    validateLength({values, name: "title", min: 3, max: 50, errors});

    //subtitles
    validateMultiLang({values, name: "subtitles", value: "value", errors, max: 5000});

    //abouts
    validateMultiLang({values, name: "abouts", value: "value", errors, max: 5000});

    // web
    validateLength({values, name: "web", min: 1, max: 5, errors});

    // social
    validateLength({values, name: "social", min: 1, max: 5, errors});

    // emails
    validateLength({values, name: "emails", min: 1, max: 5, errors});

    // phones
    validateLength({values, name: "phones", min: 2, max: 30, errors});

    return errors
};

export default profilePublicValidate;