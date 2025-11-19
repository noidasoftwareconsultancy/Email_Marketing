import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        emailQuota: true,
        emailsSentToday: true,
        lastResetDate: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if we need to reset the daily quota
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastReset = new Date(user.lastResetDate);
    lastReset.setHours(0, 0, 0, 0);

    let emailsSentToday = user.emailsSentToday;

    // Reset if it's a new day
    if (today.getTime() > lastReset.getTime()) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          emailsSentToday: 0,
          lastResetDate: new Date(),
        },
      });
      emailsSentToday = 0;
    }

    const remainingQuota = user.emailQuota - emailsSentToday;
    const quotaPercentage = (emailsSentToday / user.emailQuota) * 100;

    return NextResponse.json({
      emailQuota: user.emailQuota,
      emailsSentToday,
      remainingQuota,
      quotaPercentage,
      lastResetDate: user.lastResetDate,
    });
  } catch (error) {
    console.error('Failed to fetch quota:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quota' },
      { status: 500 }
    );
  }
}
