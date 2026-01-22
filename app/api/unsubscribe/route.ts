
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const campaignId = searchParams.get('campaign');
  const contactId = searchParams.get('contact');

  if (!contactId) {
    return NextResponse.json({ error: 'Invalid unsubscribe request' }, { status: 400 });
  }

  try {
    // Verify contact exists
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Unsubscribe the contact
    await prisma.contact.update({
      where: { id: contactId },
      data: {
        doNotEmail: true,
        status: 'UNSUBSCRIBED',
        notes: contact.notes ? `${contact.notes}\nUnsubscribed via campaign ${campaignId || 'unknown'}` : `Unsubscribed via campaign ${campaignId || 'unknown'}`,
      },
    });

    // If campaign ID is provided, log the unsubscribe event (optional, but good for stats)
    // We could add an 'UNSUBSCRIBED' status to EmailStatus enum if we wanted strict tracking
    // For now, let's just update the contact.

    // Redirect to success page
    const successUrl = new URL('/unsubscribe', request.url);
    successUrl.searchParams.set('success', 'true');
    return NextResponse.redirect(successUrl);

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
}
