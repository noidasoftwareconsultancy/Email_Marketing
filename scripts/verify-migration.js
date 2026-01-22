/**
 * Verify Database Migration
 * 
 * This script checks if the database has been updated with the new schema.
 * Run this to verify the migration was successful.
 * 
 * Usage: node scripts/verify-migration.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyMigration() {
  console.log('🔍 Verifying database migration...\n');

  const checks = {
    newContactFields: false,
    contactActivityTable: false,
    contactDuplicateTable: false,
    contactSegmentTable: false,
    contactFieldTable: false,
  };

  try {
    // Check 1: New Contact fields
    console.log('1️⃣ Checking new Contact fields...');
    try {
      const contact = await prisma.contact.findFirst({
        select: {
          id: true,
          linkedInUrl: true,
          score: true,
          rating: true,
          emailVerified: true,
          doNotEmail: true,
        },
      });
      checks.newContactFields = true;
      console.log('   ✅ New Contact fields exist\n');
    } catch (error) {
      console.log('   ❌ New Contact fields missing');
      console.log(`   Error: ${error.message}\n`);
    }

    // Check 2: ContactActivity table
    console.log('2️⃣ Checking ContactActivity table...');
    try {
      await prisma.contactActivity.findFirst();
      checks.contactActivityTable = true;
      console.log('   ✅ ContactActivity table exists\n');
    } catch (error) {
      console.log('   ❌ ContactActivity table missing');
      console.log(`   Error: ${error.message}\n`);
    }

    // Check 3: ContactDuplicate table
    console.log('3️⃣ Checking ContactDuplicate table...');
    try {
      await prisma.contactDuplicate.findFirst();
      checks.contactDuplicateTable = true;
      console.log('   ✅ ContactDuplicate table exists\n');
    } catch (error) {
      console.log('   ❌ ContactDuplicate table missing');
      console.log(`   Error: ${error.message}\n`);
    }

    // Check 4: ContactSegment table
    console.log('4️⃣ Checking ContactSegment table...');
    try {
      await prisma.contactSegment.findFirst();
      checks.contactSegmentTable = true;
      console.log('   ✅ ContactSegment table exists\n');
    } catch (error) {
      console.log('   ❌ ContactSegment table missing');
      console.log(`   Error: ${error.message}\n`);
    }

    // Check 5: ContactField table
    console.log('5️⃣ Checking ContactField table...');
    try {
      await prisma.contactField.findFirst();
      checks.contactFieldTable = true;
      console.log('   ✅ ContactField table exists\n');
    } catch (error) {
      console.log('   ❌ ContactField table missing');
      console.log(`   Error: ${error.message}\n`);
    }

    // Summary
    console.log('═══════════════════════════════════════════════════');
    console.log('   Migration Verification Summary');
    console.log('═══════════════════════════════════════════════════\n');

    const passed = Object.values(checks).filter(Boolean).length;
    const total = Object.keys(checks).length;

    console.log(`✅ Passed: ${passed}/${total}`);
    console.log(`❌ Failed: ${total - passed}/${total}\n`);

    if (passed === total) {
      console.log('🎉 All checks passed! Migration successful!\n');
      console.log('Next steps:');
      console.log('1. Restart your development server');
      console.log('2. Test the new features');
      console.log('3. Run: node scripts/migrate-contacts.js (optional)\n');
      return true;
    } else {
      console.log('⚠️  Migration incomplete. Please run the migration:\n');
      console.log('Option 1: Run SQL in Supabase SQL Editor');
      console.log('   File: prisma/migrations/add_contact_enhancements.sql\n');
      console.log('Option 2: Use Prisma CLI');
      console.log('   Command: npx prisma db push\n');
      console.log('See DATABASE_MIGRATION_GUIDE.md for details.\n');
      return false;
    }

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    console.log('\nMake sure:');
    console.log('1. Database is accessible');
    console.log('2. Prisma client is generated (run: npx prisma generate)');
    console.log('3. .env file has correct DATABASE_URL\n');
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run verification
verifyMigration()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
