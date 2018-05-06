import {isValidDate, validateLength, isValidSlug, validateMultiLang} from "../../common/form/validators";

const profilePublicValidate = values => {

    const errors = {};
    const {schedule} = values;

    //categories
    validateLength({values, name: "categories", min: 1, max: 2, errors});

    //schedule
    if (Array.isArray(schedule)) {
        const scheduleErrors = [];
        schedule.forEach((s, i) => {

            const {date} = s;
            const modelErrors = {};

            if (!date || isValidDate(date)) {
                modelErrors.date = 'Required';
                scheduleErrors[i] = modelErrors;
            }


        })
    }

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

    // addresses
    validateLength({values, name: "addresses", min: 1, max: 5, errors});

    // addresses
    validateLength({values, name: "stagename", min: 2, max: 30, errors});

    // Slug
    isValidSlug({slug: values.slug, errors});


    return errors
};

export default profilePublicValidate;