'use client';

import { useState, useEffect } from 'react';
import { replaceVariables, getLogoUrls } from '@/lib/email-variables';

export default function DomainLaunchPreviewPage() {
  const [htmlContent, setHtmlContent] = useState('');
  const [sampleData, setSampleData] = useState({
    firstName: 'John',
    name: 'John Doe',
    website: 'example.com',
    email: 'john@example.com',
    cta_url: 'https://calendly.com/ewynk/onboarding',
    unsubscribe_url: 'https://example.com/unsubscribe',
    ...getLogoUrls(),
  });

  useEffect(() => {
    // Load template
    fetch('/email-marketing-assets/domain-launch-template/html-template.html')
      .then(res => res.text())
      .then(html => {
        setHtmlContent(html);
      })
      .catch(err => console.error('Error loading template:', err));
  }, []);

  const previewHtml = replaceVariables(htmlContent, sampleData);

  const handleDataChange = (field: string, value: string) => {
    setSampleData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Domain Launch Email Template
          </h1>
          <p className="mt-2 text-gray-600">
            Cold outreach template for domain owners - Preview with live data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Sample Data
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={sampleData.firstName}
                    onChange={(e) => handleDataChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Domain/Website
                  </label>
                  <input
                    type="text"
                    value={sampleData.website}
                    onChange={(e) => handleDataChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CTA URL (Booking Link)
                  </label>
                  <input
                    type="url"
                    value={sampleData.cta_url}
                    onChange={(e) => handleDataChange('cta_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Variables Used
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <code className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {'{{firstName}}'}
                    </code>
                    <span className="text-gray-600">{sampleData.firstName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {'{{website}}'}
                    </code>
                    <span className="text-gray-600">{sampleData.website}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {'{{cta_url}}'}
                    </code>
                    <span className="text-gray-600 text-xs truncate max-w-[100px]">Link</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {'{{logo_white_url}}'}
                    </code>
                    <span className="text-gray-600 text-xs">Logo</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Template Info
                </h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <p><strong>Type:</strong> Cold Outreach</p>
                  <p><strong>Target:</strong> Domain Owners</p>
                  <p><strong>Goal:</strong> Book Calls</p>
                  <p><strong>Tone:</strong> Friendly, Professional</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900">
                  Email Preview
                </h2>
              </div>
              
              <div className="p-6">
                {/* Subject Line Preview */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-semibold text-blue-900 mb-1">SUBJECT LINE</p>
                  <p className="text-sm text-blue-800">
                    {replaceVariables('Quick help with launching {{website}}', sampleData)}
                  </p>
                </div>

                {/* Email Content */}
                <div 
                  className="border border-gray-200 rounded-lg overflow-hidden"
                  style={{ backgroundColor: '#8b8b8b' }}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                    style={{ 
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Template Features */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Template Features
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Personalized</p>
                    <p className="text-xs text-gray-600">Uses first name and domain</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Mobile Responsive</p>
                    <p className="text-xs text-gray-600">Looks great on all devices</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Clear CTA</p>
                    <p className="text-xs text-gray-600">Single, focused action</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Professional Design</p>
                    <p className="text-xs text-gray-600">Clean, modern layout</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Social Proof</p>
                    <p className="text-xs text-gray-600">Value prop in header</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Compliant</p>
                    <p className="text-xs text-gray-600">Unsubscribe & address</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Instructions */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                How to Use This Template
              </h3>
              <ol className="list-decimal ml-5 space-y-2 text-sm text-blue-800">
                <li>Ensure contacts have <code className="bg-blue-100 px-1 py-0.5 rounded">firstName</code> and <code className="bg-blue-100 px-1 py-0.5 rounded">website</code> fields</li>
                <li>Set your booking/calendar URL as the CTA</li>
                <li>Create campaign and select this template</li>
                <li>Preview with real contact data</li>
                <li>Send test email to yourself</li>
                <li>Launch campaign to target audience</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
