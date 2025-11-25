/**
 * Contact Data Migration Script
 * 
 * This script helps migrate existing contacts to use the new schema fields.
 * Run this after updating your Prisma schema and generating the client.
 * 
 * Usage: node scripts/migrate-contacts.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateContacts() {
  console.log('🚀 Starting contact migration...\n');

  try {
    // Get all contacts
    const contacts = await prisma.contact.findMany();
    console.log(`📊 Found ${contacts.length} contacts to migrate\n`);

    let updated = 0;
    let skipped = 0;

    for (const contact of contacts) {
      const updates = {};
      let needsUpdate = false;

      // Set default language if not set
      if (!contact.language) {
        updates.language = 'en';
        needsUpdate = true;
      }

      // Set default score if not set
      if (contact.score === null || contact.score === undefined) {
        updates.score = 0;
        needsUpdate = true;
      }

      // Set default verification flags if not set
      if (contact.emailVerified === null || contact.emailVerified === undefined) {
        updates.emailVerified = false;
        needsUpdate = true;
      }

      if (contact.phoneVerified === null || contact.phoneVerified === undefined) {
        updates.phoneVerified = false;
        needsUpdate = true;
      }

      // Set default preference flags if not set
      if (contact.doNotEmail === null || contact.doNotEmail === undefined) {
        updates.doNotEmail = false;
        needsUpdate = true;
      }

      if (contact.doNotCall === null || contact.doNotCall === undefined) {
        updates.doNotCall = false;
        needsUpdate = true;
      }

      // Calculate initial lead score based on existing data
      if (updates.score === 0) {
        let calculatedScore = 0;

        // Has complete profile
        if (contact.firstName && contact.lastName && contact.phone && contact.company) {
          calculatedScore += 20;
        }

        // Has social media
        if (contact.linkedInUrl || contact.twitterHandle || contact.facebookUrl) {
          calculatedScore += 10;
        }

        // Has tags
        if (contact.tags && contact.tags.length > 0) {
          calculatedScore += 10;
        }

        // Has notes
        if (contact.notes) {
          calculatedScore += 5;
        }

        // Active status
        if (contact.status === 'ACTIVE') {
          calculatedScore += 15;
        }

        updates.score = Math.min(calculatedScore, 100);
      }

      // Update contact if needed
      if (needsUpdate) {
        await prisma.contact.update({
          where: { id: contact.id },
          data: updates,
        });
        updated++;
        console.log(`✅ Updated: ${contact.email} (Score: ${updates.score})`);
      } else {
        skipped++;
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`   Total contacts: ${contacts.length}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log('\n✨ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function createSampleActivities() {
  console.log('\n🎯 Creating sample activities...\n');

  try {
    // Get first 5 contacts
    const contacts = await prisma.contact.findMany({
      take: 5,
      where: { status: 'ACTIVE' },
    });

    if (contacts.length === 0) {
      console.log('⚠️  No active contacts found to create sample activities');
      return;
    }

    const activityTypes = [
      { type: 'EMAIL_SENT', title: 'Welcome Email Sent', description: 'Sent automated welcome email' },
      { type: 'EMAIL_OPENED', title: 'Email Opened', description: 'Opened welcome email' },
      { type: 'NOTE_ADDED', title: 'Note Added', description: 'Added initial contact note' },
      { type: 'TAG_ADDED', title: 'Tag Added', description: 'Added customer tag' },
    ];

    let created = 0;

    for (const contact of contacts) {
      // Create 2-3 random activities per contact
      const numActivities = Math.floor(Math.random() * 2) + 2;

      for (let i = 0; i < numActivities; i++) {
        const activity = activityTypes[Math.floor(Math.random() * activityTypes.length)];

        await prisma.contactActivity.create({
          data: {
            contactId: contact.id,
            userId: contact.userId,
            type: activity.type,
            title: activity.title,
            description: activity.description,
            metadata: {},
          },
        });

        created++;
      }

      console.log(`✅ Created activities for: ${contact.email}`);
    }

    console.log(`\n📊 Created ${created} sample activities`);

  } catch (error) {
    console.error('❌ Failed to create sample activities:', error);
  }
}

// Main execution
async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('   Contact System Migration Tool');
  console.log('═══════════════════════════════════════════════════\n');

  await migrateContacts();
  
  // Optionally create sample activities
  const createSamples = process.argv.includes('--samples');
  if (createSamples) {
    await createSampleActivities();
  } else {
    console.log('\n💡 Tip: Run with --samples flag to create sample activities');
  }

  console.log('\n═══════════════════════════════════════════════════');
  console.log('   Migration Complete!');
  console.log('═══════════════════════════════════════════════════\n');
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
