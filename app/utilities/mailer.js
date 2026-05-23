import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import pug from "pug";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sesConf = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
}

const sesClient = new SESClient(sesConf);

const mySendMailer = async (data) => {
  try {
    logger.warn(`mySendMailer ${data.template} → ${data.message.to}`);

    const fn_html = pug.compileFile(
      path.join(__dirname, "../views/emails/", data.template, "html_ses.pug")
    );
    const fn_text = pug.compileFile(
      path.join(__dirname, "../views/emails/", data.template, "text_ses.pug")
    );

    const locals = {
      ...data.email_content,
      ...(data.__ ? { __: data.__ } : {})
    };

    const HTML_FORMAT_BODY = fn_html(locals);
    const TEXT_FORMAT_BODY = fn_text(locals).split("<br/>").join("\n");

    const emailParams = {
      Destination: {
        ToAddresses: [data.message.to],
      },
      Message: {
        Body: {
          Html: { Charset: "UTF-8", Data: HTML_FORMAT_BODY },
          Text: { Charset: "UTF-8", Data: TEXT_FORMAT_BODY },
        },
        Subject: { Charset: "UTF-8", Data: data.email_content.subject },
      },
      Source: process.env.MAILFROM,
    };

    const command = new SendEmailCommand(emailParams);
    const result = await sesClient.send(command);
    logger.warn(`mySendMailer ✅ sent ${data.template} → ${data.message.to} [msgId:${result.MessageId}]`);

  } catch (err) {
    const sesCode = err?.name || err?.Code || err?.$metadata?.httpStatusCode || 'unknown';
    const sesRequestId = err?.$metadata?.requestId || '';
    logger.error(`mySendMailer ❌ ${data.template} → ${data.message.to} [${sesCode}${sesRequestId ? ' req:' + sesRequestId : ''}]: ${err.message}`);
    throw err;
  }
};

export { mySendMailer };
