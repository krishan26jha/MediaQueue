#!/usr/bin/env node

/**
 * Quick PostgreSQL Setup Script for MediQueue
 * This script helps set up the PostgreSQL database quickly
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ ${description} completed`);
    if (output.trim()) {
      console.log(output.trim());
    }
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`);
    console.error(error.message);
    return false;
  }
}

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('postgresql://')) {
      console.log('✅ .env.local file exists with PostgreSQL configuration');
      return true;
    }
  }
  
  console.log('⚠️  .env.local not found or missing PostgreSQL configuration');
  console.log('Please create .env.local with your PostgreSQL DATABASE_URL');
  return false;
}

async function setupPostgreSQL() {
  console.log('🏥 MediQueue PostgreSQL Setup\n');

  // 1. Check environment file
  console.log('1. Checking environment configuration...');
  if (!checkEnvFile()) {
    console.log('\nPlease set up your .env.local file first.');
    console.log('Example:');
    console.log('DATABASE_URL="postgresql://mediqueue_user:password@localhost:5432/mediqueue"');
    process.exit(1);
  }

  // 2. Generate Prisma client
  if (!runCommand('npx prisma generate', 'Generating Prisma client')) {
    process.exit(1);
  }

  // 3. Test database connection
  console.log('\n2. Testing database connection...');
  if (!runCommand('npm run validate:postgres', 'Validating PostgreSQL setup')) {
    console.log('\n❌ Database connection failed.');
    console.log('Please check:');
    console.log('- PostgreSQL is running');
    console.log('- Database and user exist');
    console.log('- DATABASE_URL is correct in .env.local');
    console.log('\nSee POSTGRESQL_SETUP.md for detailed instructions');
    process.exit(1);
  }

  // 4. Run migrations
  console.log('\n3. Setting up database schema...');
  const migrationSuccess = runCommand('npx prisma migrate dev --name init', 'Running database migrations');
  
  if (!migrationSuccess) {
    console.log('\n⚠️  Migration failed, trying db push instead...');
    if (!runCommand('npx prisma db push', 'Pushing database schema')) {
      console.log('\n❌ Schema setup failed. Please check your database configuration.');
      process.exit(1);
    }
  }

  // 5. Final validation
  console.log('\n4. Final validation...');
  runCommand('npm run validate:postgres', 'Final PostgreSQL validation');

  console.log('\n🎉 PostgreSQL setup completed successfully!');
  console.log('\nNext steps:');
  console.log('- Start development server: npm run dev');
  console.log('- Open Prisma Studio: npx prisma studio');
  console.log('- Access the app: http://localhost:3000');
}

// Run setup if called directly
if (require.main === module) {
  setupPostgreSQL().catch(error => {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  });
}
