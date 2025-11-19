import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const originalCampaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!originalCampaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Create duplicate campaign
    const duplicatedCampaign = await prisma.campaign.create({
      data: {
        name: `${originalCampaign.name} (Copy)`,
        description: originalCampaign.description,
        templateId: originalCampaign.templateId,
        targetTags: originalCampaign.targetTags,
        userId: originalCampaign.userId,
        status: 'DRAFT',
        totalRecipients: originalCampaign.totalRecipients,
      },
      include: {
        template: true,
      },
    });

    return NextResponse.json(duplicatedCampaign);
  } catch (error: any) {
    console.error('Duplicate campaign error:', error);
    return NextResponse.json({ 
      error: 'Failed to duplicate campaign',
      details: error.message 
    }, { status: 500 });
  }
}
