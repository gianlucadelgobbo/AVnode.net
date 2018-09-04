const logger = require('./logger');

//const ses = require('nodemailer-ses-transport');

const pug = require('pug');
const aws = require('aws-sdk');
aws.config.loadFromPath('./config/ses.json');

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

  const fn = pug.compileFile(__dirname+'/../views/emails/signup.pug', null);

  let HTML_FORMAT_BODY = fn({
    site:    data.locals.site,
    title:    __("Welcome!"),
    block_0:  __("We're thrilled to have you here! Get ready to dive into your new account."),
    block_1:  __("We're excited to have you get started. First, you need to confirm your account. Just press the button below."),
    button:   __("Confirm Account"),
    block_2:  __("If that doesn't work, copy and paste the following link in your browser:"),
    block_3:  __("If you have any questions, just reply to this email, we're always happy to help out."),
    link:     data.locals.link+data.locals.confirm,
    signature: "Cheers<br />The AVnode.net Team",
  });
  console.log("HTML_FORMAT_BODY");
  console.log(HTML_FORMAT_BODY);
  
  var params = {
    Destination: { /* required */
      /* CcAddresses: [ 'g.delgobbo@flyer.it' ], */
      ToAddresses: [
        data.message.to,
      ]
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
        Charset: "UTF-8",
        Data: HTML_FORMAT_BODY
        },
        Text: {
        Charset: "UTF-8",
        Data: "TEXT_FORMAT_BODY"
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'AVnode.net | ' + __("Confirm Account")
      }
    },
    Source: process.env.MAILFROM, /* required */
    ReplyToAddresses: [ process.env.MAILFROM ],
  };       
  
  // Create the promise and SES service object
  var sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
  
  // Handle promise's fulfilled/rejected states
  sendPromise.then(
    function(data) {
      console.log(data.MessageId);
      cb(null);
    }
  ).catch(
    function(err) {
      console.error(err, err.stack);
      cb(err);
    }
  );
  

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