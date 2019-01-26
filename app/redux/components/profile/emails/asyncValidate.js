import {validateProfileEmail} from "../../common/form/validators";

const parseErrors = ({errorArray}) => Array.isArray(errorArray) && !errorArray.length ? null : {emails: errorArray};

const asyncValidate = (values) => {
    const promises = [];
    const {emails = []} = values;
    const errorArray = [];

    emails.forEach((email, index) => {
        if (!email.stored) {
            validateProfileEmail({
                value: email,
                promises,
                result: {},
                index,
                errorArray
            });
        }
    });

    return Promise.all(promises)
        .then(() => {
            return parseErrors({errorArray})
        })
        .catch(() => {
            return parseErrors({errorArray})
        });
};

export default asyncValidate;



