'use client';

import { useState } from 'react';
import { getLogoUrls } from '@/lib/email-variables';

interface CampaignVariableSettingsProps {
  onCtaUrlChange?: (url: string) => void;
  defaultCtaUrl?: string;
}

export default function CampaignVariableSettings({ 
  onCtaUrlChange,
  defaultCtaUrl = ''
}: CampaignVariableSettingsProps) {
  const [ctaUrl, setCtaUrl] = useState(defaultCtaUrl);
  const [showInfo, setShowInfo] = useState(false);
  
  const logoUrls = getLogoUrls();

  const handleCtaUrlChange = (url: string) => {
    setCtaUrl(url);
    onCtaUrlChange?.(url);
  };

  return (
    <div className="space-y-4">
      {/* CTA URL Setting */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Call-to-Action URL
          <span className="ml-2 text-xs text-gray-500">(Optional)</span>
        </label>
        <input
          type="url"
          value={ctaUrl}
          onChange={(e) => handleCtaUrlChange(e.target.value)}
          placeholder="https://example.com/special-offer"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500">
          This URL will replace <code className="bg-gray-100 px-1 py-0.5 rounded">{'{{cta_url}}'}</code> in your template
        </p>
      </div>

      {/* Variable Info Toggle */}
      <button
        type="button"
        onClick={() => setShowInfo(!showInfo)}
        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        {showInfo ? '− Hide' : '+ Show'} Variable Information
      </button>

      {/* Variable Information Panel */}
      {showInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Available Variables
            </h4>
            <p className="text-xs text-blue-700 mb-3">
              Your template can use these variables for personalization:
            </p>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded border border-blue-100">
                <code className="text-blue-600">{'{{firstName}}'}</code>
                <span className="ml-2 text-gray-600">Contact's first name</span>
              </div>
              <div className="bg-white p-2 rounded border border-blue-100">
                <code className="text-blue-600">{'{{name}}'}</code>
                <span className="ml-2 text-gray-600">Full name</span>
              </div>
              <div className="bg-white p-2 rounded border border-blue-100">
                <code className="text-blue-600">{'{{email}}'}</code>
                <span className="ml-2 text-gray-600">Email address</span>
              </div>
              <div className="bg-white p-2 rounded border border-blue-100">
                <code className="text-blue-600">{'{{company}}'}</code>
                <span className="ml-2 text-gray-600">Company name</span>
              </div>
              <div className="bg-white p-2 rounded border border-blue-100">
                <code className="text-blue-600">{'{{jobTitle}}'}</code>
                <span className="ml-2 text-gray-600">Job title</span>
              </div>
              <div className="bg-white p-2 rounded border border-blue-100">
                <code className="text-blue-600">{'{{cta_url}}'}</code>
                <span className="ml-2 text-gray-600">Your CTA URL</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Logo Assets
            </h4>
            <p className="text-xs text-blue-700 mb-3">
              Use these in your template to include your brand logos:
            </p>
            
            <div className="space-y-2 text-xs">
              <div className="bg-white p-2 rounded border border-blue-100">
                <code className="text-blue-600">{'{{logo_url}}'}</code>
                <span className="ml-2 text-gray-600">Default logo</span>
              </div>
              <div className="bg-white p-2 rounded border border-blue-100">
                <code className="text-blue-600">{'{{logo_black_url}}'}</code>
                <span className="ml-2 text-gray-600">Black logo (PNG)</span>
              </div>
              <div className="bg-white p-2 rounded border border-blue-100">
                <code className="text-blue-600">{'{{logo_white_url}}'}</code>
                <span className="ml-2 text-gray-600">White logo (SVG)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Example Usage
            </h4>
            <div className="bg-white p-3 rounded border border-blue-100 font-mono text-xs">
              <div className="text-gray-600">{'<img src="{{logo_url}}" alt="Logo" width="150" />'}</div>
              <div className="text-gray-600 mt-2">{'<h1>Hi {{firstName}},</h1>'}</div>
              <div className="text-gray-600 mt-2">{'<p>We noticed you work at {{company}}.</p>'}</div>
              <div className="text-gray-600 mt-2">{'<a href="{{cta_url}}">Click Here</a>'}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-700">
              <strong>Note:</strong> Variables are automatically replaced with actual contact data when emails are sent. 
              Missing data will use sensible defaults (e.g., "there" for missing names).
            </p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Personalization enabled</span>
          <span className="text-green-600 font-medium">✓ Active</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-2">
          <span className="text-gray-600">Logo assets available</span>
          <span className="text-green-600 font-medium">✓ 5 logos</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-2">
          <span className="text-gray-600">Contact variables</span>
          <span className="text-green-600 font-medium">✓ 15+ fields</span>
        </div>
      </div>
    </div>
  );
}
