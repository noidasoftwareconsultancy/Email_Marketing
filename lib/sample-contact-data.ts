/**
 * Sample contact data for testing variable replacement
 */

import { Contact } from '@prisma/client';

export const sampleContacts: Partial<Contact>[] = [
  {
    id: 'sample-1',
    email: 'john.doe@acme.com',
    name: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    company: 'Acme Corporation',
    jobTitle: 'Marketing Director',
    phone: '+1 (555) 123-4567',
    website: 'acme.com',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    zipCode: '10001',
    tags: ['enterprise', 'marketing'],
    status: 'ACTIVE',
  },
  {
    id: 'sample-2',
    email: 'sarah.johnson@techstart.io',
    name: 'Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    company: 'TechStart',
    jobTitle: 'CEO',
    phone: '+1 (555) 987-6543',
    website: 'techstart.io',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    zipCode: '94102',
    tags: ['startup', 'tech'],
    status: 'ACTIVE',
  },
  {
    id: 'sample-3',
    email: 'michael.chen@innovate.com',
    name: 'Michael Chen',
    firstName: 'Michael',
    lastName: 'Chen',
    company: 'Innovate Solutions',
    jobTitle: 'Product Manager',
    phone: '+1 (555) 456-7890',
    website: 'innovate.com',
    city: 'Austin',
    state: 'TX',
    country: 'USA',
    zipCode: '78701',
    tags: ['saas', 'product'],
    status: 'ACTIVE',
  },
  {
    id: 'sample-4',
    email: 'emily.rodriguez@global.com',
    name: 'Emily Rodriguez',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    company: 'Global Enterprises',
    jobTitle: 'VP of Sales',
    phone: '+1 (555) 234-5678',
    website: 'global.com',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    zipCode: '60601',
    tags: ['enterprise', 'sales'],
    status: 'ACTIVE',
  },
  {
    id: 'sample-5',
    email: 'david.kim@startup.co',
    name: 'David Kim',
    firstName: 'David',
    lastName: 'Kim',
    company: 'Startup Co',
    jobTitle: 'Founder',
    phone: '+1 (555) 345-6789',
    website: 'startup.co',
    city: 'Seattle',
    state: 'WA',
    country: 'USA',
    zipCode: '98101',
    tags: ['startup', 'founder'],
    status: 'ACTIVE',
  },
];

export function getRandomSampleContact(): Partial<Contact> {
  return sampleContacts[Math.floor(Math.random() * sampleContacts.length)];
}

export function getSampleContactByIndex(index: number): Partial<Contact> {
  return sampleContacts[index % sampleContacts.length];
}

export const sampleContactWithCustomData: Partial<Contact> = {
  id: 'sample-custom',
  email: 'alex.taylor@example.com',
  name: 'Alex Taylor',
  firstName: 'Alex',
  lastName: 'Taylor',
  company: 'Example Corp',
  jobTitle: 'CTO',
  phone: '+1 (555) 111-2222',
  website: 'example.com',
  city: 'Boston',
  state: 'MA',
  country: 'USA',
  zipCode: '02101',
  tags: ['tech', 'enterprise'],
  status: 'ACTIVE',
  customData: {
    industry: 'Technology',
    employees: '100-500',
    revenue: '$10M-$50M',
    lastPurchase: 'Enterprise Plan',
    accountManager: 'Jane Smith',
    renewalDate: '2024-12-31',
  },
};

/**
 * Generate a sample contact with specific attributes
 */
export function generateSampleContact(overrides: Partial<Contact> = {}): Partial<Contact> {
  const base = getRandomSampleContact();
  return {
    ...base,
    ...overrides,
  };
}
