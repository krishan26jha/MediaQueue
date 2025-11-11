#!/usr/bin/env node

/**
 * PostgreSQL Migration Validation Script
 * This script validates the PostgreSQL setup and database schema
 */

const { PrismaClient } = require('@prisma/client');

async function validateSetup() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Validating PostgreSQL setup...\n');

    // 1. Test database connection
    console.log('1. Testing database connection...');
    await prisma.$connect();
    console.log('   ✅ Database connection successful');

    // 2. Check database URL format
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL not found in environment variables');
    }
    
    if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
      throw new Error('DATABASE_URL should be a PostgreSQL connection string');
    }
    console.log('   ✅ Database URL format valid');

    // 3. Test basic query
    console.log('\n2. Testing basic database query...');
    const result = await prisma.$queryRaw`SELECT 1 as test, NOW() as current_time`;
    console.log('   ✅ Basic query successful:', result[0]);

    // 4. Check if tables exist
    console.log('\n3. Checking database schema...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    if (tables.length === 0) {
      console.log('   ⚠️  No tables found - run "npx prisma migrate dev" to create schema');
    } else {
      console.log(`   ✅ Found ${tables.length} tables:`, tables.map(t => t.table_name).join(', '));
    }

    // 5. Test model access (if tables exist)
    if (tables.length > 0) {
      console.log('\n4. Testing model access...');
      try {
        const userCount = await prisma.user.count();
        console.log(`   ✅ User model accessible (${userCount} users found)`);
      } catch (error) {
        console.log('   ⚠️  Model access failed - schema might need updates');
      }
    }

    console.log('\n🎉 PostgreSQL setup validation completed successfully!');
    console.log('\nNext steps:');
    console.log('- If no tables found: Run "npx prisma migrate dev --name init"');
    console.log('- Start development: Run "npm run dev"');
    console.log('- Open Prisma Studio: Run "npx prisma studio"');

  } catch (error) {
    console.error('\n❌ Validation failed:');
    console.error('Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('- Make sure PostgreSQL is running');
    console.error('- Check your DATABASE_URL in .env.local');
    console.error('- Verify database and user exist');
    console.error('- Run the database setup commands from POSTGRESQL_SETUP.md');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run validation if called directly
if (require.main === module) {
  validateSetup();
}

module.exports = { validateSetup };
