# Deploying the Hospital Queue Application to Vercel

This guide will walk you through the process of deploying the Hospital Queue application to Vercel with a PostgreSQL database.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. A GitHub account (to push your code)

## Step 1: Prepare your database

You have two options for your PostgreSQL database:

### Option 1: Use Vercel Postgres (Recommended)

1. Create a new Vercel Postgres database from the Vercel dashboard
   - Go to your project in Vercel
   - Navigate to Storage
   - Click "Create New" and select "Postgres"
   - Follow the setup wizard

2. Vercel will automatically set up the following environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL` 
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

### Option 2: Use an external PostgreSQL provider

1. Create a PostgreSQL database with a provider like Supabase, Railway, or Neon
2. Get your database connection string in the format: `postgresql://username:password@host:port/database`
3. Add this connection string as the `DATABASE_URL` environment variable in Vercel

## Step 2: Deploy to Vercel

1. Push your code to GitHub
2. Log in to Vercel and create a new project
3. Connect your GitHub repository
4. Configure the project:
   - Build Command: `npm run build` (already configured in vercel.json)
   - Output Directory: `.next` (already configured in vercel.json)
   - Install Command: `npm install` (already configured in vercel.json)

5. Add environment variables:
   - `NEXTAUTH_SECRET` - A secure random string for NextAuth.js
   - `NEXTAUTH_URL` - Your full Vercel deployment URL (e.g., https://your-app.vercel.app)
   
   If not using Vercel Postgres, also add:
   - `DATABASE_URL` - Your PostgreSQL connection string

6. Deploy the project

## Step 3: Run Database Migrations

After deploying, you need to run the database migrations:

1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Link to your project: `vercel link`
4. Pull environment variables: `vercel env pull .env.local`
5. Run migrations: `npx prisma migrate deploy`

## Troubleshooting

If you encounter issues:

1. Check the Vercel deployment logs
2. Verify your environment variables are set correctly
3. Try running `npx prisma migrate reset` locally with the `.env.local` file if you need to reset the database
4. If Prisma gives "P3006" or "P3007" migration errors, you may need to modify your migration files

## Future Database Updates

To update your database schema in the future:

1. Make changes to the `prisma/schema.prisma` file
2. Run `npx prisma migrate dev --name your_migration_name` locally to create a new migration
3. Commit and push the migration files
4. Redeploy your application on Vercel 