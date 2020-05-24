import {
  isValidName,
  validateLength,
  isValidSlug
} from "../../common/form/validators";
import { INVALID_STRING_3_100 } from "../../common/form/errors";

const validate = values => {
  let errors = {};

  isValidName({ values, name: "title", errors });

  isValidName({ values, name: "externalurl", errors });

  if (!errors.title || !errors.externalurl) errors = {};

  console.log(errors);

  /* isValidSlug({ values, name: "slug", errors });

  validateLength({
    values,
    name: "slug",
    min: 3,
    max: 100,
    errorKey: INVALID_STRING_3_100,
    errors
  }); */

  return errors;
};

export default validate;
