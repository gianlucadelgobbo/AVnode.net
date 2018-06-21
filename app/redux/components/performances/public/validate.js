import {isValidName, isValidSlug, validateLength, validateMultiLang} from "../../common/form/validators";

const performancePublicValidate = values => {

    const errors = {};

    //Title name
    validateLength({values, name: "title", min: 3, max: 50, errors});

    isValidName({values, name:"title", errors});

    // Slug
    isValidSlug({values,  name: "slug",  errors});

     // Abouts
    validateMultiLang({values, name: "abouts", value: "value", errors, max: 5000});
    
    //Price
    isValidName({values, name:"price", errors});

    //Duration
    isValidName({values, name:"duration", errors});

    // Tech_art
    //validateMultiLang({values, name: "tech_art", value: "value", errors, max: 100});
    
    // Tech_req
    //validateMultiLang({values, name: "tech_req", value: "value", errors, max: 100});

    return errors
};

export default performancePublicValidate;
