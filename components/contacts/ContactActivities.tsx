'use client';

import { useState, useEffect } from 'react';
import { ContactActivity } from '@/lib/types';
import { Button } from '@/components/ui/Button';

interface ContactActivitiesProps {
  contactId: string;
}

const activityIcons: Record<string, string> = {
  EMAIL_SENT: '📧',
  EMAIL_OPENED: '📬',
  EMAIL_CLICKED: '🖱️',
  EMAIL_BOUNCED: '⚠️',
  CALL_MADE: '📞',
  CALL_RECEIVED: '📱',
  MEETING_SCHEDULED: '📅',
  MEETING_COMPLETED: '✅',
  NOTE_ADDED: '📝',
  TAG_ADDED: '🏷️',
  TAG_REMOVED: '🗑️',
  STATUS_CHANGED: '🔄',
  LIST_CHANGED: '📋',
  FORM_SUBMITTED: '📄',
  WEBSITE_VISIT: '🌐',
  CUSTOM: '⭐',
};

export function ContactActivities({ contactId }: ContactActivitiesProps) {
  const [activities, setActivities] = useState<ContactActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddActivity, setShowAddActivity] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, [contactId]);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/contacts/activities?contactId=${contactId}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading activities...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
        <Button size="sm" onClick={() => setShowAddActivity(true)}>
          Add Activity
        </Button>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No activities yet. Add your first activity to track interactions.
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="text-2xl">{activityIcons[activity.type] || '📌'}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900">{activity.title}</h4>
                  <span className="text-xs text-gray-500">{formatDate(activity.createdAt)}</span>
                </div>
                {activity.description && (
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                )}
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                    {activity.type.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
