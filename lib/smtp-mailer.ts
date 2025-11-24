import nodemailer from 'nodemailer';

/**
 * Create SMTP transporter for Gmail/Google Workspace or custom SMTP
 * Works with regular password or App Password
 */
export function createSMTPTransporter(email: string, password: string) {
  // Check if custom SMTP settings are provided
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;

  if (smtpHost && smtpPort) {
    // Use custom SMTP settings (e.g., Brevo, SendGrid, etc.)
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtpUser || email,
        pass: password,
      },
    });
    return transporter;
  }

  // Default to Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
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
  // Use SMTP_EMAIL from environment if available (for Brevo verified sender)
  const senderEmail = process.env.SMTP_EMAIL || from;
  
  const mailOptions = {
    from: `"${process.env.NEXT_PUBLIC_FROM_NAME || 'eWynk Mail'}" <${senderEmail}>`,
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
