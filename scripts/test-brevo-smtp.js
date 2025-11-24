/**
 * Test Brevo SMTP Connection
 * Run with: node scripts/test-brevo-smtp.js [recipient@email.com]
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

async function testBrevoSMTP() {
  console.log('🔍 Testing Brevo SMTP Connection...\n');

  const config = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    email: process.env.SMTP_EMAIL,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  };
console.log(config,"con")
  // Allow custom recipient from command line
  const recipient = process.argv[2] || config.email;

  console.log('Configuration:');
  console.log('  Host:', config.host);
  console.log('  Port:', config.port);
  console.log('  From Email:', config.email);
  console.log('  SMTP User:', config.user);
  console.log('  Password:', config.password ? '***' + config.password.slice(-8) : 'NOT SET');
  console.log('  Recipient:', recipient);
  console.log('');

  if (!config.host || !config.port || !config.user || !config.password) {
    console.error('❌ Missing SMTP configuration in .env file');
    process.exit(1);
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: false, // Use STARTTLS
      auth: {
        user: config.user,
        pass: config.password,
      },
      debug: true, // Enable debug output
      logger: true, // Log to console
    });

    console.log('⏳ Verifying connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified!\n');

    console.log('📧 Sending test email to:', recipient);
    const info = await transporter.sendMail({
      from: `"eWynk Test" <${config.email}>`,
      to: recipient,
      subject: 'Brevo SMTP Test - ' + new Date().toLocaleString(),
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #4F46E5;">✅ Brevo SMTP Test Successful!</h2>
          <p>This email was sent successfully using Brevo SMTP relay.</p>
          <hr style="border: 1px solid #E5E7EB; margin: 20px 0;">
          <p><strong>Configuration Details:</strong></p>
          <ul style="line-height: 1.8;">
            <li><strong>Host:</strong> ${config.host}</li>
            <li><strong>Port:</strong> ${config.port}</li>
            <li><strong>From:</strong> ${config.email}</li>
            <li><strong>SMTP User:</strong> ${config.user}</li>
            <li><strong>To:</strong> ${recipient}</li>
          </ul>
          <hr style="border: 1px solid #E5E7EB; margin: 20px 0;">
          <p style="color: #059669; font-weight: bold;">✓ Email delivery working correctly!</p>
          <p style="color: #6B7280; font-size: 12px;">Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `,
      text: `Brevo SMTP Test Successful!\n\nThis email was sent using Brevo SMTP relay.\n\nConfiguration:\n- Host: ${config.host}\n- Port: ${config.port}\n- From: ${config.email}\n- To: ${recipient}\n\nSent at: ${new Date().toLocaleString()}`,
    });

    console.log('\n✅ Test email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    console.log('   Accepted:', info.accepted);
    console.log('   Rejected:', info.rejected);
    console.log('\n🎉 All tests passed! Your Brevo SMTP is configured correctly.');
    console.log('\n📬 Important Notes:');
    console.log('   1. Check your spam/junk folder if you don\'t see the email');
    console.log('   2. Verify that', config.email, 'is verified in your Brevo account');
    console.log('   3. Check Brevo dashboard for delivery logs: https://app.brevo.com/');
    console.log('   4. It may take 1-2 minutes for the email to arrive');
  } catch (error) {
    console.error('\n❌ SMTP test failed:', error.message);
    if (error.code) {
      console.error('   Error code:', error.code);
    }
    if (error.response) {
      console.error('   Server response:', error.response);
    }
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Verify your Brevo API key is correct');
    console.error('   2. Check that', config.email, 'is verified in Brevo');
    console.error('   3. Ensure your Brevo account is active');
    console.error('   4. Check Brevo SMTP settings: https://app.brevo.com/settings/keys/smtp');
    process.exit(1);
  }
}

testBrevoSMTP();
