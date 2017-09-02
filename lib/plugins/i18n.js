const i18n = require('i18n');

i18n.configure({
  locales:['en'],
  defaultLocale: 'en',
  directory: `${__dirname}/../../locales`,
  // FIXME: Disable when you find a solution for pug
  register: global
});

module.exports = i18n;
