/**
 * Application Configuration
 * Centralized configuration for branding, limits, and settings
 */

export const appConfig = {
  // Company Information
  company: {
    name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Your Company',
    email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'hello@yourcompany.com',
    website: process.env.NEXT_PUBLIC_COMPANY_WEBSITE || 'https://yourcompany.com',
    address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || '123 Business St, City, State 12345',
    phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+1 (555) 123-4567',
    logo: process.env.NEXT_PUBLIC_COMPANY_LOGO || '/logo.png',
  },

  // Email Settings
  email: {
    defaultFromName: process.env.NEXT_PUBLIC_FROM_NAME || 'Your Company',
    replyTo: process.env.NEXT_PUBLIC_REPLY_TO_EMAIL || 'noreply@yourcompany.com',
    
    // Gmail Limits
    limits: {
      freeAccount: {
        dailyQuota: 500,
        batchSize: 50,
        delayBetweenEmails: 1000, // milliseconds
      },
      workspace: {
        dailyQuota: 2000,
        batchSize: 100,
        delayBetweenEmails: 500,
      },
    },

    // Unsubscribe URL
    unsubscribeUrl: process.env.NEXT_PUBLIC_UNSUBSCRIBE_URL || 'https://yourcompany.com/unsubscribe',
  },

  // Feature Flags
  features: {
    enableAnalytics: true,
    enableScheduling: true,
    enableABTesting: false,
    enableAutomation: false,
    enableContactLists: true,
    enableCustomFields: true,
  },

  // UI Settings
  ui: {
    itemsPerPage: 20,
    maxTagsDisplay: 5,
    dateFormat: 'MMM dd, yyyy',
    timeFormat: 'HH:mm',
  },

  // Validation Rules
  validation: {
    maxContactsPerImport: 10000,
    maxTemplateSize: 500000, // bytes
    maxCampaignRecipients: 10000,
    allowedFileTypes: ['.csv', '.txt'],
  },

  // Social Links (optional)
  social: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL,
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL,
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL,
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  },
};

// Template Variables
export const templateVariables = {
  contact: [
    '{{name}}',
    '{{firstName}}',
    '{{lastName}}',
    '{{email}}',
    '{{phone}}',
    '{{company}}',
    '{{jobTitle}}',
  ],
  company: [
    '{{company_name}}',
    '{{company_email}}',
    '{{company_website}}',
    '{{company_address}}',
    '{{company_phone}}',
  ],
  campaign: [
    '{{unsubscribe_url}}',
    '{{campaign_name}}',
    '{{current_date}}',
    '{{current_year}}',
  ],
};

// Email Template Categories
export const templateCategories = [
  'Welcome',
  'Newsletter',
  'Promotional',
  'Announcement',
  'Event',
  'Follow-up',
  'Survey',
  'Transactional',
  'Seasonal',
  'Other',
];

// Contact Tags (predefined suggestions)
export const suggestedTags = [
  'customer',
  'lead',
  'prospect',
  'vip',
  'newsletter',
  'webinar',
  'event',
  'trial',
  'premium',
  'free',
  'active',
  'inactive',
  'engaged',
];

// Contact Sources
export const contactSources = [
  'website',
  'csv_import',
  'manual',
  'api',
  'landing_page',
  'webinar',
  'event',
  'referral',
  'social_media',
  'other',
];

export default appConfig;
