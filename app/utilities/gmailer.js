import nodemailer from 'nodemailer';
import { logger } from './logger.js';

export const gMailer = (data, cb) => {
  logger.info('gMailer');

  // Google Workspace SMTP relay: authenticates by the server's public IP
  // (allowlisted in Google Admin Console), so no App Password is required.
  // If emailuser/emailpassword are still configured on the call, they're
  // passed through as SMTP auth on top of the relay (works either way).
  const transportConfig = {
    host: 'smtp-relay.gmail.com',
    port: 587,
    secure: false
  };

  if (data.auth && data.auth.user && data.auth.pass) {
    transportConfig.auth = {
      user: data.auth.user,
      pass: data.auth.pass
    };
  }

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
