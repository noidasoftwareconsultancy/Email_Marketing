import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';

    const lists = await prisma.contactList.findMany({
      where: { userId },
      include: {
        _count: {
          select: { contacts: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(lists);
  } catch (error: any) {
    console.error('Get lists error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact lists', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    const body = await request.json();

    const list = await prisma.contactList.create({
      data: {
        name: body.name,
        description: body.description,
        userId,
      },
    });

    return NextResponse.json(list);
  } catch (error: any) {
    console.error('Create list error:', error);
    return NextResponse.json(
      { error: 'Failed to create contact list', details: error.message },
      { status: 500 }
    );
  }
}
