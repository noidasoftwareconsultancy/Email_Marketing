/**
 * Complete Email System Diagnostic
 * Checks all aspects of the email configuration
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

async function diagnoseEmailSystem() {
  console.log('🔍 Email System Diagnostic Report');
  console.log('═'.repeat(60));
  console.log('');

  let issues = [];
  let warnings = [];
  let success = [];

  // 1. Check Environment Variables
  console.log('1️⃣  Checking Environment Variables...');
  console.log('─'.repeat(60));
  
  const requiredVars = {
    'SMTP_HOST': process.env.SMTP_HOST,
    'SMTP_PORT': process.env.SMTP_PORT,
    'SMTP_EMAIL': process.env.SMTP_EMAIL,
    'SMTP_USER': process.env.SMTP_USER,
    'SMTP_PASSWORD': process.env.SMTP_PASSWORD,
  };

  for (const [key, value] of Object.entries(requiredVars)) {
    if (value) {
      console.log(`   ✅ ${key}: ${key.includes('PASSWORD') ? '***' + value.slice(-8) : value}`);
      success.push(`${key} is set`);
    } else {
      console.log(`   ❌ ${key}: NOT SET`);
      issues.push(`${key} is missing`);
    }
  }

  const optionalVars = {
    'BREVO_API_KEY': process.env.BREVO_API_KEY,
    'NEXT_PUBLIC_FROM_NAME': process.env.NEXT_PUBLIC_FROM_NAME,
    'NEXT_PUBLIC_REPLY_TO_EMAIL': process.env.NEXT_PUBLIC_REPLY_TO_EMAIL,
  };

  console.log('\n   Optional Variables:');
  for (const [key, value] of Object.entries(optionalVars)) {
    if (value) {
      console.log(`   ✅ ${key}: ${value}`);
    } else {
      console.log(`   ⚠️  ${key}: Not set (optional)`);
      warnings.push(`${key} not set (optional)`);
    }
  }

  console.log('');

  // 2. Test SMTP Connection
  console.log('2️⃣  Testing SMTP Connection...');
  console.log('─'.repeat(60));

  if (issues.length === 0) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      await transporter.verify();
      console.log('   ✅ SMTP connection successful');
      console.log('   ✅ Authentication successful');
      success.push('SMTP connection working');
    } catch (error) {
      console.log('   ❌ SMTP connection failed:', error.message);
      issues.push('SMTP connection failed: ' + error.message);
    }
  } else {
    console.log('   ⏭️  Skipped (missing required variables)');
  }

  console.log('');

  // 3. Check Brevo API Access
  console.log('3️⃣  Checking Brevo API Access...');
  console.log('─'.repeat(60));

  const apiKey = process.env.BREVO_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch('https://api.brevo.com/v3/account', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('   ✅ Brevo API access successful');
        console.log('   📧 Account Email:', data.email);
        console.log('   📊 Plan:', data.plan?.type || 'Unknown');
        
        if (data.plan?.creditsType === 'sendLimit') {
          console.log('   📬 Daily Limit:', data.plan.credits || 'Unknown');
        }
        success.push('Brevo API access working');
      } else {
        console.log('   ❌ Brevo API access failed');
        issues.push('Invalid Brevo API key');
      }
    } catch (error) {
      console.log('   ❌ Brevo API error:', error.message);
      issues.push('Brevo API error: ' + error.message);
    }
  } else {
    console.log('   ⚠️  BREVO_API_KEY not set');
    console.log('   ℹ️  Cannot verify sender status without API key');
    warnings.push('Cannot check sender verification status');
  }

  console.log('');

  // 4. Check Sender Verification
  console.log('4️⃣  Checking Sender Verification...');
  console.log('─'.repeat(60));

  if (apiKey) {
    try {
      const response = await fetch('https://api.brevo.com/v3/senders', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const senderEmail = process.env.SMTP_EMAIL;
        const sender = data.senders?.find(s => s.email === senderEmail);

        if (sender) {
          if (sender.active) {
            console.log('   ✅ Sender email verified and active');
            console.log('   📧 Email:', sender.email);
            console.log('   👤 Name:', sender.name || 'Not set');
            success.push('Sender email verified');
          } else {
            console.log('   ⚠️  Sender email verified but NOT active');
            console.log('   📧 Email:', sender.email);
            warnings.push('Sender email not active');
          }
        } else {
          console.log('   ❌ Sender email NOT verified in Brevo');
          console.log('   📧 Email:', senderEmail);
          console.log('   ℹ️  Go to: https://app.brevo.com/senders');
          issues.push('Sender email not verified - emails may not be delivered');
        }

        if (data.senders && data.senders.length > 0) {
          console.log('\n   📋 All verified senders:');
          data.senders.forEach(s => {
            console.log(`      • ${s.email} ${s.active ? '✅' : '❌'}`);
          });
        }
      }
    } catch (error) {
      console.log('   ❌ Error checking senders:', error.message);
    }
  } else {
    console.log('   ⏭️  Skipped (BREVO_API_KEY not set)');
    console.log('   ℹ️  Add BREVO_API_KEY to .env to check sender status');
  }

  console.log('');

  // Summary
  console.log('═'.repeat(60));
  console.log('📊 DIAGNOSTIC SUMMARY');
  console.log('═'.repeat(60));
  console.log('');

  if (success.length > 0) {
    console.log('✅ Success (' + success.length + '):');
    success.forEach(s => console.log('   • ' + s));
    console.log('');
  }

  if (warnings.length > 0) {
    console.log('⚠️  Warnings (' + warnings.length + '):');
    warnings.forEach(w => console.log('   • ' + w));
    console.log('');
  }

  if (issues.length > 0) {
    console.log('❌ Issues (' + issues.length + '):');
    issues.forEach(i => console.log('   • ' + i));
    console.log('');
  }

  // Recommendations
  console.log('💡 RECOMMENDATIONS:');
  console.log('─'.repeat(60));

  if (issues.some(i => i.includes('Sender email not verified'))) {
    console.log('1. VERIFY YOUR SENDER EMAIL (CRITICAL):');
    console.log('   • Go to: https://app.brevo.com/senders');
    console.log('   • Add and verify:', process.env.SMTP_EMAIL);
    console.log('   • This is why emails are not being delivered!');
    console.log('');
  }

  if (!process.env.BREVO_API_KEY) {
    console.log('2. Add Brevo API Key (recommended):');
    console.log('   • Go to: https://app.brevo.com/settings/keys/api');
    console.log('   • Copy your API key');
    console.log('   • Add to .env: BREVO_API_KEY=your-key');
    console.log('');
  }

  if (issues.length === 0 && warnings.length === 0) {
    console.log('🎉 Everything looks good! Your email system is ready.');
    console.log('');
    console.log('Test sending an email:');
    console.log('   node scripts/test-brevo-smtp.js your-email@example.com');
  }

  console.log('═'.repeat(60));
}

diagnoseEmailSystem().catch(console.error);
