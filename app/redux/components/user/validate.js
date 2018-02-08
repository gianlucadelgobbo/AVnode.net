const validate = values => {
    const errors = {}
    if (!values.surname) {
      errors.surname = 'Surname Required'
    }
    if (!values.name) {
      errors.name = 'Name Required'
    }
    if (!values.stagename) {
      errors.stagename = 'Stage Name Required'
    }
    if (!values.slug) {
      errors.slug = 'Slug Required'
    }
    if (!values.web || !values.web.length) {
      errors.web = { _error: 'At least one link must be entered' }
    } else {
      const weblinkArrayErrors = []
      values.web.forEach((link, linkindex) => {
        const linkErrors = {}
        if (!link || !link.url) {
          linkErrors.url = 'Required'
          weblinkArrayErrors[linkindex] = linkErrors
        }
      });
    }
    return errors
  }
  
  export default validate;