import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get template with campaign statistics
    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        campaigns: {
          select: {
            id: true,
            name: true,
            totalSent: true,
            totalOpened: true,
            totalClicked: true,
            sentAt: true,
          },
          orderBy: {
            sentAt: 'desc',
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Calculate aggregate statistics
    const totalCampaigns = template.campaigns.length;
    const totalSent = template.campaigns.reduce((sum, c) => sum + c.totalSent, 0);
    const totalOpened = template.campaigns.reduce((sum, c) => sum + c.totalOpened, 0);
    const totalClicked = template.campaigns.reduce((sum, c) => sum + c.totalClicked, 0);

    const openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
    const clickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0;
    const clickToOpenRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;

    // Campaign performance over time
    const campaignPerformance = template.campaigns.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      sentAt: campaign.sentAt,
      sent: campaign.totalSent,
      opened: campaign.totalOpened,
      clicked: campaign.totalClicked,
      openRate: campaign.totalSent > 0 ? (campaign.totalOpened / campaign.totalSent) * 100 : 0,
      clickRate: campaign.totalSent > 0 ? (campaign.totalClicked / campaign.totalSent) * 100 : 0,
    }));

    return NextResponse.json({
      template: {
        id: template.id,
        name: template.name,
        category: template.category,
      },
      summary: {
        totalCampaigns,
        totalSent,
        totalOpened,
        totalClicked,
        openRate: Math.round(openRate * 100) / 100,
        clickRate: Math.round(clickRate * 100) / 100,
        clickToOpenRate: Math.round(clickToOpenRate * 100) / 100,
      },
      campaigns: campaignPerformance,
      benchmarks: {
        industryAvgOpenRate: 21.5, // Industry average
        industryAvgClickRate: 2.6,
        yourPerformance: {
          openRate: openRate > 21.5 ? 'above' : openRate > 18 ? 'average' : 'below',
          clickRate: clickRate > 2.6 ? 'above' : clickRate > 2 ? 'average' : 'below',
        },
      },
    });
  } catch (error: any) {
    console.error('Get template analytics error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch template analytics',
      details: error.message 
    }, { status: 500 });
  }
}

// Update template performance metrics
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Recalculate performance metrics from campaigns
    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        campaigns: {
          select: {
            totalSent: true,
            totalOpened: true,
            totalClicked: true,
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    const totalSent = template.campaigns.reduce((sum, c) => sum + c.totalSent, 0);
    const totalOpened = template.campaigns.reduce((sum, c) => sum + c.totalOpened, 0);
    const totalClicked = template.campaigns.reduce((sum, c) => sum + c.totalClicked, 0);

    const avgOpenRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
    const avgClickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0;

    // Calculate performance score (0-100)
    let performanceScore = 0;
    if (totalSent > 0) {
      // Open rate score (max 50 points)
      performanceScore += Math.min((avgOpenRate / 30) * 50, 50);
      // Click rate score (max 30 points)
      performanceScore += Math.min((avgClickRate / 5) * 30, 30);
      // Usage score (max 20 points)
      performanceScore += Math.min((template.campaigns.length / 10) * 20, 20);
    }

    const updatedTemplate = await prisma.template.update({
      where: { id },
      data: {
        totalSent,
        totalOpened,
        totalClicked,
        avgOpenRate,
        avgClickRate,
        performanceScore: Math.round(performanceScore),
        lastUsedAt: new Date(),
      },
    });

    return NextResponse.json(updatedTemplate);
  } catch (error: any) {
    console.error('Update template analytics error:', error);
    return NextResponse.json({ 
      error: 'Failed to update template analytics',
      details: error.message 
    }, { status: 500 });
  }
}
