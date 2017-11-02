const path = require('path');
const _ = require('lodash');
// updating https://github.com/niftylettuce/email-templates#v3-breaking-changes
// const EmailTemplate = require('email-templates').EmailTemplate;
const Email = require('email-templates');
const nodemailer = require('nodemailer');
const ses = require('nodemailer-ses-transport');
const logger = require('../utilities/logger');

const getTransporter = () => {
  if (process.env.ACCESSKEYID == null || process.env.ACCESSKEYID === '') {
    throw new Error('Missing ACCESSKEYID config value');
  }
  if (process.env.SECRETACCESSKEY == null || process.env.SECRETACCESSKEY === '') {
    throw new Error('Missing SECRETACCESSKEY config value');
  }
  return nodemailer.createTransport(ses({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: 'eu-west-1'
  }));
};

module.exports.signup = (options, data, cb) => {
  // const template = path.join(__dirname, 'mailer/templates', 'signup');
  // const mail = getTransporter().templateSender(new EmailTemplate(template));
  const email = new Email({
    message: {
      from: process.env.MAILFROM,
      name: 'AVnode'
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: {
      jsonTransport: true
    }
  });
  console.log('to:' + options.to + ' uuid: ' + data.uuid);
  // html.pug a(href=link+uuid) Confirm Email
  // mailer.signup({ to: user.email }, { uuid: user.confirm }
  email.send({
    template: 'templates/signup',
    message: {
      to: options.to
    },
    locals: {
      link: process.env.BASE + 'user/confirm/',
      uuid: data.uuid
    }
  }).then(info => logger.info('email sent', info)).catch(err => cb(err));
  
  /*const defaults = {
    from: process.env.MAILFROM,
    subject: 'AVnode.net – Welcome'
  };
  const mailOptions = _.merge(options, defaults);

  const context = _.merge({
    link: process.env.BASE + 'user/confirm/'
  }, data);

  mail(mailOptions, context, (err, info) => {
    if (err) {
      return cb(err);
    }
    logger.info('email sent', info);
    return cb(null, info);
  });*/
};

module.exports.confirmEmail = (options, data, cb) => {
  /*const template = path.join(__dirname, 'mailer/templates', 'confirm-email');
  const mail = getTransporter().templateSender(new EmailTemplate(template));

  const defaults = {
    from: process.env.MAILFROM,
    subject: 'AVnode.net – Confirm Email'
  };
  const mailOptions = _.merge(options, defaults);

  const context = _.merge({
    link: process.env.BASE + 'user/confirm/email/',
  }, data);

  mail(mailOptions, context, (err, info) => {
    if (err) {
      return cb(err);
    }
    logger.info('email sent', info);
    return cb(null, info);
  });*/
};

module.exports.resetPassword = (options, data, cb) => {
  /*const template = path.join(__dirname, 'mailer/templates', 'reset-password');
  const mail = getTransporter().templateSender(new EmailTemplate(template));

  const defaults = {
    from: process.env.MAILFROM,
    subject: 'AVnode.net – Reset your password'
  };
  const mailOptions = _.merge(options, defaults);

  const context = _.merge({
    link: process.env.BASE + 'password/verify/'+data.email+'/'+data.token,
  }, data);

  mail(mailOptions, context, (err, info) => {
    if (err) {
      return cb(err);
    }
    logger.info('email sent', info);
    return cb(null, info);
  });*/
};

module.exports.confirmNewEmail = (options, data, cb) => {
  /*const template = path.join(__dirname, 'mailer/templates', 'confirm-new-email');
  const mail = getTransporter().templateSender(new EmailTemplate(template));

  const defaults = {
    from: process.env.MAILFROM,
    subject: 'AVnode.net – Confirm New Email'
  };
  const mailOptions = _.merge(options, defaults);

  const context = _.merge({
    link: process.env.BASE + 'user/confirm/email/',
  }, data);

  mail(mailOptions, context, (err, info) => {
    if (err) {
      return cb(err);
    }
    logger.info('email sent', info);
    return cb(null, info);
  });*/
};
