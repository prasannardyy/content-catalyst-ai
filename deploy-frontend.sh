#!/bin/bash

# Script to deploy only the frontend to Vercel
echo "🚀 Deploying frontend to Vercel..."

# Create a temporary directory for deployment
TEMP_DIR="temp-frontend-deploy"
rm -rf $TEMP_DIR
mkdir $TEMP_DIR

# Copy frontend files
cp -r frontend/* $TEMP_DIR/
cp frontend/.* $TEMP_DIR/ 2>/dev/null || true

# Copy necessary root files
cp README.md $TEMP_DIR/
cp LICENSE $TEMP_DIR/

echo "✅ Frontend files prepared for deployment"
echo "📁 Deploy the contents of '$TEMP_DIR' directory to Vercel"
echo ""
echo "Or use Vercel CLI:"
echo "cd $TEMP_DIR && vercel --prod"