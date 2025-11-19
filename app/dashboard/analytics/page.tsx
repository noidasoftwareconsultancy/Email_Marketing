'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import {
  ChartBarIcon,
  EnvelopeOpenIcon,
  CursorArrowRaysIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-gray-600">
            Track your email campaign performance and engagement metrics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sent</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">12,543</p>
                <p className="mt-2 text-sm text-green-600">↑ 23% from last month</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <ChartBarIcon className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Rate</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">24.5%</p>
                <p className="mt-2 text-sm text-green-600">↑ 2.1% from last month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <EnvelopeOpenIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Click Rate</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">3.8%</p>
                <p className="mt-2 text-sm text-green-600">↑ 0.5% from last month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <CursorArrowRaysIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">1.2%</p>
                <p className="mt-2 text-sm text-green-600">↓ 0.3% from last month</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Campaign Performance */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performing Campaigns</h2>
          <div className="space-y-4">
            {[
              { name: 'Welcome Series', sent: 1250, opened: 425, clicked: 89, rate: 34 },
              { name: 'Monthly Newsletter', sent: 3200, opened: 896, clicked: 145, rate: 28 },
              { name: 'Product Launch', sent: 2100, opened: 567, clicked: 98, rate: 27 },
              { name: 'Holiday Special', sent: 1800, opened: 432, clicked: 76, rate: 24 },
            ].map((campaign, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                  <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
                    <span>Sent: {campaign.sent.toLocaleString()}</span>
                    <span>Opened: {campaign.opened}</span>
                    <span>Clicked: {campaign.clicked}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600">{campaign.rate}%</p>
                  <p className="text-sm text-gray-500">Open Rate</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Engagement Over Time */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Engagement Trends</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart visualization would go here</p>
          </div>
        </Card>

        {/* Best Sending Times */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Best Days to Send</h2>
            <div className="space-y-3">
              {[
                { day: 'Tuesday', rate: 28.5 },
                { day: 'Wednesday', rate: 26.8 },
                { day: 'Thursday', rate: 25.2 },
                { day: 'Monday', rate: 22.1 },
                { day: 'Friday', rate: 19.3 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{item.day}</span>
                  <div className="flex items-center gap-3 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${item.rate * 3}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {item.rate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Best Times to Send</h2>
            <div className="space-y-3">
              {[
                { time: '10:00 AM', rate: 31.2 },
                { time: '2:00 PM', rate: 27.8 },
                { time: '9:00 AM', rate: 25.5 },
                { time: '11:00 AM', rate: 23.9 },
                { time: '3:00 PM', rate: 21.6 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{item.time}</span>
                  <div className="flex items-center gap-3 flex-1 ml-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${item.rate * 3}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {item.rate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
