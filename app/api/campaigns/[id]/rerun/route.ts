import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Only allow rerun for COMPLETED or FAILED campaigns
    if (campaign.status !== 'COMPLETED' && campaign.status !== 'FAILED') {
      return NextResponse.json({ 
        error: 'Only completed or failed campaigns can be rerun' 
      }, { status: 400 });
    }

    // Calculate recipients again (in case contacts changed)
    const targetTags = campaign.targetTags || [];
    const totalRecipients = await prisma.contact.count({
      where: {
        userId: campaign.userId,
        status: 'ACTIVE',
        tags: targetTags.length > 0 ? { hasSome: targetTags } : undefined,
      },
    });

    // Reset campaign for rerun
    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        status: 'DRAFT',
        scheduledAt: null,
        sentAt: null,
        completedAt: null,
        totalRecipients,
        totalSent: 0,
        totalFailed: 0,
        totalOpened: 0,
        totalClicked: 0,
      },
      include: {
        template: true,
      },
    });

    // Note: We keep the old email logs for historical reference
    // They won't interfere with the new campaign run

    return NextResponse.json({
      campaign: updatedCampaign,
      message: 'Campaign reset and ready to rerun',
    });
  } catch (error: any) {
    console.error('Rerun campaign error:', error);
    return NextResponse.json({ 
      error: 'Failed to rerun campaign',
      details: error.message 
    }, { status: 500 });
  }
}
