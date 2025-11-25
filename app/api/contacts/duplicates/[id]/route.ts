import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Update duplicate status (merge, ignore, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    const body = await request.json();

    const duplicate = await prisma.contactDuplicate.update({
      where: { id },
      data: {
        status: body.status,
        resolvedBy: userId,
        resolvedAt: new Date(),
      },
    });

    return NextResponse.json(duplicate);
  } catch (error: any) {
    console.error('Update duplicate error:', error);
    return NextResponse.json(
      { error: 'Failed to update duplicate', details: error.message },
      { status: 500 }
    );
  }
}

// Delete duplicate record
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.contactDuplicate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete duplicate error:', error);
    return NextResponse.json(
      { error: 'Failed to delete duplicate', details: error.message },
      { status: 500 }
    );
  }
}
