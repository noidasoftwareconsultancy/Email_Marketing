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
  // New fields
  linkedInUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  twitterHandle: z.string().optional(),
  facebookUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  birthday: z.string().optional(),
  gender: z.string().optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  score: z.number().min(0).max(100).optional(),
  rating: z.number().min(1).max(5).optional(),
  emailVerified: z.boolean().optional(),
  phoneVerified: z.boolean().optional(),
  doNotEmail: z.boolean().optional(),
  doNotCall: z.boolean().optional(),
  listId: z.string().optional(),
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
      linkedInUrl: contact.linkedInUrl || '',
      twitterHandle: contact.twitterHandle || '',
      facebookUrl: contact.facebookUrl || '',
      birthday: contact.birthday ? new Date(contact.birthday).toISOString().split('T')[0] : '',
      gender: contact.gender || '',
      language: contact.language || 'en',
      timezone: contact.timezone || '',
      score: contact.score || 0,
      rating: contact.rating || undefined,
      emailVerified: contact.emailVerified || false,
      phoneVerified: contact.phoneVerified || false,
      doNotEmail: contact.doNotEmail || false,
      doNotCall: contact.doNotCall || false,
      listId: contact.listId || '',
    } : {
      language: 'en',
      score: 0,
      emailVerified: false,
      phoneVerified: false,
      doNotEmail: false,
      doNotCall: false,
    },
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

      {/* Social Media */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
        <div className="space-y-4">
          <Input
            label="LinkedIn URL"
            type="url"
            {...register('linkedInUrl')}
            error={errors.linkedInUrl?.message}
            placeholder="https://linkedin.com/in/username"
          />
          <Input
            label="Twitter Handle"
            {...register('twitterHandle')}
            error={errors.twitterHandle?.message}
            placeholder="@username"
          />
          <Input
            label="Facebook URL"
            type="url"
            {...register('facebookUrl')}
            error={errors.facebookUrl?.message}
            placeholder="https://facebook.com/username"
          />
        </div>
      </div>

      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="space-y-4">
          <Input
            label="Birthday"
            type="date"
            {...register('birthday')}
            error={errors.birthday?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                {...register('gender')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select gender...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                {...register('language')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
          </div>
          <Input
            label="Timezone"
            {...register('timezone')}
            error={errors.timezone?.message}
            placeholder="America/New_York"
            helperText="IANA timezone identifier"
          />
        </div>
      </div>

      {/* Lead Scoring & Rating */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Scoring & Rating</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Lead Score (0-100)"
              type="number"
              min="0"
              max="100"
              {...register('score', { valueAsNumber: true })}
              error={errors.score?.message}
              placeholder="0"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (1-5 stars)
              </label>
              <select
                {...register('rating', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">No rating</option>
                <option value="1">⭐ 1 Star</option>
                <option value="2">⭐⭐ 2 Stars</option>
                <option value="3">⭐⭐⭐ 3 Stars</option>
                <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences & Verification */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences & Verification</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('emailVerified')}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Email Verified</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('phoneVerified')}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Phone Verified</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('doNotEmail')}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">Do Not Email</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('doNotCall')}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">Do Not Call</span>
          </label>
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
