import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json(contact);
  } catch (error: any) {
    console.error('Get contact error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch contact',
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
    
    // Parse tags if it's a string
    let parsedTags = body.tags || [];
    if (typeof parsedTags === 'string') {
      parsedTags = parsedTags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    const contact = await prisma.contact.update({
      where: { id },
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
        source: body.source,
        notes: body.notes,
        customData: body.customData,
        status: body.status,
        listId: body.listId,
        // New fields
        linkedInUrl: body.linkedInUrl,
        twitterHandle: body.twitterHandle,
        facebookUrl: body.facebookUrl,
        birthday: body.birthday ? new Date(body.birthday) : undefined,
        gender: body.gender,
        language: body.language,
        timezone: body.timezone,
        score: body.score,
        rating: body.rating,
        emailVerified: body.emailVerified,
        phoneVerified: body.phoneVerified,
        doNotEmail: body.doNotEmail,
        doNotCall: body.doNotCall,
      },
    });

    return NextResponse.json(contact);
  } catch (error: any) {
    console.error('Update contact error:', error);
    return NextResponse.json({ 
      error: 'Failed to update contact',
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
    await prisma.contact.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}
