# Docker Deployment Guide - React Router v7 SSR App

## 📋 Overview
This project is a **React Router v7 SSR application** that includes:
- ✅ Client-side React application
- ✅ Server-side rendering (SSR)
- ✅ API routes (create-trip endpoint)
- ✅ Appwrite backend integration
- ✅ Stripe payment processing
- ✅ AI trip generation (Google Gemini)

## Prerequisites
- Docker installed (version 20.10+)
- Docker Compose (optional, but recommended)
- `.env.local` file with all environment variables

## 🔐 Environment Variables

### Build-Time Variables (VITE_ prefix - embedded in client bundle)
```env
VITE_APPWRITE_API_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_USERS_COLLECTION_ID=your-users-collection-id
VITE_APPWRITE_TRIPS_COLLECTION_ID=your-trips-collection-id
VITE_SYNCFUSION_LICENSE_KEY=your-syncfusion-key
VITE_BASE_URL=http://localhost:3000
```

### Runtime Variables (Server-side API routes)
```env
GEMINI_API_KEY=your-gemini-key
UNSPLASH_ACCESS_KEY=your-unsplash-key
STRIPE_SECRET_KEY=your-stripe-key
VITE_APPWRITE_API_KEY=your-appwrite-api-key
```

## Option 1: Using Docker Compose (Recommended)

### Build and Run
```powershell
docker-compose up --build
```

### Run in Background
```powershell
docker-compose up -d
```

### Stop the Container
```powershell
docker-compose down
```

### View Logs
```powershell
docker-compose logs -f
```

## Option 2: Using Docker CLI

### Build the Image
```powershell
docker build -t travel-agency .
```

### Run the Container
```powershell
docker run -p 3000:3000 `
  --env-file .env.local `
  -v ${PWD}/.env.local:/app/.env.local:ro `
  --name travel-agency-app `
  travel-agency
```

### Run in Background
```powershell
docker run -d -p 3000:3000 `
  --env-file .env.local `
  -v ${PWD}/.env.local:/app/.env.local:ro `
  --name travel-agency-app `
  travel-agency
```

### Stop the Container
```powershell
docker stop travel-agency-app
docker rm travel-agency-app
```

### View Logs
```powershell
docker logs -f travel-agency-app
```

## Access the Application
Once running, access the application at:
- **Local**: http://localhost:3000

## Troubleshooting

### Container Won't Start
```powershell
# Check logs
docker logs travel-agency-app

# Check if .env.local is properly mounted
docker exec travel-agency-app cat .env.local
```

### Environment Variables Not Loading
```powershell
# Verify environment variables in the container
docker exec travel-agency-app printenv
```

### Rebuild After Code Changes
```powershell
# Using Docker Compose
docker-compose up --build

# Using Docker CLI
docker build -t travel-agency . --no-cache
docker stop travel-agency-app
docker rm travel-agency-app
docker run -p 3000:3000 --env-file .env.local -v ${PWD}/.env.local:/app/.env.local:ro --name travel-agency-app travel-agency
```

## Production Deployment

For production deployment:

1. **Use environment variables** instead of mounting `.env.local`
2. **Set `VITE_BASE_URL`** to your production domain
3. **Use a reverse proxy** (like Nginx) for HTTPS
4. **Consider using orchestration** (Kubernetes, Docker Swarm) for scaling

### Example Production Run
```powershell
docker run -d -p 3000:3000 `
  -e GEMINI_API_KEY="your-key" `
  -e UNSPLASH_ACCESS_KEY="your-key" `
  -e STRIPE_SECRET_KEY="your-key" `
  -e VITE_BASE_URL="https://yourdomain.com" `
  -e VITE_APPWRITE_PROJECT_ID="your-id" `
  -e VITE_APPWRITE_API_ENDPOINT="your-endpoint" `
  -e VITE_APPWRITE_API_KEY="your-key" `
  -e VITE_APPWRITE_DATABASE_ID="your-id" `
  -e VITE_APPWRITE_USERS_COLLECTION_ID="your-id" `
  -e VITE_APPWRITE_TRIPS_COLLECTION_ID="your-id" `
  -e VITE_SYNCFUSION_LICENSE_KEY="your-key" `
  --name travel-agency-app `
  --restart unless-stopped `
  travel-agency
```
