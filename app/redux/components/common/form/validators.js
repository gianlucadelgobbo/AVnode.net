export const validateLength = ({errors, values, name, minLength, maxLength}) => {
    if (!values[name] || (values[name].length <= minLength || values[name].length >= maxLength)) {
        errors[name] = {_error: "Invalid length: please insert 1 to 5 values"}
    }
};