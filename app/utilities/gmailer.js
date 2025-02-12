import nodemailer from 'nodemailer';
import { google } from "googleapis";
import { logger, requestLogger, errorLogger } from './logger.js';

const OAuth2 = google.auth.OAuth2;

export const gMailer = (data, cb) => {
  logger.info('gMailer gMailer');
  logger.info(data);

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: data.auth
  });

  transporter.sendMail(data.mail, function(err, info) {
    if (err) {
      logger.info(err);
    } else {
      logger.info("info.messageId: " + info.messageId);
      logger.info("info.envelope: " + info.envelope);
      logger.info("info.accepted: " + info.accepted);
      logger.info("info.rejected: " + info.rejected);
      logger.info("info.pending: " + info.pending);
      logger.info("info.response: " + info.response);
    }
    transporter.close();
    logger.info(err || info);
    cb(err, info);
  });
};
