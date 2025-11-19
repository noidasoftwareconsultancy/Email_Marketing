'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface CampaignRun {
  id: string;
  runNumber: number;
  status: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  totalRecipients: number;
  totalSent: number;
  totalFailed: number;
  totalOpened: number;
  totalClicked: number;
  createdAt: string;
  metrics: {
    opened: number;
    clicked: number;
    bounced: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
  };
}

export default function CampaignRunsPage() {
  const params = useParams();
  const router = useRouter();
  const [runs, setRuns] = useState<CampaignRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [campaignName, setCampaignName] = useState('');

  useEffect(() => {
    fetchRuns();
    fetchCampaign();
  }, [params.id]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCampaignName(data.name);
      }
    } catch (error) {
      console.error('Failed to fetch campaign:', error);
    }
  };

  const fetchRuns = async () => {
    try {
      const response = await fetch(`/api/campaigns/${params.id}/runs`);
      if (response.ok) {
        const data = await response.json();
        setRuns(data);
      } else {
        toast.error('Failed to fetch campaign runs');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'SENDING':
        return 'bg-blue-100 text-blue-700';
      case 'FAILED':
        return 'bg-red-100 text-red-700';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'FAILED':
        return <XCircleIcon className="w-5 h-5" />;
      default:
        return <ClockIcon className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Card>
          <p className="text-center text-gray-500 py-8">Loading campaign runs...</p>
        </Card>
      </DashboardLayout>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-900">{campaignName}</h1>
            <p className="mt-1 text-gray-600">Campaign Run History</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card padding="sm">
            <p className="text-sm text-gray-600">Total Runs</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{runs.length}</p>
          </Card>
          <Card padding="sm">
            <p className="text-sm text-gray-600">Total Sent</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {runs.reduce((sum, run) => sum + run.totalSent, 0)}
            </p>
          </Card>
          <Card padding="sm">
            <p className="text-sm text-gray-600">Total Opened</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {runs.reduce((sum, run) => sum + run.metrics.opened, 0)}
            </p>
          </Card>
          <Card padding="sm">
            <p className="text-sm text-gray-600">Avg Open Rate</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {runs.length > 0
                ? (
                    runs.reduce((sum, run) => sum + run.metrics.openRate, 0) / runs.length
                  ).toFixed(1)
                : 0}
              %
            </p>
          </Card>
        </div>

        {/* Runs List */}
        {runs.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No runs yet</h3>
              <p className="text-gray-600">This campaign hasn't been sent yet</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {runs.map((run) => (
              <Card key={run.id} hover>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Run #{run.runNumber}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          run.status
                        )}`}
                      >
                        {getStatusIcon(run.status)}
                        {run.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-500">Started</p>
                        <p className="font-semibold text-gray-900">
                          {run.startedAt
                            ? new Date(run.startedAt).toLocaleString()
                            : 'Not started'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Completed</p>
                        <p className="font-semibold text-gray-900">
                          {run.completedAt
                            ? new Date(run.completedAt).toLocaleString()
                            : 'In progress'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Duration</p>
                        <p className="font-semibold text-gray-900">
                          {run.startedAt && run.completedAt
                            ? `${Math.round(
                                (new Date(run.completedAt).getTime() -
                                  new Date(run.startedAt).getTime()) /
                                  1000 /
                                  60
                              )} min`
                            : '-'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Recipients</p>
                        <p className="font-semibold text-gray-900">{run.totalRecipients}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Sent</p>
                        <p className="font-semibold text-green-600">{run.totalSent}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Failed</p>
                        <p className="font-semibold text-red-600">{run.totalFailed}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Opened</p>
                        <p className="font-semibold text-blue-600">{run.metrics.opened}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Clicked</p>
                        <p className="font-semibold text-purple-600">{run.metrics.clicked}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Open Rate</p>
                          <p className="font-semibold text-blue-600">
                            {run.metrics.openRate.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Click Rate</p>
                          <p className="font-semibold text-purple-600">
                            {run.metrics.clickRate.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Bounce Rate</p>
                          <p className="font-semibold text-red-600">
                            {run.metrics.bounceRate.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/dashboard/campaigns/${params.id}/analytics?run=${run.id}`}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="View Run Analytics"
                    >
                      <ChartBarIcon className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
