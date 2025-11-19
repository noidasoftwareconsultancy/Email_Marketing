'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Template } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { templateSchema, TemplateFormData } from '@/lib/validations';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  DocumentTextIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      toast.error('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TemplateFormData) => {
    try {
      const url = editingTemplate ? `/api/templates/${editingTemplate.id}` : '/api/templates';
      const method = editingTemplate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(editingTemplate ? 'Template updated!' : 'Template created!');
        setIsModalOpen(false);
        reset();
        setEditingTemplate(null);
        fetchTemplates();
      } else {
        toast.error('Failed to save template');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Template deleted');
        fetchTemplates();
      } else {
        toast.error('Failed to delete template');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    reset({
      name: template.name,
      description: template.description || '',
      subject: template.subject,
      previewText: template.previewText || '',
      htmlBody: template.htmlBody,
      textBody: template.textBody || '',
      category: template.category || '',
    });
    setIsModalOpen(true);
  };

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
            <p className="mt-1 text-gray-600">
              Create and manage reusable email templates
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingTemplate(null);
              reset({});
              setIsModalOpen(true);
            }}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card padding="sm">
            <p className="text-sm text-gray-600">Total Templates</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{templates.length}</p>
          </Card>
          <Card padding="sm">
            <p className="text-sm text-gray-600">Categories</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {new Set(templates.map((t) => t.category).filter(Boolean)).size}
            </p>
          </Card>
          <Card padding="sm">
            <p className="text-sm text-gray-600">Recently Updated</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {templates.filter((t) => {
                const daysSince = Math.floor(
                  (Date.now() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                );
                return daysSince <= 7;
              }).length}
            </p>
          </Card>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <Card>
            <p className="text-center text-gray-500 py-8">Loading templates...</p>
          </Card>
        ) : templates.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No templates yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first email template to get started
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Template
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} hover className="flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {template.name}
                      </h3>
                      {template.category && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                          {template.category}
                        </span>
                      )}
                    </div>
                  </div>
                  {template.description && (
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  )}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-500 mb-1">Subject:</p>
                    <p className="text-sm font-medium text-gray-900">{template.subject}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Created {new Date(template.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePreview(template)}
                    className="flex-1"
                  >
                    <EyeIcon className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <button
                    onClick={() => handleEdit(template)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Template Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTemplate(null);
          reset({});
        }}
        title={editingTemplate ? 'Edit Template' : 'Create New Template'}
        size="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Template Name"
            {...register('name')}
            error={errors.name?.message}
            required
          />
          <Input
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            helperText="Brief description of this template"
          />
          <Input
            label="Category"
            {...register('category')}
            error={errors.category?.message}
            helperText="e.g., Newsletter, Welcome, Promotional"
          />
          <Input
            label="Subject Line"
            {...register('subject')}
            error={errors.subject?.message}
            required
          />
          <Input
            label="Preview Text"
            {...register('previewText')}
            error={errors.previewText?.message}
            helperText="Text shown in email preview"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HTML Body <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('htmlBody')}
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="<html>...</html>"
            />
            {errors.htmlBody && (
              <p className="mt-1 text-sm text-red-600">{errors.htmlBody.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plain Text Body (Optional)
            </label>
            <textarea
              {...register('textBody')}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Plain text version..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingTemplate(null);
                reset({});
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingTemplate ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewTemplate(null);
        }}
        title="Template Preview"
        size="xl"
      >
        {previewTemplate && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Subject:</p>
              <p className="font-semibold text-gray-900">{previewTemplate.subject}</p>
            </div>
            {previewTemplate.previewText && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Preview Text:</p>
                <p className="text-gray-900">{previewTemplate.previewText}</p>
              </div>
            )}
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <p className="text-sm text-gray-600 mb-2">HTML Preview:</p>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: previewTemplate.htmlBody }}
              />
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
