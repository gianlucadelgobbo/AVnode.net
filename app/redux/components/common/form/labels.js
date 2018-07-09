import {defineMessages} from 'react-intl';

export const STAGE_NAME = "label.form.stagename";
export const PROFILE_URL = "label.form.url";
export const ABOUT = "label.form.about";
export const WEB = "label.form.web";
export const SOCIAL = "label.form.social";
export const ADDRESS = "label.form.address";

/*
* Define i18n Form Label
* */
defineMessages({
    [STAGE_NAME]: {
        id: STAGE_NAME,
        defaultMessage: "Stage Name"
    },
    [PROFILE_URL]: {
        id: PROFILE_URL,
        defaultMessage: "Profile Url"
    },
    [ABOUT]: {
        id: ABOUT,
        defaultMessage: "About"
    },
    [WEB]: {
        id: WEB,
        defaultMessage: "Web"
    },
    [SOCIAL]: {
        id: SOCIAL,
        defaultMessage: "Socials"
    },
    [ADDRESS]: {
        id: ADDRESS,
        defaultMessage: "Address"
    }
});
