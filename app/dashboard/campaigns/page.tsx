'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Campaign, Template } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { campaignSchema, CampaignFormData } from '@/lib/validations';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  PaperAirplaneIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

export default function CampaignsPage() {
  const [campaigns, setcampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sendingCampaign, setSendingCampaign] = useState<string | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [gmailConnected, setGmailConnected] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
  });

  useEffect(() => {
    fetchCampaigns();
    fetchTemplates();
    checkGmailConnection();
  }, []);

  const checkGmailConnection = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const user = await response.json();
        const hasCredentials = user.googleTokens?.email && user.googleTokens?.password;
        setGmailConnected(hasCredentials);
      }
    } catch (error) {
      console.error('Failed to check Gmail connection:', error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns');
      if (response.ok) {
        const data = await response.json();
        setcampaigns(data);
      }
    } catch (error) {
      toast.error('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Failed to fetch templates');
    }
  };

  const onSubmit = async (data: CampaignFormData) => {
    try {
      const url = editingCampaign ? `/api/campaigns/${editingCampaign.id}` : '/api/campaigns';
      const method = editingCampaign ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(editingCampaign ? 'Campaign updated!' : 'Campaign created!');
        setIsModalOpen(false);
        reset();
        setEditingCampaign(null);
        fetchCampaigns();
      } else {
        toast.error('Failed to save campaign');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to send this campaign?')) return;

    setSendingCampaign(campaignId);
    try {
      const response = await fetch('/api/campaigns/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Campaign sent! ${data.sent} emails delivered.`);
        fetchCampaigns();
      } else {
        toast.error('Failed to send campaign');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setSendingCampaign(null);
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    reset({
      name: campaign.name,
      description: campaign.description || '',
      templateId: campaign.templateId,
      targetTags: campaign.targetTags.join(', ') as any,
      scheduledAt: campaign.scheduledAt ? new Date(campaign.scheduledAt).toISOString().slice(0, 16) : '' as any,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Campaign deleted');
        fetchCampaigns();
      } else {
        toast.error('Failed to delete campaign');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'SENDING':
        return 'bg-blue-100 text-blue-700';
      case 'SCHEDULED':
        return 'bg-purple-100 text-purple-700';
      case 'FAILED':
        return 'bg-red-100 text-red-700';
      case 'PAUSED':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'SENDING':
        return <PaperAirplaneIcon className="w-5 h-5" />;
      case 'SCHEDULED':
        return <ClockIcon className="w-5 h-5" />;
      case 'FAILED':
        return <XCircleIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Gmail Connection Warning */}
        {!gmailConnected && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-yellow-700">
                  <strong>Gmail not connected.</strong> You need to connect your Gmail account before sending campaigns.
                </p>
                <p className="mt-2">
                  <a
                    href="/dashboard/settings"
                    className="text-sm font-medium text-yellow-700 underline hover:text-yellow-600"
                  >
                    Go to Settings to connect Gmail →
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
            <p className="mt-1 text-gray-600">
              Create and manage your email campaigns
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingCampaign(null);
              reset({});
              setIsModalOpen(true);
            }}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Campaign
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card padding="sm">
            <p className="text-sm text-gray-600">Total Campaigns</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{campaigns.length}</p>
          </Card>
          <Card padding="sm">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {campaigns.filter((c) => c.status === 'COMPLETED').length}
            </p>
          </Card>
          <Card padding="sm">
            <p className="text-sm text-gray-600">Scheduled</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {campaigns.filter((c) => c.status === 'SCHEDULED').length}
            </p>
          </Card>
          <Card padding="sm">
            <p className="text-sm text-gray-600">Draft</p>
            <p className="text-2xl font-bold text-gray-600 mt-1">
              {campaigns.filter((c) => c.status === 'DRAFT').length}
            </p>
          </Card>
        </div>

        {/* Campaigns List */}
        {loading ? (
          <Card>
            <p className="text-center text-gray-500 py-8">Loading campaigns...</p>
          </Card>
        ) : campaigns.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <PaperAirplaneIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No campaigns yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first campaign to start sending emails
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Campaign
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} hover>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {campaign.name}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          campaign.status
                        )}`}
                      >
                        {getStatusIcon(campaign.status)}
                        {campaign.status}
                      </span>
                    </div>
                    {campaign.description && (
                      <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Recipients</p>
                        <p className="font-semibold text-gray-900">
                          {campaign.totalRecipients}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Sent</p>
                        <p className="font-semibold text-green-600">{campaign.totalSent}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Opened</p>
                        <p className="font-semibold text-blue-600">{campaign.totalOpened}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Clicked</p>
                        <p className="font-semibold text-purple-600">
                          {campaign.totalClicked}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {campaign.status === 'DRAFT' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleSendCampaign(campaign.id)}
                          isLoading={sendingCampaign === campaign.id}
                        >
                          <PaperAirplaneIcon className="w-4 h-4 mr-1" />
                          Send Now
                        </Button>
                        <button
                          onClick={() => handleEdit(campaign)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <Button size="sm" variant="outline">
                      <ChartBarIcon className="w-4 h-4 mr-1" />
                      View Stats
                    </Button>
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCampaign(null);
          reset({});
        }}
        title={editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Campaign Name"
            {...register('name')}
            error={errors.name?.message}
            required
          />
          <Input
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            helperText="Brief description of this campaign"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Template <span className="text-red-500">*</span>
            </label>
            <select
              {...register('templateId')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Choose a template...</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            {errors.templateId && (
              <p className="mt-1 text-sm text-red-600">{errors.templateId.message}</p>
            )}
          </div>
          <Input
            label="Target Tags (comma separated)"
            {...register('targetTags')}
            helperText="Leave empty to send to all contacts"
          />
          <Input
            label="Schedule Date & Time (Optional)"
            type="datetime-local"
            {...register('scheduledAt')}
            helperText="Leave empty to save as draft"
          />
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Campaign will be saved as draft. You can send it later
              from the campaigns list.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingCampaign(null);
                reset({});
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
