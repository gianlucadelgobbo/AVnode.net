const logger = require('./logger');

//const ses = require('nodemailer-ses-transport');

const pug = require('pug');
const aws = require('aws-sdk');
aws.config.loadFromPath('./config/ses.json');

var params = {
  Destination: { /* required */
    /* CcAddresses: [ 'g.delgobbo@flyer.it' ], */
    ToAddresses: []
  },
  Message: { /* required */
    Body: { /* required */
      Html: {
        Charset: "UTF-8",
        Data: "HTML_FORMAT_BODY"
      },
      Text: {
        Charset: "UTF-8",
        Data: "TEXT_FORMAT_BODY"
      }
    },
    Subject: {
      Charset: 'UTF-8',
      Data: ''
    }
  },
  Source: "MAILFROM", /* required */
  ReplyToAddresses: [ "MAILFROM" ],
}; 

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

  const fn_html = pug.compileFile(__dirname+'/../views/emails/signup/html_ses.pug', null);
  const fn_text = pug.compileFile(__dirname+'/../views/emails/signup/text_ses.pug', null);
  const email_content = {
    site:    data.locals.site,
    title:    __("Welcome!"),
    block_1:  __("We're excited to have you get started. First, you need to confirm your account. Just press the button below."),
    button:   __("Confirm Account"),
    block_2:  __("If that doesn't work, copy and paste the following link in your browser:"),
    block_3:  __("If you have any questions, just reply to this email, we're always happy to help out."),
    link:     data.locals.link+data.locals.confirm,
    signature: "Cheers<br/>The AVnode.net Team"
  }

  const HTML_FORMAT_BODY = fn_html(email_content);
  const TEXT_FORMAT_BODY = fn_text(email_content).split("<br/>").join("\n");

  logger.info('TEXT_FORMAT_BODY');
  logger.info(TEXT_FORMAT_BODY);

  params.Destination.ToAddresses = [ data.message.to ];
  params.Message.Body.Html.Data = HTML_FORMAT_BODY;
  params.Message.Body.Text.Data = TEXT_FORMAT_BODY;
  params.Message.Subject.Data = 'AVnode.net | ' + __("Confirm Account");
  params.Source = process.env.MAILFROM, /* required */
  params.ReplyToAddresses = [ process.env.MAILFROM ],

  logger.info(params);
    
  // Create the promise and SES service object
  var sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
  
  // Handle promise's fulfilled/rejected states
  sendPromise.then(
    function(data) {
      cb(null);
    }
  ).catch(
    function(err) {
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

module.exports.resetPassword = (data, cb) => {

  const fn_html = pug.compileFile(__dirname+'/../views/emails/reset-password/html_ses.pug', null);
  const fn_text = pug.compileFile(__dirname+'/../views/emails/reset-password/text_ses.pug', null);
  const email_content = {
    site:    data.locals.site,
    title:    __("Password reset"),
    block_1:  __("We’ve received a request to reset your password."),
    button:   __("Click here to reset your password"),
    block_2:  __("If you didn’t make the request, just ignore this message. Otherwise, you can reset your password using this link:"),
    block_3:  __("Thanks."),
    link:     data.locals.link+data.locals.confirm,
    signature: "The AVnode.net Team"
  }

  const HTML_FORMAT_BODY = fn_html(email_content);
  const TEXT_FORMAT_BODY = fn_text(email_content).split("<br/>").join("\n");

  logger.info('TEXT_FORMAT_BODY');
  logger.info(TEXT_FORMAT_BODY);

  params.Destination.ToAddresses = [ data.message.to ];
  params.Message.Body.Html.Data = HTML_FORMAT_BODY;
  params.Message.Body.Text.Data = TEXT_FORMAT_BODY;
  params.Message.Subject.Data = 'AVnode.net | ' + __("Password reset");
  params.Source = process.env.MAILFROM, /* required */
  params.ReplyToAddresses = [ process.env.MAILFROM ],

  logger.info(params);
    
  // Create the promise and SES service object
  var sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
  
  // Handle promise's fulfilled/rejected states
  sendPromise.then(
    function(data) {
      cb(null);
    }
  ).catch(
    function(err) {
      cb(err);
    }
  );

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