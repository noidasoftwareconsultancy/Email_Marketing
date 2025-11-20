/**
 * Email Variable Management System
 * Handles variable replacement in email templates with contact data and assets
 */

import { Contact } from '@prisma/client';

export interface EmailVariables {
  // Contact variables
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  jobTitle?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  
  // Campaign variables
  cta_url?: string;
  unsubscribe_url?: string;
  
  // Brand assets
  logo_url?: string;
  logo_black_url?: string;
  logo_white_url?: string;
  favicon_black_url?: string;
  favicon_white_url?: string;
  
  // Custom variables from contact.customData
  [key: string]: any;
}

/**
 * Get base URL for assets (works in both development and production)
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Server-side: use environment variable or default
  return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
}

/**
 * Get logo URLs for email templates
 * Uses absolute URLs for email compatibility
 */
export function getLogoUrls() {
  const baseUrl = getBaseUrl();
  
  // Option 1: Use environment variable for CDN/hosted logos (recommended for production)
  const cdnUrl = process.env.NEXT_PUBLIC_LOGO_CDN_URL;
  
  if (cdnUrl) {
    return {
      logo_url: `${cdnUrl}/logo-black.png`,
      logo_black_url: `${cdnUrl}/logo-black.png`,
      logo_white_url: `${cdnUrl}/logo-white.svg`,
      favicon_black_url: `${cdnUrl}/favicon-black.png`,
      favicon_white_url: `${cdnUrl}/favicon-white.png`,
    };
  }
  
  // Option 2: Use direct public URLs (works better in email clients)
  // Encode spaces in filenames for URL compatibility
  return {
    logo_url: `${baseUrl}/Logo%20Black.png`,
    logo_black_url: `${baseUrl}/Logo%20Black.png`,
    logo_white_url: `${baseUrl}/Logo%20White.svg`,
    favicon_black_url: `${baseUrl}/Fav%20Icon%20Black%20(1).png`,
    favicon_white_url: `${baseUrl}/Fav%20Icon%20White.png`,
  };
}

/**
 * Extract variables from contact data
 */
export function extractContactVariables(contact: Contact): EmailVariables {
  const variables: EmailVariables = {
    name: contact.name || contact.firstName || 'there',
    firstName: contact.firstName || contact.name?.split(' ')[0] || 'there',
    lastName: contact.lastName || contact.name?.split(' ').slice(1).join(' ') || '',
    email: contact.email,
    company: contact.company || '',
    jobTitle: contact.jobTitle || '',
    phone: contact.phone || '',
    website: contact.website || contact.email?.split('@')[1] || 'your-domain.com',
    address: contact.address || '',
    city: contact.city || '',
    state: contact.state || '',
    country: contact.country || '',
    zipCode: contact.zipCode || '',
  };
  
  // Add custom data if available
  if (contact.customData && typeof contact.customData === 'object') {
    Object.assign(variables, contact.customData);
  }
  
  return variables;
}

/**
 * Generate campaign-specific URLs
 */
export function generateCampaignUrls(
  campaignId: string,
  contactId: string,
  ctaUrl?: string
): Partial<EmailVariables> {
  const baseUrl = getBaseUrl();
  
  return {
    cta_url: ctaUrl || `${baseUrl}/dashboard`,
    unsubscribe_url: `${baseUrl}/api/unsubscribe?campaign=${campaignId}&contact=${contactId}`,
  };
}

/**
 * Replace variables in template content
 * Supports both {{variable}} and {variable} syntax
 */
export function replaceVariables(
  content: string,
  variables: EmailVariables
): string {
  let result = content;
  
  // Replace {{variable}} syntax
  result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = variables[key];
    return value !== undefined && value !== null ? String(value) : match;
  });
  
  // Replace {variable} syntax (less common but supported)
  result = result.replace(/\{(\w+)\}/g, (match, key) => {
    // Skip if it's CSS or already replaced
    if (match.includes(':') || variables[key] === undefined) {
      return match;
    }
    const value = variables[key];
    return value !== undefined && value !== null ? String(value) : match;
  });
  
  return result;
}

/**
 * Prepare complete email content with all variables replaced
 */
export function prepareEmailContent(
  htmlTemplate: string,
  textTemplate: string | null,
  contact: Contact,
  campaignId: string,
  options: {
    ctaUrl?: string;
    additionalVariables?: Record<string, any>;
  } = {}
): { html: string; text: string | null } {
  // Combine all variables
  const variables: EmailVariables = {
    ...extractContactVariables(contact),
    ...getLogoUrls(),
    ...generateCampaignUrls(campaignId, contact.id, options.ctaUrl),
    ...options.additionalVariables,
  };
  
  // Replace variables in both HTML and text versions
  const html = replaceVariables(htmlTemplate, variables);
  const text = textTemplate ? replaceVariables(textTemplate, variables) : null;
  
  return { html, text };
}

/**
 * Get list of available variables for template editor
 */
export function getAvailableVariables(): Array<{
  key: string;
  label: string;
  category: string;
  example: string;
}> {
  return [
    // Contact variables
    { key: 'name', label: 'Full Name', category: 'Contact', example: 'John Doe' },
    { key: 'firstName', label: 'First Name', category: 'Contact', example: 'John' },
    { key: 'lastName', label: 'Last Name', category: 'Contact', example: 'Doe' },
    { key: 'email', label: 'Email', category: 'Contact', example: 'john@example.com' },
    { key: 'company', label: 'Company', category: 'Contact', example: 'Acme Inc' },
    { key: 'jobTitle', label: 'Job Title', category: 'Contact', example: 'CEO' },
    { key: 'phone', label: 'Phone', category: 'Contact', example: '+1234567890' },
    { key: 'website', label: 'Website', category: 'Contact', example: 'example.com' },
    { key: 'city', label: 'City', category: 'Contact', example: 'New York' },
    { key: 'state', label: 'State', category: 'Contact', example: 'NY' },
    { key: 'country', label: 'Country', category: 'Contact', example: 'USA' },
    
    // Campaign variables
    { key: 'cta_url', label: 'CTA URL', category: 'Campaign', example: 'https://example.com/offer' },
    { key: 'unsubscribe_url', label: 'Unsubscribe URL', category: 'Campaign', example: 'https://example.com/unsubscribe' },
    
    // Brand assets
    { key: 'logo_url', label: 'Logo (Default)', category: 'Brand Assets', example: '/Logo Black.png' },
    { key: 'logo_black_url', label: 'Logo (Black)', category: 'Brand Assets', example: '/Logo Black.png' },
    { key: 'logo_white_url', label: 'Logo (White)', category: 'Brand Assets', example: '/Logo White.svg' },
    { key: 'favicon_black_url', label: 'Favicon (Black)', category: 'Brand Assets', example: '/Fav Icon Black (1).png' },
    { key: 'favicon_white_url', label: 'Favicon (White)', category: 'Brand Assets', example: '/Fav Icon White.png' },
  ];
}

/**
 * Validate template for missing required variables
 */
export function validateTemplate(content: string): {
  valid: boolean;
  missingVariables: string[];
  unusedVariables: string[];
} {
  const variablePattern = /\{\{(\w+)\}\}/g;
  const foundVariables = new Set<string>();
  let match;
  
  while ((match = variablePattern.exec(content)) !== null) {
    foundVariables.add(match[1]);
  }
  
  const availableVars = new Set(getAvailableVariables().map(v => v.key));
  const missingVariables: string[] = [];
  const unusedVariables: string[] = [];
  
  foundVariables.forEach(varName => {
    if (!availableVars.has(varName)) {
      missingVariables.push(varName);
    }
  });
  
  return {
    valid: missingVariables.length === 0,
    missingVariables,
    unusedVariables,
  };
}
