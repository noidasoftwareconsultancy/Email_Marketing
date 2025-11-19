/**
 * Template Variable Replacement Utilities
 * Handles dynamic variable replacement in email templates
 */

import { appConfig } from './config';
import { Contact } from './types';

interface TemplateData {
  contact?: Contact;
  campaign?: {
    name: string;
    id: string;
  };
  customVariables?: Record<string, string>;
}

/**
 * Replace all variables in a template string
 */
export function replaceTemplateVariables(
  template: string,
  data: TemplateData
): string {
  let result = template;

  // Contact variables
  if (data.contact) {
    result = result
      .replace(/\{\{name\}\}/g, data.contact.name || data.contact.email)
      .replace(/\{\{firstName\}\}/g, data.contact.firstName || '')
      .replace(/\{\{lastName\}\}/g, data.contact.lastName || '')
      .replace(/\{\{email\}\}/g, data.contact.email)
      .replace(/\{\{phone\}\}/g, data.contact.phone || '')
      .replace(/\{\{company\}\}/g, data.contact.company || '')
      .replace(/\{\{jobTitle\}\}/g, data.contact.jobTitle || '')
      .replace(/\{\{website\}\}/g, data.contact.website || '')
      .replace(/\{\{address\}\}/g, data.contact.address || '')
      .replace(/\{\{city\}\}/g, data.contact.city || '')
      .replace(/\{\{state\}\}/g, data.contact.state || '')
      .replace(/\{\{country\}\}/g, data.contact.country || '')
      .replace(/\{\{zipCode\}\}/g, data.contact.zipCode || '');
  }

  // Company variables
  result = result
    .replace(/\{\{company_name\}\}/g, appConfig.company.name)
    .replace(/\{\{company_email\}\}/g, appConfig.company.email)
    .replace(/\{\{company_website\}\}/g, appConfig.company.website)
    .replace(/\{\{company_address\}\}/g, appConfig.company.address)
    .replace(/\{\{company_phone\}\}/g, appConfig.company.phone);

  // Campaign variables
  if (data.campaign) {
    result = result
      .replace(/\{\{campaign_name\}\}/g, data.campaign.name)
      .replace(/\{\{unsubscribe_url\}\}/g, 
        `${appConfig.email.unsubscribeUrl}?email=${data.contact?.email || ''}&campaign=${data.campaign.id}`
      );
  } else {
    result = result
      .replace(/\{\{unsubscribe_url\}\}/g, appConfig.email.unsubscribeUrl);
  }

  // Date variables
  const now = new Date();
  result = result
    .replace(/\{\{current_date\}\}/g, now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }))
    .replace(/\{\{current_year\}\}/g, now.getFullYear().toString())
    .replace(/\{\{current_month\}\}/g, now.toLocaleDateString('en-US', { month: 'long' }));

  // Custom variables
  if (data.customVariables) {
    Object.entries(data.customVariables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, value);
    });
  }

  return result;
}

/**
 * Get list of all variables used in a template
 */
export function extractTemplateVariables(template: string): string[] {
  const regex = /\{\{([^}]+)\}\}/g;
  const variables: string[] = [];
  let match;

  while ((match = regex.exec(template)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }

  return variables;
}

/**
 * Validate that all required variables are available
 */
export function validateTemplateVariables(
  template: string,
  data: TemplateData
): { valid: boolean; missingVariables: string[] } {
  const usedVariables = extractTemplateVariables(template);
  const missingVariables: string[] = [];

  const availableVariables = new Set([
    'company_name',
    'company_email',
    'company_website',
    'company_address',
    'company_phone',
    'unsubscribe_url',
    'current_date',
    'current_year',
    'current_month',
  ]);

  if (data.contact) {
    availableVariables.add('name');
    availableVariables.add('firstName');
    availableVariables.add('lastName');
    availableVariables.add('email');
    availableVariables.add('phone');
    availableVariables.add('company');
    availableVariables.add('jobTitle');
    availableVariables.add('website');
    availableVariables.add('address');
    availableVariables.add('city');
    availableVariables.add('state');
    availableVariables.add('country');
    availableVariables.add('zipCode');
  }

  if (data.campaign) {
    availableVariables.add('campaign_name');
  }

  if (data.customVariables) {
    Object.keys(data.customVariables).forEach((key) => {
      availableVariables.add(key);
    });
  }

  usedVariables.forEach((variable) => {
    if (!availableVariables.has(variable)) {
      missingVariables.push(variable);
    }
  });

  return {
    valid: missingVariables.length === 0,
    missingVariables,
  };
}

/**
 * Preview template with sample data
 */
export function previewTemplate(template: string): string {
  const sampleContact: Contact = {
    id: 'sample',
    email: 'john.doe@example.com',
    name: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1 (555) 123-4567',
    company: 'Acme Inc.',
    jobTitle: 'Marketing Manager',
    website: 'https://example.com',
    address: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    country: 'United States',
    zipCode: '94102',
    tags: ['customer', 'vip'],
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return replaceTemplateVariables(template, {
    contact: sampleContact,
    campaign: {
      name: 'Sample Campaign',
      id: 'sample-campaign',
    },
  });
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  // Basic sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
}

/**
 * Validate template HTML for common issues
 */
export function validateTemplateHtml(html: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for basic HTML structure
  if (!html.includes('<html') && !html.includes('<body')) {
    errors.push('Template should include basic HTML structure');
  }
  
  // Check for unclosed tags (basic check)
  const openTags = html.match(/<(\w+)[^>]*>/g) || [];
  const closeTags = html.match(/<\/(\w+)>/g) || [];
  
  if (openTags.length !== closeTags.length) {
    errors.push('Possible unclosed HTML tags detected');
  }
  
  // Check for inline styles (recommended for email)
  if (html.includes('<style>') && !html.includes('style=')) {
    errors.push('Consider using inline styles for better email client compatibility');
  }
  
  // Check for responsive meta tag
  if (!html.includes('viewport')) {
    errors.push('Missing viewport meta tag for mobile responsiveness');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate plain text version from HTML
 */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculate template performance score based on CRO best practices
 */
export function calculateTemplateScore(template: {
  subject: string;
  previewText?: string;
  htmlBody: string;
}): { score: number; suggestions: string[] } {
  let score = 100;
  const suggestions: string[] = [];
  
  // Subject line checks (optimal: 20-50 characters)
  if (template.subject.length < 20) {
    score -= 10;
    suggestions.push('Subject line is too short (recommended: 20-50 characters)');
  } else if (template.subject.length > 50) {
    score -= 10;
    suggestions.push('Subject line is too long (recommended: 20-50 characters)');
  }
  
  // Preview text (critical for open rates)
  if (!template.previewText) {
    score -= 15;
    suggestions.push('Add preview text to improve open rates by 30-40%');
  } else if (template.previewText.length < 40) {
    score -= 5;
    suggestions.push('Preview text should be 40-130 characters for optimal display');
  }
  
  // HTML size (affects deliverability)
  const htmlSize = new Blob([template.htmlBody]).size;
  if (htmlSize > 102400) { // 100KB
    score -= 20;
    suggestions.push('HTML is too large (recommended: under 100KB for better deliverability)');
  }
  
  // Personalization (increases engagement)
  const hasPersonalization = template.htmlBody.includes('{{') || template.subject.includes('{{');
  if (!hasPersonalization) {
    score -= 15;
    suggestions.push('Add personalization variables to improve engagement by 26%');
  }
  
  // Call to action
  const hasButton = template.htmlBody.toLowerCase().includes('button') || 
                    template.htmlBody.toLowerCase().includes('<a ');
  if (!hasButton) {
    score -= 10;
    suggestions.push('Include a clear call-to-action button to improve click rates');
  }
  
  // Mobile responsiveness
  const hasMobileOptimization = template.htmlBody.includes('viewport') || 
                                 template.htmlBody.includes('max-width');
  if (!hasMobileOptimization) {
    score -= 10;
    suggestions.push('Add mobile-responsive design (60%+ of emails are opened on mobile)');
  }
  
  // Alt text for images
  const hasImages = template.htmlBody.includes('<img');
  const hasAltText = template.htmlBody.includes('alt=');
  if (hasImages && !hasAltText) {
    score -= 5;
    suggestions.push('Add alt text to images for accessibility and better rendering');
  }
  
  return { score: Math.max(0, score), suggestions };
}

/**
 * Analyze template for A/B testing opportunities
 */
export function suggestABTestVariations(template: {
  subject: string;
  htmlBody: string;
}): string[] {
  const suggestions: string[] = [];
  
  // Subject line variations
  if (!template.subject.includes('?') && !template.subject.includes('!')) {
    suggestions.push('Test subject line with question or exclamation mark');
  }
  
  if (!template.subject.includes('emoji')) {
    suggestions.push('Test subject line with emoji for higher open rates');
  }
  
  // CTA variations
  const ctaCount = (template.htmlBody.match(/<a /gi) || []).length;
  if (ctaCount === 1) {
    suggestions.push('Test multiple CTA placements (above fold vs. below fold)');
  }
  
  // Content length
  const wordCount = template.htmlBody.split(/\s+/).length;
  if (wordCount > 500) {
    suggestions.push('Test shorter version (concise vs. detailed content)');
  }
  
  return suggestions;
}
