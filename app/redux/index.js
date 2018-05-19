import React from 'react';
import {Provider} from 'react-redux'
import App from './components/app/index';
import store from './store'

import { addLocaleData, IntlProvider } from 'react-intl';

import enLocaleData from 'react-intl/locale-data/en';
import frLocaleData from 'react-intl/locale-data/fr';
import esLocaleData from 'react-intl/locale-data/es';
import translations from './i18n/locales';

addLocaleData(enLocaleData);
addLocaleData(frLocaleData);
addLocaleData(esLocaleData);

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

    if (translations[locale] !== null) {
        return translations[locale];
    } else {
        return translations[fallback];
    }
};

let root = document.getElementById('app');

const init = () => {

    render(
        <Provider store={store}>
            <IntlProvider locale={this.getLocale()} key={this.getLocale()} messages={this.getMessages()}>
                <App/>
            </IntlProvider>
        </Provider>,
        root
    );
};

init();