import { connect } from 'preact-redux';
import Language from './Language';
import { addLocaleData } from 'preact-intl';

import messagesEN from '../locales/en.json';
import messagesDE from '../locales/de.json';
// FIXME: Import locale date for every supported locale…
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
addLocaleData([...en, ...de]);

/*
const getLocale = () => {
  // FIXME: Read `navigator.language` and `navigator.languages?
  if (navigator.language !== null) {
    return navigator.language.replace(/\-.*$/, '');
  } else {
    return 'en';
  }
}; */

const messages = {
  en: messagesEN,
  de: messagesDE
};

const getLocale = (user) => {
  const fallback = 'en';
  if (user.settings && user.settings.language && user.settings.language !== '') {
    return user.settings.language;
  } else {
    return fallback;
  }
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
