'use client';

import { useState } from 'react';
import VariableInserter from '@/components/templates/VariableInserter';
import VariablePreview from '@/components/templates/VariablePreview';
import { getAvailableVariables } from '@/lib/email-variables';

export default function TestVariablesPage() {
  const [subject, setSubject] = useState('Hi {{firstName}}, special offer for {{company}}');
  const [htmlContent, setHtmlContent] = useState(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Test Email</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <!-- Logo -->
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="{{logo_url}}" alt="Company Logo" width="150" style="max-width: 100%; height: auto;" />
  </div>
  
  <!-- Content -->
  <h1 style="color: #1f2937;">Hi {{firstName}},</h1>
  <p style="color: #4b5563; line-height: 1.6;">
    We're reaching out to professionals at <strong>{{company}}</strong>.
  </p>
  <p style="color: #4b5563; line-height: 1.6;">
    As a {{jobTitle}}, you might be interested in our latest services.
  </p>
  
  <!-- CTA Button -->
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{cta_url}}" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
      Learn More
    </a>
  </div>
  
  <!-- Contact Info -->
  <div style="margin-top: 30px; padding: 20px; background: #f3f4f6; border-radius: 8px;">
    <p style="margin: 0 0 10px; color: #1f2937; font-weight: bold;">Your Details:</p>
    <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Email: {{email}}</p>
    <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Phone: {{phone}}</p>
    <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Location: {{city}}, {{state}}, {{country}}</p>
  </div>
  
  <!-- Footer -->
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
    <p>Best regards,<br>Your Team</p>
    <p style="margin-top: 15px;">
      <a href="{{unsubscribe_url}}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`);

  const [textContent, setTextContent] = useState(`Hi {{firstName}},

We're reaching out to professionals at {{company}}.

As a {{jobTitle}}, you might be interested in our latest services.

Learn More: {{cta_url}}

Your Details:
Email: {{email}}
Phone: {{phone}}
Location: {{city}}, {{state}}, {{country}}

Best regards,
Your Team

Unsubscribe: {{unsubscribe_url}}`);

  const variables = getAvailableVariables();

  const handleInsertVariable = (variable: string) => {
    // Insert at the end of HTML content for demo
    setHtmlContent(prev => prev + variable);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Variable System Test
          </h1>
          <p className="mt-2 text-gray-600">
            Test the email variable replacement system with live preview
          </p>
        </div>

        {/* Available Variables Reference */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Available Variables
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(
              variables.reduce((acc, v) => {
                if (!acc[v.category]) acc[v.category] = [];
                acc[v.category].push(v);
                return acc;
              }, {} as Record<string, typeof variables>)
            ).map(([category, vars]) => (
              <div key={category} className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  {category}
                </h3>
                <div className="space-y-1">
                  {vars.map((v) => (
                    <div key={v.key} className="text-xs">
                      <code className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {`{{${v.key}}}`}
                      </code>
                      <span className="ml-2 text-gray-600">{v.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Line Editor */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Subject Line
            </h2>
            <VariableInserter onInsert={(v) => setSubject(prev => prev + v)} />
          </div>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter subject line with variables..."
          />
        </div>

        {/* HTML Editor */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              HTML Content
            </h2>
            <div className="flex gap-2">
              <VariableInserter onInsert={handleInsertVariable} />
              <VariablePreview content={htmlContent} subject={subject} />
            </div>
          </div>
          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            className="w-full h-96 px-4 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter HTML content with variables..."
          />
        </div>

        {/* Text Editor */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Plain Text Content
            </h2>
          </div>
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="w-full h-48 px-4 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter plain text content with variables..."
          />
        </div>

        {/* Logo Assets Info */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            Logo Assets Available
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded border border-blue-100">
              <p className="text-sm font-medium text-gray-900 mb-2">Black Logo (PNG)</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block mb-2">
                {`{{logo_black_url}}`}
              </code>
              <p className="text-xs text-gray-600">File: /Logo Black.png</p>
            </div>
            <div className="bg-white p-4 rounded border border-blue-100">
              <p className="text-sm font-medium text-gray-900 mb-2">White Logo (SVG)</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block mb-2">
                {`{{logo_white_url}}`}
              </code>
              <p className="text-xs text-gray-600">File: /Logo White.svg</p>
            </div>
            <div className="bg-white p-4 rounded border border-blue-100">
              <p className="text-sm font-medium text-gray-900 mb-2">Black Favicon (PNG)</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block mb-2">
                {`{{favicon_black_url}}`}
              </code>
              <p className="text-xs text-gray-600">File: /Fav Icon Black (1).png</p>
            </div>
            <div className="bg-white p-4 rounded border border-blue-100">
              <p className="text-sm font-medium text-gray-900 mb-2">White Favicon (PNG)</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block mb-2">
                {`{{favicon_white_url}}`}
              </code>
              <p className="text-xs text-gray-600">File: /Fav Icon White.png</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
