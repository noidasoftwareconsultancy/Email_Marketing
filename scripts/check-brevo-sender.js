/**
 * Check Brevo Sender Status
 * This script helps diagnose sender verification issues
 */

require('dotenv').config();

async function checkBrevoSender() {
  console.log('🔍 Checking Brevo Sender Configuration...\n');

  // Try to use BREVO_API_KEY first, fall back to SMTP_PASSWORD
  const apiKey = process.env.BREVO_API_KEY || process.env.SMTP_PASSWORD;
  const senderEmail = process.env.SMTP_EMAIL;

  if (!apiKey) {
    console.error('❌ BREVO_API_KEY or SMTP_PASSWORD not found in .env');
    console.log('\n💡 To check sender verification, you need a Brevo API key:');
    console.log('   1. Go to: https://app.brevo.com/settings/keys/api');
    console.log('   2. Copy your API key (v3)');
    console.log('   3. Add to .env: BREVO_API_KEY=your-api-key-here');
    process.exit(1);
  }

  console.log('Sender Email:', senderEmail);
  console.log('API Key:', apiKey ? '***' + apiKey.slice(-8) : 'NOT SET');
  console.log('');

  try {
    // Check senders using Brevo API
    console.log('⏳ Fetching sender list from Brevo...\n');
    
    const response = await fetch('https://api.brevo.com/v3/senders', {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ API request failed:', response.status, response.statusText);
      console.error('Response:', error);
      console.log('\n💡 Make sure you are using the correct API key from:');
      console.log('   https://app.brevo.com/settings/keys/api');
      process.exit(1);
    }

    const data = await response.json();
    
    console.log('✅ Successfully connected to Brevo API\n');
    console.log('📧 Verified Senders:');
    console.log('─'.repeat(60));

    if (data.senders && data.senders.length > 0) {
      data.senders.forEach((sender, index) => {
        console.log(`\n${index + 1}. ${sender.name || 'No Name'}`);
        console.log(`   Email: ${sender.email}`);
        console.log(`   Active: ${sender.active ? '✅ Yes' : '❌ No'}`);
        console.log(`   ID: ${sender.id}`);
        
        if (sender.email === senderEmail) {
          console.log('   🎯 THIS IS YOUR CONFIGURED SENDER');
        }
      });

      console.log('\n' + '─'.repeat(60));

      // Check if configured sender is in the list
      const configuredSender = data.senders.find(s => s.email === senderEmail);
      
      if (configuredSender) {
        if (configuredSender.active) {
          console.log('\n✅ Your sender email', senderEmail, 'is verified and active!');
        } else {
          console.log('\n⚠️  Your sender email', senderEmail, 'is verified but NOT active!');
          console.log('   Please activate it in Brevo dashboard.');
        }
      } else {
        console.log('\n❌ Your sender email', senderEmail, 'is NOT verified in Brevo!');
        console.log('\n📝 To add and verify your sender:');
        console.log('   1. Go to: https://app.brevo.com/senders');
        console.log('   2. Click "Add a new sender"');
        console.log('   3. Add:', senderEmail);
        console.log('   4. Verify the email by clicking the link sent to your inbox');
      }
    } else {
      console.log('\n⚠️  No verified senders found in your Brevo account!');
      console.log('\n📝 To add a sender:');
      console.log('   1. Go to: https://app.brevo.com/senders');
      console.log('   2. Click "Add a new sender"');
      console.log('   3. Add:', senderEmail);
      console.log('   4. Verify the email');
    }

    console.log('\n📊 Account Info:');
    console.log('   Total Senders:', data.senders?.length || 0);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify your API key is correct');
    console.log('   3. Visit: https://app.brevo.com/settings/keys/api');
  }
}

checkBrevoSender();
