import {defineMessages} from 'react-intl';

export const REQUIRED = "validation.error.required";
export const NOT_ALLOWED = "validation.error.not.allowed";
export const SLUG_REQUIRED = "validation.error.slug.required";
export const SLUG_IS_TAKEN = "validation.error.slug.is.taken";
export const INVALID_CITY = "validation.error.invalid.city";
export const INVALID_ADDRESS = "validation.error.invalid.address";
export const INVALID_STRING_LENGTH = "validation.error.invalid.string.length";
export const INVALID_IMAGE_SIZE = "validation.error.invalid.image.size";
export const INVALID_STRING_3_20 = "validation.error.invalid.string.3.20";
export const INVALID_STRING_0_5 = "validation.error.invalid.string.0.5";
export const INVALID_STRING_0_10 = "validation.error.invalid.string.0.10";
export const INVALID_STRING_1_5 = "validation.error.invalid.string.1.5";
export const INVALID_STRING_1_3 = "validation.error.invalid.string.1.3";
export const INVALID_STRING_3_100 = "validation.error.invalid.string.3.100";
export const INVALID_EMAIL = "validation.error.invalid.email";
export const INVALID_PASSWORD = "validation.error.invalid.password";
export const INVALID_PASSWORD_LENGTH = "validation.error.invalid.passwordLength";
export const INVALID_PASSWORD_CONTENT = "validation.error.invalid.passwordContent";
export const DEFINE_LEAST_EMAIL= "validation.error.define.least.email";
export const MULTIPLE_PRIMARY_EMAIL = "validation.error.multiple.primary.email";
export const NO_PRIMARY_EMAIL = "validation.error.no.primary.email";
export const EMAIL_IS_TAKEN = "validation.error.email.is.take";
export const DUPLICATED_EMAIL = "validation.error.email.duplicated";
export const START_IS_BEFORE_END = "validation.error.start.is.before.end";

//export const IS_NAN = "validation.error.is_nan";
//export const END_DATE_BEFORE_START_DATE = "validation.error.end_data_before_start_date";
//export const EMAILS_DONT_MATCH = "validation.error.emails_dont_match";

/*
* Define i18n validation errors
* */
defineMessages({
    [REQUIRED]: {
        id: REQUIRED,
        defaultMessage: "Required"
    },
    [NOT_ALLOWED]: {
        id: NOT_ALLOWED,
        defaultMessage: "Characters Not Allowed"
    },
    [SLUG_REQUIRED]: {
        id: SLUG_REQUIRED,
        defaultMessage: "Slug Required"
    },
    [SLUG_IS_TAKEN]: {
        id: SLUG_IS_TAKEN,
        defaultMessage: "That slug is taken"
    },
    [INVALID_CITY]: {
        id: INVALID_CITY,
        defaultMessage: "Invalid city"
    },
    [INVALID_ADDRESS]: {
        id: INVALID_ADDRESS,
        defaultMessage: "Invalid address"
    },
    [INVALID_STRING_LENGTH]: {
        id: INVALID_STRING_LENGTH,
        defaultMessage: "Invalid string length (max 10000)"
    },
    [INVALID_IMAGE_SIZE]: {
        id: INVALID_IMAGE_SIZE,
        defaultMessage: "Invalid image size"
    },
    [INVALID_STRING_3_20]: {
        id: INVALID_STRING_3_20,
        defaultMessage: "Invalid length: please insert 3 to 20 values"
    },
    [INVALID_STRING_1_5]: {
        id: INVALID_STRING_1_5,
        defaultMessage: "Invalid length: please insert 1 to 5 values"
    },
    [INVALID_STRING_0_5]: {
        id: INVALID_STRING_0_5,
        defaultMessage: "Invalid length: max 5 values"
    },
    [INVALID_STRING_0_10]: {
        id: INVALID_STRING_0_10,
        defaultMessage: "Invalid length: max 10 values"
    },
     [INVALID_STRING_1_3]: {
        id: INVALID_STRING_1_3,
        defaultMessage: "Invalid length: please insert 1 to 3 values"
    },
    [INVALID_STRING_3_100]: {
        id: INVALID_STRING_3_100,
        defaultMessage: "Invalid length: please insert 3 to 100 values"
    },
    [INVALID_EMAIL]: {
        id: INVALID_EMAIL,
        defaultMessage: "Invalid email"
    },
    [DEFINE_LEAST_EMAIL]: {
        id: DEFINE_LEAST_EMAIL,
        defaultMessage: "Define at least one email"
    },
    [MULTIPLE_PRIMARY_EMAIL]: {
        id: MULTIPLE_PRIMARY_EMAIL,
        defaultMessage: "Multiple primary email"
    },
    [NO_PRIMARY_EMAIL]: {
        id: NO_PRIMARY_EMAIL,
        defaultMessage: "No primary email"
    },
    [INVALID_PASSWORD]: {
        id: INVALID_PASSWORD,
        defaultMessage: "Passwords don't match"
    },
    [INVALID_PASSWORD_LENGTH]: {
        id: INVALID_PASSWORD_LENGTH,
        defaultMessage: "Your password is too short"
    },
    [INVALID_PASSWORD_CONTENT]: {
        id: INVALID_PASSWORD_CONTENT,
        defaultMessage: "Password must contain at least number, a capital letter and a lower case letter"
    },
    [EMAIL_IS_TAKEN]: {
        id: EMAIL_IS_TAKEN,
        defaultMessage: "The email is already in use"
    },
    [DUPLICATED_EMAIL]: {
        id: DUPLICATED_EMAIL,
        defaultMessage: "Duplicated email"
    },
    [START_IS_BEFORE_END]: {
        id: START_IS_BEFORE_END,
        defaultMessage: "End time must be after start time"
    },
});
