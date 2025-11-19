import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    
    const templates = await prisma.template.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(templates);
  } catch (error: any) {
    console.error('Get templates error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch templates',
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    const body = await request.json();

    const template = await prisma.template.create({
      data: {
        name: body.name,
        description: body.description,
        subject: body.subject,
        previewText: body.previewText,
        htmlBody: body.htmlBody,
        textBody: body.textBody || '',
        category: body.category,
        userId,
      },
    });

    return NextResponse.json(template);
  } catch (error: any) {
    console.error('Create template error:', error);
    return NextResponse.json({ 
      error: 'Failed to create template',
      details: error.message 
    }, { status: 500 });
  }
}
