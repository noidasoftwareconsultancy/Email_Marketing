import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignIds } = body;

    if (!Array.isArray(campaignIds) || campaignIds.length === 0) {
      return NextResponse.json({ 
        error: 'Invalid campaign IDs' 
      }, { status: 400 });
    }

    // Delete campaigns
    const result = await prisma.campaign.deleteMany({
      where: {
        id: { in: campaignIds },
      },
    });

    return NextResponse.json({ 
      success: true, 
      deletedCount: result.count 
    });
  } catch (error: any) {
    console.error('Bulk delete campaigns error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete campaigns',
      details: error.message 
    }, { status: 500 });
  }
}
