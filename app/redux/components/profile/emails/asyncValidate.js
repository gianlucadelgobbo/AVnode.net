import {validateProfileEmail} from "../../common/form/validators";

const asyncValidate = (values) => {
    const promises = [];
    const {emails = []} = values;
    const errorArray = [];

    emails.forEach((email, index) => {
        validateProfileEmail({
            value: email,
            promises,
            result: {},
            index,
            errorArray
        });
    });

    return Promise.all(promises)
        .then(() => {
            return {emails: errorArray};
        })
        .catch(() => {
            return {emails: errorArray};
        });
};

export default asyncValidate;



