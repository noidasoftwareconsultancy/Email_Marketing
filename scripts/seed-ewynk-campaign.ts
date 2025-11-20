import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting eWynk campaign template seeding...\n');

  // Read template files
  const assetsPath = path.join(process.cwd(), 'email-marketing-assets', 'ewynk-promo-campaign');
  
  const htmlTemplate = fs.readFileSync(path.join(assetsPath, 'html-template.html'), 'utf-8');
  const shortTemplate = fs.readFileSync(path.join(assetsPath, 'short-email-template.html'), 'utf-8');
  const plainTextTemplate = fs.readFileSync(path.join(assetsPath, 'plain-text-template.txt'), 'utf-8');
  const followupTemplates = JSON.parse(fs.readFileSync(path.join(assetsPath, 'followup-templates.json'), 'utf-8'));
  const subjectLines = JSON.parse(fs.readFileSync(path.join(assetsPath, 'subject-lines.json'), 'utf-8'));
  const previewText = JSON.parse(fs.readFileSync(path.join(assetsPath, 'preview-text.json'), 'utf-8'));
  const utmConfig = JSON.parse(fs.readFileSync(path.join(assetsPath, 'utm-config.json'), 'utf-8'));

  // Get the first user (or create a system user)
  let user = await prisma.user.findFirst();
  
  if (!user) {
    console.log('⚠️  No users found. Creating system user for templates...');
    user = await prisma.user.create({
      data: {
        email: 'system@ewynk.com',
        name: 'System',
      },
    });
  }

  console.log(`📧 Using user: ${user.email}\n`);

  // Helper function to build CTA URL with UTM
  const buildCtaUrl = (utmContent: string) => {
    const params = new URLSearchParams({
      utm_source: utmConfig.default.utm_source,
      utm_medium: utmConfig.default.utm_medium,
      utm_campaign: utmConfig.default.utm_campaign,
      utm_content: utmContent,
    });
    return `${utmConfig.base_url}?${params.toString()}`;
  };

  // Template 1: Main Promotional Email
  console.log('📝 Creating main promotional template...');
  const mainTemplate = await prisma.template.create({
    data: {
      name: 'eWynk Promo - Main (Full HTML)',
      description: 'Complete promotional email with all sections, stats, and services. Includes dark mode support and responsive design.',
      subject: subjectLines.general[1], // "Free strategy session — no strings attached"
      previewText: previewText.pairings[0].preview,
      htmlBody: htmlTemplate
        .replace('{{cta_url}}', buildCtaUrl('cta_schedule'))
        .replace('{{unsubscribe_url}}', '{{unsubscribe_url}}'), // Keep placeholder for system
      textBody: plainTextTemplate
        .replace('{{subject}}', subjectLines.general[1])
        .replace('{{cta_url}}', buildCtaUrl('cta_schedule'))
        .replace('{{unsubscribe_url}}', '{{unsubscribe_url}}'),
      category: 'promotional',
      isPublic: true,
      tags: ['ewynk', 'promo', 'strategy-session', 'full-version'],
      userId: user.id,
    },
  });
  console.log(`✅ Created: ${mainTemplate.name}\n`);

  // Template 2: Short Version
  console.log('📝 Creating short email template...');
  const shortTemplateDb = await prisma.template.create({
    data: {
      name: 'eWynk Promo - Short Version',
      description: 'Condensed promotional email focusing on CTA. Perfect for mobile-first audiences or quick sends.',
      subject: subjectLines.general[4], // "Quick 15-minute call to boost your site performance"
      previewText: 'Want practical ways to get more leads from your website?',
      htmlBody: shortTemplate
        .replace('{{cta_url}}', buildCtaUrl('cta_schedule'))
        .replace('{{unsubscribe_url}}', '{{unsubscribe_url}}'),
      textBody: 'Hi {{name}},\n\nWant practical ways to get more leads from your website? Book a free 15-minute strategy call — no obligation.\n\n' + buildCtaUrl('cta_schedule') + '\n\n— Vishal, eWynk\nhelp@ewynk.com | +91-9971978446\n\nUnsubscribe: {{unsubscribe_url}}',
      category: 'promotional',
      isPublic: true,
      tags: ['ewynk', 'promo', 'strategy-session', 'short-version'],
      userId: user.id,
    },
  });
  console.log(`✅ Created: ${shortTemplateDb.name}\n`);

  // Template 3: E-commerce Specific
  console.log('📝 Creating e-commerce specific template...');
  const ecommerceTemplate = await prisma.template.create({
    data: {
      name: 'eWynk Promo - E-commerce Focus',
      description: 'Promotional email tailored for e-commerce businesses and Shopify store owners.',
      subject: subjectLines.ecommerce[0], // "Boost your Shopify store sales — free consultation"
      previewText: 'Free e-commerce audit to find hidden revenue opportunities.',
      htmlBody: htmlTemplate
        .replace('{{cta_url}}', buildCtaUrl('cta_schedule'))
        .replace('{{unsubscribe_url}}', '{{unsubscribe_url}}'),
      textBody: plainTextTemplate
        .replace('{{subject}}', subjectLines.ecommerce[0])
        .replace('{{cta_url}}', buildCtaUrl('cta_schedule'))
        .replace('{{unsubscribe_url}}', '{{unsubscribe_url}}'),
      category: 'promotional',
      isPublic: true,
      tags: ['ewynk', 'promo', 'ecommerce', 'shopify'],
      userId: user.id,
    },
  });
  console.log(`✅ Created: ${ecommerceTemplate.name}\n`);

  // Template 4: Service Business Specific
  console.log('📝 Creating service business template...');
  const serviceTemplate = await prisma.template.create({
    data: {
      name: 'eWynk Promo - Service Business Focus',
      description: 'Promotional email tailored for service-based businesses emphasizing automation.',
      subject: subjectLines.service_business[0], // "Get more service bookings from your website"
      previewText: 'Automate client onboarding and save 10 hours every week.',
      htmlBody: htmlTemplate
        .replace('{{cta_url}}', buildCtaUrl('cta_schedule'))
        .replace('{{unsubscribe_url}}', '{{unsubscribe_url}}'),
      textBody: plainTextTemplate
        .replace('{{subject}}', subjectLines.service_business[0])
        .replace('{{cta_url}}', buildCtaUrl('cta_schedule'))
        .replace('{{unsubscribe_url}}', '{{unsubscribe_url}}'),
      category: 'promotional',
      isPublic: true,
      tags: ['ewynk', 'promo', 'service-business', 'automation'],
      userId: user.id,
    },
  });
  console.log(`✅ Created: ${serviceTemplate.name}\n`);

  // Template 5: Startup Focus
  console.log('📝 Creating startup-focused template...');
  const startupTemplate = await prisma.template.create({
    data: {
      name: 'eWynk Promo - Startup Focus',
      description: 'Promotional email tailored for early-stage startups and founders.',
      subject: subjectLines.startups[0], // "Launch your MVP faster with eWynk"
      previewText: 'Startup-friendly development to get you from idea to market quickly.',
      htmlBody: shortTemplate // Use short template for startups
        .replace('{{cta_url}}', buildCtaUrl('cta_schedule'))
        .replace('{{unsubscribe_url}}', '{{unsubscribe_url}}'),
      textBody: 'Hi {{name}},\n\nLaunch your MVP faster with eWynk. Startup-friendly pricing, enterprise-quality work.\n\nBook a free strategy call: ' + buildCtaUrl('cta_schedule') + '\n\n— Vishal, eWynk\nhelp@ewynk.com | +91-9971978446\n\nUnsubscribe: {{unsubscribe_url}}',
      category: 'promotional',
      isPublic: true,
      tags: ['ewynk', 'promo', 'startups', 'mvp'],
      userId: user.id,
    },
  });
  console.log(`✅ Created: ${startupTemplate.name}\n`);

  // Follow-up Templates
  console.log('📝 Creating follow-up templates...\n');

  // Follow-up 1: Gentle Reminder
  const followup1 = await prisma.template.create({
    data: {
      name: 'eWynk Follow-up 1 - Gentle Reminder',
      description: 'First follow-up email (2-3 days after initial). Gentle reminder about the free strategy session.',
      subject: followupTemplates.followup_1.subject,
      previewText: followupTemplates.followup_1.preview_text,
      htmlBody: followupTemplates.followup_1.html_body
        .replace('{{cta_url}}', buildCtaUrl('followup1'))
        .replace('{{unsubscribe_url}}', '{{unsubscribe_url}}'),
      textBody: followupTemplates.followup_1.plain_text
        .replace('{{cta_url}}', buildCtaUrl('followup1'))
        .replace('{{unsubscribe_url}}', '{{unsubscribe_url}}'),
      category: 'follow-up',
      isPublic: true,
      tags: ['ewynk', 'follow-up', 'reminder', 'sequence-1'],
      userId: user.id,
    },
  });
  console.log(`✅ Created: ${followup1.name}`);

  // Follow-up 2: Value Add
  const followup2 = await prisma.template.create({
    data: {
      name: 'eWynk Follow-up 2 - Value Add (3 Tips)',
      description: 'Second follow-up email (5-7 days after initial). Provides value with 3 quick conversion tips.',
      subject: followupTemplates.followup_2.subject,
      previewText: followupTemplates.followup_2.preview_text,
      htmlBody: followupTemplates.followup_2.html_body
        .replace('{{cta_url}}', buildCtaUrl('followup2'))
        .replace('{{unsubscribe_url}}', '{{unsubscribe_url}}'),
      textBody: followupTemplates.followup_2.plain_text
        .replace('{{cta_url}}', buildCtaUrl('followup2'))
        .replace('{{unsubscribe_url}}', '{{unsubscribe_url}}'),
      category: 'follow-up',
      isPublic: true,
      tags: ['ewynk', 'follow-up', 'value-add', 'sequence-2'],
      userId: user.id,
    },
  });
  console.log(`✅ Created: ${followup2.name}`);

  // Follow-up 3: Last Chance
  const followup3 = await prisma.template.create({
    data: {
      name: 'eWynk Follow-up 3 - Last Chance',
      description: 'Final follow-up email (10-12 days after initial). Creates urgency with limited slots messaging.',
      subject: followupTemplates.followup_3.subject,
      previewText: followupTemplates.followup_3.preview_text,
      htmlBody: followupTemplates.followup_3.html_body
        .replace('{{cta_url}}', buildCtaUrl('followup3'))
        .replace('{{unsubscribe_url}}', '{{unsubscribe_url}}'),
      textBody: followupTemplates.followup_3.plain_text
        .replace('{{cta_url}}', buildCtaUrl('followup3'))
        .replace('{{unsubscribe_url}}', '{{unsubscribe_url}}'),
      category: 'follow-up',
      isPublic: true,
      tags: ['ewynk', 'follow-up', 'urgency', 'sequence-3'],
      userId: user.id,
    },
  });
  console.log(`✅ Created: ${followup3.name}\n`);

  console.log('🎉 Successfully seeded 8 eWynk campaign templates!\n');
  console.log('📊 Summary:');
  console.log('  - 1 Main promotional template (full HTML)');
  console.log('  - 1 Short version template');
  console.log('  - 3 Audience-specific templates (E-commerce, Service, Startup)');
  console.log('  - 3 Follow-up sequence templates\n');
  console.log('✅ All templates include:');
  console.log('  - UTM tracking parameters');
  console.log('  - Responsive design');
  console.log('  - Dark mode support');
  console.log('  - Plain text fallbacks\n');
  console.log('🚀 Ready to use in your campaigns dashboard!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding templates:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
