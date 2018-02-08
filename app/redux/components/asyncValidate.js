import { fetchSlug, editUser } from '../reducers/actions';
const asyncValidate = (values , dispatch ) => {
  
  return new Promise((resolve, reject) => {
    dispatch(fetchSlug(values.slug, dispatch))
    .then((response) => {
     //console.log(response);
     const exist =  response.payload.slug.exist;
     if(exist){
      throw { slug: 'That slug is taken' }
     }
     else{
       dispatch(editUser);
     }
    }); //dispatch
  }); //promise
};

export default asyncValidate;
