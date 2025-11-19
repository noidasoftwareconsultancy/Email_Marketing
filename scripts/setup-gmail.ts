import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupGmail() {
  try {
    console.log('Setting up Gmail credentials for demo user...\n');

    // Update demo user with Gmail credentials
    const user = await prisma.user.update({
      where: { id: 'demo-user-id' },
      data: {
        email: 'access@ewynk.com',
        googleTokens: {
          type: 'smtp',
          email: 'access@ewynk.com',
          password: 'YOUR_APP_PASSWORD_HERE', // Replace with actual app password
        },
      },
    });

    console.log('✅ Gmail credentials added for:', user.email);
    console.log('   User ID:', user.id);
    console.log('\n⚠️  IMPORTANT: Replace YOUR_APP_PASSWORD_HERE with your actual app password!');
    console.log('   Generate one at: https://myaccount.google.com/apppasswords\n');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupGmail();
