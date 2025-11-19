'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import {
  UserGroupIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FolderIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { DashboardStats, RecentActivity } from '@/lib/types';

interface QuotaInfo {
  emailQuota: number;
  emailsSentToday: number;
  remainingQuota: number;
  quotaPercentage: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    activeContacts: 0,
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalEmailsSent: 0,
    totalTemplates: 0,
    totalContactLists: 0,
    openRate: 0,
    clickRate: 0,
    bounceRate: 0,
    recentContactsCount: 0,
    recentCampaignsCount: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [quotaLoading, setQuotaLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([fetchStats(), fetchRecentActivity(), fetchQuota()]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setError(null);
      } else {
        setError('Failed to load dashboard statistics');
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch('/api/dashboard/recent-activity?limit=10');
      if (response.ok) {
        const data = await response.json();
        setRecentActivity(data);
      }
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
    } finally {
      setActivityLoading(false);
    }
  };

  const fetchQuota = async () => {
    try {
      const response = await fetch('/api/dashboard/quota');
      if (response.ok) {
        const data = await response.json();
        setQuota(data);
      }
    } catch (error) {
      console.error('Failed to fetch quota:', error);
    } finally {
      setQuotaLoading(false);
    }
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
    return new Date(date).toLocaleDateString();
  };

  const getActivityColor = (status?: RecentActivity['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="mt-2 text-gray-600">Welcome to eWynk Mail - Your email marketing command center</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <Card>
            <div className="flex items-center space-x-3 text-red-600">
              <ExclamationTriangleIcon className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Contacts"
            value={loading ? '...' : stats.totalContacts.toLocaleString()}
            icon={<UserGroupIcon className="w-6 h-6" />}
            color="blue"
            trend={
              stats.recentContactsCount > 0
                ? { value: stats.recentContactsCount, isPositive: true }
                : undefined
            }
          />
          <StatsCard
            title="Active Campaigns"
            value={loading ? '...' : `${stats.activeCampaigns}/${stats.totalCampaigns}`}
            icon={<EnvelopeIcon className="w-6 h-6" />}
            color="purple"
            trend={
              stats.recentCampaignsCount > 0
                ? { value: stats.recentCampaignsCount, isPositive: true }
                : undefined
            }
          />
          <StatsCard
            title="Emails Sent"
            value={loading ? '...' : stats.totalEmailsSent.toLocaleString()}
            icon={<ChartBarIcon className="w-6 h-6" />}
            color="green"
          />
          <StatsCard
            title="Contact Lists"
            value={loading ? '...' : stats.totalContactLists}
            icon={<FolderIcon className="w-6 h-6" />}
            color="orange"
          />
        </div>

        {/* Email Quota */}
        {quota && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Daily Email Quota</h3>
                <p className="text-sm text-gray-600">
                  {quota.emailsSentToday.toLocaleString()} of {quota.emailQuota.toLocaleString()} emails sent today
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{quota.remainingQuota.toLocaleString()}</p>
                <p className="text-sm text-gray-600">remaining</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  quota.quotaPercentage > 90
                    ? 'bg-red-500'
                    : quota.quotaPercentage > 70
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(quota.quotaPercentage, 100)}%` }}
              ></div>
            </div>
            {quota.quotaPercentage > 90 && (
              <p className="mt-2 text-sm text-red-600">⚠️ You&apos;re approaching your daily limit</p>
            )}
          </Card>
        )}

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Rate</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {loading ? '...' : `${stats.openRate.toFixed(1)}%`}
                </p>
              </div>
              <ArrowTrendingUpIcon className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <span>Industry average: 21.3%</span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Click Rate</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {loading ? '...' : `${stats.clickRate.toFixed(1)}%`}
                </p>
              </div>
              <ArrowTrendingUpIcon className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <span>Industry average: 2.6%</span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {loading ? '...' : `${stats.bounceRate.toFixed(1)}%`}
                </p>
              </div>
              <ArrowTrendingDownIcon className="w-8 h-8 text-red-500" />
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <span>Industry average: 0.7%</span>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/dashboard/contacts">
              <Card hover className="cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-cyan-100 rounded-xl">
                    <UserGroupIcon className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Manage Contacts</h3>
                    <p className="text-sm text-gray-600">Add or import contacts</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/templates">
              <Card hover className="cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Create Template</h3>
                    <p className="text-sm text-gray-600">Design email templates</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/campaigns">
              <Card hover className="cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-teal-100 rounded-xl">
                    <EnvelopeIcon className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">New Campaign</h3>
                    <p className="text-sm text-gray-600">Start email campaign</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/analytics">
              <Card hover className="cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <ChartBarIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">View Analytics</h3>
                    <p className="text-sm text-gray-600">Track performance</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            {activityLoading && <span className="text-sm text-gray-500">Loading...</span>}
          </div>
          {recentActivity.length === 0 && !activityLoading ? (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity yet</p>
              <p className="text-sm mt-2">Start by creating contacts, templates, or campaigns</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={`${activity.type}-${activity.id}`}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${getActivityColor(activity.status)}`}></div>
                    <span className="text-gray-900">{activity.description}</span>
                  </div>
                  <span className="text-sm text-gray-500">{getRelativeTime(activity.timestamp)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
