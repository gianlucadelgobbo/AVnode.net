const Email = require('email-templates');
const nodemailer = require('nodemailer');
const logger = require('./logger');

//const ses = require('nodemailer-ses-transport');

  
const getTransporter = () => {
  return nodemailer.createTransport({
    SES: new aws.SES({
        apiVersion: '2010-12-01'
    })
  });
}

module.exports.sendEmail = (data, cb) => {
  logger.info('Sending Email');
  const transport = getTransporter();
  logger.info(transport);
  logger.info(data);
  const email = new Email({
    message: {
      from: 'info@avnode.net',
      name: 'AVnode.net'
    },
    views: { root: 'app/views/emails' },
    transport: transport
  });
  email.send(data)
  .then(info => logger.info('Email sent', info))
  .catch(err => cb(err));
}

module.exports.signup = (data, cb) => {
  logger.info('Sending signup Email');
  const transport = getTransporter();
  logger.info(transport);
  logger.info(data);
  const email = new Email({
    message: {
      from: process.env.MAILFROM,
      name: 'AVnode'
    },
    transport: transport,
    views: { root: 'app/views/emails' }
  });
  // console.log('to:' + options.to + ' uuid: ' + data.uuid);

  email.send(data)
  .then(info => logger.info('Signup email sent', info))
  .catch(err => cb(err));
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

module.exports.sendMsgEmail = (data, cb) => {

  const email = new Email({
    message: {
      from: process.env.MAILFROM,
      name: 'AVnode'
    },
    transport: getTransporter(),
    views: { root: 'app/views/emails' }
  });
  console.log('to:' + data.to + ' msg: ' + data.msg);

  email.send(data)
  .then(info => logger.info('sendMsgEmail sent', info))
  .catch(err => cb(err));

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