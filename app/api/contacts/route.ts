import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    
    const contacts = await prisma.contact.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    const body = await request.json();
    
    // Parse tags if it's a string
    let parsedTags = body.tags || [];
    if (typeof parsedTags === 'string') {
      parsedTags = parsedTags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    const contact = await prisma.contact.create({
      data: {
        email: body.email,
        name: body.name,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        company: body.company,
        jobTitle: body.jobTitle,
        website: body.website,
        address: body.address,
        city: body.city,
        state: body.state,
        country: body.country,
        zipCode: body.zipCode,
        tags: parsedTags,
        source: body.source || 'manual',
        notes: body.notes,
        customData: body.customData || {},
        userId,
      },
    });

    return NextResponse.json(contact);
  } catch (error: any) {
    console.error('Create contact error:', error);
    return NextResponse.json({ 
      error: 'Failed to create contact',
      details: error.message 
    }, { status: 500 });
  }
}
