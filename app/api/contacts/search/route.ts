import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    const searchParams = request.nextUrl.searchParams;

    // Get query parameters
    const query = searchParams.get('q') || '';
    const status = searchParams.get('status');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const listId = searchParams.get('listId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where: any = { userId };

    // Text search across multiple fields
    if (query) {
      where.OR = [
        { email: { contains: query, mode: 'insensitive' } },
        { name: { contains: query, mode: 'insensitive' } },
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { company: { contains: query, mode: 'insensitive' } },
        { jobTitle: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by tags (contacts must have ALL specified tags)
    if (tags.length > 0) {
      where.tags = { hasEvery: tags };
    }

    // Filter by list
    if (listId) {
      where.listId = listId === 'null' ? null : listId;
    }

    // Get total count
    const total = await prisma.contact.count({ where });

    // Get paginated results
    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        list: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error: any) {
    console.error('Search contacts error:', error);
    return NextResponse.json(
      {
        error: 'Failed to search contacts',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
