import {validateLength, validateSchedule} from "../../common/form/validators";

const validate = values => {

    const errors = {};

    //schedule
    validateSchedule({values, name: "schedule", errors, date: "programdate"});

    //categories
    validateLength({values, name: "categories", min: 1, max: 2, errors});

    return errors
};

export default validate;