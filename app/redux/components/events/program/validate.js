import {isValidDate, validateLength} from "../../common/form/validators";

const validate = values => {

    const errors = {};
    const {program} = values;

    //program
    if (Array.isArray(program)) {
        let programErrors = [];
        program.forEach((s, i) => {
            let modelErrors = {};
            const {startdate, enddate} = s;

            if (!startdate || !isValidDate(startdate)) {
                modelErrors.startdate = 'Required';
                programErrors[i] = modelErrors;
            }

            if (!enddate || !isValidDate(enddate)) {
                modelErrors.startdate = 'Required';
                programErrors[i] = modelErrors;
            }

            //categories
            validateLength({
                values: s,
                name: "categories",
                min: 1,
                max: 2,
                index: i,
                errors: modelErrors,
                errorArray: programErrors
            });

        });

        if (programErrors.length) {
            errors.program = programErrors;
        }
    }

    return errors
};

export default validate;