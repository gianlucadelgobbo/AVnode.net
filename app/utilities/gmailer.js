import nodemailer from 'nodemailer';
import { logger } from './logger.js';

export const gMailer = (data, cb) => {
  logger.info('gMailer');

  if (!data.auth || !data.auth.user || !data.auth.pass) {
    const err = new Error('Gmail credentials not provided');
    logger.error(err.message);
    return cb(err);
  }

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: data.auth.user,
      pass: data.auth.pass
    }
  });

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
