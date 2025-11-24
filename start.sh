#!/bin/bash

echo "🚀 Starting AI Coding Assistant..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file with your GROQ_API_KEY"
    exit 1
fi

# Start backend
echo "Starting backend server..."
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend in new terminal (macOS)
echo "Starting frontend..."
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && npm run dev"'

echo ""
echo "✅ Backend running on http://localhost:3000"
echo "✅ Frontend running on http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the backend"

# Wait for Ctrl+C
wait $BACKEND_PID
