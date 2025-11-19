'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Template, Contact } from '@/lib/types';
import {
  EnvelopeIcon,
  UserGroupIcon,
  TagIcon,
  EyeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface CampaignPreviewProps {
  template: Template;
  targetTags: string[];
  onClose?: () => void;
}

export function CampaignPreview({ template, targetTags, onClose }: CampaignPreviewProps) {
  const [recipientCount, setRecipientCount] = useState(0);
  const [sampleContacts, setSampleContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipients();
  }, [targetTags]);

  const fetchRecipients = async () => {
    try {
      const params = new URLSearchParams();
      if (targetTags.length > 0) {
        params.append('tags', targetTags.join(','));
      }
      
      const response = await fetch(`/api/contacts?${params.toString()}`);
      if (response.ok) {
        const contacts = await response.json();
        const activeContacts = contacts.filter((c: Contact) => c.status === 'ACTIVE');
        setRecipientCount(activeContacts.length);
        setSampleContacts(activeContacts.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch recipients:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Campaign Preview</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Recipients Summary */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <UserGroupIcon className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">Target Recipients</h4>
            <p className="text-sm text-gray-600 mt-1">
              {loading ? (
                'Calculating...'
              ) : (
                <>
                  This campaign will be sent to{' '}
                  <span className="font-semibold text-indigo-600">{recipientCount}</span> active
                  contacts
                </>
              )}
            </p>
          </div>
        </div>

        {/* Target Tags */}
        {targetTags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TagIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Target Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {targetTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sample Contacts */}
        {sampleContacts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Sample Recipients:</p>
            <div className="space-y-2">
              {sampleContacts.map((contact) => (
                <div key={contact.id} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="font-medium">{contact.name || contact.email}</span>
                  {contact.name && <span className="text-gray-400">({contact.email})</span>}
                </div>
              ))}
              {recipientCount > 5 && (
                <p className="text-sm text-gray-500 italic">
                  ...and {recipientCount - 5} more contacts
                </p>
              )}
            </div>
          </div>
        )}

        {recipientCount === 0 && !loading && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> No active contacts match the selected criteria. Please
                adjust your target tags or add more contacts.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Email Preview */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <EnvelopeIcon className="w-6 h-6 text-gray-500" />
          <h4 className="font-semibold text-gray-900">Email Preview</h4>
        </div>

        {/* Email Header */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-600 w-20">Template:</span>
              <span className="text-sm text-gray-900">{template.name}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-600 w-20">Subject:</span>
              <span className="text-sm text-gray-900">{template.subject}</span>
            </div>
            {template.previewText && (
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-gray-600 w-20">Preview:</span>
                <span className="text-sm text-gray-600">{template.previewText}</span>
              </div>
            )}
            {template.category && (
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-gray-600 w-20">Category:</span>
                <span className="text-sm text-gray-600">{template.category}</span>
              </div>
            )}
          </div>
        </div>

        {/* Email Body Preview */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <EyeIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Email Body</span>
            </div>
          </div>
          <div className="p-4 bg-white max-h-96 overflow-y-auto">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: template.htmlBody }}
            />
          </div>
        </div>

        {/* Text Version */}
        {template.textBody && (
          <div className="mt-4">
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                View Plain Text Version
              </summary>
              <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {template.textBody}
                </pre>
              </div>
            </details>
          </div>
        )}
      </Card>

      {/* Performance Stats */}
      {template.totalSent > 0 && (
        <Card>
          <h4 className="font-semibold text-gray-900 mb-4">Template Performance History</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Sent</p>
              <p className="text-xl font-bold text-gray-900">{template.totalSent}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Open Rate</p>
              <p className="text-xl font-bold text-green-600">{template.avgOpenRate.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Click Rate</p>
              <p className="text-xl font-bold text-purple-600">
                {template.avgClickRate.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Performance</p>
              <p className="text-xl font-bold text-indigo-600">{template.performanceScore}/100</p>
            </div>
          </div>
        </Card>
      )}

      {/* Important Notes */}
      <Card>
        <h4 className="font-semibold text-gray-900 mb-3">Before You Send</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 mt-0.5">✓</span>
            <span>Review the email content and subject line carefully</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 mt-0.5">✓</span>
            <span>Verify that you're targeting the correct audience</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 mt-0.5">✓</span>
            <span>Ensure your Gmail account is connected and has sufficient quota</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 mt-0.5">✓</span>
            <span>Test emails will be sent with 1-second delays to respect rate limits</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
