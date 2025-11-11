// Test Environment Configuration for Vercel Deployment
require('../lib/vercel-db-config');
const { PrismaClient } = require('@prisma/client');

async function testVercelConfig() {
  console.log('\n--- Testing Vercel Deployment Configuration ---\n');
  
  // Output environment validation
  const environmentCheck = {
    'NODE_ENV': process.env.NODE_ENV || 'not set',
    'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET ? 'set' : 'not set',
    'NEXTAUTH_URL': process.env.NEXTAUTH_URL || 'not set',
    'DATABASE_URL': process.env.DATABASE_URL ? 'set (masked)' : 'not set',
    'POSTGRES_PRISMA_URL': process.env.POSTGRES_PRISMA_URL ? 'set (masked)' : 'not set',
    'POSTGRES_URL': process.env.POSTGRES_URL ? 'set (masked)' : 'not set',
  };
  
  console.log('Environment Variables:');
  console.table(environmentCheck);
  
  // Only attempt database connection if DATABASE_URL is set
  if (process.env.DATABASE_URL) {
    console.log('\nAttempting database connection...');
    
    try {
      const prisma = new PrismaClient();
      
      // Attempt to connect and run a simple query
      const result = await prisma.$queryRaw`SELECT 1 as vercel_deployment_test`;
      
      console.log('✅ Database connection successful!', result);
      await prisma.$disconnect();
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      
      console.log('\nPossible solutions:');
      console.log('1. On Vercel, make sure you have set up Postgres or provided a DATABASE_URL');
      console.log('2. If using Vercel Postgres, check that your database is properly provisioned');
      console.log('3. If using an external provider, verify your connection string is correct');
      console.log('4. Make sure your IP is allowed to connect to the database (check firewall settings)');
      
      return false;
    }
  } else {
    console.error('❌ No DATABASE_URL configured!');
    return false;
  }
}

// When run directly
if (require.main === module) {
  testVercelConfig()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test failed with error:', error);
      process.exit(1);
    });
}

module.exports = { testVercelConfig }; 