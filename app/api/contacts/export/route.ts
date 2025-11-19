import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get user ID (in production, get from session)
    const userId = 'demo-user-id';

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tags = searchParams.get('tags');

    // Build filter
    const where: any = { userId };
    
    if (status && status !== 'all') {
      where.status = status;
    }

    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      where.tags = {
        hasSome: tagArray,
      };
    }

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Convert to CSV
    const headers = [
      'email',
      'name',
      'firstName',
      'lastName',
      'phone',
      'company',
      'jobTitle',
      'website',
      'address',
      'city',
      'state',
      'country',
      'zipCode',
      'tags',
      'source',
      'status',
      'createdAt',
    ];

    const csvRows = [headers.join(',')];

    for (const contact of contacts) {
      const row = [
        contact.email,
        contact.name || '',
        contact.firstName || '',
        contact.lastName || '',
        contact.phone || '',
        contact.company || '',
        contact.jobTitle || '',
        contact.website || '',
        contact.address || '',
        contact.city || '',
        contact.state || '',
        contact.country || '',
        contact.zipCode || '',
        contact.tags.join(';'),
        contact.source || '',
        contact.status,
        contact.createdAt.toISOString(),
      ];
      csvRows.push(row.map(field => `"${field}"`).join(','));
    }

    const csv = csvRows.join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="contacts-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export contacts', details: error.message },
      { status: 500 }
    );
  }
}
