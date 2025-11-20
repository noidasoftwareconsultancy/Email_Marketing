import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        googleTokens: Prisma.JsonNull,
      },
      create: {
        id: userId,
        email: 'user@example.com',
        googleTokens: Prisma.JsonNull,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Disconnect Gmail error:', error);
    return NextResponse.json({ 
      error: 'Failed to disconnect Gmail',
      details: error.message 
    }, { status: 500 });
  }
}
