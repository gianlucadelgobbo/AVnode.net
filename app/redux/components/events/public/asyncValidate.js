import {validateAddress, validateSlug} from "../../common/form/validators";

const asyncValidate = (values, dispatch, state) => {

    const promises = [];
    const result = {};

    // slug
    validateSlug({value: values.slug, previousValue: state.initialValues.slug, promises, result});

    // address
    validateAddress({values: values.addresses, promises, result});

    return Promise.all(promises).then(() => result);

};

export default asyncValidate
