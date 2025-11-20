'use client';

import { useState } from 'react';
import { prepareEmailContent, getLogoUrls } from '@/lib/email-variables';

export default function TestEmailSendPage() {
  const [testContact, setTestContact] = useState({
    id: 'test-1',
    email: 'anshul@example.com',
    name: 'Anshul',
    firstName: 'Anshul',
    lastName: '',
    company: '',
    jobTitle: '',
    phone: '',
    website: 'https://1clickmovies.online',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    tags: [],
    customData: null,
    source: null,
    notes: null,
    status: 'ACTIVE' as const,
    listId: null,
    userId: 'test-user',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [htmlTemplate, setHtmlTemplate] = useState('');
  const [processedHtml, setProcessedHtml] = useState('');

  const loadTemplate = async () => {
    try {
      const response = await fetch('/email-marketing-assets/domain-launch-template/html-template.html');
      const html = await response.text();
      setHtmlTemplate(html);
      
      // Process the template with variables
      const { html: processed } = prepareEmailContent(
        html,
        null,
        testContact,
        'test-campaign-id',
        {
          ctaUrl: 'https://calendly.com/ewynk/onboarding',
        }
      );
      
      setProcessedHtml(processed);
    } catch (error) {
      console.error('Error loading template:', error);
    }
  };

  const updateContact = (field: string, value: string) => {
    setTestContact(prev => ({ ...prev, [field]: value }));
  };

  const reprocessTemplate = () => {
    if (htmlTemplate) {
      const { html: processed } = prepareEmailContent(
        htmlTemplate,
        null,
        testContact,
        'test-campaign-id',
        {
          ctaUrl: 'https://calendly.com/ewynk/onboarding',
        }
      );
      setProcessedHtml(processed);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Test Email Template</h1>
          <p className="mt-2 text-gray-600">
            Test the domain launch email template with variable replacement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Test Contact Data</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={testContact.firstName}
                    onChange={(e) => updateContact('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={testContact.email}
                    onChange={(e) => updateContact('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="text"
                    value={testContact.website}
                    onChange={(e) => updateContact('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <button
                  onClick={loadTemplate}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Load Template
                </button>

                <button
                  onClick={reprocessTemplate}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  disabled={!htmlTemplate}
                >
                  Reprocess with New Data
                </button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-semibold mb-3">Variables</h3>
                <div className="space-y-2 text-xs">
                  <div className="bg-gray-50 p-2 rounded">
                    <code>{'{{firstName}}'}</code>: {testContact.firstName}
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <code>{'{{website}}'}</code>: {testContact.website}
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <code>{'{{logo_white_url}}'}</code>: {getLogoUrls().logo_white_url}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gray-100 px-6 py-3 border-b">
                <h2 className="text-sm font-semibold">Email Preview</h2>
              </div>
              
              <div className="p-6">
                {processedHtml ? (
                  <div 
                    className="border rounded-lg overflow-hidden"
                    style={{ backgroundColor: '#8b8b8b' }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    Click "Load Template" to see the preview
                  </div>
                )}
              </div>
            </div>

            {/* Raw HTML View */}
            {processedHtml && (
              <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gray-100 px-6 py-3 border-b">
                  <h2 className="text-sm font-semibold">Processed HTML (First 500 chars)</h2>
                </div>
                <div className="p-6">
                  <pre className="text-xs bg-gray-50 p-4 rounded overflow-x-auto">
                    {processedHtml.substring(0, 500)}...
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
