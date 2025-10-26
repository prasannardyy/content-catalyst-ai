#!/bin/bash

echo "🚀 Starting Content Catalyst AI in Demo Mode..."
echo ""

# Check if backend dependencies are installed
if ! python3 -c "import fastapi" 2>/dev/null; then
    echo "❌ Backend dependencies not found. Installing..."
    cd backend && pip3 install -r requirements.txt && cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Frontend dependencies not found. Installing..."
    cd frontend && npm install && cd ..
fi

echo "✅ Dependencies ready"
echo ""
echo "🎬 Demo Mode Features:"
echo "   • No external API setup required"
echo "   • Mock AI-generated content"
echo "   • Full UI/UX experience"
echo "   • Instant project processing"
echo ""
echo "📱 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "🛑 Press Ctrl+C to stop both servers"
echo ""

# Start both servers using the npm script
npm run dev