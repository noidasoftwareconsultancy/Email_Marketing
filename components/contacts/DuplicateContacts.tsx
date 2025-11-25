'use client';

import { useState, useEffect } from 'react';
import { ContactDuplicate } from '@/lib/types';
import { Button } from '@/components/ui/Button';

export function DuplicateContacts() {
  const [duplicates, setDuplicates] = useState<ContactDuplicate[]>([]);
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);

  const fetchDuplicates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/contacts/duplicates?status=PENDING');
      if (response.ok) {
        const data = await response.json();
        setDuplicates(data);
      }
    } catch (error) {
      console.error('Failed to fetch duplicates:', error);
    } finally {
      setLoading(false);
    }
  };

  const detectDuplicates = async () => {
    setDetecting(true);
    try {
      const response = await fetch('/api/contacts/duplicates', {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        fetchDuplicates();
      }
    } catch (error) {
      console.error('Failed to detect duplicates:', error);
      alert('Failed to detect duplicates');
    } finally {
      setDetecting(false);
    }
  };

  const mergeDuplicates = async (duplicate: ContactDuplicate) => {
    if (!confirm('Are you sure you want to merge these contacts?')) return;

    try {
      const response = await fetch('/api/contacts/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryContactId: duplicate.contactId1,
          secondaryContactId: duplicate.contactId2,
          mergeStrategy: 'primary',
        }),
      });

      if (response.ok) {
        alert('Contacts merged successfully');
        fetchDuplicates();
      }
    } catch (error) {
      console.error('Failed to merge contacts:', error);
      alert('Failed to merge contacts');
    }
  };

  const ignoreDuplicate = async (duplicateId: string) => {
    try {
      const response = await fetch(`/api/contacts/duplicates/${duplicateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'IGNORED' }),
      });

      if (response.ok) {
        fetchDuplicates();
      }
    } catch (error) {
      console.error('Failed to ignore duplicate:', error);
    }
  };

  useEffect(() => {
    fetchDuplicates();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Duplicate Contacts</h2>
          <p className="text-gray-600 mt-1">
            Review and merge duplicate contacts to keep your database clean
          </p>
        </div>
        <Button onClick={detectDuplicates} isLoading={detecting}>
          Detect Duplicates
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading duplicates...</div>
      ) : duplicates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">No duplicate contacts found</p>
          <p className="text-sm text-gray-500 mt-2">
            Click "Detect Duplicates" to scan for potential duplicates
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {duplicates.map((duplicate) => (
            <div
              key={duplicate.id}
              className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-900">
                      {Math.round(duplicate.similarityScore)}% Match
                    </span>
                    <span className="text-sm text-gray-500">
                      ({duplicate.matchedFields.join(', ')})
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => mergeDuplicates(duplicate)}
                  >
                    Merge
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => ignoreDuplicate(duplicate.id)}
                  >
                    Ignore
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Contact 1</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Email:</strong> {duplicate.contact1?.email}</p>
                    <p><strong>Name:</strong> {duplicate.contact1?.name || 'N/A'}</p>
                    <p><strong>Phone:</strong> {duplicate.contact1?.phone || 'N/A'}</p>
                    <p><strong>Company:</strong> {duplicate.contact1?.company || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Contact 2</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Email:</strong> {duplicate.contact2?.email}</p>
                    <p><strong>Name:</strong> {duplicate.contact2?.name || 'N/A'}</p>
                    <p><strong>Phone:</strong> {duplicate.contact2?.phone || 'N/A'}</p>
                    <p><strong>Company:</strong> {duplicate.contact2?.company || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
