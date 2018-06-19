import {isValidName, isValidSlug, validateLength, validateMultiLang} from "../../common/form/validators";

const crewPublicValidate = values => {

    const errors = {};

    //Stage name
    validateLength({values, name: "stagename", min: 3, max: 5, errors});

    isValidName({values, name:"stagename", errors});

    // Slug
    isValidSlug({values,  name: "slug",  errors});

     // Abouts
    validateMultiLang({values, name: "abouts", value: "value", errors, max: 5000});

    // Social
    validateLength({values, name: "social", min: 1, max: 5, errors});
    
    // Web
    validateLength({values, name: "web", min: 1, max: 5, errors});

    return errors
};

export default crewPublicValidate;
