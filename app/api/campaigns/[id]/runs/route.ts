import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const runs = await prisma.campaignRun.findMany({
      where: { campaignId: id },
      orderBy: { runNumber: 'desc' },
      include: {
        _count: {
          select: { emailLogs: true },
        },
      },
    });

    // Calculate metrics for each run
    const runsWithMetrics = await Promise.all(
      runs.map(async (run) => {
        const emailLogs = await prisma.emailLog.findMany({
          where: { runId: run.id },
        });

        const opened = emailLogs.filter((log) =>
          ['OPENED', 'CLICKED'].includes(log.status)
        ).length;
        const clicked = emailLogs.filter((log) => log.status === 'CLICKED').length;
        const bounced = emailLogs.filter((log) => log.status === 'BOUNCED').length;

        const openRate = run.totalSent > 0 ? (opened / run.totalSent) * 100 : 0;
        const clickRate = run.totalSent > 0 ? (clicked / run.totalSent) * 100 : 0;
        const bounceRate = run.totalRecipients > 0 ? (bounced / run.totalRecipients) * 100 : 0;

        return {
          ...run,
          metrics: {
            opened,
            clicked,
            bounced,
            openRate,
            clickRate,
            bounceRate,
          },
        };
      })
    );

    return NextResponse.json(runsWithMetrics);
  } catch (error: any) {
    console.error('Get campaign runs error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch campaign runs',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
