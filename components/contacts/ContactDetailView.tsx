'use client';

import { Contact } from '@/lib/types';
import { ContactActivities } from './ContactActivities';

interface ContactDetailViewProps {
  contact: Contact;
  onEdit: () => void;
  onDelete: () => void;
}

export function ContactDetailView({ contact, onEdit, onDelete }: ContactDetailViewProps) {
  const renderField = (label: string, value: any) => {
    if (!value) return null;
    return (
      <div>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900">{value}</dd>
      </div>
    );
  };

  const renderRating = (rating?: number) => {
    if (!rating) return 'No rating';
    return '⭐'.repeat(rating);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Unnamed Contact'}
            </h2>
            <p className="text-gray-600 mt-1">{contact.email}</p>
            <div className="flex gap-2 mt-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                contact.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                contact.status === 'UNSUBSCRIBED' ? 'bg-gray-100 text-gray-800' :
                contact.status === 'BOUNCED' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {contact.status}
              </span>
              {contact.emailVerified && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  ✓ Email Verified
                </span>
              )}
              {contact.phoneVerified && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  ✓ Phone Verified
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Lead Score & Rating */}
      {(contact.score !== undefined || contact.rating) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Scoring</h3>
          <div className="grid grid-cols-2 gap-6">
            {contact.score !== undefined && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Lead Score</dt>
                <dd className="mt-1">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-900">{contact.score}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${contact.score}%` }}
                      />
                    </div>
                  </div>
                </dd>
              </div>
            )}
            {contact.rating && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Rating</dt>
                <dd className="mt-1 text-2xl">{renderRating(contact.rating)}</dd>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
          {renderField('First Name', contact.firstName)}
          {renderField('Last Name', contact.lastName)}
          {renderField('Email', contact.email)}
          {renderField('Phone', contact.phone)}
          {renderField('Job Title', contact.jobTitle)}
          {renderField('Company', contact.company)}
          {renderField('Website', contact.website)}
        </dl>
      </div>

      {/* Address */}
      {(contact.address || contact.city || contact.state || contact.country) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            {renderField('Street Address', contact.address)}
            {renderField('City', contact.city)}
            {renderField('State/Province', contact.state)}
            {renderField('Country', contact.country)}
            {renderField('ZIP/Postal Code', contact.zipCode)}
          </dl>
        </div>
      )}

      {/* Social Media */}
      {(contact.linkedInUrl || contact.twitterHandle || contact.facebookUrl) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            {contact.linkedInUrl && (
              <div>
                <dt className="text-sm font-medium text-gray-500">LinkedIn</dt>
                <dd className="mt-1">
                  <a href={contact.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">
                    {contact.linkedInUrl}
                  </a>
                </dd>
              </div>
            )}
            {renderField('Twitter', contact.twitterHandle)}
            {contact.facebookUrl && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Facebook</dt>
                <dd className="mt-1">
                  <a href={contact.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">
                    {contact.facebookUrl}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Personal Information */}
      {(contact.birthday || contact.gender || contact.language || contact.timezone) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            {contact.birthday && renderField('Birthday', new Date(contact.birthday).toLocaleDateString())}
            {renderField('Gender', contact.gender)}
            {renderField('Language', contact.language)}
            {renderField('Timezone', contact.timezone)}
          </dl>
        </div>
      )}

      {/* Tags */}
      {contact.tags && contact.tags.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {contact.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Preferences */}
      {(contact.doNotEmail || contact.doNotCall) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Preferences</h3>
          <div className="space-y-2">
            {contact.doNotEmail && (
              <div className="flex items-center gap-2 text-red-600">
                <span>⚠️</span>
                <span className="text-sm font-medium">Do Not Email</span>
              </div>
            )}
            {contact.doNotCall && (
              <div className="flex items-center gap-2 text-red-600">
                <span>⚠️</span>
                <span className="text-sm font-medium">Do Not Call</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {contact.notes && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.notes}</p>
        </div>
      )}

      {/* Activity Timeline */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <ContactActivities contactId={contact.id} />
      </div>

      {/* Metadata */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
          {renderField('Source', contact.source)}
          {renderField('Created', new Date(contact.createdAt).toLocaleString())}
          {renderField('Last Updated', new Date(contact.updatedAt).toLocaleString())}
          {contact.lastContactedAt && renderField('Last Contacted', new Date(contact.lastContactedAt).toLocaleString())}
          {contact.lastEngagedAt && renderField('Last Engaged', new Date(contact.lastEngagedAt).toLocaleString())}
        </dl>
      </div>
    </div>
  );
}
