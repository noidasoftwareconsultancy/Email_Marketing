import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contactList = await prisma.contactList.findUnique({
      where: { id },
      include: {
        contacts: true,
        _count: {
          select: { contacts: true },
        },
      },
    });

    if (!contactList) {
      return NextResponse.json({ error: 'Contact list not found' }, { status: 404 });
    }

    return NextResponse.json(contactList);
  } catch (error: any) {
    console.error('Get contact list error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch contact list',
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

    const contactList = await prisma.contactList.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
      },
    });

    return NextResponse.json(contactList);
  } catch (error: any) {
    console.error('Update contact list error:', error);
    return NextResponse.json({ 
      error: 'Failed to update contact list',
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
    await prisma.contactList.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete contact list error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete contact list',
      details: error.message 
    }, { status: 500 });
  }
}
