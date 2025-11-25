import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Find duplicate contacts
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'PENDING';
    const minScore = parseFloat(searchParams.get('minScore') || '70');

    const duplicates = await prisma.contactDuplicate.findMany({
      where: {
        status: status as any,
        similarityScore: { gte: minScore },
      },
      orderBy: { similarityScore: 'desc' },
      take: 100,
    });

    // Fetch contact details
    const contactIds = [
      ...duplicates.map((d) => d.contactId1),
      ...duplicates.map((d) => d.contactId2),
    ];
    const contacts = await prisma.contact.findMany({
      where: {
        id: { in: contactIds },
        userId,
      },
    });

    const contactMap = new Map(contacts.map((c) => [c.id, c]));
    const enrichedDuplicates = duplicates.map((dup) => ({
      ...dup,
      contact1: contactMap.get(dup.contactId1),
      contact2: contactMap.get(dup.contactId2),
    }));

    return NextResponse.json(enrichedDuplicates);
  } catch (error: any) {
    console.error('Get duplicates error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch duplicates', details: error.message },
      { status: 500 }
    );
  }
}

// Detect duplicates
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';

    // Get all contacts for the user
    const contacts = await prisma.contact.findMany({
      where: { userId },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        company: true,
      },
    });

    const duplicates: any[] = [];

    // Compare each contact with others
    for (let i = 0; i < contacts.length; i++) {
      for (let j = i + 1; j < contacts.length; j++) {
        const contact1 = contacts[i];
        const contact2 = contacts[j];

        const similarity = calculateSimilarity(contact1, contact2);

        if (similarity.score >= 70) {
          // Check if duplicate already exists
          const existing = await prisma.contactDuplicate.findFirst({
            where: {
              OR: [
                { contactId1: contact1.id, contactId2: contact2.id },
                { contactId1: contact2.id, contactId2: contact1.id },
              ],
            },
          });

          if (!existing) {
            duplicates.push({
              contactId1: contact1.id,
              contactId2: contact2.id,
              similarityScore: similarity.score,
              matchedFields: similarity.matchedFields,
              status: 'PENDING',
            });
          }
        }
      }
    }

    // Create duplicate records
    if (duplicates.length > 0) {
      await prisma.contactDuplicate.createMany({
        data: duplicates,
        skipDuplicates: true,
      });
    }

    return NextResponse.json({
      message: `Found ${duplicates.length} potential duplicates`,
      count: duplicates.length,
    });
  } catch (error: any) {
    console.error('Detect duplicates error:', error);
    return NextResponse.json(
      { error: 'Failed to detect duplicates', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to calculate similarity
function calculateSimilarity(contact1: any, contact2: any): { score: number; matchedFields: string[] } {
  const matchedFields: string[] = [];
  let score = 0;

  // Email match (exact) - 40 points
  if (contact1.email && contact2.email && contact1.email.toLowerCase() === contact2.email.toLowerCase()) {
    matchedFields.push('email');
    score += 40;
  }

  // Phone match (normalized) - 30 points
  if (contact1.phone && contact2.phone) {
    const phone1 = contact1.phone.replace(/\D/g, '');
    const phone2 = contact2.phone.replace(/\D/g, '');
    if (phone1 === phone2) {
      matchedFields.push('phone');
      score += 30;
    }
  }

  // Name similarity - 20 points
  if (contact1.name && contact2.name) {
    const name1 = contact1.name.toLowerCase().trim();
    const name2 = contact2.name.toLowerCase().trim();
    if (name1 === name2) {
      matchedFields.push('name');
      score += 20;
    } else if (name1.includes(name2) || name2.includes(name1)) {
      matchedFields.push('name');
      score += 10;
    }
  }

  // First + Last name match - 15 points
  if (contact1.firstName && contact2.firstName && contact1.lastName && contact2.lastName) {
    const fn1 = contact1.firstName.toLowerCase().trim();
    const fn2 = contact2.firstName.toLowerCase().trim();
    const ln1 = contact1.lastName.toLowerCase().trim();
    const ln2 = contact2.lastName.toLowerCase().trim();
    
    if (fn1 === fn2 && ln1 === ln2) {
      matchedFields.push('firstName', 'lastName');
      score += 15;
    }
  }

  // Company match - 10 points
  if (contact1.company && contact2.company) {
    const comp1 = contact1.company.toLowerCase().trim();
    const comp2 = contact2.company.toLowerCase().trim();
    if (comp1 === comp2) {
      matchedFields.push('company');
      score += 10;
    }
  }

  return { score, matchedFields };
}
