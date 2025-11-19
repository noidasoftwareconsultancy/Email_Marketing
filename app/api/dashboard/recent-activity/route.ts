import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RecentActivity } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');

    // Fetch recent campaigns
    const recentCampaigns = await prisma.campaign.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        status: true,
        updatedAt: true,
        totalSent: true,
        totalRecipients: true,
      },
    });

    // Fetch recent contacts
    const recentContacts = await prisma.contact.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // Fetch recent templates
    const recentTemplates = await prisma.template.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });

    // Fetch recent contact lists
    const recentContactLists = await prisma.contactList.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: {
          select: { contacts: true },
        },
      },
    });

    // Combine and format activities
    const activities: RecentActivity[] = [];

    // Add campaign activities
    recentCampaigns.forEach((campaign) => {
      let action = '';
      let status: RecentActivity['status'] = 'info';
      
      switch (campaign.status) {
        case 'COMPLETED':
          action = 'completed';
          status = 'success';
          break;
        case 'SENDING':
          action = 'is sending';
          status = 'info';
          break;
        case 'FAILED':
          action = 'failed';
          status = 'error';
          break;
        case 'SCHEDULED':
          action = 'scheduled';
          status = 'info';
          break;
        default:
          action = 'updated';
          status = 'info';
      }

      activities.push({
        id: campaign.id,
        type: 'campaign',
        action,
        description: `Campaign "${campaign.name}" ${action}${campaign.totalSent > 0 ? ` (${campaign.totalSent}/${campaign.totalRecipients} sent)` : ''}`,
        timestamp: campaign.updatedAt,
        status,
      });
    });

    // Add contact activities
    recentContacts.forEach((contact) => {
      activities.push({
        id: contact.id,
        type: 'contact',
        action: 'added',
        description: `New contact added: ${contact.name || contact.email}`,
        timestamp: contact.createdAt,
        status: 'success',
      });
    });

    // Add template activities
    recentTemplates.forEach((template) => {
      activities.push({
        id: template.id,
        type: 'template',
        action: 'created',
        description: `Template "${template.name}" created`,
        timestamp: template.createdAt,
        status: 'info',
      });
    });

    // Add contact list activities
    recentContactLists.forEach((list) => {
      activities.push({
        id: list.id,
        type: 'contact_list',
        action: 'created',
        description: `Contact list "${list.name}" created${list._count ? ` with ${list._count.contacts} contacts` : ''}`,
        timestamp: list.createdAt,
        status: 'info',
      });
    });

    // Sort by timestamp and limit
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    return NextResponse.json(sortedActivities);
  } catch (error) {
    console.error('Failed to fetch recent activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent activity' },
      { status: 500 }
    );
  }
}
