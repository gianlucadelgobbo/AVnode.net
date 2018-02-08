import {
validateUserFields
} from '../reducers/actions';
const asyncValidate = (values , dispatch ) => {
  
  return new Promise((resolve, reject) => {
    dispatch(validateUserFields(values))
    .then((response) => {
     console.log(response);
    }); //dispatch
  }); //promise
};

export default asyncValidate;
