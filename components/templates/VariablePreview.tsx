'use client';

import { useState } from 'react';
import { replaceVariables, getAvailableVariables, type EmailVariables } from '@/lib/email-variables';

interface VariablePreviewProps {
  content: string;
  subject?: string;
}

export default function VariablePreview({ content, subject }: VariablePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Sample data for preview
  const sampleData: EmailVariables = {
    name: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    company: 'Acme Corporation',
    jobTitle: 'Marketing Director',
    phone: '+1 (555) 123-4567',
    website: 'acme.com',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    cta_url: 'https://example.com/special-offer',
    unsubscribe_url: 'https://example.com/unsubscribe',
    logo_url: '/Logo Black.png',
    logo_black_url: '/Logo Black.png',
    logo_white_url: '/Logo White.svg',
    favicon_black_url: '/Fav Icon Black (1).png',
    favicon_white_url: '/Fav Icon White.png',
  };

  const previewContent = replaceVariables(content, sampleData);
  const previewSubject = subject ? replaceVariables(subject, sampleData) : null;

  // Extract variables used in content
  const variablePattern = /\{\{(\w+)\}\}/g;
  const usedVariables = new Set<string>();
  let match;
  
  const tempContent = content + (subject || '');
  while ((match = variablePattern.exec(tempContent)) !== null) {
    usedVariables.add(match[1]);
  }

  const availableVars = getAvailableVariables();
  const usedVarDetails = availableVars.filter(v => usedVariables.has(v.key));

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Preview Variables ({usedVariables.size})
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setIsOpen(false)}
            />

            <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
                <h3 className="text-lg font-semibold text-white">
                  Variable Preview
                </h3>
                <p className="mt-1 text-sm text-blue-100">
                  See how your template will look with sample data
                </p>
              </div>

              <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                {/* Variables Used */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Variables Used ({usedVariables.size})
                  </h4>
                  {usedVarDetails.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {usedVarDetails.map((variable) => (
                        <div
                          key={variable.key}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                        >
                          <div>
                            <code className="text-xs font-mono text-blue-600">
                              {`{{${variable.key}}}`}
                            </code>
                            <span className="ml-2 text-xs text-gray-600">
                              {variable.label}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            → {sampleData[variable.key] || 'N/A'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No variables detected in this template
                    </p>
                  )}
                </div>

                {/* Subject Preview */}
                {previewSubject && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Subject Line Preview
                    </h4>
                    <div className="p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="text-sm text-gray-900">{previewSubject}</p>
                    </div>
                  </div>
                )}

                {/* Content Preview */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Content Preview
                  </h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                      <p className="text-xs text-gray-600">
                        HTML Preview (with sample data)
                      </p>
                    </div>
                    <div className="p-4 bg-white max-h-96 overflow-y-auto">
                      <div
                        dangerouslySetInnerHTML={{ __html: previewContent }}
                        className="prose prose-sm max-w-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Sample Data Reference */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">
                    Sample Data Used
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-medium text-blue-800">Name:</span>{' '}
                      <span className="text-blue-600">{sampleData.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Email:</span>{' '}
                      <span className="text-blue-600">{sampleData.email}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Company:</span>{' '}
                      <span className="text-blue-600">{sampleData.company}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Job Title:</span>{' '}
                      <span className="text-blue-600">{sampleData.jobTitle}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-blue-700">
                    Actual emails will use real contact data from your database
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
