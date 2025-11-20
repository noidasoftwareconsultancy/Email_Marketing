import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Domain Launch Template...');

  // Read template files
  const htmlBody = readFileSync(
    join(process.cwd(), 'email-marketing-assets/domain-launch-template/html-template.html'),
    'utf-8'
  );

  const textBody = readFileSync(
    join(process.cwd(), 'email-marketing-assets/domain-launch-template/plain-text-template.txt'),
    'utf-8'
  );

  // Get the first user (or create a system user)
  let user = await prisma.user.findFirst();

  if (!user) {
    console.log('Creating system user...');
    user = await prisma.user.create({
      data: {
        email: 'system@ewynk.com',
        name: 'System',
      },
    });
  }

  // Create or update template
  const existingTemplate = await prisma.template.findFirst({
    where: {
      name: 'Domain Launch - Cold Outreach',
      userId: user.id,
    },
  });

  if (existingTemplate) {
    console.log('Updating existing template...');
    await prisma.template.update({
      where: { id: existingTemplate.id },
      data: {
        subject: 'Quick help with launching {{website}}',
        previewText: 'I came across your domain and wanted to check if you\'re planning to take it live soon.',
        htmlBody,
        textBody,
        description: 'Cold outreach template for domain owners who haven\'t launched their websites yet. Personalized with domain name and first name.',
        category: 'Cold Outreach',
        tags: ['cold-outreach', 'domain-launch', 'website-development', 'onboarding'],
        isPublic: true,
      },
    });
    console.log('✅ Template updated!');
  } else {
    console.log('Creating new template...');
    await prisma.template.create({
      data: {
        name: 'Domain Launch - Cold Outreach',
        subject: 'Quick help with launching {{website}}',
        previewText: 'I came across your domain and wanted to check if you\'re planning to take it live soon.',
        htmlBody,
        textBody,
        description: 'Cold outreach template for domain owners who haven\'t launched their websites yet. Personalized with domain name and first name.',
        category: 'Cold Outreach',
        tags: ['cold-outreach', 'domain-launch', 'website-development', 'onboarding'],
        isPublic: true,
        userId: user.id,
      },
    });
    console.log('✅ Template created!');
  }

  console.log('\n📧 Domain Launch Template Details:');
  console.log('   Name: Domain Launch - Cold Outreach');
  console.log('   Subject: Quick help with launching {{website}}');
  console.log('   Category: Cold Outreach');
  console.log('   Variables: {{firstName}}, {{website}}, {{cta_url}}, {{logo_white_url}}');
  console.log('\n✨ Template is ready to use in campaigns!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding template:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
