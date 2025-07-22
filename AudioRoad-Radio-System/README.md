# 🎙️ AudioRoad Radio System

**Professional WebRTC call-in show and podcast system with AI-powered analysis**

A modern, scalable WebRTC server for hosting professional call-in shows, podcasts, and live radio broadcasts with real-time AI analysis, caller screening, and comprehensive management tools.

## ✨ Features

### 🎧 **Modern Interfaces**
- **Beautiful caller interface** with real-time connection status
- **Professional screener dashboard** with live queue management
- **Host control panel** for show management
- **Mobile-responsive design** for all devices

### 🤖 **AI-Powered Analysis**
- **Real-time caller topic analysis** (relevance, category, audience interest)
- **Smart screening recommendations** (approve/reject/hold)
- **On-air content analysis** (sentiment, key points, follow-up questions)
- **Automatic show summaries** with insights

### 📊 **Advanced Management**
- **Live caller queue** with priority management
- **Real-time statistics** (caller count, wait times, show metrics)
- **Call history** and analytics
- **User management** (screeners, hosts, permissions)

### 🔒 **Production Ready**
- **Secure WebRTC connections** with encryption
- **Rate limiting** and DDoS protection
- **CORS protection** for cross-origin requests
- **Comprehensive error handling** and logging

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm
- **Git** for version control
- **OpenAI API key** (optional, for AI features)
- **Supabase account** (optional, for database)

### Local Development

1. **Navigate to the project directory**
```bash
cd AudioRoad-Radio-System
```

2. **Install WebRTC server dependencies**
```bash
cd webrtc-server
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env
# Edit .env with your configuration
```

4. **Start the WebRTC server**
```bash
npm start
```

5. **Access the interfaces**
- **Caller Interface**: http://localhost:3002/caller.html
- **Screener Dashboard**: http://localhost:3002/screener-dashboard
- **Host Dashboard**: http://localhost:3002/host.html
- **API Status**: http://localhost:3002/api/status

## 🏗️ Architecture

### **Core Components**
- **Express.js server** with Socket.IO for real-time communication
- **WebRTC signaling** for peer-to-peer audio connections
- **AI integration** with OpenAI for content analysis
- **Database integration** with Supabase for persistence
- **Security middleware** for protection and rate limiting

### **Real-time Features**
- **Live caller queue** management
- **Instant screener notifications**
- **Real-time AI analysis** updates
- **Live show statistics**

## 🤖 AI Integration

### **Caller Topic Analysis**
The system analyzes caller topics in real-time to provide:
- **Relevance scoring** (1-10 scale)
- **Category classification** (business, health, regulations, personal)
- **Audience interest prediction**
- **Screening recommendations**

### **On-air Analysis**
During live shows, AI provides:
- **Sentiment analysis** of caller content
- **Key point extraction** for hosts
- **Follow-up question suggestions**
- **Content moderation** alerts

## 📊 API Endpoints

### **Status & Health**
- `GET /api/status` - Server status and statistics
- `GET /api/health` - Health check endpoint

### **Caller Management**
- `GET /api/callers` - List all active callers
- `GET /api/call-history` - Call history and analytics

### **Show Management**
- `GET /api/show-summaries` - Show summaries and insights
- `POST /api/shows` - Create new show session

## 🔧 Configuration

### **Environment Variables**

#### **Required**
```bash
NODE_ENV=production
PORT=3002
```

#### **AI Features (Optional)**
```bash
OPENAI_API_KEY=your_openai_api_key
```

#### **Database (Optional)**
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

#### **Security**
```bash
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📁 Project Structure

```
AudioRoad-Radio-System/
├── webrtc-server/           # Main WebRTC server
│   ├── server.js           # Main server file
│   ├── public/             # Static files
│   │   ├── caller.html     # Caller interface
│   │   ├── screener.html   # Basic screener interface
│   │   └── host.html       # Host dashboard
│   ├── screener-dashboard/ # Modern React screener app
│   ├── package.json        # Dependencies
│   └── env.example         # Environment template
├── documentation/          # Project documentation
├── start-dev.sh           # Development startup script
└── README.md              # This file
```

## 🚀 Deployment

### **Railway (Recommended)**
1. Connect your GitHub repository to Railway
2. Add environment variables in Railway dashboard
3. Deploy automatically on push to main branch

### **Other Platforms**
- **Render.com** - Free tier available
- **DigitalOcean App Platform** - More control
- **Heroku** - Classic choice

See `DEPLOYMENT.md` for detailed deployment instructions.

## 🔧 Development

### **Scripts**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (when implemented)

### **Database Setup**
Run the SQL from `database_schema.sql` in your Supabase SQL editor for full database functionality.

## 📞 Support

For support or questions:
- Create an issue in the repository
- Check the documentation folder
- Review the deployment guide

## 📄 License

This project is licensed under the MIT License. 