import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { contacts } = await request.json();

    if (!Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        { error: 'Invalid contacts data' },
        { status: 400 }
      );
    }

    // Get user ID (in production, get from session)
    const userId = 'demo-user-id';

    const results = {
      imported: 0,
      updated: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const contact of contacts) {
      try {
        if (!contact.email || !contact.email.includes('@')) {
          results.skipped++;
          results.errors.push(`Invalid email: ${contact.email || 'missing'}`);
          continue;
        }

        // Parse tags if they're a string
        let tags: string[] = [];
        if (typeof contact.tags === 'string') {
          tags = contact.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
        } else if (Array.isArray(contact.tags)) {
          tags = contact.tags;
        }

        // Check if contact exists
        const existing = await prisma.contact.findUnique({
          where: {
            email_userId: {
              email: contact.email.toLowerCase().trim(),
              userId,
            },
          },
        });

        if (existing) {
          // Update existing contact
          await prisma.contact.update({
            where: { id: existing.id },
            data: {
              name: contact.name || existing.name,
              firstName: contact.firstName || existing.firstName,
              lastName: contact.lastName || existing.lastName,
              phone: contact.phone || existing.phone,
              company: contact.company || existing.company,
              jobTitle: contact.jobTitle || existing.jobTitle,
              website: contact.website || existing.website,
              address: contact.address || existing.address,
              city: contact.city || existing.city,
              state: contact.state || existing.state,
              country: contact.country || existing.country,
              zipCode: contact.zipCode || existing.zipCode,
              tags: tags.length > 0 ? tags : existing.tags,
              source: contact.source || existing.source,
              notes: contact.notes || existing.notes,
            },
          });
          results.updated++;
        } else {
          // Create new contact
          await prisma.contact.create({
            data: {
              email: contact.email.toLowerCase().trim(),
              name: contact.name,
              firstName: contact.firstName,
              lastName: contact.lastName,
              phone: contact.phone,
              company: contact.company,
              jobTitle: contact.jobTitle,
              website: contact.website,
              address: contact.address,
              city: contact.city,
              state: contact.state,
              country: contact.country,
              zipCode: contact.zipCode,
              tags,
              source: contact.source || 'csv_import',
              notes: contact.notes,
              userId,
            },
          });
          results.imported++;
        }
      } catch (error: any) {
        results.skipped++;
        results.errors.push(`Error processing ${contact.email}: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Imported ${results.imported} new contacts, updated ${results.updated} existing contacts, skipped ${results.skipped}`,
    });
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to import contacts', details: error.message },
      { status: 500 }
    );
  }
}
