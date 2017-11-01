const i18n = require('i18n');

i18n.configure({
  locales:['en','fr','de','it'],
  defaultLocale: 'en',
  directory: `${__dirname}/../../app/locales`,
  register: global
});

module.exports = i18n;
