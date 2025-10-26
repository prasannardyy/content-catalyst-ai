#!/bin/bash

echo "🔧 Quick Vercel Fix..."

# Create a temporary package.json at root with Next.js
cat > package.json << 'EOF'
{
  "name": "content-catalyst-ai",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "cd frontend && npm install && npm run build",
    "start": "cd frontend && npm start",
    "dev": "cd frontend && npm run dev"
  },
  "dependencies": {
    "next": "14.0.3",
    "react": "^18",
    "react-dom": "^18"
  }
}
EOF

echo "✅ Created root package.json with Next.js dependency"
echo "📝 Now commit and push:"
echo "   git add package.json"
echo "   git commit -m 'Add Next.js to root package.json for Vercel'"
echo "   git push origin main"
echo ""
echo "🚀 Then redeploy in Vercel!"