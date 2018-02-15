import slugvalidate from '../../../utilities/slug.js';
import validatorsObj from '../../../utilities/validators.js';

const validators = validatorsObj.validators;

const profilePublicValidate = values => {

  const errors = {};

  if (!values.surname || values.surname.trim() === "") {
      errors.surname = 'Surname Required';
  }
  if (!values.name || values.name.trim() === "") {
      errors.name = 'Name Required';
  }
  if (!values.stagename || values.stagename.trim() === "") {
      errors.stagename = 'Stage Name Required';
  }
  else if (!validators.validateStringLength(values.stagename, 2, 30)) {
      errors.stagename = 'Must be more or equal 2 and less or equal 30 characters';
  }
  if (!values.slug || values.slug.trim() === "") {
      errors.slug = 'Slug Required';
  }
  if(values.slug) {
    if(!validators.isSlug(values.slug)){
      errors.slug = 'Characters Not Allowed';
    }
  }
  if (!values.web || !values.web.length) {
      errors.web = { _error: 'At least one link must be entered' }
  } else {
      const webArrayErrors = [];
      values.web.forEach((w, windex) => {
      const webErrors = {};
      if (!w || !w.url) {
        webErrors.url = '';
      }
      else if (!validators.isUrl(w.url)){
        webErrors.url = 'Invalid link, please insert a valid link ';
        webArrayErrors[windex] =webErrors;
      }
      if (values.web.length > 5) {
        if (!webErrors.web) {
          webErrors.url = []
        }
        webErrors.url._error = 'No more than five link allowed'
        webArrayErrors[windex] = webErrors
      }
    });
  
    if (webArrayErrors.length) {
      errors.web = webArrayErrors;
    }
  }

  if (!values.social || !values.social.length) {
    errors.social = { _error: 'At least one link must be entered' }
  } else {
    const socialArrayErrors = [];
    values.social.forEach((s, sindex) => {
      const socialErrors = {};
      if (!s || !s.url) {
        socialErrors.url = '';
      }
      else if (!validators.isUrl(s.url)) {
        socialErrors.url = 'Invalid link, please insert a valid link ';
        socialArrayErrors[sindex] =socialErrors;
      }
    });
    if (socialArrayErrors.length) {
        errors.social = socialArrayErrors;
      }
    }
  
/*
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
  */
  return errors;
};
  
export default profilePublicValidate;