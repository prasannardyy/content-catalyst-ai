#!/bin/bash

echo "🚀 Setting up Content Catalyst AI locally..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local file not found"
    echo "📝 Creating .env.local template..."
    
    cat > .env.local << EOL
# Firebase Configuration (replace with your actual values)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDG4p5STGHfFi2M6Uedv2vEg6VWAQrcUNg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=contentcatalyst-1d0ea.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=contentcatalyst-1d0ea
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=contentcatalyst-1d0ea.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=277461592109
NEXT_PUBLIC_FIREBASE_APP_ID=1:277461592109:web:817bb87043b76a22c230a4

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_DEMO_MODE=false
EOL

    echo "✅ .env.local created with template values"
else
    echo "✅ .env.local already exists"
fi

# Build the application to check for errors
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for errors above."
    exit 1
fi

echo "✅ Build successful"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up Firebase Authentication:"
echo "   - Go to: https://console.firebase.google.com/project/contentcatalyst-1d0ea/authentication"
echo "   - Enable Email/Password and Google sign-in"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Visit: http://localhost:3001"
echo ""
echo "📖 For detailed instructions, see LOCAL_SETUP_GUIDE.md"