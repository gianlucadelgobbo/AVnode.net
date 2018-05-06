import {isValidDate, isValidSlug, validateLength, validateMultiLang} from "../../common/form/validators";

const validate = values => {

    const errors = {};
    const {calls} = values;

    if (Array.isArray(calls)) {
        let callsErrors = [];
        calls.forEach((s, i) => {
            let modelErrors = {};
            const {start_date, end_date, packages, topics} = s;

            validateLength({
                values: s,
                name: "title",
                min: 3,
                max: 50,
                errors: modelErrors,
                index: i,
                errorArray: modelErrors
            });

            // Slug
            isValidSlug({values: s, name: "slug", errors, index: i, errorArray: modelErrors});

            if (!start_date || isValidDate(start_date)) {
                modelErrors.start_date = 'Required';
                callsErrors[i] = modelErrors;
            }

            if (!end_date || isValidDate(end_date)) {
                modelErrors.end_date = 'Required';
                callsErrors[i] = modelErrors;
            }

            //excerpt
            validateMultiLang({
                values,
                name: "excerpt",
                value: "value",
                errors,
                max: 5000,
                index: i,
                errorArray: modelErrors
            });

            //terms
            validateMultiLang({
                values,
                name: "terms",
                value: "value",
                errors,
                max: 5000,
                index: i,
                errorArray: modelErrors
            });

            //closedcalltext
            validateMultiLang({
                values,
                name: "closedcalltext",
                value: "value",
                errors,
                max: 5000,
                index: i,
                errorArray: modelErrors
            });

            //package
            if (Array.isArray(packages)) {
                let packageErrors = [];

                packages.forEach((p, i) => {
                    let pErrors = {};

                    //name
                    validateLength({
                        values: p,
                        name: "name",
                        min: 3,
                        max: 50,
                        errors: pErrors,
                        index: i,
                        errorArray: packageErrors
                    });

                    // price
                    validateLength({
                        values: p,
                        name: "price",
                        min: 3,
                        max: 50,
                        errors: pErrors,
                        index: i,
                        errorArray: packageErrors
                    });

                    //description
                    validateMultiLang({
                        values: p,
                        name: "description",
                        value: "value",
                        errors: pErrors,
                        max: 5000,
                        index: i,
                        errorArray: packageErrors
                    });

                    // options_name
                    validateLength({
                        values: p,
                        name: "options_name",
                        min: 3,
                        max: 50,
                        errors: pErrors,
                        index: i,
                        errorArray: packageErrors
                    });

                });

                if (packageErrors.length) {
                    errors.packages = packageErrors;
                }

            }

            //topics
            if (Array.isArray(topics)) {
                let topicsErrors = [];

                topics.forEach((p, i) => {
                    let tErrors = {};

                    //name
                    validateLength({
                        values: p,
                        name: "name",
                        min: 3,
                        max: 50,
                        errors: tErrors,
                        index: i,
                        errorArray: topicsErrors
                    });


                    //description
                    validateMultiLang({
                        values: p,
                        name: "description",
                        value: "value",
                        errors: tErrors,
                        max: 5000,
                        index: i,
                        errorArray: topicsErrors
                    });


                });

                if (topicsErrors.length) {
                    errors.topics = topicsErrors;
                }

            }

        });

        if (callsErrors.length) {
            errors[name] = callsErrors;
        }
    }


    return errors
};

export default validate;