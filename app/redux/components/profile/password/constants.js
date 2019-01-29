import React from 'react';
import {FormattedMessage} from 'react-intl';

export const FORM_NAME = "PROFILE.PASSWORD";

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MUST_CONTAIN_CAPITAL_LETTER = true;
export const PASSWORD_MUST_CONTAIN_NUMBER = true;
export const PASSWORD_MUST_CONTAIN_SPECIAL_CHAR = true;

export const PROFILE_NAME = <FormattedMessage
                                id="account.ppassword"
                                defaultMessage="MY PROFILE PASSWORD"
                            />
export const SHOW = <FormattedMessage
                            id="show"
                            defaultMessage="SHOW"
                            />
