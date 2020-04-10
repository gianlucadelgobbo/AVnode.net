import {isValidName, isValidSlug, validateLength, validateMultiLang} from "../../common/form/validators";
import {
  INVALID_STRING_0_10,
  INVALID_STRING_3_50} from "../../common/form/errors";

const profilePublicValidate = values => {

  const errors = {};

  //Stage name
  validateLength({values, name: "stagename", min: 3, max: 50, errorKey: INVALID_STRING_3_50, errors});

  isValidName({values, name: "stagename", errors});

  // Slug
  isValidSlug({values, name: "slug", errors});
  validateLength({values, name: "slug", min: 3, max: 50, errorKey: INVALID_STRING_3_50, errors});

  //abouts
  validateMultiLang({values, name: "abouts", value: "value", errors, max: 10000});

  // web
  validateLength({values, name: "web", min: 0, max: 10, errorKey: INVALID_STRING_0_10, errors});

  // social
  validateLength({values, name: "social", min: 0, max: 10, errorKey: INVALID_STRING_0_10, errors});

  // addresses
  validateLength({values, name: "addresses", min: 0, max: 10, errorKey: INVALID_STRING_0_10, errors});

  return errors;
};

export default profilePublicValidate;