#!/usr/bin/env node

/**
 * Apply Database Changes Script
 * Temporarily switches to direct connection and applies schema changes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

console.log('\n' + '='.repeat(60));
log('  Apply Database Changes - Add New Contact Fields', 'cyan');
console.log('='.repeat(60) + '\n');

const envPath = path.join(process.cwd(), '.env');

// Read current .env
let envContent = fs.readFileSync(envPath, 'utf8');

// Check if already using direct connection
const isPooler = envContent.includes(':6543') && envContent.includes('pgbouncer=true');

if (isPooler) {
  log('Step 1: Switching to direct database connection...', 'yellow');
  
  // Backup original .env
  const backupPath = path.join(process.cwd(), '.env.backup');
  fs.writeFileSync(backupPath, envContent);
  log('✅ Backed up .env to .env.backup', 'green');
  
  // Switch to direct connection
  envContent = envContent
    .replace(':6543', ':5432')
    .replace('?pgbouncer=true', '');
  
  fs.writeFileSync(envPath, envContent);
  log('✅ Switched to direct connection (port 5432)', 'green');
} else {
  log('✅ Already using direct connection', 'green');
}

log('\nStep 2: Applying database schema changes...', 'yellow');
log('This will add 9 new fields to the Contact table:', 'cyan');
log('  • jobTitle', 'cyan');
log('  • website', 'cyan');
log('  • address', 'cyan');
log('  • city', 'cyan');
log('  • state', 'cyan');
log('  • country', 'cyan');
log('  • zipCode', 'cyan');
log('  • source', 'cyan');
log('  • notes', 'cyan');

console.log('\n' + '-'.repeat(60) + '\n');

try {
  // Run prisma db push
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('\n' + '-'.repeat(60) + '\n');
  log('✅ Database schema updated successfully!', 'green');
  
} catch (error) {
  console.log('\n' + '-'.repeat(60) + '\n');
  log('❌ Failed to update database schema', 'red');
  console.error(error);
  
  // Restore backup if it exists
  if (isPooler && fs.existsSync(path.join(process.cwd(), '.env.backup'))) {
    log('\nRestoring original .env...', 'yellow');
    const backup = fs.readFileSync(path.join(process.cwd(), '.env.backup'), 'utf8');
    fs.writeFileSync(envPath, backup);
    log('✅ Restored original .env', 'green');
  }
  
  process.exit(1);
}

// Restore pooler connection if we changed it
if (isPooler) {
  log('\nStep 3: Restoring pooler connection...', 'yellow');
  const backup = fs.readFileSync(path.join(process.cwd(), '.env.backup'), 'utf8');
  fs.writeFileSync(envPath, backup);
  log('✅ Restored pooler connection', 'green');
  
  // Clean up backup
  fs.unlinkSync(path.join(process.cwd(), '.env.backup'));
}

log('\nStep 4: Regenerating Prisma Client...', 'yellow');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  log('✅ Prisma Client regenerated', 'green');
} catch (error) {
  log('⚠️  Warning: Failed to regenerate Prisma Client', 'yellow');
}

console.log('\n' + '='.repeat(60));
log('  ✅ Database Update Complete!', 'green');
console.log('='.repeat(60) + '\n');

log('New fields added to Contact table:', 'cyan');
log('  ✓ jobTitle, website, address, city, state', 'green');
log('  ✓ country, zipCode, source, notes', 'green');

log('\nYou can now:', 'yellow');
log('  1. Add contacts with all 16 fields', 'cyan');
log('  2. Import from CSV with new fields', 'cyan');
log('  3. Import from Excel (1,549 domains)', 'cyan');
log('  4. Use all contact features', 'cyan');

log('\nNext steps:', 'yellow');
log('  npm run dev', 'cyan');
log('  Open: http://ewynk.com/dashboard/contacts', 'cyan');
log('  Click: "Add Contact" or "Import Excel"', 'cyan');

console.log('');
