/**
 * Test script to verify email template variable replacement
 * Run with: npx ts-node scripts/test-email-template.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Mock Contact type
interface Contact {
  id: string;
  email: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  jobTitle: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipCode: string | null;
  tags: string[];
  customData: any;
  source: string | null;
  notes: string | null;
  status: string;
  listId: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Simple variable replacement function
function replaceVariables(content: string, variables: Record<string, any>): string {
  let result = content;
  
  // Replace {{variable}} syntax
  result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = variables[key];
    return value !== undefined && value !== null ? String(value) : match;
  });
  
  return result;
}

// Test contact
const testContact: Contact = {
  id: 'test-1',
  email: 'anshul@example.com',
  name: 'Anshul',
  firstName: 'Anshul',
  lastName: null,
  company: null,
  jobTitle: null,
  phone: null,
  website: 'https://1clickmovies.online',
  address: null,
  city: null,
  state: null,
  country: null,
  zipCode: null,
  tags: [],
  customData: null,
  source: null,
  notes: null,
  status: 'ACTIVE',
  listId: null,
  userId: 'test-user',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Variables
const variables = {
  firstName: testContact.firstName || 'there',
  name: testContact.name || testContact.firstName || 'there',
  website: testContact.website || testContact.email.split('@')[1] || 'your-domain.com',
  email: testContact.email,
  cta_url: 'https://calendly.com/ewynk/onboarding',
  unsubscribe_url: 'https://example.com/unsubscribe?contact=test-1',
  logo_url: 'http://ewynk.com/api/assets/logo?type=black',
  logo_white_url: 'http://ewynk.com/api/assets/logo?type=white',
  logo_black_url: 'http://ewynk.com/api/assets/logo?type=black',
};

// Load template
const templatePath = join(process.cwd(), 'email-marketing-assets', 'domain-launch-template', 'html-template.html');
const htmlTemplate = readFileSync(templatePath, 'utf-8');

// Process template
const processedHtml = replaceVariables(htmlTemplate, variables);

// Check for unreplaced variables
const unreplacedVars = processedHtml.match(/\{\{(\w+)\}\}/g);

console.log('=== Email Template Test ===\n');
console.log('Test Contact:');
console.log(`  Name: ${testContact.firstName}`);
console.log(`  Email: ${testContact.email}`);
console.log(`  Website: ${testContact.website}\n`);

console.log('Variables:');
Object.entries(variables).forEach(([key, value]) => {
  console.log(`  {{${key}}}: ${value}`);
});

console.log('\n=== Results ===');
if (unreplacedVars && unreplacedVars.length > 0) {
  console.log('❌ Found unreplaced variables:');
  unreplacedVars.forEach(v => console.log(`  ${v}`));
} else {
  console.log('✅ All variables replaced successfully!');
}

console.log('\n=== Sample Output (first 500 chars) ===');
console.log(processedHtml.substring(0, 500));
console.log('...\n');

// Save processed HTML for inspection
const outputPath = join(process.cwd(), 'test-email-output.html');
require('fs').writeFileSync(outputPath, processedHtml);
console.log(`✅ Full processed HTML saved to: ${outputPath}`);
console.log('   Open this file in a browser to see the final result.\n');
