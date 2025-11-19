import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-id';
    const body = await request.json();
    const { action, contactIds, data } = body;

    if (!action || !contactIds || !Array.isArray(contactIds)) {
      return NextResponse.json(
        { error: 'Invalid request. Required: action, contactIds (array)' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'delete':
        result = await prisma.contact.deleteMany({
          where: {
            id: { in: contactIds },
            userId,
          },
        });
        break;

      case 'update_status':
        if (!data?.status) {
          return NextResponse.json(
            { error: 'Status is required for update_status action' },
            { status: 400 }
          );
        }
        result = await prisma.contact.updateMany({
          where: {
            id: { in: contactIds },
            userId,
          },
          data: {
            status: data.status,
          },
        });
        break;

      case 'add_tags':
        if (!data?.tags || !Array.isArray(data.tags)) {
          return NextResponse.json(
            { error: 'Tags array is required for add_tags action' },
            { status: 400 }
          );
        }
        // Get existing contacts
        const contacts = await prisma.contact.findMany({
          where: {
            id: { in: contactIds },
            userId,
          },
          select: { id: true, tags: true },
        });

        // Update each contact with merged tags
        await Promise.all(
          contacts.map((contact) =>
            prisma.contact.update({
              where: { id: contact.id },
              data: {
                tags: [...new Set([...contact.tags, ...data.tags])],
              },
            })
          )
        );

        result = { count: contacts.length };
        break;

      case 'remove_tags':
        if (!data?.tags || !Array.isArray(data.tags)) {
          return NextResponse.json(
            { error: 'Tags array is required for remove_tags action' },
            { status: 400 }
          );
        }
        // Get existing contacts
        const contactsToUpdate = await prisma.contact.findMany({
          where: {
            id: { in: contactIds },
            userId,
          },
          select: { id: true, tags: true },
        });

        // Update each contact with filtered tags
        await Promise.all(
          contactsToUpdate.map((contact) =>
            prisma.contact.update({
              where: { id: contact.id },
              data: {
                tags: contact.tags.filter((tag) => !data.tags.includes(tag)),
              },
            })
          )
        );

        result = { count: contactsToUpdate.length };
        break;

      case 'move_to_list':
        if (!data?.listId) {
          return NextResponse.json(
            { error: 'listId is required for move_to_list action' },
            { status: 400 }
          );
        }
        result = await prisma.contact.updateMany({
          where: {
            id: { in: contactIds },
            userId,
          },
          data: {
            listId: data.listId,
          },
        });
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      action,
      affected: result.count || contactIds.length,
    });
  } catch (error: any) {
    console.error('Bulk operation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to perform bulk operation',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
