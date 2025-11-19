'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  CursorArrowRaysIcon,
} from '@heroicons/react/24/outline';

interface TemplateAnalyticsProps {
  templateId: string;
}

interface AnalyticsData {
  template: {
    id: string;
    name: string;
    category: string | null;
  };
  summary: {
    totalCampaigns: number;
    totalSent: number;
    totalOpened: number;
    totalClicked: number;
    openRate: number;
    clickRate: number;
    clickToOpenRate: number;
  };
  campaigns: Array<{
    id: string;
    name: string;
    sentAt: Date | null;
    sent: number;
    opened: number;
    clicked: number;
    openRate: number;
    clickRate: number;
  }>;
  benchmarks: {
    industryAvgOpenRate: number;
    industryAvgClickRate: number;
    yourPerformance: {
      openRate: string;
      clickRate: string;
    };
  };
}

export function TemplateAnalytics({ templateId }: TemplateAnalyticsProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [templateId]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/templates/${templateId}/analytics`);
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (performance: string) => {
    if (performance === 'above') return 'text-green-600';
    if (performance === 'average') return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceIcon = (performance: string) => {
    if (performance === 'above') return <ArrowTrendingUpIcon className="w-5 h-5" />;
    if (performance === 'below') return <ArrowTrendingDownIcon className="w-5 h-5" />;
    return null;
  };

  if (loading) {
    return (
      <Card>
        <p className="text-center text-gray-500 py-8">Loading analytics...</p>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <p className="text-center text-gray-500 py-8">No analytics data available</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <ChartBarIcon className="w-6 h-6 mr-2 text-indigo-600" />
          Template Performance Analytics
        </h2>
        <p className="text-gray-600 mt-1">{data.template.name}</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sent</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {data.summary.totalSent.toLocaleString()}
              </p>
            </div>
            <EnvelopeIcon className="w-8 h-8 text-indigo-600" />
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Rate</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {data.summary.openRate.toFixed(1)}%
              </p>
              <div className={`flex items-center gap-1 mt-1 ${getPerformanceColor(data.benchmarks.yourPerformance.openRate)}`}>
                {getPerformanceIcon(data.benchmarks.yourPerformance.openRate)}
                <span className="text-xs font-medium">
                  {data.benchmarks.yourPerformance.openRate} average
                </span>
              </div>
            </div>
            <EnvelopeOpenIcon className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Click Rate</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {data.summary.clickRate.toFixed(1)}%
              </p>
              <div className={`flex items-center gap-1 mt-1 ${getPerformanceColor(data.benchmarks.yourPerformance.clickRate)}`}>
                {getPerformanceIcon(data.benchmarks.yourPerformance.clickRate)}
                <span className="text-xs font-medium">
                  {data.benchmarks.yourPerformance.clickRate} average
                </span>
              </div>
            </div>
            <CursorArrowRaysIcon className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Campaigns</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {data.summary.totalCampaigns}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total uses</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Benchmarks */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Industry Benchmarks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Your Open Rate</span>
              <span className="text-lg font-bold text-gray-900">
                {data.summary.openRate.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all"
                style={{ width: `${Math.min(data.summary.openRate, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Industry average: {data.benchmarks.industryAvgOpenRate}%
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Your Click Rate</span>
              <span className="text-lg font-bold text-gray-900">
                {data.summary.clickRate.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${Math.min((data.summary.clickRate / 10) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Industry average: {data.benchmarks.industryAvgClickRate}%
            </p>
          </div>
        </div>
      </Card>

      {/* Campaign Performance */}
      {data.campaigns.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Campaign
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Sent
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Opened
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Clicked
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Open Rate
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Click Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{campaign.name}</p>
                      {campaign.sentAt && (
                        <p className="text-xs text-gray-500">
                          {new Date(campaign.sentAt).toLocaleDateString()}
                        </p>
                      )}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900">
                      {campaign.sent.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900">
                      {campaign.opened.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900">
                      {campaign.clicked.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {campaign.openRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {campaign.clickRate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Insights */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="space-y-3">
          {data.summary.clickToOpenRate > 0 && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Click-to-Open Rate: {data.summary.clickToOpenRate.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {data.summary.clickToOpenRate > 15
                    ? 'Excellent! Your content is highly engaging for those who open.'
                    : 'Consider improving your call-to-action and content relevance.'}
                </p>
              </div>
            </div>
          )}

          {data.benchmarks.yourPerformance.openRate === 'above' && (
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-2 h-2 bg-green-600 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Above Average Open Rate
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Your subject line and preview text are performing well!
                </p>
              </div>
            </div>
          )}

          {data.benchmarks.yourPerformance.openRate === 'below' && (
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="flex-shrink-0 w-2 h-2 bg-yellow-600 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Opportunity to Improve Open Rate
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Try A/B testing different subject lines and adding personalization.
                </p>
              </div>
            </div>
          )}

          {data.summary.totalCampaigns >= 5 && (
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Popular Template
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  This template has been used in {data.summary.totalCampaigns} campaigns. Consider creating variations for A/B testing.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
