import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get activities for a contact
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    const searchParams = request.nextUrl.searchParams;
    const contactId = searchParams.get('contactId');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = { userId };
    if (contactId) where.contactId = contactId;
    if (type) where.type = type;

    const activities = await prisma.contactActivity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        contact: {
          select: {
            id: true,
            email: true,
            name: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(activities);
  } catch (error: any) {
    console.error('Get activities error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities', details: error.message },
      { status: 500 }
    );
  }
}

// Create a new activity
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    const body = await request.json();

    const activity = await prisma.contactActivity.create({
      data: {
        contactId: body.contactId,
        type: body.type,
        title: body.title,
        description: body.description,
        metadata: body.metadata || {},
        userId,
      },
    });

    // Update lastContactedAt if relevant activity type
    const contactActivityTypes = ['EMAIL_SENT', 'CALL_MADE', 'MEETING_COMPLETED'];
    if (contactActivityTypes.includes(body.type)) {
      await prisma.contact.update({
        where: { id: body.contactId },
        data: { lastContactedAt: new Date() },
      });
    }

    return NextResponse.json(activity);
  } catch (error: any) {
    console.error('Create activity error:', error);
    return NextResponse.json(
      { error: 'Failed to create activity', details: error.message },
      { status: 500 }
    );
  }
}
