import {defineMessages} from 'react-intl';

export const REQUIRED = "validation.error.required";
export const NOT_ALLOWED = "validation.error.not.allowed";
export const SLUG_REQUIRED = "validation.error.slug.required";
export const SLUG_IS_TAKEN = "validation.error.slug.is.taken";
export const INVALID_CITY = "validation.error.invalid.city";
export const INVALID_ADDRESS = "validation.error.invalid.address";
export const INVALID_STRING_LENGTH = "validation.error.invalid.string.length";
export const INVALID_IMAGE_SIZE = "validation.error.invalid.image.size";
export const INVALID_STRING_MIN_MAX = "validation.error.invalid.string.min.max";
export const INVALID_EMAIL = "validation.error.invalid.email";
export const DEFINE_LEAST_EMAIL= "validation.error.define.least.email";
export const MULTIPLE_PRIMARY_EMAIL = "validation.error.multiple.primary.email";
export const NO_PRIMARY_EMAIL = "validation.error.no.primary.email";

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
        defaultMessage: "Invalid string length (max 5000)"
    },
    [INVALID_IMAGE_SIZE]: {
        id: INVALID_IMAGE_SIZE,
        defaultMessage: "Invalid image size"
    },
    [INVALID_STRING_MIN_MAX]: {
        id: INVALID_STRING_MIN_MAX,
        defaultMessage: "Invalid length: please insert"
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
    }
});
