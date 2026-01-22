
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const campaignId = searchParams.get('cid');
  const contactId = searchParams.get('uid');

  // 1x1 Transparent GIF
  const transparentGif = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
  );

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
        // Only track if not already opened/clicked to avoid inflating unique opens
        // Or if we want to track every open, we can update lastOpenedAt.
        // For stats, we usually care about unique opens.
        
        const isFirstOpen = !logEntry.openedAt;

        await prisma.emailLog.update({
          where: { id: logEntry.id },
          data: {
            status: logEntry.status === 'SENT' ? 'OPENED' : logEntry.status, // Don't overwrite CLICKED
            openedAt: logEntry.openedAt || new Date(), // Keep original openedAt if exists
          },
        });

        if (isFirstOpen) {
          // 2. Update Campaign stats
          await prisma.campaign.update({
            where: { id: campaignId },
            data: {
              totalOpened: { increment: 1 },
            },
          });

          // 3. Update Contact stats
          await prisma.contact.update({
            where: { id: contactId },
            data: {
              lastEngagedAt: new Date(),
              score: { increment: 1 }, // Add 1 point for open
            },
          });

          // 4. Create Contact Activity
          const campaignForUser = await prisma.campaign.findUnique({
              where: { id: campaignId },
              select: { userId: true, name: true }
          });
          
          if (campaignForUser) {
              await prisma.contactActivity.create({
                data: {
                  contactId,
                  userId: campaignForUser.userId,
                  type: 'EMAIL_OPENED',
                  title: 'Email Opened',
                  description: `Opened campaign: ${campaignForUser.name}`,
                  metadata: { campaignId },
                },
              });
          }
        } else {
             // Even if not unique, update lastEngagedAt
             await prisma.contact.update({
                where: { id: contactId },
                data: {
                  lastEngagedAt: new Date(),
                },
            });
        }
      }
    } catch (error) {
      console.error('Error tracking open:', error);
    }
  }

  return new NextResponse(transparentGif, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
