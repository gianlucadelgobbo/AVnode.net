import {validateSlug} from "../../common/form/validators";

const asyncValidate = (values, dispatch, state) => {

    const promises = [];
    const result = {};
    const {calls} = values;

    if (Array.isArray(calls)) {

        const errorArray = [];

        calls.forEach((c, i) => {

            const modelErrors = {};

            // slug
            validateSlug({
                value: values.slug,
                previousValue: state.initialValues.slug,
                promises,
                result: modelErrors,
                index: i,
                errorArray
            })

        })


    }


    return Promise.all(promises).then(() => result);

};

export default asyncValidate
