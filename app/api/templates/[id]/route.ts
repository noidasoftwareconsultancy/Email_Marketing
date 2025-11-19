import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await prisma.template.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error: any) {
    console.error('Get template error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch template',
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

    const template = await prisma.template.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        subject: body.subject,
        previewText: body.previewText,
        htmlBody: body.htmlBody,
        textBody: body.textBody,
        category: body.category,
      },
    });

    return NextResponse.json(template);
  } catch (error: any) {
    console.error('Update template error:', error);
    return NextResponse.json({ 
      error: 'Failed to update template',
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
    await prisma.template.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete template error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete template',
      details: error.message 
    }, { status: 500 });
  }
}
