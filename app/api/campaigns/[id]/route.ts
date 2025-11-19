import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        template: true,
        _count: {
          select: { emailLogs: true },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error: any) {
    console.error('Get campaign error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch campaign',
      details: error.message 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Parse targetTags if it's a string
    let parsedTags = body.targetTags || [];
    if (typeof parsedTags === 'string') {
      parsedTags = parsedTags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        templateId: body.templateId,
        targetTags: parsedTags,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        status: body.status,
      },
    });

    return NextResponse.json(campaign);
  } catch (error: any) {
    console.error('Update campaign error:', error);
    return NextResponse.json({ 
      error: 'Failed to update campaign',
      details: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.campaign.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete campaign error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete campaign',
      details: error.message 
    }, { status: 500 });
  }
}
