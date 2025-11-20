#!/usr/bin/env node

/**
 * Test Contact API
 * Quick test to verify contact creation works
 */

const testContact = {
  email: 'test@example.com',
  name: 'Test User',
  firstName: 'Test',
  lastName: 'User',
  phone: '+1-555-0100',
  company: 'Test Company',
  jobTitle: 'Manager',
  website: 'https://example.com',
  address: '123 Test St',
  city: 'Test City',
  state: 'Test State',
  country: 'Test Country',
  zipCode: '12345',
  tags: 'test,demo,sample',
  source: 'manual',
  notes: 'This is a test contact',
};

async function testCreateContact() {
  console.log('🧪 Testing Contact Creation API\n');
  console.log('Test Data:', JSON.stringify(testContact, null, 2));
  console.log('\n📡 Sending POST request to /api/contacts...\n');

  try {
    const response = await fetch('http://ewynk.com/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testContact),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ SUCCESS! Contact created:\n');
      console.log(JSON.stringify(data, null, 2));
      console.log('\n🎉 Contact API is working correctly!');
      return data.id;
    } else {
      console.log('❌ FAILED! Error response:\n');
      console.log(JSON.stringify(data, null, 2));
      console.log('\n⚠️  Contact API has issues. Check the error above.');
      return null;
    }
  } catch (error) {
    console.log('❌ FAILED! Network error:\n');
    console.error(error);
    console.log('\n⚠️  Make sure the development server is running (npm run dev)');
    return null;
  }
}

async function testGetContacts() {
  console.log('\n\n🧪 Testing Get Contacts API\n');
  console.log('📡 Sending GET request to /api/contacts...\n');

  try {
    const response = await fetch('http://ewynk.com/api/contacts');
    const data = await response.json();

    if (response.ok) {
      console.log(`✅ SUCCESS! Retrieved ${data.length} contacts\n`);
      if (data.length > 0) {
        console.log('First contact:', JSON.stringify(data[0], null, 2));
      }
      return true;
    } else {
      console.log('❌ FAILED! Error response:\n');
      console.log(JSON.stringify(data, null, 2));
      return false;
    }
  } catch (error) {
    console.log('❌ FAILED! Network error:\n');
    console.error(error);
    return false;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('           Contact API Test Suite');
  console.log('═══════════════════════════════════════════════════════\n');

  // Test create
  const contactId = await testCreateContact();

  // Test get
  await testGetContacts();

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('           Test Complete');
  console.log('═══════════════════════════════════════════════════════\n');

  if (contactId) {
    console.log('✅ All tests passed!');
    console.log('\nYou can now:');
    console.log('1. Add contacts manually via the UI');
    console.log('2. Import contacts from CSV');
    console.log('3. Import contacts from Excel');
    console.log('\nOpen: http://ewynk.com/dashboard/contacts\n');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.\n');
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000');
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Run tests
checkServer().then(isRunning => {
  if (!isRunning) {
    console.log('❌ Development server is not running!\n');
    console.log('Please start the server first:');
    console.log('  npm run dev\n');
    process.exit(1);
  }
  main();
});
