import React, {Component} from 'react';
import {Provider} from 'react-redux'
import App from './components/app/index';
import store from './store'
import {getDefaultModel} from "./components/performances/users/selectors";

import {addLocaleData, IntlProvider} from 'react-intl';

import enLocaleData from 'react-intl/locale-data/en';
import frLocaleData from 'react-intl/locale-data/fr';
import esLocaleData from 'react-intl/locale-data/es';
import itLocaleData from 'react-intl/locale-data/it';
import deLocaleData from 'react-intl/locale-data/de';
import huLocaleData from 'react-intl/locale-data/hu';
import elLocaleData from 'react-intl/locale-data/el';
import beLocaleData from 'react-intl/locale-data/be';
import ruLocaleData from 'react-intl/locale-data/ru';
import plLocaleData from 'react-intl/locale-data/pl';

import translations from './i18n/locales';

addLocaleData([...enLocaleData, ...frLocaleData, ...esLocaleData, ...itLocaleData, ...deLocaleData, ...huLocaleData, ...elLocaleData, ...beLocaleData, ...ruLocaleData, ...plLocaleData]);

const getLocale = (user) => {
    const isValidLanguage = (l) => Object.keys(translations).indexOf(l) > -1;

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

const state = store.getState();
const user = getDefaultModel(state) || {};

class Main extends Component {

    render() {

        return (<IntlProvider locale={getLocale(user)} key={getLocale(user)} messages={getMessages(user)}>
            <Provider store={store}>
                <App/>
            </Provider>
        </IntlProvider>)
    }
}


export default Main;