const config = require('getconfig');
const i18n = require('i18n');

i18n.configure({
  locales:config.locales,
  defaultLocale: config.defaultLocale,
  directory: `${__dirname}/../../locales`,
  register: global
});

module.exports = i18n;
