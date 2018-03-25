import {connect} from 'preact-redux';
import Language from '../_to_review/Language';
import {addLocaleData} from 'preact-intl';

import messagesEN from '../../../../locales/en.json';
import messagesDE from '../../../../locales/de.json';
import messagesFR from '../../../../locales/fr.json';
import messagesIT from '../../../../locales/it.json';
// FIXME: Import locale data for every supported locale…
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
import fr from 'react-intl/locale-data/fr';
import it from 'react-intl/locale-data/it';

addLocaleData([...en, ...de, ...fr, ...it]);

const messages = {
    en: messagesEN,
    de: messagesDE,
    fr: messagesFR,
    it: messagesIT
};

const getLocale = (user) => {
    const isValidLanguage = (l) => Object.keys(messages).indexOf(l) > -1;

    const fallback = 'en';

    /*
    * priority
    * - settings
    * - URL
    * - navigator
    * - fallback
    * */

    // Try to get language from user settings
    const settings = user.settings || {};
    const {language} = settings;
    if (isValidLanguage(language)) {
        return language;
    }

    // Try to get language from URL
    const hostname = window.location.hostname;
    const splitHostname = hostname.split(".");
    const possibleLanguage = splitHostname[0];
    if (isValidLanguage(possibleLanguage)) {
        return possibleLanguage;
    }

    // Try to get language from navigator
    if (isValidLanguage(navigator.language)) {
        return navigator.language.replace(/\-.*$/, '');
    }

    //Return fallback
    return fallback;

};

const getMessages = (user) => {
    const fallback = 'en';
    const locale = getLocale(user);

    if (messages[locale] !== null) {
        return messages[locale];
    } else {
        return messages[fallback];
    }
};

const mapStateToProps = ({user}) => {

    return {
        user,
        messages: getMessages(user),
        locale: getLocale(user)
    };
};

export default connect(mapStateToProps)(Language);
