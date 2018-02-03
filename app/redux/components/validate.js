const validate = values => {
  const errors = {};
  if (!values.surname) {
    errors.surname = 'Surname Required';
  }
  if (!values.name) {
    errors.name = 'Name Required';
  }
  if (!values.stagename) {
    errors.stagename = 'Stage Name Required'
  }
  if (!values.slug) {
    errors.slug = 'Slug Required'
  }  
  if (values.emails) {
    const emailsArrayErrors = [];
    values.emails.forEach((email, emailIndex) => {
      const emailErrors = {};
      if (!email || !email.email) {
        emailErrors.email = 'Required';
        emailsArrayErrors[emailIndex] = emailErrors;
      }
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email.email)) {
        emailErrors.email = 'Invalid email address';
        emailsArrayErrors[emailIndex] = emailErrors;
      }
    });
    if (emailsArrayErrors.length) {
      errors.emails = emailsArrayErrors;
    }
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
};
  
export default validate;