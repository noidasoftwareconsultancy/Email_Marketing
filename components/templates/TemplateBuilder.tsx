'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Template } from '@/lib/types';
import { templateVariables, templateCategories } from '@/lib/config';
import { CodeBracketIcon, EyeIcon } from '@heroicons/react/24/outline';

const templateFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  previewText: z.string().optional(),
  htmlBody: z.string().min(1, 'HTML body is required'),
  textBody: z.string().optional(),
});

type TemplateFormData = z.infer<typeof templateFormSchema>;

interface TemplateBuilderProps {
  template?: Template | null;
  onSubmit: (data: TemplateFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TemplateBuilder({ template, onSubmit, onCancel, isSubmitting }: TemplateBuilderProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'html' | 'text'>('html');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: template ? {
      name: template.name,
      description: template.description || '',
      category: template.category || '',
      subject: template.subject,
      previewText: template.previewText || '',
      htmlBody: template.htmlBody,
      textBody: template.textBody || '',
    } : {},
  });

  const htmlBody = watch('htmlBody');
  const subject = watch('subject');
  const previewText = watch('previewText');

  const insertVariable = (variable: string, field: 'subject' | 'htmlBody' | 'textBody') => {
    const currentValue = watch(field) || '';
    setValue(field, currentValue + variable);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Template Info */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Template Name"
          {...register('name')}
          error={errors.name?.message}
          required
          placeholder="My Email Template"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            {...register('category')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select category...</option>
            {templateCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input
        label="Description"
        {...register('description')}
        placeholder="Brief description of this template"
      />

      {/* Subject Line */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Subject Line <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-1">
            {templateVariables.contact.slice(0, 3).map((variable) => (
              <button
                key={variable}
                type="button"
                onClick={() => insertVariable(variable, 'subject')}
                className="px-2 py-1 text-xs bg-primary-50 text-primary-700 rounded hover:bg-primary-100 transition-colors"
              >
                {variable}
              </button>
            ))}
          </div>
        </div>
        <Input
          {...register('subject')}
          error={errors.subject?.message}
          placeholder="Welcome to {{company_name}}!"
        />
      </div>

      <Input
        label="Preview Text"
        {...register('previewText')}
        placeholder="Text shown in email preview"
        helperText="This appears in the inbox preview"
      />

      {/* Variable Reference */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Available Variables</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-blue-800 mb-1">Contact:</p>
            <div className="space-y-1">
              {templateVariables.contact.map((v) => (
                <code key={v} className="block text-blue-700">{v}</code>
              ))}
            </div>
          </div>
          <div>
            <p className="font-medium text-blue-800 mb-1">Company:</p>
            <div className="space-y-1">
              {templateVariables.company.map((v) => (
                <code key={v} className="block text-blue-700">{v}</code>
              ))}
            </div>
          </div>
          <div>
            <p className="font-medium text-blue-800 mb-1">Campaign:</p>
            <div className="space-y-1">
              {templateVariables.campaign.map((v) => (
                <code key={v} className="block text-blue-700">{v}</code>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Editor Tabs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('html')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'html'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <CodeBracketIcon className="w-4 h-4 inline mr-1" />
              HTML
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'text'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Plain Text
            </button>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            <EyeIcon className="w-4 h-4 mr-1" />
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
        </div>

        {activeTab === 'html' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HTML Body <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('htmlBody')}
              rows={16}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="<html>...</html>"
            />
            {errors.htmlBody && (
              <p className="mt-1 text-sm text-red-600">{errors.htmlBody.message}</p>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plain Text Body
            </label>
            <textarea
              {...register('textBody')}
              rows={16}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Plain text version of your email..."
            />
          </div>
        )}
      </div>

      {/* Preview */}
      {showPreview && htmlBody && (
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <h4 className="font-semibold text-gray-900 mb-3">Preview</h4>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded p-3">
              <p className="text-xs text-gray-500 mb-1">Subject:</p>
              <p className="font-semibold">{subject || 'No subject'}</p>
            </div>
            {previewText && (
              <div className="bg-gray-50 rounded p-3">
                <p className="text-xs text-gray-500 mb-1">Preview Text:</p>
                <p className="text-sm">{previewText}</p>
              </div>
            )}
            <div className="border border-gray-200 rounded p-4 max-h-96 overflow-auto">
              <div dangerouslySetInnerHTML={{ __html: htmlBody }} />
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {template ? 'Update Template' : 'Create Template'}
        </Button>
      </div>
    </form>
  );
}
