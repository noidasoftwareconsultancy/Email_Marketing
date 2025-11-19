import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailTemplates } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    const body = await request.json();
    const { templateKey } = body;

    if (!templateKey || !emailTemplates[templateKey as keyof typeof emailTemplates]) {
      return NextResponse.json({ error: 'Invalid template key' }, { status: 400 });
    }

    const libraryTemplate = emailTemplates[templateKey as keyof typeof emailTemplates];

    const template = await prisma.template.create({
      data: {
        name: libraryTemplate.name,
        description: libraryTemplate.description,
        subject: libraryTemplate.subject,
        previewText: libraryTemplate.previewText,
        htmlBody: libraryTemplate.htmlBody,
        category: libraryTemplate.category,
        userId,
      },
    });

    return NextResponse.json(template);
  } catch (error: any) {
    console.error('Import template error:', error);
    return NextResponse.json({ 
      error: 'Failed to import template',
      details: error.message 
    }, { status: 500 });
  }
}
