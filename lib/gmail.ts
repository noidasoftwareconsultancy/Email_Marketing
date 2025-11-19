import { google } from 'googleapis';
import nodemailer from 'nodemailer';

export async function createGmailTransporter(accessToken: string, refreshToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'me',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: refreshToken,
      accessToken: accessToken,
    },
  });

  return transporter;
}

export async function sendEmail(
  transporter: nodemailer.Transporter,
  to: string,
  subject: string,
  html: string,
  text?: string
) {
  const mailOptions = {
    from: 'me',
    to,
    subject,
    html,
    text: text || '',
  };

  return await transporter.sendMail(mailOptions);
}
