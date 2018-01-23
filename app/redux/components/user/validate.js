const validate = values => {
    const errors = {}
    if (!values.surname) {
      errors.surname = 'Required'
    }
    if (!values.name) {
      errors.name = 'Required'
    }
    /*if (!values.birthday) {
      errors.birthday = 'Required'
    } else if (isNaN(Number(values.birthday))) {
        errors.birthday = 'Must be a number'
    }*/
    return errors
  }
  
  export default validate;