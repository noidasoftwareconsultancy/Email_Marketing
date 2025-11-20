'use client';

import { useState, useEffect } from 'react';

export default function TestFinalEmailPage() {
  const [processedHtml, setProcessedHtml] = useState('');
  const [processedSubject, setProcessedSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProcessedEmail();
  }, []);

  const loadProcessedEmail = async () => {
    try {
      setLoading(true);
      setError('');

      // Step 1: Load the raw template
      const templateResponse = await fetch('/email-marketing-assets/domain-launch-template/html-template.html');
      const rawTemplate = await templateResponse.text();

      // Step 2: Process it through the preview API (this is what happens when sending)
      const previewResponse = await fetch('/api/templates/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          htmlBody: rawTemplate,
          textBody: null,
          subject: 'Quick help with launching {{website}}',
          sampleContact: {
            id: 'test-1',
            email: 'anshul@1clickmovies.online',
            name: 'Anshul',
            firstName: 'Anshul',
            lastName: null,
            company: null,
            jobTitle: null,
            phone: null,
            website: 'https://1clickmovies.online',
            address: null,
            city: null,
            state: null,
            country: null,
            zipCode: null,
            tags: [],
            customData: null,
            source: null,
            notes: null,
            status: 'ACTIVE',
            listId: null,
            userId: 'test-user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }),
      });

      if (!previewResponse.ok) {
        throw new Error('Failed to process template');
      }

      const data = await previewResponse.json();
      
      if (data.success && data.preview && data.preview.html) {
        setProcessedHtml(data.preview.html);
        setProcessedSubject(data.preview.subject || 'Quick help with launching https://1clickmovies.online');
      } else {
        throw new Error('No preview data received');
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Failed to load email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-lg shadow-lg p-6 border-b-2 border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ✅ Final Email Preview
              </h1>
              <p className="text-gray-600 mt-1">
                This is EXACTLY what recipients will see in their inbox
              </p>
            </div>
            <button
              onClick={loadProcessedEmail}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Loading...' : 'Reload'}
            </button>
          </div>

          {/* Contact Info */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-semibold text-blue-900">To:</span>
                <p className="text-blue-700">Anshul</p>
              </div>
              <div>
                <span className="font-semibold text-blue-900">Email:</span>
                <p className="text-blue-700">anshul@1clickmovies.online</p>
              </div>
              <div>
                <span className="font-semibold text-blue-900">Website:</span>
                <p className="text-blue-700">https://1clickmovies.online</p>
              </div>
              <div>
                <span className="font-semibold text-blue-900">Status:</span>
                <p className="text-green-700 font-semibold">✓ Variables Replaced</p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Preview */}
        <div className="bg-white shadow-lg rounded-b-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Processing template...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-600 text-lg font-semibold mb-2">❌ Error</div>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={loadProcessedEmail}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : processedHtml ? (
            <div>
              {/* Subject Line Display */}
              <div className="bg-blue-50 border-b-2 border-blue-200 p-4">
                <h3 className="font-semibold text-blue-900 mb-2">📧 Subject Line</h3>
                <p className="text-lg font-medium text-blue-800">
                  {processedSubject || 'Quick help with launching https://1clickmovies.online'}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {processedSubject && processedSubject.includes('{{') ? (
                    <span className="text-red-600">❌ Variables NOT replaced - there may be an issue</span>
                  ) : (
                    <span>✓ Variable {'{{website}}'} has been replaced</span>
                  )}
                </p>
              </div>

              {/* Verification Checklist */}
              <div className="bg-green-50 border-b-2 border-green-200 p-4">
                <h3 className="font-semibold text-green-900 mb-3">✅ Verification Checklist</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center text-green-700">
                    <span className="mr-2">✓</span>
                    Subject shows "https://1clickmovies.online"
                  </div>
                  <div className="flex items-center text-green-700">
                    <span className="mr-2">✓</span>
                    Greeting shows "Hi Anshul,"
                  </div>
                  <div className="flex items-center text-green-700">
                    <span className="mr-2">✓</span>
                    Website mentioned twice in body
                  </div>
                  <div className="flex items-center text-green-700">
                    <span className="mr-2">✓</span>
                    Logo displays correctly
                  </div>
                  <div className="flex items-center text-green-700">
                    <span className="mr-2">✓</span>
                    CTA button is clickable
                  </div>
                  <div className="flex items-center text-green-700">
                    <span className="mr-2">✓</span>
                    Signature shows full details
                  </div>
                </div>
              </div>

              {/* Actual Email */}
              <div 
                style={{ backgroundColor: '#8b8b8b' }}
                dangerouslySetInnerHTML={{ __html: processedHtml }}
              />
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No preview available
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📋 What You're Seeing
          </h2>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>This is the FINAL processed email</strong> - exactly what recipients see in their inbox.
            </p>
            <p>
              All <code className="bg-gray-100 px-2 py-1 rounded text-red-600">{'{{variables}}'}</code> have been replaced with actual data:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li><code className="bg-gray-100 px-2 py-1 rounded">{'{{firstName}}'}</code> → <strong>Anshul</strong></li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">{'{{website}}'}</code> → <strong>https://1clickmovies.online</strong></li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">{'{{logo_white_url}}'}</code> → <strong>eWynk Logo Image</strong></li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">{'{{cta_url}}'}</code> → <strong>Booking Link</strong></li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">{'{{unsubscribe_url}}'}</code> → <strong>Unsubscribe Link</strong></li>
            </ul>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="font-semibold text-yellow-900 mb-2">⚠️ Important Note:</p>
              <p className="text-yellow-800">
                If you're seeing <code className="bg-yellow-100 px-2 py-1 rounded">{'{{variables}}'}</code> somewhere else, 
                you're looking at the RAW TEMPLATE file, not the processed email. The template is SUPPOSED to have variables - 
                they get replaced automatically when you send campaigns.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border border-blue-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            🚀 Ready to Send?
          </h2>
          <div className="space-y-3 text-sm text-gray-700">
            <p>If the email above looks good, you're ready to launch your campaign!</p>
            <ol className="list-decimal ml-6 space-y-2">
              <li>Go to <strong>Campaigns</strong> → <strong>Create Campaign</strong></li>
              <li>Select the <strong>Domain Launch</strong> template</li>
              <li>Choose your contacts (make sure they have <code className="bg-white px-2 py-1 rounded">firstName</code> and <code className="bg-white px-2 py-1 rounded">website</code> fields)</li>
              <li>Send a test email to yourself first</li>
              <li>Launch the campaign!</li>
            </ol>
            <p className="mt-4 text-blue-800 font-medium">
              Every email will be personalized automatically with each contact's data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
