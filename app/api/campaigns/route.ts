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

    // Parse targetTags if it's a string
    let parsedTags = body.targetTags || [];
    if (typeof parsedTags === 'string') {
      parsedTags = parsedTags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    // Calculate total recipients based on target tags
    const targetTags = parsedTags;
    const totalRecipients = await prisma.contact.count({
      where: {
        userId,
        status: 'ACTIVE',
        tags: targetTags.length > 0 ? { hasSome: targetTags } : undefined,
      },
    });

    // Determine status based on scheduledAt
    let status: 'DRAFT' | 'SCHEDULED' = 'DRAFT';
    if (body.scheduledAt) {
      const scheduledDate = new Date(body.scheduledAt);
      if (scheduledDate > new Date()) {
        status = 'SCHEDULED';
      }
    }

    const campaign = await prisma.campaign.create({
      data: {
        name: body.name,
        description: body.description,
        templateId: body.templateId,
        targetTags: parsedTags,
        userId,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        totalRecipients,
        status,
      },
      include: {
        template: true,
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
