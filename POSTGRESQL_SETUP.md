# PostgreSQL Setup Guide for MediQueue

This guide will help you set up PostgreSQL for local development with MediQueue.

## Prerequisites

- Node.js 18+ installed
- Git installed

## PostgreSQL Installation

### Windows (using PostgreSQL installer)

1. Download PostgreSQL from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Make sure PostgreSQL service is running

### Windows (using Chocolatey)

```powershell
choco install postgresql
```

### macOS (using Homebrew)

```bash
brew install postgresql
brew services start postgresql
```

### Ubuntu/Debian

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Database Setup

1. **Connect to PostgreSQL as superuser:**

```bash
# Windows/macOS/Linux
psql -U postgres
```

2. **Create database and user:**

```sql
-- Create database
CREATE DATABASE mediqueue;

-- Create user
CREATE USER mediqueue_user WITH PASSWORD 'password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE mediqueue TO mediqueue_user;

-- Grant schema privileges (PostgreSQL 15+)
\c mediqueue;
GRANT ALL ON SCHEMA public TO mediqueue_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mediqueue_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mediqueue_user;

-- Exit psql
\q
```

## Environment Configuration

1. **Update your `.env.local` file:**

```bash
# Database (PostgreSQL for development)
DATABASE_URL="postgresql://mediqueue_user:password@localhost:5432/mediqueue"

# Other environment variables...
GEMINI_API_KEY=your_gemini_api_key_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

## Database Migration

1. **Run Prisma migrations:**

```bash
# Generate Prisma client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name init

# Alternative: Push schema without migration (for development)
npx prisma db push
```

2. **Seed the database (optional):**

```bash
npm run prisma:seed
```

## Testing the Connection

Run the database connection test:

```bash
npm run test:db
```

You should see output like:
```
Testing PostgreSQL database connection...
Database: PostgreSQL
Connection successful: [ { testResult: 1 } ]
User count: 0
```

## Prisma Studio

To explore your database visually:

```bash
npx prisma studio
```

This will open Prisma Studio in your browser at `http://localhost:5555`.

## Common Issues and Solutions

### Issue: Connection refused
- Make sure PostgreSQL service is running
- Check if the port 5432 is correct
- Verify username and password

### Issue: Database does not exist
- Create the database manually using the steps above
- Make sure you're connected to the right PostgreSQL instance

### Issue: Permission denied
- Make sure the user has the correct privileges
- Try granting additional permissions as shown in the setup steps

### Issue: Migration errors
- Drop and recreate the database if needed
- Clear migration history: `rm -rf prisma/migrations/` and start fresh

## Next Steps

1. Start the development server: `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000) in your browser
3. Register as a new user to test the application

## Production Deployment

For production deployment on Render, Railway, or other cloud providers, the database will be automatically provisioned. You just need to ensure your environment variables are set correctly.
