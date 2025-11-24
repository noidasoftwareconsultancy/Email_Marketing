import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSMTPTransporter, sendSMTPEmail } from '@/lib/smtp-mailer';
import { prepareEmailContent, replaceVariables } from '@/lib/email-variables';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, ctaUrl } = body;

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        template: true,
        user: true,
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Get contacts based on campaign's target tags
    const targetTags = campaign.targetTags || [];
    const contacts = await prisma.contact.findMany({
      where: {
        userId: campaign.userId,
        status: 'ACTIVE',
        tags: targetTags.length > 0 ? { hasSome: targetTags } : undefined,
      },
    });

    if (contacts.length === 0) {
      return NextResponse.json({ error: 'No contacts found matching the criteria' }, { status: 400 });
    }

    // Update campaign status and total recipients
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { 
        status: 'SENDING',
        totalRecipients: contacts.length,
      },
    });

    // Get SMTP credentials - prioritize environment variables over database
    const envEmail = process.env.SMTP_EMAIL;
    const envPassword = process.env.SMTP_PASSWORD;
    const dbCredentials = campaign.user.googleTokens as any;
    
    // Use environment variables if available, otherwise fall back to database
    const credentials = {
      email: envEmail || dbCredentials?.email,
      password: envPassword || dbCredentials?.password,
      type: envEmail ? 'smtp-env' : dbCredentials?.type,
    };
    
    console.log('User credentials:', {
      hasCredentials: !!credentials.email && !!credentials.password,
      hasEmail: credentials.email,
      hasPassword: credentials.password ? '***' : undefined,
      credentialsType: credentials.type,
      source: envEmail ? 'environment' : 'database',
    });
    
    if (!credentials.email || !credentials.password) {
      return NextResponse.json({ 
        error: 'SMTP not configured. Please set SMTP credentials in environment variables or connect Gmail in Settings.',
        details: 'No SMTP credentials found'
      }, { status: 400 });
    }

    // Create Nodemailer transporter
    const transporter = createSMTPTransporter(credentials.email, credentials.password);
    const senderEmail = credentials.email;

    let sent = 0;
    let failed = 0;

    // Send emails using Nodemailer with variable replacement
    for (const contact of contacts) {
      try {
        // Prepare personalized email content with variables
        const { html, text } = prepareEmailContent(
          campaign.template.htmlBody,
          campaign.template.textBody,
          contact,
          campaignId,
          { ctaUrl }
        );

        // Replace variables in subject line with all contact variables
        const subjectVariables = {
          name: contact.name || contact.firstName || 'there',
          firstName: contact.firstName || contact.name?.split(' ')[0] || 'there',
          lastName: contact.lastName || contact.name?.split(' ').slice(1).join(' ') || '',
          company: contact.company || '',
          website: contact.website || contact.email?.split('@')[1] || 'your-domain.com',
          email: contact.email,
          jobTitle: contact.jobTitle || '',
          phone: contact.phone || '',
          city: contact.city || '',
          state: contact.state || '',
          country: contact.country || '',
        };
        
        const personalizedSubject = replaceVariables(
          campaign.template.subject,
          subjectVariables
        );

        await sendSMTPEmail(
          transporter,
          senderEmail,
          contact.email,
          personalizedSubject,
          html,
          text || undefined
        );

        await prisma.emailLog.create({
          data: {
            campaignId,
            contactId: contact.id,
            status: 'SENT',
            sentAt: new Date(),
          },
        });

        sent++;
      } catch (error) {
        await prisma.emailLog.create({
          data: {
            campaignId,
            contactId: contact.id,
            status: 'FAILED',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });

        failed++;
      }

      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Update campaign
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: 'COMPLETED',
        sentAt: new Date(),
        completedAt: new Date(),
        totalSent: sent,
        totalFailed: failed,
      },
    });

    return NextResponse.json({ sent, failed });
  } catch (error: any) {
    console.error('Campaign send error:', error);
    return NextResponse.json({ 
      error: 'Failed to send campaign',
      details: error.message 
    }, { status: 500 });
  }
}
