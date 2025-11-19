import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';

    const result = await prisma.contact.deleteMany({
      where: { userId },
    });

    return NextResponse.json({ 
      success: true, 
      deletedCount: result.count 
    });
  } catch (error: any) {
    console.error('Delete contacts error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete contacts',
      details: error.message 
    }, { status: 500 });
  }
}
