import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const selectedTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];

    // Get all unique tags from contacts
    const contacts = await prisma.contact.findMany({
      where: {
        status: 'ACTIVE',
        doNotEmail: false,
      },
      select: {
        tags: true,
      },
    });

    // Flatten and count tags
    const tagCounts = new Map<string, number>();
    contacts.forEach((contact) => {
      contact.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    // Convert to array and sort by count
    const allTags = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    // If specific tags are selected, get the count of contacts with those tags
    let contactCount = 0;
    if (selectedTags.length > 0) {
      contactCount = await prisma.contact.count({
        where: {
          status: 'ACTIVE',
          doNotEmail: false,
          tags: {
            hasSome: selectedTags,
          },
        },
      });
    } else {
      // If no tags selected, count all active contacts
      contactCount = await prisma.contact.count({
        where: {
          status: 'ACTIVE',
          doNotEmail: false,
        },
      });
    }

    return NextResponse.json({
      tags: allTags,
      contactCount,
      selectedTags,
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}
