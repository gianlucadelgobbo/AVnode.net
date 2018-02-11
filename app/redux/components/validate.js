<<<<<<< HEAD
const validate = values => {

  const errors = {};
  let isError = false;

  if (!values.surname || values.surname.trim() === "") {
    errors.surname = 'Surname Required';
    isError = true;
  }
  if (!values.name || values.name.trim() === "") {
    errors.name = 'Name Required';
    isError = true;
  }
  if (!values.stagename || values.stagename.trim() === "") {
    errors.stagename = 'Stage Name Required';
    isError = true;
  }
  else if (values.stagename.length < 2) {
    errors.stagename = 'Must be 2 characters or more';
    isError = true;
  }
  else if (values.stagename.length > 30) {
    errors.stagename = 'Must be 30 characters or less';
    isError = true;
  }
  if (!values.slug || values.slug.trim() === "") {
    errors.slug = 'Slug Required';
    isError = true;
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
      else if (!/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(w.url)) {
        webErrors.url = 'Invalid link, please insert a valid link ';
        webArrayErrors[windex] =webErrors;
        isError = true;
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
      isError = true;
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
      else if (!/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(s.url)) {
        socialErrors.url = 'Invalid link, please insert a valid link ';
        socialArrayErrors[sindex] =socialErrors;
        isError = true;
      }
    });
    if (socialArrayErrors.length) {
        errors.social = socialArrayErrors;
        isError = true;
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
  
=======
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
  else if (values.stagename.length < 5) {
    errors.stagename = 'Must be 5 characters or more'
  }
  if (!values.slug) {
    errors.slug = 'Slug Required'
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
      else if (!/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(w.url)) {
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
      else if (!/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(s.url)) {
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
  
>>>>>>> e9b760e51eb977de4bb73244649abaa40fd303dc
export default validate;