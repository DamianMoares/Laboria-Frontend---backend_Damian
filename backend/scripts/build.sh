#!/bin/bash

# Build script for Railway deployment
echo "🚀 Building Laboria Backend for Railway..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Build complete
echo "✅ Build complete!"
