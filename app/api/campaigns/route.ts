import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    
    const campaigns = await prisma.campaign.findMany({
      where: { userId },
      include: {
        template: true,
        _count: {
          select: { emailLogs: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(campaigns);
  } catch (error: any) {
    console.error('Get campaigns error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch campaigns',
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    const body = await request.json();

    const campaign = await prisma.campaign.create({
      data: {
        name: body.name,
        description: body.description,
        templateId: body.templateId,
        targetTags: body.targetTags || [],
        userId,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      },
    });

    return NextResponse.json(campaign);
  } catch (error: any) {
    console.error('Create campaign error:', error);
    return NextResponse.json({ 
      error: 'Failed to create campaign',
      details: error.message 
    }, { status: 500 });
  }
}
