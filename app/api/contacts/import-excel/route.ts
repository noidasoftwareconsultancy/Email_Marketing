import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';
import { mapDomainToContact } from '@/lib/domain-to-contact-mapper';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return NextResponse.json({ error: 'Excel file is empty' }, { status: 400 });
    }

    let imported = 0;
    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];
    const stats = {
      totalDomains: data.length,
      totalContacts: 0,
      withCompany: 0,
      withPhone: 0,
      byState: {} as Record<string, number>,
    };

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        // Map domain data to contact format
        const contactData = mapDomainToContact(row as any);

        if (!contactData || !contactData.email) {
          skipped++;
          const domainName = (row as any).domain_name || 'unknown';
          errors.push(`Row ${i + 1}: No valid email for domain ${domainName}`);
          continue;
        }

        // Check if contact exists
        const existing = await prisma.contact.findFirst({
          where: {
            email: contactData.email,
            userId,
          },
        });

        if (existing) {
          // Update existing contact - merge data
          await prisma.contact.update({
            where: { id: existing.id },
            data: {
              name: contactData.name || existing.name,
              firstName: contactData.firstName || existing.firstName,
              lastName: contactData.lastName || existing.lastName,
              phone: contactData.phone || existing.phone,
              company: contactData.company || existing.company,
              website: contactData.website || existing.website,
              address: contactData.address || existing.address,
              city: contactData.city || existing.city,
              state: contactData.state || existing.state,
              country: contactData.country || existing.country,
              zipCode: contactData.zipCode || existing.zipCode,
              tags: [...new Set([...existing.tags, ...(contactData.tags || [])])],
              notes: contactData.notes 
                ? (existing.notes ? `${existing.notes}\n\n${contactData.notes}` : contactData.notes)
                : existing.notes,
              source: existing.source || 'excel_import',
            },
          });
          updated++;
        } else {
          // Create new contact
          await prisma.contact.create({
            data: {
              email: contactData.email,
              name: contactData.name,
              firstName: contactData.firstName,
              lastName: contactData.lastName,
              phone: contactData.phone,
              company: contactData.company,
              website: contactData.website,
              address: contactData.address,
              city: contactData.city,
              state: contactData.state,
              country: contactData.country,
              zipCode: contactData.zipCode,
              tags: contactData.tags || [],
              notes: contactData.notes,
              source: 'excel_import',
              userId,
            },
          });
          imported++;
        }

        // Update stats
        stats.totalContacts++;
        if (contactData.company) stats.withCompany++;
        if (contactData.phone) stats.withPhone++;
        if (contactData.state) {
          stats.byState[contactData.state] = (stats.byState[contactData.state] || 0) + 1;
        }
      } catch (error: any) {
        skipped++;
        const domainName = (row as any).domain_name || 'unknown';
        errors.push(`Row ${i + 1} (${domainName}): ${error.message}`);
      }
    }

    return NextResponse.json({
      message: `Successfully imported ${imported} contacts, updated ${updated}, skipped ${skipped}`,
      results: {
        imported,
        updated,
        skipped,
        stats,
        errors: errors.slice(0, 20), // Limit errors to first 20
      },
    });
  } catch (error: any) {
    console.error('Excel import error:', error);
    return NextResponse.json(
      {
        error: 'Failed to import Excel file',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
