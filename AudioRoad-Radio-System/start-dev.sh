#!/bin/bash

echo "🎙️ Starting AudioRoad Radio System Development Environment..."

# Function to start a service
start_service() {
    local service_name=$1
    local service_path=$2
    local port=$3
    
    echo "Starting $service_name on port $port..."
    cd "$service_path"
    
    if [ "$service_name" = "WebRTC Server" ]; then
        npm run dev &
    else
        npm start &
    fi
    
    echo "$service_name started!"
    sleep 2
}

# Start all services
echo "📡 Starting WebRTC Server..."
start_service "WebRTC Server" "webrtc-server" 3002

echo "🎧 Starting Screener App..."
start_service "Screener App" "radio-screener-app" 3000

echo "🎤 Starting Host Dashboard..."
start_service "Host Dashboard" "enhanced-host-dashboard" 3001

echo "🔧 Starting Backend API..."
start_service "Backend API" "audioroad-webrtc-system" 8080

echo ""
echo "✅ All services started!"
echo ""
echo "🌐 Access your applications:"
echo "   WebRTC Server:     http://localhost:3002"
echo "   Screener App:      http://localhost:3000"
echo "   Host Dashboard:    http://localhost:3001"
echo "   Backend API:       http://localhost:8080"
echo ""
echo "📞 Test caller interface: http://localhost:3002/caller.html"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for user to stop
wait 