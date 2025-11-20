import { NextRequest, NextResponse } from 'next/server';
import { prepareEmailContent, validateTemplate, replaceVariables, extractContactVariables, getLogoUrls, generateCampaignUrls } from '@/lib/email-variables';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { htmlBody, textBody, subject, previewText, sampleContact } = body;

    // Validate template
    const validation = validateTemplate(htmlBody + (subject || ''));

    // Create sample contact if not provided
    const contact = sampleContact || {
      id: 'sample-id',
      email: 'john.doe@example.com',
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      company: 'Acme Corporation',
      jobTitle: 'Marketing Director',
      phone: '+1 (555) 123-4567',
      website: 'acme.com',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10001',
      tags: [],
      customData: null,
      source: null,
      notes: null,
      status: 'ACTIVE',
      listId: null,
      userId: 'sample-user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Prepare email content with variables
    const { html, text } = prepareEmailContent(
      htmlBody,
      textBody,
      contact,
      'preview-campaign-id',
      {
        ctaUrl: 'https://example.com/special-offer',
      }
    );

    // Replace variables in subject line and preview text
    const variables = {
      ...extractContactVariables(contact),
      ...getLogoUrls(),
      ...generateCampaignUrls('preview-campaign-id', contact.id, 'https://example.com/special-offer'),
    };

    const processedSubject = subject ? replaceVariables(subject, variables) : subject;
    const processedPreviewText = previewText ? replaceVariables(previewText, variables) : previewText;

    return NextResponse.json({
      success: true,
      preview: {
        html,
        text,
        subject: processedSubject,
        previewText: processedPreviewText,
      },
      validation,
    });
  } catch (error: any) {
    console.error('Template preview error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate preview',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
