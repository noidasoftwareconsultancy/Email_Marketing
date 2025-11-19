import nodemailer from 'nodemailer';

/**
 * Create SMTP transporter for Gmail/Google Workspace
 * Works with regular password or App Password
 */
export function createSMTPTransporter(email: string, password: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Simplified - uses Gmail's settings automatically
    auth: {
      user: email,
      pass: password,
    },
  });

  return transporter;
}

/**
 * Send email using Nodemailer
 */
export async function sendSMTPEmail(
  transporter: nodemailer.Transporter,
  from: string,
  to: string,
  subject: string,
  html: string,
  text?: string
) {
  const mailOptions = {
    from: `"${process.env.NEXT_PUBLIC_FROM_NAME || 'BulkMailer Pro'}" <${from}>`,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
  };

  return await transporter.sendMail(mailOptions);
}

/**
 * Test SMTP connection
 */
export async function testSMTPConnection(email: string, password: string): Promise<boolean> {
  try {
    const transporter = createSMTPTransporter(email, password);
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('SMTP connection test failed:', error);
    return false;
  }
}
