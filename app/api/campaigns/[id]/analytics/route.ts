import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get campaign with email logs
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        template: {
          select: {
            name: true,
            subject: true,
          },
        },
        emailLogs: {
          select: {
            status: true,
            sentAt: true,
            openedAt: true,
            clickedAt: true,
            bouncedAt: true,
            error: true,
            contact: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Calculate detailed analytics
    const totalRecipients = campaign.emailLogs.length;
    const sent = campaign.emailLogs.filter((log) =>
      ['SENT', 'OPENED', 'CLICKED'].includes(log.status)
    ).length;
    const opened = campaign.emailLogs.filter((log) =>
      ['OPENED', 'CLICKED'].includes(log.status)
    ).length;
    const clicked = campaign.emailLogs.filter((log) => log.status === 'CLICKED').length;
    const bounced = campaign.emailLogs.filter((log) => log.status === 'BOUNCED').length;
    const failed = campaign.emailLogs.filter((log) => log.status === 'FAILED').length;
    const pending = campaign.emailLogs.filter((log) => log.status === 'PENDING').length;

    // Calculate rates
    const openRate = sent > 0 ? (opened / sent) * 100 : 0;
    const clickRate = sent > 0 ? (clicked / sent) * 100 : 0;
    const bounceRate = totalRecipients > 0 ? (bounced / totalRecipients) * 100 : 0;
    const deliveryRate = totalRecipients > 0 ? (sent / totalRecipients) * 100 : 0;
    const clickToOpenRate = opened > 0 ? (clicked / opened) * 100 : 0;

    // Group by status for chart data
    const statusBreakdown = {
      sent,
      opened,
      clicked,
      bounced,
      failed,
      pending,
    };

    // Timeline data (opens and clicks over time)
    const timeline = campaign.emailLogs
      .filter((log) => log.openedAt || log.clickedAt)
      .map((log) => ({
        timestamp: log.openedAt || log.clickedAt,
        type: log.clickedAt ? 'click' : 'open',
        contact: log.contact.name || log.contact.email,
      }))
      .sort((a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime());

    // Recent activity
    const recentActivity = campaign.emailLogs
      .filter((log) => log.sentAt || log.openedAt || log.clickedAt || log.bouncedAt)
      .sort((a, b) => {
        const aTime = a.clickedAt || a.openedAt || a.bouncedAt || a.sentAt;
        const bTime = b.clickedAt || b.openedAt || b.bouncedAt || b.sentAt;
        return new Date(bTime!).getTime() - new Date(aTime!).getTime();
      })
      .slice(0, 20)
      .map((log) => ({
        contact: log.contact.name || log.contact.email,
        status: log.status,
        timestamp: log.clickedAt || log.openedAt || log.bouncedAt || log.sentAt,
      }));

    // Error analysis
    const errors = campaign.emailLogs
      .filter((log) => log.error)
      .reduce((acc, log) => {
        const error = log.error || 'Unknown error';
        acc[error] = (acc[error] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return NextResponse.json({
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        template: campaign.template,
        scheduledAt: campaign.scheduledAt,
        sentAt: campaign.sentAt,
        completedAt: campaign.completedAt,
      },
      metrics: {
        totalRecipients,
        sent,
        opened,
        clicked,
        bounced,
        failed,
        pending,
        openRate,
        clickRate,
        bounceRate,
        deliveryRate,
        clickToOpenRate,
      },
      statusBreakdown,
      timeline,
      recentActivity,
      errors,
    });
  } catch (error: any) {
    console.error('Get campaign analytics error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch campaign analytics',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
