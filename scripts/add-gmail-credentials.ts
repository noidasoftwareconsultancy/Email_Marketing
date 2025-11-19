import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function addCredentials() {
  try {
    console.log('\n🔐 Gmail Credentials Setup\n');
    console.log('This will add Gmail credentials to your demo user.\n');
    
    const email = await question('Enter Gmail address (default: access@ewynk.com): ') || 'access@ewynk.com';
    const password = await question('Enter App Password (16 characters, no spaces): ');
    
    if (!password || password.length < 10) {
      console.log('\n❌ Invalid password. Please enter your App Password.');
      console.log('   Generate one at: https://myaccount.google.com/apppasswords\n');
      process.exit(1);
    }

    console.log('\n⏳ Saving credentials...');

    const user = await prisma.user.update({
      where: { id: 'demo-user-id' },
      data: {
        email: email,
        googleTokens: {
          type: 'smtp',
          email: email,
          password: password.replace(/\s/g, ''), // Remove any spaces
        },
      },
    });

    console.log('\n✅ Gmail credentials saved successfully!');
    console.log('   Email:', user.email);
    console.log('   User ID:', user.id);
    console.log('\n🚀 You can now send campaigns!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

addCredentials();
