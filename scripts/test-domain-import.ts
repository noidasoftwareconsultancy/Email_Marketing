/**
 * Test script for domain data import
 * Run with: npx tsx scripts/test-domain-import.ts
 */

import * as XLSX from 'xlsx';
import { mapDomainToContact } from '../lib/domain-to-contact-mapper';
import * as fs from 'fs';
import * as path from 'path';

async function testDomainImport() {
  console.log('🧪 Testing Domain Import Mapping...\n');

  // Read the Excel file
  const filePath = path.join(process.cwd(), 'sample-data', '09-November-india.xlsx');
  
  if (!fs.existsSync(filePath)) {
    console.error('❌ File not found:', filePath);
    return;
  }

  const buffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  console.log(`📊 Total rows in Excel: ${data.length}\n`);

  // Test first 5 rows
  console.log('Testing first 5 rows:\n');
  console.log('='.repeat(80));

  let successCount = 0;
  let failCount = 0;
  const stateCount: Record<string, number> = {};
  const registrarCount: Record<string, number> = {};

  for (let i = 0; i < Math.min(5, data.length); i++) {
    const row = data[i] as any;
    console.log(`\n📝 Row ${i + 1}: ${row.domain_name}`);
    console.log('-'.repeat(80));

    const contact = mapDomainToContact(row);

    if (contact) {
      successCount++;
      console.log('✅ Successfully mapped:');
      console.log(`   Email: ${contact.email}`);
      console.log(`   Name: ${contact.name || 'N/A'}`);
      console.log(`   Company: ${contact.company || 'N/A'}`);
      console.log(`   Phone: ${contact.phone || 'N/A'}`);
      console.log(`   Location: ${[contact.city, contact.state, contact.country].filter(Boolean).join(', ') || 'N/A'}`);
      console.log(`   Website: ${contact.website}`);
      console.log(`   Tags: ${contact.tags?.join(', ') || 'N/A'}`);
      console.log(`   Notes: ${contact.notes?.substring(0, 100)}...`);
    } else {
      failCount++;
      console.log('❌ Failed to map');
    }
  }

  // Process all rows for statistics
  console.log('\n' + '='.repeat(80));
  console.log('\n📈 Processing all rows for statistics...\n');

  for (const row of data) {
    const contact = mapDomainToContact(row as any);
    if (contact) {
      if (contact.state) {
        stateCount[contact.state] = (stateCount[contact.state] || 0) + 1;
      }
      
      // Extract registrar from tags
      const registrarTag = contact.tags?.find(t => 
        t === 'godaddy' || t === 'hostinger' || t === 'name-com' || t === 'openprovider'
      );
      if (registrarTag) {
        registrarCount[registrarTag] = (registrarCount[registrarTag] || 0) + 1;
      }
    }
  }

  // Summary
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Rows: ${data.length}`);
  console.log(`Successfully Mapped: ${successCount} (from first 5)`);
  console.log(`Failed: ${failCount} (from first 5)`);
  console.log(`Success Rate: ${((successCount / Math.min(5, data.length)) * 100).toFixed(2)}%`);

  console.log('\n📍 Top States:');
  const topStates = Object.entries(stateCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
  topStates.forEach(([state, count]) => {
    console.log(`   ${state}: ${count} domains`);
  });

  console.log('\n🏢 Registrars:');
  const topRegistrars = Object.entries(registrarCount)
    .sort(([, a], [, b]) => b - a);
  topRegistrars.forEach(([registrar, count]) => {
    console.log(`   ${registrar}: ${count} domains`);
  });

  console.log('\n✅ Test completed!\n');
}

// Run the test
testDomainImport().catch(console.error);
