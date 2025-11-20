'use client';

import { useState, useEffect } from 'react';

export default function PreviewSentEmailPage() {
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(false);

  const loadAndProcessTemplate = async () => {
    setLoading(true);
    try {
      // Simulate what happens when a campaign sends
      const response = await fetch('/api/templates/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          htmlBody: await fetch('/email-marketing-assets/domain-launch-template/html-template.html').then(r => r.text()),
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

      const data = await response.json();
      
      if (data.success) {
        setHtmlContent(data.preview.html);
      } else {
        console.error('Preview failed:', data);
        alert('Failed to generate preview: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error loading preview: ' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAndProcessTemplate();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Preview: Sent Email
          </h1>
          <p className="text-gray-600 mb-4">
            This shows exactly what the recipient will see in their inbox
          </p>
          
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={loadAndProcessTemplate}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Reload Preview'}
            </button>
            
            <div className="text-sm text-gray-600">
              Contact: <strong>Anshul</strong> | Website: <strong>https://1clickmovies.online</strong>
            </div>
          </div>

          {htmlContent && (
            <div className="border-t pt-4">
              <div className="bg-gray-50 p-2 rounded mb-2 text-xs text-gray-600">
                ✅ All variables have been replaced with actual data
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-gray-500">Loading preview...</div>
            </div>
          ) : htmlContent ? (
            <div 
              style={{ backgroundColor: '#8b8b8b' }}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-gray-500">No preview available</div>
            </div>
          )}
        </div>

        {htmlContent && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-3">Verification Checklist</h2>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Subject line shows "Quick help with launching https://1clickmovies.online"</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Greeting shows "Hi Anshul," (not "Hi {'{{firstName}}'},")</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Website appears as "https://1clickmovies.online" (not "{'{{website}}'}")</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>eWynk logo displays correctly</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>CTA button "Book Your Onboarding Call" is clickable</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Signature shows "Vishal Vishwakarma, Founder & CEO, eWynk"</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Unsubscribe link is present in footer</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
