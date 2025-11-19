#!/usr/bin/env node

/**
 * Complete Setup Script
 * Runs all necessary setup steps to complete the platform configuration
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 BulkMailer Pro - Complete Setup\n');
console.log('This script will complete all pending setup tasks.\n');

// Colors for console output
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

function step(number, title) {
  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}Step ${number}: ${title}${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

// Check if .env exists
function checkEnvFile() {
  step(1, 'Checking Environment Configuration');
  
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    error('.env file not found!');
    info('Please create .env file with required variables.');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check for required variables
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXT_PUBLIC_COMPANY_NAME',
  ];
  
  const missing = required.filter(key => !envContent.includes(key));
  
  if (missing.length > 0) {
    warning(`Missing environment variables: ${missing.join(', ')}`);
    info('Some features may not work correctly.');
  } else {
    success('Environment configuration complete');
  }
  
  // Check if branding is customized
  if (envContent.includes('BulkMailer Pro')) {
    info('Using default branding. You can customize in .env file.');
  } else {
    success('Custom branding configured');
  }
}

// Generate Prisma Client
function generatePrismaClient() {
  step(2, 'Generating Prisma Client');
  
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    success('Prisma Client generated successfully');
  } catch (err) {
    error('Failed to generate Prisma Client');
    throw err;
  }
}

// Check database migration status
function checkMigrationStatus() {
  step(3, 'Checking Database Migration Status');
  
  try {
    info('Checking if enhanced contact fields exist...');
    
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    if (schema.includes('jobTitle') && schema.includes('website')) {
      success('Enhanced contact fields found in schema');
      info('Run "npm run db:push" to apply changes to database');
    } else {
      warning('Enhanced contact fields not found in schema');
    }
  } catch (err) {
    error('Failed to check migration status');
    console.error(err);
  }
}

// Check if sample data exists
function checkSampleData() {
  step(4, 'Checking Sample Data');
  
  const sampleFiles = [
    'sample-data/contacts-sample.csv',
    'sample-data/09-November-india.xlsx',
  ];
  
  sampleFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      success(`Found: ${file}`);
    } else {
      info(`Not found: ${file} (optional)`);
    }
  });
}

// Check if all components are in place
function checkComponents() {
  step(5, 'Checking Components');
  
  const components = [
    'components/contacts/ContactForm.tsx',
    'components/contacts/ExcelImporter.tsx',
    'components/templates/TemplateBuilder.tsx',
    'components/analytics/CampaignAnalytics.tsx',
    'components/campaigns/CampaignScheduler.tsx',
  ];
  
  let allFound = true;
  components.forEach(component => {
    const componentPath = path.join(process.cwd(), component);
    if (fs.existsSync(componentPath)) {
      success(`✓ ${component}`);
    } else {
      error(`✗ ${component}`);
      allFound = false;
    }
  });
  
  if (allFound) {
    success('All components are in place');
  } else {
    warning('Some components are missing');
  }
}

// Check API routes
function checkAPIRoutes() {
  step(6, 'Checking API Routes');
  
  const routes = [
    'app/api/contacts/import/route.ts',
    'app/api/contacts/export/route.ts',
    'app/api/contacts/import-excel/route.ts',
    'app/api/campaigns/[id]/analytics/route.ts',
  ];
  
  let allFound = true;
  routes.forEach(route => {
    const routePath = path.join(process.cwd(), route);
    if (fs.existsSync(routePath)) {
      success(`✓ ${route}`);
    } else {
      error(`✗ ${route}`);
      allFound = false;
    }
  });
  
  if (allFound) {
    success('All API routes are in place');
  } else {
    warning('Some API routes are missing');
  }
}

// Display next steps
function displayNextSteps() {
  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.green}✅ Setup Check Complete!${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  
  console.log(`${colors.yellow}📋 Next Steps:${colors.reset}\n`);
  
  console.log('1. Apply database changes:');
  console.log(`   ${colors.cyan}npm run db:push${colors.reset}\n`);
  
  console.log('2. Start development server:');
  console.log(`   ${colors.cyan}npm run dev${colors.reset}\n`);
  
  console.log('3. Open your browser:');
  console.log(`   ${colors.cyan}http://localhost:3000${colors.reset}\n`);
  
  console.log('4. Import your Excel data:');
  console.log(`   ${colors.cyan}Dashboard → Contacts → Import Excel${colors.reset}`);
  console.log(`   ${colors.cyan}Upload: sample-data/09-November-india.xlsx${colors.reset}\n`);
  
  console.log('5. Create your first campaign:');
  console.log(`   ${colors.cyan}Dashboard → Templates → Create Template${colors.reset}`);
  console.log(`   ${colors.cyan}Dashboard → Campaigns → Create Campaign${colors.reset}\n`);
  
  console.log(`${colors.yellow}📚 Documentation:${colors.reset}\n`);
  console.log(`   • EXCEL_IMPORT_READY.md - Import guide for your data`);
  console.log(`   • ENHANCEMENTS.md - All features documentation`);
  console.log(`   • DEPLOYMENT_READY.md - Deployment guide\n`);
  
  console.log(`${colors.green}🎉 Your email marketing platform is ready!${colors.reset}\n`);
}

// Main execution
async function main() {
  try {
    checkEnvFile();
    generatePrismaClient();
    checkMigrationStatus();
    checkSampleData();
    checkComponents();
    checkAPIRoutes();
    displayNextSteps();
  } catch (err) {
    console.error('\n');
    error('Setup check failed!');
    console.error(err);
    process.exit(1);
  }
}

main();
