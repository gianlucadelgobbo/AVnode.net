import pug from 'pug';
import aws from 'aws-sdk';
import { info as logInfo } from './logger.js'; // Fix logger import
import { fileURLToPath } from 'url';
import path from 'path';

// Fix `__dirname` in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load AWS SES configuration
aws.config.loadFromPath(path.join(__dirname, '../../config/ses.json'));

const params = {
  Destination: {
    CcAddresses: [],
    ToAddresses: []
  },
  Message: {
    Body: {
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
  Source: "MAILFROM",
  ReplyToAddresses: ["MAILFROM"],
};

const mySendMailer = async (data) => {
  try {
    logInfo(`mySendMailer ${data.template}`);

    const fn_html = pug.compileFile(path.join(__dirname, '../views/emails/', data.template, 'html_ses.pug'));
    const fn_text = pug.compileFile(path.join(__dirname, '../views/emails/', data.template, 'text_ses.pug'));

    const HTML_FORMAT_BODY = fn_html(data.email_content);
    const TEXT_FORMAT_BODY = fn_text(data.email_content).split("<br/>").join("\n");

    logInfo('TEXT_FORMAT_BODY');
    logInfo(TEXT_FORMAT_BODY);

    if (data.message.cc && data.message.cc.length) params.Destination.CcAddresses = data.message.cc;
    params.Destination.ToAddresses = [data.message.to];
    params.Message.Body.Html.Data = HTML_FORMAT_BODY;
    params.Message.Body.Text.Data = TEXT_FORMAT_BODY;
    params.Message.Subject.Data = data.email_content.subject;
    params.Source = data.message.from ? data.message.from : process.env.MAILFROM;
    params.ReplyToAddresses = [data.message.from ? data.message.from : process.env.MAILFROM];

    logInfo(params);

    const ses = new aws.SES({ apiVersion: '2010-12-01' });
    await ses.sendEmail(params).promise();

    return null; // No error
  } catch (err) {
    logInfo(`Mailer Error: ${err}`);
    throw err; // Pass error to the caller
  }
};

// Export the mailer function
export { mySendMailer };
