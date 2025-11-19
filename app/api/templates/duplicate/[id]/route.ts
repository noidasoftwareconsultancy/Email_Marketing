import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id') || 'demo-user-id';

    const originalTemplate = await prisma.template.findUnique({
      where: { id },
    });

    if (!originalTemplate) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Create duplicate with "Copy" suffix
    const duplicate = await prisma.template.create({
      data: {
        name: `${originalTemplate.name} (Copy)`,
        description: originalTemplate.description,
        subject: originalTemplate.subject,
        previewText: originalTemplate.previewText,
        htmlBody: originalTemplate.htmlBody,
        textBody: originalTemplate.textBody,
        category: originalTemplate.category,
        thumbnail: originalTemplate.thumbnail,
        isPublic: false,
        userId,
      },
    });

    return NextResponse.json(duplicate);
  } catch (error: any) {
    console.error('Duplicate template error:', error);
    return NextResponse.json({ 
      error: 'Failed to duplicate template',
      details: error.message 
    }, { status: 500 });
  }
}
