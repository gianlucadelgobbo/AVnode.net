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
    /*if (!values.birthday) {
      errors.birthday = 'Required'
    } else if (isNaN(Number(values.birthday))) {
        errors.birthday = 'Must be a number'
    }*/
    return errors
  }
  
  export default validate;