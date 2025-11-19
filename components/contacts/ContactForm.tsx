'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Contact } from '@/lib/types';
import { suggestedTags, contactSources } from '@/lib/config';

const contactFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  tags: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  contact?: Contact | null;
  onSubmit: (data: ContactFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ContactForm({ contact, onSubmit, onCancel, isSubmitting }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: contact ? {
      email: contact.email,
      name: contact.name || '',
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      phone: contact.phone || '',
      company: contact.company || '',
      jobTitle: contact.jobTitle || '',
      website: contact.website || '',
      address: contact.address || '',
      city: contact.city || '',
      state: contact.state || '',
      country: contact.country || '',
      zipCode: contact.zipCode || '',
      tags: contact.tags.join(', '),
      source: contact.source || '',
      notes: contact.notes || '',
    } : {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            required
            placeholder="john@example.com"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              {...register('firstName')}
              error={errors.firstName?.message}
              placeholder="John"
            />
            <Input
              label="Last Name"
              {...register('lastName')}
              error={errors.lastName?.message}
              placeholder="Doe"
            />
          </div>
          <Input
            label="Full Name"
            {...register('name')}
            error={errors.name?.message}
            placeholder="John Doe"
            helperText="If different from First + Last name"
          />
          <Input
            label="Phone"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      {/* Company Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
        <div className="space-y-4">
          <Input
            label="Company"
            {...register('company')}
            error={errors.company?.message}
            placeholder="Acme Inc."
          />
          <Input
            label="Job Title"
            {...register('jobTitle')}
            error={errors.jobTitle?.message}
            placeholder="Marketing Manager"
          />
          <Input
            label="Website"
            type="url"
            {...register('website')}
            error={errors.website?.message}
            placeholder="https://example.com"
          />
        </div>
      </div>

      {/* Address Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
        <div className="space-y-4">
          <Input
            label="Street Address"
            {...register('address')}
            error={errors.address?.message}
            placeholder="123 Main St"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              {...register('city')}
              error={errors.city?.message}
              placeholder="San Francisco"
            />
            <Input
              label="State/Province"
              {...register('state')}
              error={errors.state?.message}
              placeholder="CA"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Country"
              {...register('country')}
              error={errors.country?.message}
              placeholder="United States"
            />
            <Input
              label="ZIP/Postal Code"
              {...register('zipCode')}
              error={errors.zipCode?.message}
              placeholder="94102"
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <Input
              {...register('tags')}
              placeholder="customer, vip, newsletter"
              helperText="Comma-separated tags"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500">Suggestions:</span>
              {suggestedTags.slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  onClick={(e) => {
                    const input = e.currentTarget.form?.querySelector('input[name="tags"]') as HTMLInputElement;
                    if (input) {
                      const current = input.value;
                      input.value = current ? `${current}, ${tag}` : tag;
                    }
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <select
              {...register('source')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select source...</option>
              {contactSources.map((source) => (
                <option key={source} value={source}>
                  {source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Additional notes about this contact..."
            />
          </div>
        </div>
      </div>

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
          {contact ? 'Update Contact' : 'Add Contact'}
        </Button>
      </div>
    </form>
  );
}
