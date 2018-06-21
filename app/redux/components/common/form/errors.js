import {defineMessages} from 'react-intl';

export const REQUIRED = "validation.error.required";
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
    }
});