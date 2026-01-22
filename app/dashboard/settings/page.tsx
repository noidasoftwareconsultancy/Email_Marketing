'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GmailConnect } from '@/components/settings/GmailConnect';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { Card } from '@/components/ui/Card';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-gray-600">
            Manage your account settings and email configuration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GmailConnect />

          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Email Quota
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Daily Limit</p>
                <p className="text-2xl font-bold text-gray-900">500 emails</p>
                <p className="text-sm text-gray-500 mt-1">
                  Resets daily at midnight
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Gmail has a daily sending limit of 500 emails
                  for Google Workspace accounts and 100 for free Gmail accounts.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <ProfileSettings />
      </div>
    </DashboardLayout>
  );
}
