import {onlyFetchSlug} from '../../../reducers/actions';
import {getSlug} from './selectors'

const asyncValidate = (values, dispatch, state) => {
    let slugFromValues = values.slug;
    let slugFromState = getSlug(state);

    if (slugFromValues === slugFromState) {
        return new Promise(resolve => {
            resolve(true);
        });
    }

    return onlyFetchSlug(slugFromValues, dispatch)
        .then(response => {
            return response.exist ? {slug: 'That slug is taken'} : true;
        });

};

export default asyncValidate
