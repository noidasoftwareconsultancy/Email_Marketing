import { z } from 'zod';

export const contactSchema = z.object({
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
  tags: z.union([z.array(z.string()), z.string()]).optional().transform(val => {
    if (!val) return [];
    if (typeof val === 'string') return val.split(',').map(t => t.trim()).filter(Boolean);
    return val;
  }),
  source: z.string().optional(),
  notes: z.string().optional(),
});

export const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  previewText: z.string().optional(),
  htmlBody: z.string().min(1, 'Email body is required'),
  textBody: z.string().optional(),
  category: z.string().optional(),
});

export const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  description: z.string().optional(),
  templateId: z.string().min(1, 'Template is required'),
  targetTags: z.union([z.array(z.string()), z.string()]).optional().transform(val => {
    if (!val) return [];
    if (typeof val === 'string') return val.split(',').map(t => t.trim()).filter(Boolean);
    return val;
  }),
  scheduledAt: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type TemplateFormData = z.infer<typeof templateSchema>;
export type CampaignFormData = z.infer<typeof campaignSchema>;
