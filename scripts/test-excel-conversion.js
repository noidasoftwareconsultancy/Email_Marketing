const XLSX = require('xlsx');
const path = require('path');

// Simple conversion function (matches the TypeScript logic)
function generateEmailFromDomain(domainName) {
  const prefixes = ['info', 'contact', 'hello', 'admin', 'support'];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  return `${randomPrefix}@${domainName}`;
}

function cleanValue(value) {
  if (!value) return undefined;
  const str = String(value).trim();
  if (str === 'REDACTED FOR PRIVACY' || str === '') return undefined;
  return str;
}

function parseName(fullName) {
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

function mapDomainToContact(domain) {
  if (!domain.domain_name) return null;

  let email = cleanValue(domain.registrant_email) || 
              cleanValue(domain.administrative_email) || 
              cleanValue(domain.technical_email);
  
  if (!email) {
    email = generateEmailFromDomain(domain.domain_name);
  }

  const name = cleanValue(domain.registrant_name) || 
               cleanValue(domain.administrative_name) || 
               cleanValue(domain.technical_name);
  
  const { firstName, lastName } = parseName(name);

  const company = cleanValue(domain.registrant_company) || 
                  cleanValue(domain.administrative_company) || 
                  cleanValue(domain.technical_company);

  const phone = cleanValue(domain.registrant_phone) || 
                cleanValue(domain.administrative_phone) || 
                cleanValue(domain.technical_phone);

  const tags = ['domain-owner'];
  const state = cleanValue(domain.registrant_state);
  if (state) {
    tags.push(String(state).toLowerCase().replace(/\s+/g, '-'));
  }
  if (domain.domain_registrar_name) {
    tags.push(String(domain.domain_registrar_name).toLowerCase().split(',')[0].replace(/\s+/g, '-'));
  }

  const notes = [
    `Domain: ${domain.domain_name}`,
    domain.domain_registrar_name ? `Registrar: ${domain.domain_registrar_name}` : null,
    domain.name_server_1 ? `NS1: ${domain.name_server_1}` : null,
    domain.name_server_2 ? `NS2: ${domain.name_server_2}` : null,
    domain.domain_status_1 ? `Status: ${domain.domain_status_1}` : null,
  ].filter(Boolean).join(' | ');

  return {
    email,
    name,
    firstName,
    lastName,
    phone,
    company,
    website: `https://${domain.domain_name}`,
    address: cleanValue(domain.registrant_address),
    city: cleanValue(domain.registrant_city),
    state: cleanValue(domain.registrant_state),
    country: cleanValue(domain.registrant_country),
    zipCode: cleanValue(domain.registrant_zip),
    tags,
    source: 'domain_import',
    notes,
  };
}

// Read and test conversion
const filePath = path.join(__dirname, '../sample-data/09-November-india.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('=== EXCEL TO CONTACT CONVERSION TEST ===\n');
console.log(`Total domains in file: ${data.length}\n`);

// Convert first 10 records
const contacts = data.slice(0, 10).map(mapDomainToContact).filter(Boolean);

console.log('=== FIRST 10 CONVERTED CONTACTS ===\n');
contacts.forEach((contact, index) => {
  console.log(`\n--- Contact ${index + 1} ---`);
  console.log(`Email: ${contact.email}`);
  console.log(`Name: ${contact.name || 'N/A'}`);
  console.log(`Company: ${contact.company || 'N/A'}`);
  console.log(`Phone: ${contact.phone || 'N/A'}`);
  console.log(`Website: ${contact.website}`);
  console.log(`Location: ${contact.city || 'N/A'}, ${contact.state || 'N/A'}, ${contact.country || 'N/A'}`);
  console.log(`Tags: ${contact.tags.join(', ')}`);
  console.log(`Notes: ${contact.notes.substring(0, 100)}...`);
});

// Statistics
const allContacts = data.map(mapDomainToContact).filter(Boolean);
const stats = {
  total: allContacts.length,
  withRealEmail: allContacts.filter(c => !c.email.match(/^(info|contact|hello|admin|support)@/)).length,
  withGeneratedEmail: allContacts.filter(c => c.email.match(/^(info|contact|hello|admin|support)@/)).length,
  withCompany: allContacts.filter(c => c.company).length,
  withPhone: allContacts.filter(c => c.phone).length,
  withAddress: allContacts.filter(c => c.address).length,
  byState: {},
};

allContacts.forEach(contact => {
  if (contact.state) {
    stats.byState[contact.state] = (stats.byState[contact.state] || 0) + 1;
  }
});

console.log('\n\n=== CONVERSION STATISTICS ===');
console.log(`Total Contacts: ${stats.total}`);
console.log(`With Real Email: ${stats.withRealEmail} (${((stats.withRealEmail/stats.total)*100).toFixed(1)}%)`);
console.log(`With Generated Email: ${stats.withGeneratedEmail} (${((stats.withGeneratedEmail/stats.total)*100).toFixed(1)}%)`);
console.log(`With Company: ${stats.withCompany} (${((stats.withCompany/stats.total)*100).toFixed(1)}%)`);
console.log(`With Phone: ${stats.withPhone} (${((stats.withPhone/stats.total)*100).toFixed(1)}%)`);
console.log(`With Address: ${stats.withAddress} (${((stats.withAddress/stats.total)*100).toFixed(1)}%)`);

console.log('\n=== TOP 10 STATES ===');
const topStates = Object.entries(stats.byState)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);
topStates.forEach(([state, count]) => {
  console.log(`${state}: ${count} contacts`);
});

console.log('\n✅ Conversion test complete!');
console.log(`\nReady to import ${stats.total} contacts from your Excel file.`);
