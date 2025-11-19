import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';

    // Calculate date 30 days ago for recent metrics
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Parallel queries for better performance
    const [
      totalContacts,
      activeContacts,
      totalCampaigns,
      activeCampaigns,
      emailsSent,
      totalTemplates,
      totalContactLists,
      totalSent,
      totalOpened,
      totalClicked,
      totalBounced,
      totalAttempted,
      recentContactsCount,
      recentCampaignsCount,
    ] = await Promise.all([
      // Get total contacts
      prisma.contact.count({
        where: { userId },
      }),
      // Get active contacts
      prisma.contact.count({
        where: { userId, status: 'ACTIVE' },
      }),
      // Get total campaigns
      prisma.campaign.count({
        where: { userId },
      }),
      // Get active campaigns (not completed or failed)
      prisma.campaign.count({
        where: { 
          userId,
          status: { in: ['DRAFT', 'SCHEDULED', 'SENDING', 'PAUSED'] },
        },
      }),
      // Get total emails sent
      prisma.emailLog.count({
        where: {
          campaign: { userId },
          status: { in: ['SENT', 'OPENED', 'CLICKED'] },
        },
      }),
      // Get total templates
      prisma.template.count({
        where: { userId },
      }),
      // Get total contact lists
      prisma.contactList.count({
        where: { userId },
      }),
      // Calculate open rate - total sent
      prisma.emailLog.count({
        where: {
          campaign: { userId },
          status: { in: ['SENT', 'OPENED', 'CLICKED'] },
        },
      }),
      // Calculate open rate - total opened
      prisma.emailLog.count({
        where: {
          campaign: { userId },
          status: { in: ['OPENED', 'CLICKED'] },
        },
      }),
      // Calculate click rate
      prisma.emailLog.count({
        where: {
          campaign: { userId },
          status: 'CLICKED',
        },
      }),
      // Calculate bounce rate - bounced
      prisma.emailLog.count({
        where: {
          campaign: { userId },
          status: 'BOUNCED',
        },
      }),
      // Calculate bounce rate - attempted
      prisma.emailLog.count({
        where: { campaign: { userId } },
      }),
      // Recent contacts (last 30 days)
      prisma.contact.count({
        where: {
          userId,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      // Recent campaigns (last 30 days)
      prisma.campaign.count({
        where: {
          userId,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
    ]);

    const openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
    const clickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0;
    const bounceRate = totalAttempted > 0 ? (totalBounced / totalAttempted) * 100 : 0;

    return NextResponse.json({
      totalContacts,
      activeContacts,
      totalCampaigns,
      activeCampaigns,
      totalEmailsSent: emailsSent,
      totalTemplates,
      totalContactLists,
      openRate,
      clickRate,
      bounceRate,
      recentContactsCount,
      recentCampaignsCount,
    });
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
