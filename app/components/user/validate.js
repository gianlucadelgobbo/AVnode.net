const validate = values => {
  const errors = {};
  if (!values.surname) {
    errors.surname = 'Required';
  }
  if (!values.name) {
    errors.name = 'Required';
  }
  return errors;
}
  
export default validate;