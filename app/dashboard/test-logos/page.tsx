'use client';

import { useEffect, useState } from 'react';
import { getLogoUrls } from '@/lib/email-variables';

export default function TestLogosPage() {
  const [logoUrls, setLogoUrls] = useState<Record<string, string>>({});
  const [loadStatus, setLoadStatus] = useState<Record<string, 'loading' | 'success' | 'error'>>({});

  useEffect(() => {
    const urls = getLogoUrls();
    setLogoUrls(urls);
    
    // Initialize load status
    const status: Record<string, 'loading' | 'success' | 'error'> = {};
    Object.keys(urls).forEach(key => {
      status[key] = 'loading';
    });
    setLoadStatus(status);
  }, []);

  const handleImageLoad = (key: string) => {
    setLoadStatus(prev => ({ ...prev, [key]: 'success' }));
  };

  const handleImageError = (key: string) => {
    setLoadStatus(prev => ({ ...prev, [key]: 'error' }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Logo Loading Test</h1>
          <p className="mt-2 text-gray-600">
            Test if all logo assets are loading correctly for email templates
          </p>
        </div>

        {/* Logo URLs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Generated Logo URLs
          </h2>
          <div className="space-y-2">
            {Object.entries(logoUrls).map(([key, url]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <code className="text-sm text-blue-600">{`{{${key}}}`}</code>
                </div>
                <div className="flex-1 ml-4">
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-gray-600 hover:text-blue-600 break-all"
                  >
                    {url}
                  </a>
                </div>
                <div className="ml-4">
                  {loadStatus[key] === 'loading' && (
                    <span className="text-xs text-yellow-600">⏳ Loading...</span>
                  )}
                  {loadStatus[key] === 'success' && (
                    <span className="text-xs text-green-600">✓ Loaded</span>
                  )}
                  {loadStatus[key] === 'error' && (
                    <span className="text-xs text-red-600">✗ Failed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Test */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Visual Test
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(logoUrls).map(([key, url]) => (
              <div key={key} className="border border-gray-200 rounded-lg p-4">
                <div className="mb-2">
                  <code className="text-sm font-medium text-gray-700">{key}</code>
                </div>
                <div className="bg-gray-100 rounded p-4 flex items-center justify-center min-h-[150px]">
                  <img
                    src={url}
                    alt={key}
                    onLoad={() => handleImageLoad(key)}
                    onError={() => handleImageError(key)}
                    style={{ maxWidth: '200px', maxHeight: '100px' }}
                    className="object-contain"
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500 break-all">
                  {url}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Email Template Preview
          </h2>
          <div className="border border-gray-300 rounded-lg p-6 bg-white">
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              {/* Header with logo */}
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <img 
                  src={logoUrls.logo_url} 
                  alt="Company Logo" 
                  width="150"
                  style={{ maxWidth: '100%', height: 'auto', display: 'inline-block' }}
                  onLoad={() => handleImageLoad('preview-logo')}
                  onError={() => handleImageError('preview-logo')}
                />
              </div>
              
              {/* Content */}
              <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Hi John,</h1>
              <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#4b5563' }}>
                This is a test email to verify logo loading in email templates.
              </p>
              
              {/* Footer */}
              <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>
                  Best regards,<br />
                  Your Team
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            Troubleshooting
          </h2>
          
          <div className="space-y-4 text-sm text-blue-800">
            <div>
              <strong>If logos are not loading:</strong>
              <ol className="list-decimal ml-5 mt-2 space-y-1">
                <li>Check that files exist in <code className="bg-blue-100 px-1 py-0.5 rounded">/public</code> folder</li>
                <li>Verify <code className="bg-blue-100 px-1 py-0.5 rounded">NEXT_PUBLIC_APP_URL</code> in .env</li>
                <li>Test API endpoint: <a href="/api/assets/logo?type=black" target="_blank" className="text-blue-600 underline">/api/assets/logo?type=black</a></li>
                <li>For production, use CDN by setting <code className="bg-blue-100 px-1 py-0.5 rounded">NEXT_PUBLIC_LOGO_CDN_URL</code></li>
              </ol>
            </div>
            
            <div>
              <strong>For email clients:</strong>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Gmail may block images - users must click "Display images"</li>
                <li>Localhost URLs won't work in sent emails</li>
                <li>Use CDN or deployed app URL for production</li>
              </ul>
            </div>
            
            <div className="pt-4 border-t border-blue-200">
              <strong>Quick Fix:</strong>
              <p className="mt-2">
                Add to your <code className="bg-blue-100 px-1 py-0.5 rounded">.env</code> file:
              </p>
              <pre className="mt-2 bg-blue-100 p-3 rounded text-xs overflow-x-auto">
                NEXT_PUBLIC_APP_URL=http://localhost:3000
              </pre>
              <p className="mt-2 text-xs">
                Then restart your development server.
              </p>
            </div>
          </div>
        </div>

        {/* Test Links */}
        <div className="mt-6 bg-gray-100 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Direct API Tests</h3>
          <div className="space-y-2">
            <a 
              href="/api/assets/logo?type=black" 
              target="_blank"
              className="block text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Test Black Logo API
            </a>
            <a 
              href="/api/assets/logo?type=white" 
              target="_blank"
              className="block text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Test White Logo API
            </a>
            <a 
              href="/api/assets/logo?type=favicon-black" 
              target="_blank"
              className="block text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Test Black Favicon API
            </a>
            <a 
              href="/api/assets/logo?type=favicon-white" 
              target="_blank"
              className="block text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Test White Favicon API
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
