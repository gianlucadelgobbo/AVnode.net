const Email = require('email-templates');
const nodemailer = require('nodemailer');
const ses = require('nodemailer-ses-transport');
const logger = require('./logger');

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

module.exports.sendEmail = (data, cb) => {
  logger.info('Sending Email');
  logger.info(data);
  const email = new Email({
    message: {
      from: 'info@avnode.net',
      name: 'AVnode.net'
    },
    views: { root: 'app/views/emails' },
    transport: getTransporter()
  });
  email.send(data)
  .then(info => logger.info('Email sent', info))
  .catch(err => cb(err));
}

module.exports.signup = (options, data, cb) => {

  const email = new Email({
    message: {
      from: process.env.MAILFROM,
      name: 'AVnode'
    },
    transport: getTransporter(),
    views: { root: 'app/views/emails' }
  });
  // console.log('to:' + options.to + ' uuid: ' + data.uuid);

  email.send({
    template: 'signup',
    message: {
      to: options.to
    },
    locals: {
      link: '/user/confirm/',
      uuid: data.uuid
    }
  }).then(info => logger.info('Signup email sent', info)).catch(err => cb(err));

};


module.exports.confirmEmail = (options, data, cb) => {

  const email = new Email({
    message: {
      from: process.env.MAILFROM,
      name: 'AVnode'
    },
    transport: getTransporter(),
    views: { root: 'app/views/emails' }
  });

  email.send({
    template: 'templates/confirm-email',
    message: {
      to: options.to
    },
    locals: {
      link: '/user/confirm/email/',
      uuid: data.uuid
    }
  }).then(info => logger.info('confirmEmail sent', info)).catch(err => cb(err));

};

module.exports.resetPassword = (options, data, cb) => {

  const email = new Email({
    message: {
      from: process.env.MAILFROM,
      name: 'AVnode'
    },
    transport: getTransporter(),
    views: { root: 'app/views/emails' }
  });
  console.log('to:' + options.to + ' uuid: ' + data.uuid);

  email.send({
    template: 'templates/reset-password',
    message: {
      to: options.to
    },
    locals: {
      link: '/password/verify/' + data.email + '/' + data.token,
      uuid: data.uuid
    }
  }).then(info => logger.info('resetPassword sent', info)).catch(err => cb(err));

};

module.exports.sendMsgEmail = (options, data, cb) => {

  const email = new Email({
    message: {
      from: process.env.MAILFROM,
      name: 'AVnode'
    },
    transport: getTransporter(),
    views: { root: 'app/views/emails' }
  });
  console.log('to:' + options.to + ' uuid: ' + data.msg);

  email.send({
    template: 'templates/send-email',
    message: {
      to: options.to
    },
    locals: {
      link: "https://dev.avnode.net/",
      msg: data.msg
    }
  }).then(info => logger.info('sendMsgEmail sent', info)).catch(err => cb(err));

};

// add crew member
module.exports.addCrewMember = (options, data, cb) => {

  const email = new Email({
    message: {
      from: process.env.MAILFROM,
      name: 'AVnode'
    },
    transport: getTransporter(),
    views: { root: 'app/views/emails' }
  });
  // console.log('to:' + options.to + ' uuid: ' + data.uuid);

  email.send({
    template: 'templates/add-crew-member',
    message: {
      to: options.to
    },
    locals: {
      link: '/admin/crews',
      msg: data.msg
    }
  }).then(info => logger.info('Add Crew Member email sent', info)).catch(err => cb(err));

};