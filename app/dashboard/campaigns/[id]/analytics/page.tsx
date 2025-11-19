'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  CursorArrowRaysIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface CampaignAnalytics {
  campaign: {
    id: string;
    name: string;
    status: string;
    template: {
      name: string;
      subject: string;
    };
    scheduledAt?: string;
    sentAt?: string;
    completedAt?: string;
  };
  metrics: {
    totalRecipients: number;
    sent: number;
    opened: number;
    clicked: number;
    bounced: number;
    failed: number;
    pending: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
    deliveryRate: number;
    clickToOpenRate: number;
  };
  statusBreakdown: {
    sent: number;
    opened: number;
    clicked: number;
    bounced: number;
    failed: number;
    pending: number;
  };
  timeline: Array<{
    timestamp: string;
    type: 'open' | 'click';
    contact: string;
  }>;
  recentActivity: Array<{
    contact: string;
    status: string;
    timestamp: string;
  }>;
  errors: Record<string, number>;
}

export default function CampaignAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [params.id]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/campaigns/${params.id}/analytics`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        toast.error('Failed to fetch analytics');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Card>
          <p className="text-center text-gray-500 py-8">Loading analytics...</p>
        </Card>
      </DashboardLayout>
    );
  }

  if (!analytics) {
    return (
      <DashboardLayout>
        <Card>
          <p className="text-center text-gray-500 py-8">Campaign not found</p>
        </Card>
      </DashboardLayout>
    );
  }

  const { campaign, metrics, statusBreakdown, timeline, recentActivity, errors } = analytics;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push('/dashboard/campaigns')}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
            <p className="mt-1 text-gray-600">Campaign Analytics</p>
          </div>
        </div>

        {/* Campaign Info */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Template</p>
              <p className="font-semibold text-gray-900">{campaign.template.name}</p>
              <p className="text-sm text-gray-500 mt-1">{campaign.template.subject}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-gray-900">{campaign.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Sent At</p>
              <p className="font-semibold text-gray-900">
                {campaign.sentAt
                  ? new Date(campaign.sentAt).toLocaleString()
                  : 'Not sent yet'}
              </p>
            </div>
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivery Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {metrics.deliveryRate.toFixed(1)}%
                </p>
              </div>
              <EnvelopeIcon className="w-10 h-10 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {metrics.sent} of {metrics.totalRecipients} delivered
            </p>
          </Card>

          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Rate</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {metrics.openRate.toFixed(1)}%
                </p>
              </div>
              <EnvelopeOpenIcon className="w-10 h-10 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">{metrics.opened} opens</p>
          </Card>

          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Click Rate</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {metrics.clickRate.toFixed(1)}%
                </p>
              </div>
              <CursorArrowRaysIcon className="w-10 h-10 text-purple-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">{metrics.clicked} clicks</p>
          </Card>

          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bounce Rate</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {metrics.bounceRate.toFixed(1)}%
                </p>
              </div>
              <ExclamationTriangleIcon className="w-10 h-10 text-red-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">{metrics.bounced} bounces</p>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Breakdown */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Sent</span>
                </div>
                <span className="font-semibold text-gray-900">{statusBreakdown.sent}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <EnvelopeOpenIcon className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">Opened</span>
                </div>
                <span className="font-semibold text-gray-900">{statusBreakdown.opened}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CursorArrowRaysIcon className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700">Clicked</span>
                </div>
                <span className="font-semibold text-gray-900">{statusBreakdown.clicked}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700">Bounced</span>
                </div>
                <span className="font-semibold text-gray-900">{statusBreakdown.bounced}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircleIcon className="w-5 h-5 text-red-500" />
                  <span className="text-gray-700">Failed</span>
                </div>
                <span className="font-semibold text-gray-900">{statusBreakdown.failed}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Pending</span>
                </div>
                <span className="font-semibold text-gray-900">{statusBreakdown.pending}</span>
              </div>
            </div>
          </Card>

          {/* Advanced Metrics */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Click-to-Open Rate</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {metrics.clickToOpenRate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${Math.min(metrics.clickToOpenRate, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Delivery Rate</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {metrics.deliveryRate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(metrics.deliveryRate, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Open Rate</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {metrics.openRate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${Math.min(metrics.openRate, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Click Rate</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {metrics.clickRate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${Math.min(metrics.clickRate, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No activity yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Contact
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((activity, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{activity.contact}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            activity.status === 'CLICKED'
                              ? 'bg-purple-100 text-purple-700'
                              : activity.status === 'OPENED'
                              ? 'bg-green-100 text-green-700'
                              : activity.status === 'SENT'
                              ? 'bg-blue-100 text-blue-700'
                              : activity.status === 'BOUNCED'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {activity.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(activity.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Errors */}
        {Object.keys(errors).length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Analysis</h3>
            <div className="space-y-2">
              {Object.entries(errors).map(([error, count]) => (
                <div key={error} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm text-red-800">{error}</span>
                  <span className="text-sm font-semibold text-red-900">{count} occurrences</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Timeline */}
        {timeline.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Timeline</h3>
            <div className="space-y-3">
              {timeline.slice(0, 20).map((event, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      event.type === 'click' ? 'bg-purple-500' : 'bg-green-500'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{event.contact}</span>{' '}
                      {event.type === 'click' ? 'clicked a link' : 'opened the email'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
