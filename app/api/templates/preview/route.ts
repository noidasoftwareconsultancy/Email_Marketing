import { NextRequest, NextResponse } from 'next/server';
import { replaceTemplateVariables, calculateTemplateScore } from '@/lib/template-utils';
import { Contact } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { htmlBody, subject, previewText, contactData } = body;

    // Create sample contact data
    const sampleContact: Contact = {
      id: 'sample',
      email: contactData?.email || 'john.doe@example.com',
      name: contactData?.name || 'John Doe',
      firstName: contactData?.firstName || 'John',
      lastName: contactData?.lastName || 'Doe',
      phone: contactData?.phone || '+1 (555) 123-4567',
      company: contactData?.company || 'Acme Corp',
      jobTitle: contactData?.jobTitle || 'Marketing Manager',
      website: contactData?.website || 'https://example.com',
      address: contactData?.address || '123 Main St',
      city: contactData?.city || 'San Francisco',
      state: contactData?.state || 'CA',
      country: contactData?.country || 'United States',
      zipCode: contactData?.zipCode || '94102',
      tags: [],
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const templateData = {
      contact: sampleContact,
      campaign: {
        name: 'Sample Campaign',
        id: 'sample-campaign',
      },
    };

    const previewHtml = replaceTemplateVariables(htmlBody, templateData);
    const previewSubject = replaceTemplateVariables(subject, templateData);
    const previewPreviewText = previewText ? replaceTemplateVariables(previewText, templateData) : '';

    // Calculate template score
    const scoreData = calculateTemplateScore({
      subject,
      previewText,
      htmlBody,
    });

    return NextResponse.json({
      htmlBody: previewHtml,
      subject: previewSubject,
      previewText: previewPreviewText,
      score: scoreData.score,
      suggestions: scoreData.suggestions,
    });
  } catch (error: any) {
    console.error('Preview template error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate preview',
      details: error.message 
    }, { status: 500 });
  }
}
