import {isValidDate, isValidSlug, validateLength, validateMultiLang} from "../../common/form/validators";

const validate = values => {

    const errors = {};
    const {calls} = values;

    if (Array.isArray(calls)) {
        let callsErrors = [];
        calls.forEach((s, i) => {
            let modelErrors = {};
            const {start_date, end_date, packages, topics} = s;

            //title
            validateLength({
                values: s,
                name: "title",
                min: 3,
                max: 50,
                errors: modelErrors,
                index: i,
                errorArray: callsErrors
            });

            // Slug
            isValidSlug({
                values: s,
                name: "slug",
                errors: modelErrors,
                index: i,
                errorArray: callsErrors
            });

            if (!start_date || !isValidDate(start_date)) {
                modelErrors.start_date = 'Required';
                callsErrors[i] = modelErrors;
            }

            if (!end_date || !isValidDate(end_date)) {
                modelErrors.end_date = 'Required';
                callsErrors[i] = modelErrors;
            }

            //categories
            validateLength({
                values: s,
                name: "categories",
                min: 1,
                max: 2,
                index: i,
                errors: modelErrors,
                errorArray: callsErrors
            });

            //excerpt
            validateMultiLang({
                values,
                name: "excerpt",
                value: "value",
                max: 5000,
                index: i,
                errors: modelErrors,
                errorArray: callsErrors
            });

            //terms
            validateMultiLang({
                values,
                name: "terms",
                value: "value",
                max: 5000,
                index: i,
                errors: modelErrors,
                errorArray: callsErrors
            });

            //closedcalltext
            validateMultiLang({
                values,
                name: "closedcalltext",
                value: "value",
                max: 5000,
                index: i,
                errors: modelErrors,
                errorArray: callsErrors
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
                    modelErrors.packages = packageErrors;
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
                    modelErrors.topics = topicsErrors;
                }

            }

        });

        if (callsErrors.length) {
            errors.calls = callsErrors;
        }
    }

    return errors
};

export default validate;