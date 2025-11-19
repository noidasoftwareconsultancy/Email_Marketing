import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSMTPTransporter, sendSMTPEmail } from '@/lib/smtp-mailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId } = body;

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

    // Get SMTP credentials from user
    const credentials = campaign.user.googleTokens as any;
    
    console.log('User credentials:', {
      hasCredentials: !!credentials,
      hasEmail: credentials?.email,
      hasPassword: credentials?.password,
      credentialsType: credentials?.type,
    });
    
    if (!credentials || !credentials.email || !credentials.password) {
      return NextResponse.json({ 
        error: 'Gmail not connected. Please connect your Gmail account in Settings.',
        details: 'No SMTP credentials found for this user'
      }, { status: 400 });
    }

    // Create Nodemailer transporter
    const transporter = createSMTPTransporter(credentials.email, credentials.password);
    const senderEmail = credentials.email;

    let sent = 0;
    let failed = 0;

    // Send emails using Nodemailer
    for (const contact of contacts) {
      try {
        await sendSMTPEmail(
          transporter,
          senderEmail,
          contact.email,
          campaign.template.subject,
          campaign.template.htmlBody,
          campaign.template.textBody || undefined
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
