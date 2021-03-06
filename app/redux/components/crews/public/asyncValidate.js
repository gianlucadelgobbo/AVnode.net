import {
  validateSlugWithID,
  validateAddress
} from "../../common/form/validators";
import { checkIfError } from "../../common/form";

const asyncValidate = (values, dispatch, state) => {
  const promises = [];
  const result = {};
  // slug
  validateSlugWithID({
    value: values.slug,
    previousValue: state.initialValues.slug,
    promises,
    result,
    id: state.model.id,
    section: "crews"
  });

  return Promise.all(promises)
    .then(() => {
      return checkIfError(result);
    })
    .catch(() => {
      return checkIfError(result);
    });

  //return Promise.all(promises).then(() => result);
};

export default asyncValidate;
