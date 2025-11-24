/**
 * Check Brevo Account Status and Sender Verification
 * Run with: node scripts/check-brevo-status.js
 */

require('dotenv').config();

async function checkBrevoStatus() {
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    console.error('❌ BREVO_API_KEY not found in .env');
    process.exit(1);
  }

  console.log('🔍 Checking Brevo Account Status...\n');

  try {
    // Check account info
    console.log('📊 Account Information:');
    const accountResponse = await fetch('https://api.brevo.com/v3/account', {
      headers: {
        'accept': 'application/json',
        'api-key': apiKey
      }
    });
    
    if (!accountResponse.ok) {
      throw new Error(`API Error: ${accountResponse.status} ${accountResponse.statusText}`);
    }
    
    const account = await accountResponse.json();
    console.log('   Email:', account.email);
    console.log('   Plan:', account.plan?.[0]?.type || 'Unknown');
    console.log('   Credits:', account.plan?.[0]?.credits || 'N/A');
    console.log('   Credits Used:', account.plan?.[0]?.creditsUsed || 'N/A');
    
    // Check senders
    console.log('\n📧 Verified Senders:');
    const sendersResponse = await fetch('https://api.brevo.com/v3/senders', {
      headers: {
        'accept': 'application/json',
        'api-key': apiKey
      }
    });
    
    if (!sendersResponse.ok) {
      throw new Error(`Senders API Error: ${sendersResponse.status}`);
    }
    
    const senders = await sendersResponse.json();
    
    if (senders.senders && senders.senders.length > 0) {
      senders.senders.forEach(sender => {
        const status = sender.active ? '✅ Active' : '❌ Inactive';
        console.log(`   ${status} - ${sender.email} (${sender.name})`);
      });
    } else {
      console.log('   ⚠️  No verified senders found!');
    }

    // Check if access@ewynk.com is verified
    const targetEmail = process.env.SMTP_EMAIL || 'access@ewynk.com';
    const isVerified = senders.senders?.some(s => s.email === targetEmail && s.active);
    
    console.log('\n🎯 Sender Verification Status:');
    console.log(`   Email: ${targetEmail}`);
    console.log(`   Status: ${isVerified ? '✅ VERIFIED' : '❌ NOT VERIFIED'}`);
    
    if (!isVerified) {
      console.log('\n⚠️  ACTION REQUIRED:');
      console.log('   Your sender email is not verified in Brevo!');
      console.log('   This is why emails are not being delivered.');
      console.log('\n📝 To fix this:');
      console.log('   1. Go to: https://app.brevo.com/senders');
      console.log('   2. Add and verify:', targetEmail);
      console.log('   3. Follow the verification steps (email confirmation or DNS records)');
    }

    // Check recent email activity
    console.log('\n📬 Recent Email Activity:');
    const eventsResponse = await fetch('https://api.brevo.com/v3/smtp/statistics/events?limit=10&offset=0', {
      headers: {
        'accept': 'application/json',
        'api-key': apiKey
      }
    });
    
    if (eventsResponse.ok) {
      const events = await eventsResponse.json();
      if (events.events && events.events.length > 0) {
        console.log(`   Found ${events.events.length} recent events`);
        events.events.slice(0, 5).forEach(event => {
          console.log(`   - ${event.event}: ${event.email} (${new Date(event.date).toLocaleString()})`);
        });
      } else {
        console.log('   No recent email events found');
      }
    }

    console.log('\n✅ Status check complete!');
    console.log('\n💡 Next Steps:');
    console.log('   1. Verify your sender email if not already done');
    console.log('   2. Check spam folder at recipient email');
    console.log('   3. View full logs: https://app.brevo.com/log');
    
  } catch (error) {
    console.error('\n❌ Error checking Brevo status:', error.message);
    console.error('\n💡 Make sure your BREVO_API_KEY is correct');
    console.error('   Get it from: https://app.brevo.com/settings/keys/api');
  }
}

checkBrevoStatus();
