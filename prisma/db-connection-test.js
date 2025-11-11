// Prisma connection test script
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing PostgreSQL database connection...');
    
    // Print database path but hide most of it for security
    const dbUrl = process.env.DATABASE_URL || 'postgresql://mediqueue_user:password@localhost:5432/mediqueue';
    const isPostgreSQL = dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://');
    console.log(`Database: ${isPostgreSQL ? 'PostgreSQL' : 'Unknown'}`);
    
    // For most accurate test, try to run a simple query
    const result = await prisma.$queryRaw`SELECT 1 as testResult`;
    console.log('Connection successful:', result);
    
    // Check if we can access the User model
    const userCount = await prisma.user.count();
    console.log(`User count: ${userCount}`);
    
    return true;
  } catch (error) {
    console.error('Failed to connect to database:');
    console.error(error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test if called directly from CLI
if (require.main === module) {
  testConnection()
    .then(success => {
      if (!success) {
        process.exit(1); // Exit with error code for CI/CD
      }
    });
}

module.exports = { testConnection };
