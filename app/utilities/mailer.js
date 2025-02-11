import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import pug from "pug";
import path from "path";
import { fileURLToPath } from "url";

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
    console.log(`mySendMailer ${data.template}`);

    const fn_html = pug.compileFile(
      path.join(__dirname, "../views/emails/", data.template, "html_ses.pug")
    );
    const fn_text = pug.compileFile(
      path.join(__dirname, "../views/emails/", data.template, "text_ses.pug")
    );

    const HTML_FORMAT_BODY = fn_html(data.email_content);
    const TEXT_FORMAT_BODY = fn_text(data.email_content).split("<br/>").join("\n");

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

    console.log("Email Params:", emailParams);
    const command = new SendEmailCommand(emailParams);
    const result = await sesClient.send(command);
    console.log("✅ Email sent successfully");

  } catch (err) {
    console.error(`🔥 Mailer Error: ${err}`);
    throw err;
  }
};

export { mySendMailer };
