'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import {
  CalendarIcon,
  ClockIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface CampaignSchedulerProps {
  campaignId: string;
  recipientCount: number;
  targetTags?: string[];
  onSchedule: (scheduledAt: Date) => Promise<void>;
  onSendNow: () => Promise<void>;
  isLoading?: boolean;
}

export function CampaignScheduler({
  campaignId,
  recipientCount,
  targetTags = [],
  onSchedule,
  onSendNow,
  isLoading,
}: CampaignSchedulerProps) {
  const [scheduleMode, setScheduleMode] = useState<'now' | 'later'>('now');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleSchedule = async () => {
    if (scheduleMode === 'now') {
      await onSendNow();
    } else {
      if (!selectedDate || !selectedTime) {
        alert('Please select both date and time');
        return;
      }
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}`);
      if (scheduledAt <= new Date()) {
        alert('Scheduled time must be in the future');
        return;
      }
      await onSchedule(scheduledAt);
    }
  };

  // Get optimal sending times
  const optimalTimes = [
    { time: '09:00', label: '9:00 AM', description: 'Morning check' },
    { time: '10:00', label: '10:00 AM', description: 'Peak engagement' },
    { time: '14:00', label: '2:00 PM', description: 'After lunch' },
    { time: '19:00', label: '7:00 PM', description: 'Evening reading' },
  ];

  // Get suggested days
  const today = new Date();
  const suggestedDays = [
    { offset: 0, label: 'Today' },
    { offset: 1, label: 'Tomorrow' },
    { offset: 2, label: 'In 2 days' },
    { offset: 7, label: 'Next week' },
  ];

  return (
    <div className="space-y-6">
      {/* Recipient Summary */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Ready to Send</h3>
            <p className="text-gray-600 mt-1">
              This campaign will be sent to <span className="font-semibold text-primary-600">{recipientCount}</span> {recipientCount === 1 ? 'recipient' : 'recipients'}
            </p>
            {targetTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs text-gray-500">Target tags:</span>
                {targetTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {targetTags.length === 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Targeting all active contacts
              </p>
            )}
          </div>
          <div className="p-3 bg-primary-100 rounded-lg">
            <PaperAirplaneIcon className="w-8 h-8 text-primary-600" />
          </div>
        </div>
      </Card>

      {/* Schedule Mode Selection */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setScheduleMode('now')}
          className={`p-6 rounded-lg border-2 transition-all ${
            scheduleMode === 'now'
              ? 'border-primary-600 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <PaperAirplaneIcon className={`w-8 h-8 mx-auto mb-3 ${
            scheduleMode === 'now' ? 'text-primary-600' : 'text-gray-400'
          }`} />
          <h4 className={`font-semibold mb-1 ${
            scheduleMode === 'now' ? 'text-primary-900' : 'text-gray-900'
          }`}>
            Send Now
          </h4>
          <p className="text-sm text-gray-600">
            Start sending immediately
          </p>
        </button>

        <button
          type="button"
          onClick={() => setScheduleMode('later')}
          className={`p-6 rounded-lg border-2 transition-all ${
            scheduleMode === 'later'
              ? 'border-primary-600 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <CalendarIcon className={`w-8 h-8 mx-auto mb-3 ${
            scheduleMode === 'later' ? 'text-primary-600' : 'text-gray-400'
          }`} />
          <h4 className={`font-semibold mb-1 ${
            scheduleMode === 'later' ? 'text-primary-900' : 'text-gray-900'
          }`}>
            Schedule for Later
          </h4>
          <p className="text-sm text-gray-600">
            Choose a specific time
          </p>
        </button>
      </div>

      {/* Schedule Options */}
      {scheduleMode === 'later' && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Date & Time</h3>
          
          {/* Quick Date Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Select
            </label>
            <div className="grid grid-cols-4 gap-2">
              {suggestedDays.map((day) => {
                const date = new Date(today);
                date.setDate(date.getDate() + day.offset);
                const dateStr = date.toISOString().split('T')[0];
                return (
                  <button
                    key={day.offset}
                    type="button"
                    onClick={() => setSelectedDate(dateStr)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedDate === dateStr
                        ? 'border-primary-600 bg-primary-50 text-primary-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="text-sm font-semibold">{day.label}</div>
                    <div className="text-xs mt-1">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual Date Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <CalendarIcon className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={today.toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <ClockIcon className="w-4 h-4 inline mr-1" />
                Time
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Optimal Times */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Optimal Sending Times
            </label>
            <div className="grid grid-cols-4 gap-2">
              {optimalTimes.map((time) => (
                <button
                  key={time.time}
                  type="button"
                  onClick={() => setSelectedTime(time.time)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedTime === time.time
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`text-sm font-semibold ${
                    selectedTime === time.time ? 'text-primary-900' : 'text-gray-900'
                  }`}>
                    {time.label}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{time.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {selectedDate && selectedTime && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">Scheduled for:</p>
                  <p className="text-blue-800 mt-1">
                    {new Date(`${selectedDate}T${selectedTime}`).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Important Notes */}
      <Card>
        <h4 className="font-semibold text-gray-900 mb-3">Important Notes</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-0.5">•</span>
            <span>Emails will be sent with 1-second delays to respect Gmail limits</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-0.5">•</span>
            <span>You can monitor progress in real-time from the campaigns page</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-0.5">•</span>
            <span>Scheduled campaigns can be cancelled before they start</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 mt-0.5">•</span>
            <span>Make sure you have sufficient daily quota remaining</span>
          </li>
        </ul>
      </Card>

      {/* Action Button */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={handleSchedule}
          isLoading={isLoading}
          size="lg"
          className="min-w-[200px]"
        >
          {scheduleMode === 'now' ? (
            <>
              <PaperAirplaneIcon className="w-5 h-5 mr-2" />
              Send Now
            </>
          ) : (
            <>
              <CalendarIcon className="w-5 h-5 mr-2" />
              Schedule Campaign
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
