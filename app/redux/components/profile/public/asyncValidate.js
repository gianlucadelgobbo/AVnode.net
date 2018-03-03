import {onlyFetchSlug} from '../../../reducers/actions';
import {getSlug} from './selectors'

const asyncValidate = (values, dispatch, state) => {
    let slugFromValues = values.slug;
    let slugFromState = getSlug(state);

    if (slugFromValues === slugFromState) {
        return new Promise(() => {
            console.log("same")
            return true;
        });
    }

    return onlyFetchSlug(slugFromValues, dispatch)
        .then(response => {
            console.log("return only fetch")
            return response.exist ? {slug: 'That slug is taken'} : true;
        });

};

export default asyncValidate
