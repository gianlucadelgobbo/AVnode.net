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

module.exports.mySendMailer = (data, cb) => {
  logger.info('mySendMailer '+data.template);

  const fn_html = pug.compileFile(__dirname+'/../views/emails/'+data.template+'/html_ses.pug', null);
  const fn_text = pug.compileFile(__dirname+'/../views/emails/'+data.template+'/text_ses.pug', null);

  const HTML_FORMAT_BODY = fn_html(data.email_content);
  const TEXT_FORMAT_BODY = fn_text(data.email_content).split("<br/>").join("\n");

  logger.info('TEXT_FORMAT_BODY');
  logger.info(TEXT_FORMAT_BODY);

  params.Destination.ToAddresses = [ data.message.to ];
  params.Message.Body.Html.Data = HTML_FORMAT_BODY;
  params.Message.Body.Text.Data = TEXT_FORMAT_BODY;
  params.Message.Subject.Data = 'AVnode.net | ' + data.email_content.title;
  params.Source = process.env.MAILFROM; /* required */
  params.ReplyToAddresses = [ process.env.MAILFROM ];

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