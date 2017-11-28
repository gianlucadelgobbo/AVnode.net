// const path = require('path');
// const _ = require('lodash');
// updated for v3 https://github.com/niftylettuce/email-templates#v3-breaking-changes
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

  const email = new Email({
    message: {
      from: process.env.MAILFROM,
      name: 'AVnode'
    },
    transport: getTransporter()
  });
  // console.log('to:' + options.to + ' uuid: ' + data.uuid);

  email.send({
    template: 'templates/signup',
    message: {
      to: options.to
    },
    locals: {
      link: process.env.BASE + 'user/confirm/',
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
    transport: getTransporter()
  });

  email.send({
    template: 'templates/confirm-email',
    message: {
      to: options.to
    },
    locals: {
      link: process.env.BASE + 'user/confirm/email/',
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
    transport: getTransporter()
  });
  console.log('to:' + options.to + ' uuid: ' + data.uuid);

  email.send({
    template: 'templates/reset-password',
    message: {
      to: options.to
    },
    locals: {
      link: process.env.BASE + 'password/verify/' + data.email + '/' + data.token,
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
    transport: getTransporter()
  });
  console.log('to:' + options.to + ' uuid: ' + data.msg);
  
  email.send({
    template: 'templates/send-email',
    message: {
      to: options.to
    },
    locals: {
      link: process.env.BASE,
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
      transport: getTransporter()
    });
    // console.log('to:' + options.to + ' uuid: ' + data.uuid);
  
    email.send({
      template: 'templates/add-crew-member',
      message: {
        to: options.to
      },
      locals: {
        link: process.env.BASE + 'account/crews',
        msg: data.msg
      }
    }).then(info => logger.info('Add Crew Member email sent', info)).catch(err => cb(err));
  
  };