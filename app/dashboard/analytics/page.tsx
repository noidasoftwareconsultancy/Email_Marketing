'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import {
  ChartBarIcon,
  EnvelopeOpenIcon,
  CursorArrowRaysIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface DashboardStats {
  totalContacts: number;
  activeContacts: number;
  totalCampaigns: number;
  activeCampaigns: number;
  totalEmailsSent: number;
  totalTemplates: number;
  totalContactLists: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  recentContactsCount: number;
  recentCampaignsCount: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        toast.error('Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

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
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats?.totalEmailsSent.toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-gray-500">All time</p>
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
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats?.openRate.toFixed(1)}%
                </p>
                <p className="mt-2 text-sm text-gray-500">Average</p>
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
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats?.clickRate.toFixed(1)}%
                </p>
                <p className="mt-2 text-sm text-gray-500">Average</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <CursorArrowRaysIcon className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats?.bounceRate.toFixed(1)}%
                </p>
                <p className="mt-2 text-sm text-gray-500">Average</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Contacts</p>
                <p className="text-xl font-bold text-gray-900">{stats?.activeContacts.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          
           <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <EnvelopeIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-xl font-bold text-gray-900">{stats?.activeCampaigns}</p>
              </div>
            </div>
          </Card>

           <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-100 rounded-full">
                <ChartBarIcon className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Campaigns</p>
                <p className="text-xl font-bold text-gray-900">{stats?.totalCampaigns}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
