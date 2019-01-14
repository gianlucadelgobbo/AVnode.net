import {
  isValidSlug,
  validateLength,
  isValidName,
  isValidDate
} from "../common/form/validators";
import { INVALID_STRING_3_50, INVALID_PASSWORD, REQUIRED } from "../common/form/errors";

const signupValidate = values => {
  const errors = {};

  let { subscribe, birthday, password, confirmPassword } = values;

  if (password !== confirmPassword) {
    errors.confirmPassword = INVALID_PASSWORD;
  }
  if(subscribe==="group"){
    isValidName({ values, name: "crewName", errors });
    isValidName({ values, name: "crewUrl", errors });
  }

  //Stage name
  validateLength({
    values,
    name: "stagename",
    min: 3,
    max: 50,
    errorKey: INVALID_STRING_3_50,
    errors
  });

  //Subscribe Single
  //isValidName({ values:"single", name: "subscribe", errors });

  //StageName
  isValidName({ values, name: "stagename", errors });

  //Slug
  isValidSlug({ values, name: "slug", errors });

  //Birthday
  if (!birthday || !isValidDate(birthday)) {
      errors.birthday = REQUIRED;
  }
  //Email
  isValidName({ values, name: "email", errors });

  //Address
  isValidName({ values, name: "addresses", errors });

  //Password
  isValidName({ values, name: "password", errors });
  
  //Password
  isValidName({ values, name: "confirmPassword", errors });

  return errors;
};

export default signupValidate;
