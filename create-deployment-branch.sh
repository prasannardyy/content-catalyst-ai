#!/bin/bash

echo "🚀 Creating deployment branch with frontend at root..."

# Create and switch to deployment branch
git checkout -b vercel-deploy

# Move frontend files to root
cp -r frontend/* .
cp frontend/.* . 2>/dev/null || true

# Remove backend and other directories
rm -rf backend/
rm -rf scripts/
rm deploy-frontend.sh
rm create-deployment-branch.sh

# Update package.json name
sed -i '' 's/"content-catalyst-frontend"/"content-catalyst-ai"/' package.json

# Commit changes
git add .
git commit -m "Move frontend to root for Vercel deployment"

echo "✅ Deployment branch created!"
echo "📝 Now push this branch and connect it to Vercel:"
echo "   git push origin vercel-deploy"
echo ""
echo "🔧 In Vercel:"
echo "   1. Connect the 'vercel-deploy' branch"
echo "   2. Framework: Next.js"
echo "   3. Root Directory: (leave empty)"
echo "   4. Deploy!"