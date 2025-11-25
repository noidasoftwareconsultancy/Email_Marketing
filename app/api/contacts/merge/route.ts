import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Merge two contacts
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    const body = await request.json();
    const { primaryContactId, secondaryContactId, mergeStrategy = 'primary' } = body;

    if (!primaryContactId || !secondaryContactId) {
      return NextResponse.json(
        { error: 'Both primaryContactId and secondaryContactId are required' },
        { status: 400 }
      );
    }

    // Fetch both contacts
    const [primaryContact, secondaryContact] = await Promise.all([
      prisma.contact.findUnique({ where: { id: primaryContactId } }),
      prisma.contact.findUnique({ where: { id: secondaryContactId } }),
    ]);

    if (!primaryContact || !secondaryContact) {
      return NextResponse.json({ error: 'One or both contacts not found' }, { status: 404 });
    }

    // Merge logic based on strategy
    const mergedData: any = { ...primaryContact };

    if (mergeStrategy === 'secondary') {
      // Prefer secondary contact data
      Object.keys(secondaryContact).forEach((key) => {
        if (secondaryContact[key as keyof typeof secondaryContact] && key !== 'id' && key !== 'userId') {
          mergedData[key] = secondaryContact[key as keyof typeof secondaryContact];
        }
      });
    } else if (mergeStrategy === 'newest') {
      // Prefer newest non-null values
      Object.keys(secondaryContact).forEach((key) => {
        const secValue = secondaryContact[key as keyof typeof secondaryContact];
        const priValue = primaryContact[key as keyof typeof primaryContact];
        if (secValue && !priValue && key !== 'id' && key !== 'userId') {
          mergedData[key] = secValue;
        }
      });
    } else {
      // Default: prefer primary, fill gaps with secondary
      Object.keys(secondaryContact).forEach((key) => {
        if (!mergedData[key] && secondaryContact[key as keyof typeof secondaryContact] && key !== 'id' && key !== 'userId') {
          mergedData[key] = secondaryContact[key as keyof typeof secondaryContact];
        }
      });
    }

    // Merge tags
    const mergedTags = Array.from(new Set([...primaryContact.tags, ...secondaryContact.tags]));
    mergedData.tags = mergedTags;

    // Update primary contact with merged data
    const updatedContact = await prisma.contact.update({
      where: { id: primaryContactId },
      data: {
        name: mergedData.name,
        firstName: mergedData.firstName,
        lastName: mergedData.lastName,
        phone: mergedData.phone,
        company: mergedData.company,
        jobTitle: mergedData.jobTitle,
        website: mergedData.website,
        address: mergedData.address,
        city: mergedData.city,
        state: mergedData.state,
        country: mergedData.country,
        zipCode: mergedData.zipCode,
        tags: mergedTags,
        notes: mergedData.notes || primaryContact.notes,
        linkedInUrl: mergedData.linkedInUrl,
        twitterHandle: mergedData.twitterHandle,
        facebookUrl: mergedData.facebookUrl,
        birthday: mergedData.birthday,
        gender: mergedData.gender,
        language: mergedData.language,
        timezone: mergedData.timezone,
        score: Math.max(mergedData.score || 0, primaryContact.score || 0),
        rating: mergedData.rating || primaryContact.rating,
      },
    });

    // Transfer email logs and activities from secondary to primary
    await Promise.all([
      prisma.emailLog.updateMany({
        where: { contactId: secondaryContactId },
        data: { contactId: primaryContactId },
      }),
      prisma.contactActivity.updateMany({
        where: { contactId: secondaryContactId },
        data: { contactId: primaryContactId },
      }),
    ]);

    // Delete secondary contact
    await prisma.contact.delete({
      where: { id: secondaryContactId },
    });

    // Update duplicate status if exists
    await prisma.contactDuplicate.updateMany({
      where: {
        OR: [
          { contactId1: primaryContactId, contactId2: secondaryContactId },
          { contactId1: secondaryContactId, contactId2: primaryContactId },
        ],
      },
      data: {
        status: 'MERGED',
        resolvedBy: userId,
        resolvedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      mergedContact: updatedContact,
      message: 'Contacts merged successfully',
    });
  } catch (error: any) {
    console.error('Merge contacts error:', error);
    return NextResponse.json(
      { error: 'Failed to merge contacts', details: error.message },
      { status: 500 }
    );
  }
}
