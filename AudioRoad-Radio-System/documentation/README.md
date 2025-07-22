# AudioRoad Radio System - Complete Documentation

## 🎯 Project Overview

The AudioRoad Radio System is a comprehensive WebRTC-based solution for managing radio show callers, screeners, and hosts. It provides real-time audio connections, call management, and integration with existing radio show workflows.

## 📁 Project Structure

```
AudioRoad-Radio-System/
├── radio-screener-app/        # Screener frontend (working)
├── enhanced-host-dashboard/   # Host frontend (working)
├── audioroad-webrtc-system/   # Backend API (working)
├── webrtc-server/            # WebRTC server (needs completion)
├── documentation/            # All project docs
└── env.example              # Environment variables template
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# WebRTC Server
cd webrtc-server
npm install

# Screener App
cd ../radio-screener-app
npm install

# Host Dashboard
cd ../enhanced-host-dashboard
npm install

# Backend API
cd ../audioroad-webrtc-system
npm install
```

### 2. Environment Setup

Copy `env.example` to `.env` in each project directory and configure:

```bash
# Backend API (.env)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
PORT=8080

# WebRTC Server (.env)
PORT=3002
BACKEND_API=https://audioroad-webrtc-system.onrender.com
ALLOWED_ORIGINS=https://webrtcaudio.netlify.app,https://myshowconsole.netlify.app
```

### 3. Start Development Servers

```bash
# Terminal 1: WebRTC Server
cd webrtc-server
npm run dev

# Terminal 2: Screener App
cd radio-screener-app
npm start

# Terminal 3: Host Dashboard
cd enhanced-host-dashboard
npm start

# Terminal 4: Backend API
cd audioroad-webrtc-system
npm run dev
```

## 🔧 Core Components

### WebRTC Server (`webrtc-server/`)

**Purpose**: Handles real-time audio connections between callers and screeners

**Key Features**:
- Socket.IO signaling for WebRTC connections
- Caller registration and queue management
- Screener notification system
- Audio stream routing

**Files**:
- `server.js` - Main server implementation
- `public/caller.html` - Caller interface
- `package.json` - Dependencies

### Screener App (`radio-screener-app/`)

**Purpose**: Interface for radio show screeners to manage incoming calls

**Key Features**:
- View incoming caller queue
- Accept/reject calls
- Audio quality testing
- Caller information display

### Host Dashboard (`enhanced-host-dashboard/`)

**Purpose**: Main interface for radio show hosts

**Key Features**:
- Show management
- Caller queue overview
- Audio controls
- Show scheduling

### Backend API (`audioroad-webrtc-system/`)

**Purpose**: Database and business logic management

**Key Features**:
- Call records management
- User authentication
- Show scheduling
- Analytics and reporting

## 🌐 Deployment

### Production URLs

- **WebRTC Server**: `https://webrtc.yourdomain.com`
- **Screener App**: `https://webrtcaudio.netlify.app`
- **Host Dashboard**: `https://myshowconsole.netlify.app`
- **Backend API**: `https://audioroad-webrtc-system.onrender.com`

### Deployment Commands

```bash
# WebRTC Server (Digital Ocean)
pm2 start server.js --name "webrtc-server"
pm2 startup
pm2 save

# Frontend Apps (Netlify)
git push origin main  # Auto-deploys

# Backend API (Render)
git push origin main  # Auto-deploys
```

## 📞 Usage Workflow

### 1. Caller Experience

1. Caller clicks link: `https://webrtc.yourdomain.com/call/12345`
2. Browser requests microphone access
3. Caller automatically joins queue
4. Screener receives notification
5. Screener accepts call
6. WebRTC connection established
7. Audio quality testing
8. Call proceeds to host

### 2. Screener Workflow

1. Screener logs into screener app
2. Views incoming caller queue
3. Accepts calls for screening
4. Tests audio quality
5. Approves/rejects callers
6. Sends approved callers to host

### 3. Host Workflow

1. Host logs into dashboard
2. Views approved caller queue
3. Manages show flow
4. Controls audio levels
5. Records show content

## 🔒 Security Considerations

- HTTPS required for WebRTC
- CORS properly configured
- Input validation on all endpoints
- Rate limiting on API calls
- Secure WebSocket connections

## 📊 Monitoring

### Health Checks

- WebRTC Server: `GET /api/status`
- Backend API: `GET /health`
- Frontend Apps: Built-in error tracking

### Metrics to Track

- Connection success rate
- Audio quality scores
- Call duration
- User satisfaction
- System uptime

## 🐛 Troubleshooting

### Common Issues

1. **Microphone Access Denied**
   - Check browser permissions
   - Ensure HTTPS connection
   - Test with different browser

2. **WebRTC Connection Fails**
   - Check STUN server availability
   - Verify firewall settings
   - Test network connectivity

3. **Audio Quality Issues**
   - Check internet connection
   - Verify microphone quality
   - Test with different devices

### Debug Commands

```bash
# Check WebRTC server status
curl https://webrtc.yourdomain.com/api/status

# Check backend API health
curl https://audioroad-webrtc-system.onrender.com/health

# Monitor WebRTC server logs
pm2 logs webrtc-server
```

## 📈 Future Enhancements

- Video support for premium shows
- AI-powered caller screening
- Advanced analytics dashboard
- Mobile app development
- Integration with more radio platforms

## 📞 Support

For technical support or questions:
- Check this documentation first
- Review GitHub issues
- Contact development team
- Emergency: Use backup phone system

---

*Last updated: [Current Date]*
*Version: 1.0.0* 