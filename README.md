# Development Workspace

This workspace contains two separate projects:

## 📁 Projects

### 🎯 [Road to 1%](./road-to-1-percent/)
A comprehensive personal development platform designed to help professional drivers progress through different tiers (90%, 9%, 1%) by completing assessments and tracking their progress.

**Tech Stack**: Next.js 15, TypeScript, Supabase, Tailwind CSS

**Quick Start**:
```bash
cd road-to-1-percent
npm install
npm run dev
# Open http://localhost:3000
```

### 🎙️ [AudioRoad Radio System](./AudioRoad-Radio-System/)
A professional WebRTC call-in show and podcast system with AI-powered analysis for hosting live radio broadcasts.

**Tech Stack**: Node.js, Express, Socket.IO, WebRTC, OpenAI

**Quick Start**:
```bash
cd AudioRoad-Radio-System/webrtc-server
npm install
npm start
# Open http://localhost:3002
```

## 🚀 Development Workflow

### Running Both Projects

1. **Start Road to 1% (Port 3000)**
   ```bash
   cd road-to-1-percent
   npm run dev
   ```

2. **Start AudioRoad WebRTC Server (Port 3002)**
   ```bash
   cd AudioRoad-Radio-System/webrtc-server
   npm start
   ```

### Environment Setup

Each project has its own environment configuration:

- **Road to 1%**: Create `.env.local` in `road-to-1-percent/` directory
- **AudioRoad**: Create `.env` in `AudioRoad-Radio-System/webrtc-server/` directory

## 📋 Project Status

### Road to 1% ✅
- ✅ Next.js app running
- ✅ Quarterly assessment interface
- ✅ Dashboard and progress tracking
- 🔧 Needs Supabase setup for data persistence

### AudioRoad Radio System ✅
- ✅ WebRTC server running
- ✅ Caller interface
- ✅ Screener dashboard
- ✅ Host dashboard
- 🔧 Needs environment configuration for full features

## 🛠️ Next Steps

1. **Set up Supabase** for Road to 1% data persistence
2. **Configure environment variables** for both projects
3. **Test full functionality** of both applications
4. **Deploy to production** when ready

## 📚 Documentation

- [Road to 1% Documentation](./road-to-1-percent/README.md)
- [AudioRoad Radio System Documentation](./AudioRoad-Radio-System/README.md)
- [AudioRoad Deployment Guide](./AudioRoad-Radio-System/DEPLOYMENT.md) 