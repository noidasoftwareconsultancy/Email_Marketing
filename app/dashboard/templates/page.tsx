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
import { emailTemplates } from '@/lib/email-templates';
import { templateCategories } from '@/lib/config';
import VariableInserter from '@/components/templates/VariableInserter';
import VariablePreview from '@/components/templates/VariablePreview';
import { replaceVariables, getAvailableVariables } from '@/lib/email-variables';
import {
  PlusIcon,
  DocumentTextIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  SparklesIcon,
  ChartBarIcon,
  BeakerIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';

interface TemplateWithStats extends Template {
  _count?: {
    campaigns: number;
  };
}

interface TemplateStats {
  totalTemplates: number;
  usedTemplates: number;
  unusedTemplates: number;
  recentTemplates: number;
  categories: Array<{ category: string; count: number }>;
  mostUsedTemplates: Array<{
    id: string;
    name: string;
    category: string | null;
    usageCount: number;
  }>;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateWithStats[]>([]);
  const [stats, setStats] = useState<TemplateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'name' | 'usage'>('createdAt');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
  });

  const htmlBody = watch('htmlBody');
  const subject = watch('subject');
  const previewText = watch('previewText');

  useEffect(() => {
    fetchTemplates();
    fetchStats();
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

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/templates/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const searchTemplates = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      params.append('sortBy', sortBy);
      
      const response = await fetch(`/api/templates/search?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      toast.error('Search failed');
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery || selectedCategory !== 'all') {
        searchTemplates();
      } else {
        fetchTemplates();
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedCategory, sortBy]);

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
        fetchStats();
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
        fetchStats();
      } else {
        toast.error('Failed to delete template');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/templates/duplicate/${id}`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Template duplicated!');
        fetchTemplates();
        fetchStats();
      } else {
        toast.error('Failed to duplicate template');
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

  const handlePreview = async (template: Template) => {
    try {
      const response = await fetch('/api/templates/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          htmlBody: template.htmlBody,
          textBody: template.textBody,
          subject: template.subject,
          previewText: template.previewText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPreviewTemplate(template);
        setPreviewData(data);
        setIsPreviewOpen(true);
      }
    } catch (error) {
      toast.error('Failed to generate preview');
    }
  };

  const handleImportFromLibrary = async (key: string) => {
    try {
      const response = await fetch('/api/templates/import-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateKey: key }),
      });

      if (response.ok) {
        toast.success('Template imported!');
        setIsLibraryOpen(false);
        fetchTemplates();
        fetchStats();
      } else {
        toast.error('Failed to import template');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredTemplates = templates.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'usage') return (b._count?.campaigns || 0) - (a._count?.campaigns || 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
            <p className="mt-1 text-gray-600">
              Create and manage high-converting email templates
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsLibraryOpen(true)}
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              Template Library
            </Button>
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
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card padding="sm">
              <p className="text-sm text-gray-600">Total Templates</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalTemplates}</p>
            </Card>
            <Card padding="sm">
              <p className="text-sm text-gray-600">Active Templates</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.usedTemplates}</p>
              <p className="text-xs text-gray-500 mt-1">Used in campaigns</p>
            </Card>
            <Card padding="sm">
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">{stats.categories.length}</p>
            </Card>
            <Card padding="sm">
              <p className="text-sm text-gray-600">Recently Created</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.recentTemplates}</p>
              <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {templateCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="createdAt">Newest First</option>
                <option value="name">Name A-Z</option>
                <option value="usage">Most Used</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Templates Grid */}
        {loading ? (
          <Card>
            <p className="text-center text-gray-500 py-8">Loading templates...</p>
          </Card>
        ) : filteredTemplates.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || selectedCategory !== 'all' ? 'No templates found' : 'No templates yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first email template to get started'}
              </p>
              {!searchQuery && selectedCategory === 'all' && (
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => setIsModalOpen(true)}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create Template
                  </Button>
                  <Button variant="outline" onClick={() => setIsLibraryOpen(true)}>
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Browse Library
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} hover className="flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {template.name}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        {template.category && (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                            {template.category}
                          </span>
                        )}
                        {template._count && template._count.campaigns > 0 && (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                            {template._count.campaigns} campaigns
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {template.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                  )}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-500 mb-1">Subject:</p>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{template.subject}</p>
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
                    onClick={() => handleDuplicate(template.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Duplicate"
                  >
                    <DocumentDuplicateIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(template)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Most Used Templates */}
        {stats && stats.mostUsedTemplates.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2 text-indigo-600" />
              Most Used Templates
            </h3>
            <div className="space-y-3">
              {stats.mostUsedTemplates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{template.name}</p>
                    {template.category && (
                      <p className="text-sm text-gray-600">{template.category}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">{template.usageCount}</p>
                    <p className="text-xs text-gray-500">campaigns</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
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
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Template Name"
              {...register('name')}
              error={errors.name?.message}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                {...register('category')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select category...</option>
                {templateCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <Input
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            helperText="Brief description of this template"
          />
          <Input
            label="Subject Line"
            {...register('subject')}
            error={errors.subject?.message}
            required
            helperText="Keep it between 20-50 characters for best results"
          />
          <Input
            label="Preview Text"
            {...register('previewText')}
            error={errors.previewText?.message}
            helperText="40-130 characters shown in email preview (improves open rates by 30-40%)"
          />
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                HTML Body <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <VariableInserter 
                  onInsert={(variable) => {
                    const textarea = document.querySelector('textarea[name="htmlBody"]') as HTMLTextAreaElement;
                    if (textarea) {
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const text = textarea.value;
                      const newText = text.substring(0, start) + variable + text.substring(end);
                      textarea.value = newText;
                      textarea.focus();
                      textarea.setSelectionRange(start + variable.length, start + variable.length);
                      // Trigger change event
                      const event = new Event('input', { bubbles: true });
                      textarea.dispatchEvent(event);
                    }
                  }}
                />
                {htmlBody && (
                  <VariablePreview content={htmlBody} subject={subject} />
                )}
              </div>
            </div>
            <textarea
              {...register('htmlBody')}
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="<html>...</html>"
            />
            {errors.htmlBody && (
              <p className="mt-1 text-sm text-red-600">{errors.htmlBody.message}</p>
            )}
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-medium text-blue-900 mb-1">Available Variables:</p>
              <div className="flex flex-wrap gap-2">
                {getAvailableVariables().slice(0, 8).map((v) => (
                  <code key={v.key} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {`{{${v.key}}}`}
                  </code>
                ))}
                <span className="text-xs text-blue-600">+ more...</span>
              </div>
            </div>
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
          setPreviewData(null);
        }}
        title="Template Preview with Variables"
        size="xl"
      >
        {previewTemplate && previewData && (
          <div className="space-y-4">
            {/* Variable Information */}
            {previewData.validation && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 flex items-center mb-3">
                  <CodeBracketIcon className="w-5 h-5 mr-2" />
                  Variables Detected
                </h4>
                {previewData.validation.valid ? (
                  <div className="space-y-2">
                    <p className="text-sm text-green-700 flex items-center">
                      <span className="mr-2">✓</span>
                      All variables are valid
                    </p>
                    {previewData.preview && previewData.preview.html && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-blue-900 mb-2">Sample Data Used:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-white p-2 rounded border border-blue-100">
                            <span className="font-medium text-blue-800">Name:</span>{' '}
                            <span className="text-blue-600">John Doe</span>
                          </div>
                          <div className="bg-white p-2 rounded border border-blue-100">
                            <span className="font-medium text-blue-800">Email:</span>{' '}
                            <span className="text-blue-600">john@example.com</span>
                          </div>
                          <div className="bg-white p-2 rounded border border-blue-100">
                            <span className="font-medium text-blue-800">Company:</span>{' '}
                            <span className="text-blue-600">Acme Corp</span>
                          </div>
                          <div className="bg-white p-2 rounded border border-blue-100">
                            <span className="font-medium text-blue-800">Website:</span>{' '}
                            <span className="text-blue-600">example.com</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-yellow-700 flex items-center">
                      <span className="mr-2">⚠</span>
                      Unknown variables detected
                    </p>
                    {previewData.validation.missingVariables && previewData.validation.missingVariables.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-yellow-900 mb-1">Unknown Variables:</p>
                        <div className="flex flex-wrap gap-1">
                          {previewData.validation.missingVariables.map((v: string) => (
                            <code key={v} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              {`{{${v}}}`}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Performance Score */}
            {previewData.score !== undefined && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <BeakerIcon className="w-5 h-5 mr-2 text-indigo-600" />
                    CRO Performance Score
                  </h4>
                  <span className={`text-3xl font-bold ${getScoreColor(previewData.score)}`}>
                    {previewData.score}/100
                  </span>
                </div>
                {previewData.suggestions && previewData.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Optimization Suggestions:</p>
                    <ul className="space-y-1">
                      {previewData.suggestions.map((suggestion: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="text-indigo-600 mr-2">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Subject Line (with sample data):</p>
              <p className="font-semibold text-gray-900">{previewData.preview?.subject || previewData.subject}</p>
            </div>
            {(previewData.preview?.previewText || previewData.previewText) && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Preview Text:</p>
                <p className="text-gray-900">{previewData.preview?.previewText || previewData.previewText}</p>
              </div>
            )}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-700">Email Preview (with sample contact data)</p>
              </div>
              <div className="p-4 bg-white max-h-96 overflow-auto">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewData.preview?.html || previewData.htmlBody }}
                />
              </div>
            </div>
            
            {/* Plain Text Preview */}
            {previewData.preview?.text && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Plain Text Version</p>
                </div>
                <div className="p-4 bg-white max-h-48 overflow-auto">
                  <pre className="text-sm text-gray-900 whitespace-pre-wrap font-mono">
                    {previewData.preview.text}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Template Library Modal */}
      <Modal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        title="Template Library"
        size="xl"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Choose from our professionally designed templates optimized for conversions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(emailTemplates).map(([key, template]) => (
              <Card key={key} hover>
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{template.name}</h4>
                      <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-xs text-gray-500 mb-1">Subject:</p>
                      <p className="text-sm font-medium text-gray-900">{template.subject}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleImportFromLibrary(key)}
                    className="mt-4 w-full"
                  >
                    Import Template
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
