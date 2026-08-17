import nodemailer from 'nodemailer';
import { logger } from './logger.js';

export const gMailer = (data, cb) => {
  logger.info('gMailer');

  // If an App Password is configured on the call, authenticate directly
  // against smtp.gmail.com (proven working path). Otherwise fall back to
  // the Google Workspace SMTP relay, which trusts this server's public IP
  // (allowlisted in Google Admin Console) instead of a password.
  const transportConfig = (data.auth && data.auth.user && data.auth.pass)
    ? { service: 'gmail', auth: { user: data.auth.user, pass: data.auth.pass } }
    : { host: 'smtp-relay.gmail.com', port: 587, secure: false };

  var transporter = nodemailer.createTransport(transportConfig);

  transporter.sendMail(data.mail, function(err, info) {
    if (err) {
      logger.error('gMailer error:', err);
    } else {
      logger.info('gMailer sent:', info.messageId);
    }
    transporter.close();
    cb(err, info);
  });
};
