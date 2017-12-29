const validate = values => {
  const errors = {};
  if (!values.surname) {
    errors.surname = 'Required';
  }
  if (!values.name) {
    errors.name = 'Required';
  }  
  if (values.abouts) {
    const aboutsArrayErrors = [];
    values.abouts.forEach((about, aboutIndex) => {
      const aboutErrors = {};
      if (!about || !about.lang) {
        aboutErrors.lang = 'Required';
        aboutsArrayErrors[aboutIndex] = aboutErrors;
      }
      if (!about || !about.abouttext) {
        aboutErrors.abouttext = 'Required';
        aboutsArrayErrors[aboutIndex] = aboutErrors;
      }     
    });
    if (aboutsArrayErrors.length) {
      errors.abouts = aboutsArrayErrors;
    }
  }
  return errors;
}
  
export default validate;