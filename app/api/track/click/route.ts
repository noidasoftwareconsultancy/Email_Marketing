
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const campaignId = searchParams.get('cid');
  const contactId = searchParams.get('uid');
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Attempt to decode the URL if it looks encoded
  let finalUrl = targetUrl;
  try {
    // If it doesn't start with http, it might be encoded or relative
    if (!finalUrl.startsWith('http')) {
        finalUrl = decodeURIComponent(finalUrl);
    }
    // Fallback if still invalid
    if (!finalUrl.startsWith('http')) {
        finalUrl = `https://${finalUrl}`;
    }
  } catch (e) {
      console.error("Error decoding URL:", e);
  }

  if (campaignId && contactId) {
    try {
      // 1. Update EmailLog
      const logEntry = await prisma.emailLog.findFirst({
        where: {
          campaignId,
          contactId,
        },
      });

      if (logEntry) {
        // If not already clicked, or if we want to track every click (usually we track unique clicks for rates)
        // Let's assume we update status to CLICKED (which supersedes OPENED)
        
        const isFirstClick = logEntry.status !== 'CLICKED';

        await prisma.emailLog.update({
          where: { id: logEntry.id },
          data: {
            status: 'CLICKED',
            clickedAt: new Date(),
            // If it wasn't opened yet (e.g. preview pane disabled images), mark as opened too
            openedAt: logEntry.openedAt || new Date(),
          },
        });

        if (isFirstClick) {
          // 2. Update Campaign stats
          await prisma.campaign.update({
            where: { id: campaignId },
            data: {
              totalClicked: { increment: 1 },
              // Ensure opened count is accurate if pixel was blocked
              totalOpened: logEntry.openedAt ? undefined : { increment: 1 },
            },
          });

          // 3. Update Contact stats
          await prisma.contact.update({
            where: { id: contactId },
            data: {
              lastEngagedAt: new Date(),
              score: { increment: 3 }, // Add 3 points for click
            },
          });

          // 3.5 Create Contact Activity
          const campaignForUser = await prisma.campaign.findUnique({
              where: { id: campaignId },
              select: { userId: true, name: true }
          });
          
          if (campaignForUser) {
              await prisma.contactActivity.create({
                data: {
                  contactId,
                  userId: campaignForUser.userId,
                  type: 'EMAIL_CLICKED',
                  title: 'Link Clicked',
                  description: `Clicked link in campaign: ${campaignForUser.name}`,
                  metadata: { campaignId, url: finalUrl },
                },
              });
          }
          
           // 4. Update Template stats
           const campaign = await prisma.campaign.findUnique({
             where: { id: campaignId },
             select: { templateId: true }
           });
           
           if (campaign?.templateId) {
             await prisma.template.update({
               where: { id: campaign.templateId },
               data: {
                 totalClicked: { increment: 1 },
                 totalOpened: logEntry.openedAt ? undefined : { increment: 1 }
               }
             });
           }
        }
      }
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }

  return NextResponse.redirect(finalUrl);
}
