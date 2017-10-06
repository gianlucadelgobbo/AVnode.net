import { connect } from 'preact-redux';
import Language from './Language';
import { addLocaleData } from 'preact-intl';

import messagesEN from '../locales/en.json';
import messagesDE from '../locales/de.json';
import messagesFR from '../locales/fr.json';
// FIXME: Import locale data for every supported locale…
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
import fr from 'react-intl/locale-data/fr';
addLocaleData([...en, ...de, ...fr]);

const messages = {
  en: messagesEN,
  de: messagesDE,
  fr: messagesFR
};

const getLocale = (user) => {
  const fallback = 'en';

  // Try to get language from user settings
  if (user.settings && user.settings.language && user.settings.language !== '') {
    //console.log(' user.settings.language ' + user.settings.language);
    return user.settings.language;
  } else {
    // try to get navigator language
    if (navigator.language !== null) {
      // console.log(' nav ' + navigator.language);
      return navigator.language.replace(/\-.*$/, '');
    } else {
      return fallback;
    }
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

const mapStateToProps = ({ user }) => {

  return {
    user,
    messages: getMessages(user),
    locale: getLocale(user)
  };
};

export default connect(mapStateToProps)(Language);
