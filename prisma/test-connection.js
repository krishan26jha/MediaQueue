// Test Database Connection
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('Testing database connection...');
  
  try {
    const prisma = new PrismaClient();
    
    // Attempt to connect and run a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    console.log('Connection successful!', result);
    console.log('Database URL:', process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ':****@')); // Hide password
    
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error('Connection failed:', error);
    return false;
  }
}

testConnection().then(success => {
  if (!success) {
    console.log('\nPossible solutions:');
    console.log('1. Make sure your DATABASE_URL is correctly set in your .env file');
    console.log('2. Check that your PostgreSQL server is running');
    console.log('3. Verify that the database exists');
    console.log('4. Check firewall settings to ensure the database port is accessible');
  }
  
  process.exit(success ? 0 : 1);
}); 