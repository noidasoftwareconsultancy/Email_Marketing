'use client';

import { Card } from '@/components/ui/Card';
import { Campaign } from '@/lib/types';
import {
  EnvelopeIcon,
  EnvelopeOpenIcon,
  CursorArrowRaysIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface CampaignAnalyticsProps {
  campaign: Campaign;
}

export function CampaignAnalytics({ campaign }: CampaignAnalyticsProps) {
  const openRate = campaign.totalSent > 0
    ? ((campaign.totalOpened / campaign.totalSent) * 100).toFixed(1)
    : '0.0';

  const clickRate = campaign.totalSent > 0
    ? ((campaign.totalClicked / campaign.totalSent) * 100).toFixed(1)
    : '0.0';

  const clickToOpenRate = campaign.totalOpened > 0
    ? ((campaign.totalClicked / campaign.totalOpened) * 100).toFixed(1)
    : '0.0';

  const failureRate = campaign.totalSent > 0
    ? ((campaign.totalFailed / (campaign.totalSent + campaign.totalFailed)) * 100).toFixed(1)
    : '0.0';

  const deliveryRate = campaign.totalSent > 0
    ? ((campaign.totalSent / (campaign.totalSent + campaign.totalFailed)) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <EnvelopeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sent</p>
              <p className="text-2xl font-bold text-gray-900">{campaign.totalSent}</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <EnvelopeOpenIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Opened</p>
              <p className="text-2xl font-bold text-gray-900">{campaign.totalOpened}</p>
              <p className="text-xs text-green-600 font-medium">{openRate}%</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CursorArrowRaysIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Clicked</p>
              <p className="text-2xl font-bold text-gray-900">{campaign.totalClicked}</p>
              <p className="text-xs text-purple-600 font-medium">{clickRate}%</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">{campaign.totalFailed}</p>
              <p className="text-xs text-red-600 font-medium">{failureRate}%</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Delivery</p>
              <p className="text-2xl font-bold text-gray-900">{deliveryRate}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Metrics */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Open Rate</span>
                <span className="text-sm font-semibold text-gray-900">{openRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${openRate}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Industry average: 20-30%
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Click Rate</span>
                <span className="text-sm font-semibold text-gray-900">{clickRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(parseFloat(clickRate) * 5, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Industry average: 2-5%
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Click-to-Open Rate</span>
                <span className="text-sm font-semibold text-gray-900">{clickToOpenRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${clickToOpenRate}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Percentage of opens that clicked
              </p>
            </div>
          </div>
        </Card>

        {/* Performance Summary */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Total Recipients</span>
              <span className="text-sm font-semibold text-gray-900">{campaign.totalRecipients}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-green-700">Successfully Delivered</span>
              <span className="text-sm font-semibold text-green-900">{campaign.totalSent}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-red-700">Failed Deliveries</span>
              <span className="text-sm font-semibold text-red-900">{campaign.totalFailed}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-700">Delivery Rate</span>
              <span className="text-sm font-semibold text-blue-900">{deliveryRate}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Indicators */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border-2 ${
            parseFloat(openRate) >= 20 ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {parseFloat(openRate) >= 20 ? (
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              ) : (
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
              )}
              <span className={`font-semibold ${
                parseFloat(openRate) >= 20 ? 'text-green-900' : 'text-yellow-900'
              }`}>
                Open Rate
              </span>
            </div>
            <p className={`text-sm ${
              parseFloat(openRate) >= 20 ? 'text-green-700' : 'text-yellow-700'
            }`}>
              {parseFloat(openRate) >= 20
                ? 'Great! Above industry average'
                : 'Consider improving subject lines'}
            </p>
          </div>

          <div className={`p-4 rounded-lg border-2 ${
            parseFloat(clickRate) >= 2 ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {parseFloat(clickRate) >= 2 ? (
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              ) : (
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
              )}
              <span className={`font-semibold ${
                parseFloat(clickRate) >= 2 ? 'text-green-900' : 'text-yellow-900'
              }`}>
                Click Rate
              </span>
            </div>
            <p className={`text-sm ${
              parseFloat(clickRate) >= 2 ? 'text-green-700' : 'text-yellow-700'
            }`}>
              {parseFloat(clickRate) >= 2
                ? 'Excellent engagement!'
                : 'Add more compelling CTAs'}
            </p>
          </div>

          <div className={`p-4 rounded-lg border-2 ${
            parseFloat(failureRate) < 2 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {parseFloat(failureRate) < 2 ? (
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              ) : (
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-semibold ${
                parseFloat(failureRate) < 2 ? 'text-green-900' : 'text-red-900'
              }`}>
                Bounce Rate
              </span>
            </div>
            <p className={`text-sm ${
              parseFloat(failureRate) < 2 ? 'text-green-700' : 'text-red-700'
            }`}>
              {parseFloat(failureRate) < 2
                ? 'Healthy list quality'
                : 'Clean your contact list'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
