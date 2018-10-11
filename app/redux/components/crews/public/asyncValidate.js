import {validateSlug, validateAddress} from "../../common/form/validators";
import {checkIfError} from '../../common/form';
import {fetchSlugCrew as fetchSlug} from '../../../api';

const asyncValidate = (values, dispatch, state) => {

    const promises = [];
    const result = {};

      // slug
    validateSlug({value: values.slug, previousValue: state.initialValues.slug, promises, result, fetchSlug});

     return Promise.all(promises)
        .then(() => {
            return checkIfError(result)
        }).catch(() => {
            return checkIfError(result)
        })

    return Promise.all(promises).then(() => result);

};

export default asyncValidate
