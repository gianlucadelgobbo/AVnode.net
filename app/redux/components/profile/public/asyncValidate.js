import {checkIfError} from '../../common/form'
import {validateSlug, validateAddress} from "../../common/form/validators";
import {fetchSlug as fetchSlug} from '../../../api';

const asyncValidate = (values, dispatch, state) => {
    const promises = [];
    const result = {};

    // slug
    validateSlug({value: values.slug, previousValue: state.initialValues.slug, promises, result, fetchSlug});

    // address
    validateAddress({values: values.addresses, promises, result});

    return Promise.all(promises)
        .then(() => {
            return checkIfError(result)
        }).catch(() => {
            return checkIfError(result)
        })
};


export default asyncValidate
