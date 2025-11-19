import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const where: any = { userId };

    // Search in name, description, subject
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { subject: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Filter by category
    if (category && category !== 'all') {
      where.category = category;
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      include: {
        _count: {
          select: { campaigns: true },
        },
      },
    });

    return NextResponse.json(templates);
  } catch (error: any) {
    console.error('Search templates error:', error);
    return NextResponse.json({ 
      error: 'Failed to search templates',
      details: error.message 
    }, { status: 500 });
  }
}
