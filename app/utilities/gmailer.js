import nodemailer from 'nodemailer';
import { google } from "googleapis";
import { info, debugLog, error } from './logger.js';

const OAuth2 = google.auth.OAuth2;

export const gMailer = (data, cb) => {
  debugLog('gMailer gMailer');
  debugLog(data);

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: data.auth
  });

  transporter.sendMail(data.mail, function(err, info) {
    if (err) {
      debugLog(err);
    } else {
      debugLog("info.messageId: " + info.messageId);
      debugLog("info.envelope: " + info.envelope);
      debugLog("info.accepted: " + info.accepted);
      debugLog("info.rejected: " + info.rejected);
      debugLog("info.pending: " + info.pending);
      debugLog("info.response: " + info.response);
    }
    transporter.close();
    debugLog(err || info);
    cb(err, info);
  });
};
