import {
    isValidName,
    validateLength,
    isValidSlug
  } from "../../../common/form/validators";
  import { INVALID_STRING_3_100 } from "../../../common/form/errors";
  
  const validate = values => {
    const errors = {};
  
    isValidName({ values, name: "title", errors });
  
    isValidSlug({ values, name: "slug", errors });
  
    validateLength({
      values,
      name: "slug",
      min: 3,
      max: 100,
      errorKey: INVALID_STRING_3_100,
      errors
    });
  
    return errors;
  };
  
  export default validate;
  