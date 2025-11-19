import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    
    const contactLists = await prisma.contactList.findMany({
      where: { userId },
      include: {
        _count: {
          select: { contacts: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(contactLists);
  } catch (error: any) {
    console.error('Get contact lists error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch contact lists',
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    const body = await request.json();

    const contactList = await prisma.contactList.create({
      data: {
        name: body.name,
        description: body.description,
        userId,
      },
    });

    return NextResponse.json(contactList);
  } catch (error: any) {
    console.error('Create contact list error:', error);
    return NextResponse.json({ 
      error: 'Failed to create contact list',
      details: error.message 
    }, { status: 500 });
  }
}
