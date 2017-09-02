const i18n = require('../plugins/i18n');

module.exports = (req, res) => {
  res.status(404).render('404', {
    title: i18n.__('Hmm…'),
    nav: [],
    path: req.originalUrl
  });
};
