import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@bulkmailerpro.com' },
    update: {},
    create: {
      id: 'demo-user-id',
      email: 'demo@bulkmailerpro.com',
      name: 'Demo User',
      emailQuota: 500,
      emailsSentToday: 0,
    },
  });

  console.log('✅ Created demo user:', demoUser.email);
  console.log('   User ID:', demoUser.id);
  console.log('\n✅ Database seeded successfully!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
