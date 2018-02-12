const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
import { fetchSlug } from '../reducers/actions';
const asyncValidate = (values, dispatch ) => {
    return dispatch(fetchSlug(values.slug, dispatch)).then((response) => {
      if(response.payload.exist) {
        throw { slug: 'That slug is taken' }
      }
    });
  }

export default asyncValidate


/*



const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
import { fetchSlug } from '../reducers/actions';

const asyncValidate = (values, dispatch ) => {
  return dispatch(fetchSlug(values.slug, dispatch)).then(
    (error) => values.stagename =  'That username is taken' || null
).catch((error) => null)

  }
  //})
//}

export default asyncValidate





*/