#!/bin/bash

echo "🚀 Setting up Content Catalyst AI..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip3 install -r requirements.txt
cd ..

# Copy environment files
echo "📝 Setting up environment files..."
if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.example frontend/.env.local
    echo "✅ Created frontend/.env.local - Please update with your configuration"
fi

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env - Please update with your configuration"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update the environment files with your API keys and configuration"
echo "2. Set up your Supabase project and run the database schema"
echo "3. Configure your Google Cloud, Azure AI, and Bannerbear accounts"
echo "4. Run 'npm run dev' to start the development servers"
echo ""
echo "📚 Check the README.md for detailed setup instructions"