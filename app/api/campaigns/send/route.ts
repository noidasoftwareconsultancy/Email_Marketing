import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSMTPTransporter, sendSMTPEmail } from '@/lib/smtp-mailer';
import { createGmailTransporter } from '@/lib/gmail';
import { prepareEmailContent, injectTrackingPixel, wrapLinks, replaceVariables } from '@/lib/email-variables';

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

    // Get contacts based on campaign's target tags that HAVEN'T been sent to yet
    const targetTags = campaign.targetTags || [];

    // Check User Quota
    const user = await prisma.user.findUnique({
      where: { id: campaign.userId },
      select: { emailQuota: true, emailsSentToday: true, lastResetDate: true }
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Reset daily quota if new day
    const now = new Date();
    const lastReset = user.lastResetDate ? new Date(user.lastResetDate) : new Date(0);
    let sentToday = user.emailsSentToday;

    if (lastReset.getDate() !== now.getDate() || lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
        sentToday = 0;
        await prisma.user.update({
            where: { id: campaign.userId },
            data: { 
              emailsSentToday: 0,
              lastResetDate: now
            }
        });
    }

    if (sentToday >= user.emailQuota) {
         await prisma.campaign.update({
            where: { id: campaignId },
            data: { status: 'PAUSED' } // Pause campaign if quota reached
        });
        return NextResponse.json({ 
            error: 'Daily email quota reached', 
            quota: user.emailQuota, 
            sent: sentToday,
            status: 'PAUSED'
        }, { status: 403 });
    }
    
    // First count total recipients for the campaign (regardless of sent status)
    const totalRecipients = await prisma.contact.count({
      where: {
        userId: campaign.userId,
        status: 'ACTIVE',
        tags: targetTags.length > 0 ? { hasSome: targetTags } : undefined,
      },
    });

    // Calculate remaining quota
    const remainingQuota = user.emailQuota - sentToday;
    const batchSize = Math.min(50, remainingQuota); // Don't fetch more than we can send

    if (batchSize <= 0) {
         await prisma.campaign.update({
            where: { id: campaignId },
            data: { status: 'PAUSED' }
        });
        return NextResponse.json({ 
            error: 'Daily email quota reached', 
            status: 'PAUSED'
        }, { status: 403 });
    }

    // Fetch contacts that don't have an email log for this campaign
    const contacts = await prisma.contact.findMany({
      where: {
        userId: campaign.userId,
        status: 'ACTIVE',
        tags: targetTags.length > 0 ? { hasSome: targetTags } : undefined,
        emailLogs: {
          none: {
            campaignId: campaignId
          }
        }
      },
      // Limit to prevent timeouts - frontend should poll or user can resume
      take: batchSize 
    });

    if (totalRecipients === 0) {
      return NextResponse.json({ error: 'No contacts found matching the criteria' }, { status: 400 });
    }

    // Update campaign status and total recipients
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { 
        status: 'SENDING',
        totalRecipients: totalRecipients,
      },
    });

    // Configure Transporter
    let transporter;
    let senderEmail;

    const envEmail = process.env.SMTP_EMAIL;
    const envPassword = process.env.SMTP_PASSWORD;
    const dbTokens = campaign.user.googleTokens as any;
    const ctaUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    try {
        if (envEmail && envPassword) {
            // 1. System SMTP (Env Vars)
            transporter = createSMTPTransporter(envEmail, envPassword);
            senderEmail = envEmail;
        } else if (dbTokens?.type === 'smtp') {
            // 2. User SMTP
            if (!dbTokens.email || !dbTokens.password) throw new Error('Incomplete SMTP credentials');
            transporter = createSMTPTransporter(dbTokens.email, dbTokens.password);
            senderEmail = dbTokens.email;
        } else if (dbTokens?.access_token) {
            // 3. User Google OAuth
            transporter = await createGmailTransporter(dbTokens.access_token, dbTokens.refresh_token);
            senderEmail = campaign.user.email;
        } else {
            throw new Error('No email configuration found. Please connect Gmail or configure SMTP.');
        }
    } catch (error: any) {
        console.error('Transporter creation failed:', error);
        return NextResponse.json({ 
            error: 'Email configuration error',
            details: error.message
        }, { status: 400 });
    }

    let sent = 0;
    let failed = 0;

    // Send emails using Nodemailer with variable replacement
    for (const contact of contacts) {
      // New pause check
      const currentCampaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
      if (currentCampaign?.status === 'PAUSED') {
        break;
      }

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

        // Create Contact Activity
        await prisma.contactActivity.create({
          data: {
            contactId: contact.id,
            userId: campaign.userId,
            type: 'EMAIL_SENT',
            title: 'Email Sent',
            description: `Sent campaign: ${campaign.name}`,
            metadata: { campaignId },
          },
        });
        
        // Update Contact last contacted
        await prisma.contact.update({
            where: { id: contact.id },
            data: { lastContactedAt: new Date() }
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

    // Update User Quota with actually sent emails
    if (sent > 0) {
        await prisma.user.update({
            where: { id: campaign.userId },
            data: { emailsSentToday: { increment: sent } }
        });
    }

    // Update campaign stats
    const totalSent = await prisma.emailLog.count({ 
        where: { campaignId, status: 'SENT' } 
    });
    const totalFailed = await prisma.emailLog.count({ 
        where: { campaignId, status: 'FAILED' } 
    });
    
    // Check if fully completed
    const remainingContacts = await prisma.contact.count({
      where: {
        userId: campaign.userId,
        status: 'ACTIVE',
        tags: targetTags.length > 0 ? { hasSome: targetTags } : undefined,
        emailLogs: { none: { campaignId } }
      }
    });

    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: remainingContacts === 0 ? 'COMPLETED' : 'PAUSED', // Pause if batch finished but more remain
        sentAt: new Date(), // Last sent at
        completedAt: remainingContacts === 0 ? new Date() : null,
        totalSent,
        totalFailed,
      },
    });

    return NextResponse.json({ 
        sent, 
        failed, 
        remaining: remainingContacts,
        status: remainingContacts === 0 ? 'COMPLETED' : 'PAUSED'
    });
  } catch (error: any) {
    console.error('Campaign send error:', error);
    return NextResponse.json({ 
      error: 'Failed to send campaign',
      details: error.message 
    }, { status: 500 });
  }
}
