const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const logger = require('./logger');

module.exports.gMailer = (data, cb) => {
  logger.debug('gMailer ');
  logger.debug(data);

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: data.auth
  });

  transporter.sendMail(data.mail, function(err, info) {
    if (err) {
      logger.debug(err);
    } else {
      logger.debug("info.messageId: " + info.messageId);
      logger.debug("info.envelope: " + info.envelope);
      logger.debug("info.accepted: " + info.accepted);
      logger.debug("info.rejected: " + info.rejected);
      logger.debug("info.pending: " + info.pending);
      logger.debug("info.response: " + info.response);
    }
    transporter.close();
    logger.debug(err || info);
    cb(err, info);
  });
};
