const validate = values => {
  const errors = {};

  if (!values.name || values.name.trim() === "") {
    errors.name = "Name Required";
  }

  return errors;
};

export default validate;
