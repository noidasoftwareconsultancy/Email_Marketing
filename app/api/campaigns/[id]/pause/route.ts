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

    if (campaign.status !== 'SENDING' && campaign.status !== 'SCHEDULED') {
      return NextResponse.json({ 
        error: 'Only sending or scheduled campaigns can be paused' 
      }, { status: 400 });
    }

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: { status: 'PAUSED' },
    });

    return NextResponse.json(updatedCampaign);
  } catch (error: any) {
    console.error('Pause campaign error:', error);
    return NextResponse.json({ 
      error: 'Failed to pause campaign',
      details: error.message 
    }, { status: 500 });
  }
}
