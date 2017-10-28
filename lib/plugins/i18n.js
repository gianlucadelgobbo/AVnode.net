const i18n = require('i18n');

i18n.configure({
  locales:['en','fr','de','it'],
  defaultLocale: 'en', // change to english
  directory: `${__dirname}/../../app/locales`,
  // FIXME: Disable when you find a solution for pug
  register: global
});

module.exports = i18n;
