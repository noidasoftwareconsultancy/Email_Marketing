import { NextRequest, NextResponse } from 'next/server';
import { createSMTPTransporter, sendSMTPEmail } from '@/lib/smtp-mailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, html, text } = body;

    // Get SMTP credentials from environment
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpEmail || !smtpPassword) {
      return NextResponse.json(
        { error: 'SMTP not configured. Please check your .env file.' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = createSMTPTransporter(smtpEmail, smtpPassword);

    // Send email
    const info = await sendSMTPEmail(
      transporter,
      smtpEmail,
      to,
      subject,
      html,
      text
    );

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      response: info.response,
    });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send test email',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
