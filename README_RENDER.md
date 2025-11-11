# Deploying MediQueue to Render

This document provides instructions for deploying the MediQueue application to [Render](https://render.com).

## Prerequisites

- A Render account
- Git repository with your MediQueue project

## Deployment Steps

### 1. Database Setup

MediQueue uses PostgreSQL and the deployment includes both a database service and web application service. The database will be automatically created and configured.

### 2. Deploy using render.yaml (Recommended)

The project includes a `render.yaml` file that automatically sets up both the PostgreSQL database and web application:

1. In your Render dashboard, go to "Blueprints"
2. Click "New Blueprint Instance"  
3. Connect to your repository
4. The PostgreSQL database and web application will be created automatically
5. Environment variables including the database connection string are configured automatically
6. Click "Apply"

### 3. Manual Deployment (Alternative)

If you prefer to set up services manually:

#### Create PostgreSQL Database:
1. Go to your Render dashboard and click "New PostgreSQL"
2. Choose a name (e.g., `mediqueue-db`)
3. Select your preferred plan
4. Note the connection details

#### Create Web Service:
1. Click "New Web Service"
2. Connect your Git repository
3. Fill in the following details:
   - Name: `mediqueue`
   - Environment: `Node`
   - Build Command: `npm install && npx prisma generate && npx prisma db push && npm run build`
   - Start Command: `npm start`
4. Add environment variables:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: (connection string from your PostgreSQL service)
   - `NEXTAUTH_SECRET`: (generate a random string)
   - `NEXTAUTH_URL`: (will be set automatically)
   - `NEXT_TYPESCRIPT_IGNORE_BUILD_ERRORS`: `true`
   - Add your API keys for Gemini and EmailJS
5. Click "Create Web Service"

After deployment, you'll need to run your Prisma migrations to set up the database schema:

1. Go to your deployed web service in the Render dashboard
2. Click "Shell" in the top right
3. Run the following command to apply migrations:
   ```
   npx prisma migrate deploy
   ```
4. Optionally, seed the database with initial data:
   ```
   npx prisma db seed
   ```

### 4. Verify Deployment

1. Visit your deployed application using the provided URL
2. Check that all functionality works as expected
3. Monitor the logs in the Render dashboard for any errors

## Troubleshooting

- If you encounter database issues, make sure the disk configuration in `render.yaml` is correct and the persistent disk is mounted properly
- For build failures, check the build logs in the Render dashboard
- If the app loads but features don't work, check for client-side errors in your browser's console

## Updating Your Deployment

When you push changes to your repository's main branch, Render will automatically rebuild and deploy the updated application.
