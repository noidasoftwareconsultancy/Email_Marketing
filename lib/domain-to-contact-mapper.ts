/**
 * Domain Data to Contact Mapper
 * Converts domain registration data to contact format
 */

interface DomainData {
  num?: number;
  domain_name?: string;
  domain_registrar_id?: number;
  domain_registrar_name?: string;
  domain_registrar_whois?: string;
  domain_registrar_url?: string;
  registrant_name?: string;
  registrant_company?: string;
  registrant_address?: string;
  registrant_city?: string;
  registrant_state?: string;
  registrant_zip?: string;
  registrant_country?: string;
  registrant_phone?: string;
  registrant_fax?: string;
  registrant_email?: string;
  administrative_name?: string;
  administrative_company?: string;
  administrative_email?: string;
  administrative_phone?: string;
  technical_name?: string;
  technical_company?: string;
  technical_email?: string;
  technical_phone?: string;
  name_server_1?: string;
  name_server_2?: string;
  name_server_3?: string;
  name_server_4?: string;
  domain_status_1?: string;
  domain_status_2?: string;
  domain_status_3?: string;
  domain_status_4?: string;
}

interface ContactData {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  tags?: string[];
  source?: string;
  notes?: string;
}

/**
 * Generate email from domain name
 */
function generateEmailFromDomain(domainName: string): string {
  // Common email prefixes to try
  const prefixes = ['info', 'contact', 'hello', 'admin', 'support'];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  return `${randomPrefix}@${domainName}`;
}

/**
 * Clean REDACTED values and invalid data
 */
function cleanValue(value: any): string | undefined {
  if (!value) return undefined;
  const str = String(value).trim();
  if (
    str === '' ||
    str === 'REDACTED FOR PRIVACY' ||
    str === 'Not Applicable' ||
    str === 'N/A' ||
    str === 'null' ||
    str === 'undefined'
  ) {
    return undefined;
  }
  return str;
}

/**
 * Parse name into first and last name
 */
function parseName(fullName?: string): { firstName?: string; lastName?: string } {
  if (!fullName) return {};
  
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) {
    return { firstName: parts[0] };
  }
  
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

/**
 * Convert domain data to contact format
 */
export function mapDomainToContact(domain: DomainData): ContactData | null {
  // Must have domain name
  if (!domain.domain_name) return null;

  // Clean domain name
  const domainName = domain.domain_name.trim().toLowerCase();

  // Try to get email from various sources (prioritize registrant, then admin, then technical)
  let email = cleanValue(domain.registrant_email) || 
              cleanValue(domain.administrative_email) || 
              cleanValue(domain.technical_email);
  
  // If no email found, generate one from domain
  if (!email) {
    email = generateEmailFromDomain(domainName);
  }

  // Get name from various sources (prioritize registrant)
  const name = cleanValue(domain.registrant_name) || 
               cleanValue(domain.administrative_name) || 
               cleanValue(domain.technical_name);
  
  const { firstName, lastName } = parseName(name);

  // Get company name (prioritize registrant)
  const company = cleanValue(domain.registrant_company) || 
                  cleanValue(domain.administrative_company) || 
                  cleanValue(domain.technical_company);

  // Get phone (prioritize registrant)
  const phone = cleanValue(domain.registrant_phone) || 
                cleanValue(domain.administrative_phone) || 
                cleanValue(domain.technical_phone);

  // Build address (use registrant data)
  const address = cleanValue(domain.registrant_address);
  const city = cleanValue(domain.registrant_city);
  const state = cleanValue(domain.registrant_state);
  const country = cleanValue(domain.registrant_country) || 'India'; // Default to India for this dataset
  const zipCode = cleanValue(domain.registrant_zip);

  // Build tags
  const tags: string[] = ['domain-owner', 'india-domain'];
  
  // Add state tag if available
  if (state) {
    tags.push(`state-${state.toLowerCase().replace(/\s+/g, '-')}`);
  }
  
  // Add registrar tag
  if (domain.domain_registrar_name) {
    const registrar = domain.domain_registrar_name.toLowerCase();
    if (registrar.includes('godaddy')) {
      tags.push('godaddy');
    } else if (registrar.includes('hostinger')) {
      tags.push('hostinger');
    } else if (registrar.includes('name.com')) {
      tags.push('name-com');
    } else if (registrar.includes('openprovider')) {
      tags.push('openprovider');
    } else {
      tags.push(registrar.split(',')[0].replace(/\s+/g, '-').substring(0, 20));
    }
  }

  // Add domain extension tag
  const extension = domainName.split('.').pop();
  if (extension) {
    tags.push(`ext-${extension}`);
  }

  // Build notes with domain information
  const notesParts = [
    `Domain: ${domainName}`,
    domain.domain_registrar_name ? `Registrar: ${domain.domain_registrar_name}` : null,
    domain.name_server_1 ? `NS: ${domain.name_server_1}` : null,
    domain.domain_status_1 ? `Status: ${domain.domain_status_1}` : null,
  ].filter(Boolean);
  
  const notes = notesParts.join(' | ');

  return {
    email,
    name: name || company || domainName.split('.')[0], // Use domain name as fallback
    firstName,
    lastName,
    phone,
    company,
    website: `https://${domainName}`,
    address,
    city,
    state,
    country,
    zipCode,
    tags,
    source: 'domain_import',
    notes,
  };
}

/**
 * Convert array of domain data to contacts
 */
export function mapDomainsToContacts(domains: DomainData[]): ContactData[] {
  const contacts: ContactData[] = [];
  const seenEmails = new Set<string>();

  for (const domain of domains) {
    const contact = mapDomainToContact(domain);
    if (contact && !seenEmails.has(contact.email)) {
      contacts.push(contact);
      seenEmails.add(contact.email);
    }
  }

  return contacts;
}

/**
 * Get statistics about the conversion
 */
export function getDomainImportStats(domains: DomainData[]) {
  const contacts = mapDomainsToContacts(domains);
  
  const stats = {
    totalDomains: domains.length,
    totalContacts: contacts.length,
    withRealEmail: contacts.filter(c => !c.email.includes('@')).length,
    withGeneratedEmail: contacts.filter(c => c.email.includes('@') && 
      (c.email.startsWith('info@') || c.email.startsWith('contact@') || 
       c.email.startsWith('hello@') || c.email.startsWith('admin@') || 
       c.email.startsWith('support@'))).length,
    withCompany: contacts.filter(c => c.company).length,
    withPhone: contacts.filter(c => c.phone).length,
    withAddress: contacts.filter(c => c.address).length,
    byState: {} as Record<string, number>,
    byRegistrar: {} as Record<string, number>,
  };

  // Count by state
  contacts.forEach(contact => {
    if (contact.state) {
      stats.byState[contact.state] = (stats.byState[contact.state] || 0) + 1;
    }
  });

  // Count by registrar (from tags)
  contacts.forEach(contact => {
    const registrarTag = contact.tags?.find(t => 
      t.includes('godaddy') || t.includes('name.com') || t.includes('hosting')
    );
    if (registrarTag) {
      stats.byRegistrar[registrarTag] = (stats.byRegistrar[registrarTag] || 0) + 1;
    }
  });

  return stats;
}
