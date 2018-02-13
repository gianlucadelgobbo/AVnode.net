const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
import { fetchSlug, fetchUser } from '../reducers/actions';
const asyncValidate = (values, dispatch ) => {
    let slugCurrentUser = values.slug;
    return dispatch(fetchUser()).then((data) => {
      return dispatch(fetchSlug(slugCurrentUser, dispatch)).then((response) => {
        if(data.json.slug!==slugCurrentUser&&response.payload.exist){
          throw { slug: 'That slug is taken' }
        }
        else {
          return true;
        }
      });
    });
    
  }

export default asyncValidate
