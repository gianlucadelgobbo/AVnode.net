import {
  isValidSlug,
  validateLength,
  isValidName,
  isValidDate
} from "../common/form/validators";
import { INVALID_STRING_3_50, INVALID_PASSWORD } from "../common/form/errors";

const signupValidate = values => {
  const errors = {};

  const { birthday } = values;

  let { password, confirmPassword } = values;

  if (password !== confirmPassword) {
    errors.confirmPassword = INVALID_PASSWORD;
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

  isValidName({ values, name: "stagename", errors });

  //Crew Name
  //isValidName({values, name:"crewName", errors});

  //Crew Profile
  //isValidName({values, name:"CrewProfile", errors});

  // Slug
  isValidSlug({ values, name: "slug", errors });

  //Birthdate
  //isValidName({values, name:"birthdate", errors});

  //Email
  isValidName({ values, name: "email", errors });
  //Address
  isValidName({ values, name: "city", errors });
  //Password
  isValidName({ values, name: "password", errors });
  //Password
  isValidName({ values, name: "confirmPassword", errors });

  return errors;
};

export default signupValidate;
