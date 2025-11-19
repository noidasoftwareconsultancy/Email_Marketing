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
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (campaign.status !== 'PAUSED') {
      return NextResponse.json({ 
        error: 'Only paused campaigns can be resumed' 
      }, { status: 400 });
    }

    // Determine new status based on scheduledAt
    let newStatus: 'SENDING' | 'SCHEDULED' = 'SENDING';
    if (campaign.scheduledAt && new Date(campaign.scheduledAt) > new Date()) {
      newStatus = 'SCHEDULED';
    }

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: { status: newStatus },
    });

    return NextResponse.json(updatedCampaign);
  } catch (error: any) {
    console.error('Resume campaign error:', error);
    return NextResponse.json({ 
      error: 'Failed to resume campaign',
      details: error.message 
    }, { status: 500 });
  }
}
