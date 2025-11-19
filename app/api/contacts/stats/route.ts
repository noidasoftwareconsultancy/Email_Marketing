import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';

    // Get total counts by status
    const [total, active, unsubscribed, bounced, complained] = await Promise.all([
      prisma.contact.count({ where: { userId } }),
      prisma.contact.count({ where: { userId, status: 'ACTIVE' } }),
      prisma.contact.count({ where: { userId, status: 'UNSUBSCRIBED' } }),
      prisma.contact.count({ where: { userId, status: 'BOUNCED' } }),
      prisma.contact.count({ where: { userId, status: 'COMPLAINED' } }),
    ]);

    // Get contacts added in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentContacts = await prisma.contact.count({
      where: {
        userId,
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    // Get top tags
    const contacts = await prisma.contact.findMany({
      where: { userId },
      select: { tags: true },
    });
    const tagCounts: Record<string, number> = {};
    contacts.forEach((contact) => {
      contact.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    // Get top sources
    const sourceCounts = await prisma.contact.groupBy({
      by: ['source'],
      where: { userId },
      _count: true,
    });
    const topSources = sourceCounts
      .map((item) => ({
        source: item.source || 'unknown',
        count: item._count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get contacts by state/country
    const locationCounts = await prisma.contact.groupBy({
      by: ['state', 'country'],
      where: { userId },
      _count: true,
    });
    const topLocations = locationCounts
      .filter((item) => item.state || item.country)
      .map((item) => ({
        location: item.state ? `${item.state}, ${item.country || ''}` : item.country || 'Unknown',
        count: item._count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get engagement stats (contacts with email logs)
    const contactsWithEngagement = await prisma.contact.findMany({
      where: { userId },
      include: {
        emailLogs: {
          select: {
            status: true,
            openedAt: true,
            clickedAt: true,
          },
        },
      },
    });

    let totalEngaged = 0;
    let totalOpened = 0;
    let totalClicked = 0;
    contactsWithEngagement.forEach((contact) => {
      if (contact.emailLogs.length > 0) {
        totalEngaged++;
        if (contact.emailLogs.some((log) => log.openedAt)) totalOpened++;
        if (contact.emailLogs.some((log) => log.clickedAt)) totalClicked++;
      }
    });

    // Calculate growth rate
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const lastWeekContacts = await prisma.contact.count({
      where: {
        userId,
        createdAt: { gte: sevenDaysAgo },
      },
    });

    return NextResponse.json({
      overview: {
        total,
        active,
        unsubscribed,
        bounced,
        complained,
        recentContacts,
        lastWeekGrowth: lastWeekContacts,
      },
      engagement: {
        totalEngaged,
        totalOpened,
        totalClicked,
        engagementRate: total > 0 ? ((totalEngaged / total) * 100).toFixed(2) : '0',
        openRate: totalEngaged > 0 ? ((totalOpened / totalEngaged) * 100).toFixed(2) : '0',
        clickRate: totalEngaged > 0 ? ((totalClicked / totalEngaged) * 100).toFixed(2) : '0',
      },
      topTags,
      topSources,
      topLocations,
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch contact statistics',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
