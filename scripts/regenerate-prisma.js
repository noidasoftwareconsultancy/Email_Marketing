const { execSync } = require('child_process');

console.log('Regenerating Prisma Client...');

try {
  // Kill any processes that might be locking the Prisma client
  console.log('Step 1: Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('\n✅ Prisma Client regenerated successfully!');
  console.log('\nNext steps:');
  console.log('1. Restart your development server');
  console.log('2. The new models (ContactActivity, ContactDuplicate, etc.) should now be available');
} catch (error) {
  console.error('❌ Error regenerating Prisma Client:', error.message);
  console.log('\nTry these steps manually:');
  console.log('1. Stop all running Node.js processes');
  console.log('2. Run: npx prisma generate');
  console.log('3. Restart your development server');
}
