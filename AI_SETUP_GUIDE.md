# 🤖 AI Integration Setup Guide

## Overview

The Road to 1% app now includes powerful AI capabilities powered by Anthropic's Claude AI. This guide will help you set up and deploy the AI features.

## 🚀 What's New

### AI-Powered Features
- **Personalized Action Plans**: AI generates tailored business strategies based on your assessment results
- **AI Business Coach**: Conversational assistant for trucking business advice
- **Smart Insights**: AI analyzes your progress and provides actionable recommendations
- **Adaptive Assessments**: Intelligent questioning based on your responses

### Technical Implementation
- Anthropic Claude Sonnet 4 (most powerful available)
- Structured prompt engineering for consistent, high-quality responses
- Context-aware conversations with full assessment history
- Privacy-first design with data anonymization

## 📋 Prerequisites

- Node.js 18+
- Supabase account and project
- Anthropic API key (get one at [anthropic.com](https://anthropic.com))

## ⚙️ Setup Instructions

### 1. Install Dependencies

The Anthropic SDK has already been installed. If you need to reinstall:

```bash
npm install @anthropic-ai/sdk
```

### 2. Environment Variables

Add the following to your `.env.local` file:

```env
# Anthropic AI Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Existing Supabase variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Getting an Anthropic API Key:**
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up for an account
3. Create a new API key
4. Copy the key and add it to your environment variables

### 3. Database Migration

Run the AI migration in your Supabase SQL editor:

```sql
-- Copy and paste the contents of database_migration_ai.sql
```

This creates the following tables:
- `ai_insights`: Stores AI-generated recommendations and plans
- `ai_conversations`: Chat history with the AI coach
- `user_ai_preferences`: User preferences for AI features
- `ai_usage_metrics`: Analytics for AI feature usage

### 4. Test the Integration

Start your development server:

```bash
npm run dev
```

Visit the insights page (`/dashboard/insights`) and try the AI Action Plan Generator.

## 🏗️ Architecture Overview

### Core AI Components

```
src/lib/ai/
├── promptTemplates.ts      # Structured prompts for Claude
├── recommendationEngine.ts # Core AI service layer
├── chatContext.ts         # Conversation management
└── predictiveAnalytics.ts # Future: ML predictions
```

### API Endpoints

```
src/app/api/ai/
├── generate-plan/route.ts  # AI action plan generation
├── chat/route.ts          # Conversational AI coach
└── weekly-summary/route.ts # Future: Weekly insights
```

### Components

```
src/components/
├── ai/
│   └── AICoach.tsx        # Chat interface
├── planning/
│   └── AIActionPlanGenerator.tsx # Enhanced plan generator
```

## 🔒 Privacy & Security

### Data Handling
- **Anonymization**: User data is anonymized before sending to Claude
- **PII Removal**: Names, emails, and sensitive financial data are removed
- **Context Only**: Only assessment scores and business metrics are shared
- **No Storage**: AI conversations are not stored on Anthropic's servers

### Example Anonymized Prompt
```json
{
  "userId": "user_12345",
  "tier": "90%",
  "scores": {
    "financial": 25,
    "business": 18,
    "personal": 22
  },
  "strengths": ["Pioneer", "Connector"]
}
```

## 🎯 AI Features in Detail

### 1. AI Action Plan Generator

**Location**: `src/components/planning/AIActionPlanGenerator.tsx`

**Features**:
- 3-month, 6-month, or custom timeframes
- Focus area selection (Financial, Business, Personal, Health)
- Challenge description for personalized plans
- Real-time AI generation with progress indicators

**Usage**:
```tsx
<AIActionPlanGenerator
  assessmentScores={scores}
  userTier="90%"
  onGeneratePlan={(plan) => console.log(plan)}
/>
```

### 2. AI Business Coach

**Location**: `src/components/ai/AICoach.tsx`

**Features**:
- Conversational interface with chat history
- Context-aware responses using your assessment data
- Trucking industry expertise
- Quick suggestion buttons for common questions

**Usage**:
```tsx
<AICoach
  isOpen={showCoach}
  onClose={() => setShowCoach(false)}
  userName="John"
/>
```

### 3. AI Insights Engine

**Location**: `src/lib/ai/recommendationEngine.ts`

**Features**:
- Weekly progress summaries
- Predictive analytics (future enhancement)
- Personalized recommendations
- Performance benchmarking

## 🔧 Customization

### Adjusting AI Personality

Edit `src/lib/ai/promptTemplates.ts` to customize:
- Response style (casual vs professional)
- Industry focus
- Depth of recommendations

### Modifying Assessment Context

Update `src/lib/ai/chatContext.ts` to include:
- Additional user data in context
- Custom conversation starters
- Specialized prompts for different user tiers

## 📊 Monitoring & Analytics

### Usage Tracking

The system tracks:
- API calls and token usage
- Response quality ratings
- Feature engagement metrics
- Conversation topics

### Database Tables for Analytics

```sql
-- View AI usage metrics
SELECT feature_type, COUNT(*) as usage_count
FROM ai_usage_metrics
GROUP BY feature_type;

-- View conversation topics
SELECT user_message, ai_response
FROM ai_conversations
ORDER BY created_at DESC
LIMIT 10;
```

## 🚀 Deployment Considerations

### Production Environment

1. **API Key Security**: Store Anthropic key as an environment variable
2. **Rate Limiting**: Implement request throttling for AI endpoints
3. **Caching**: Cache common AI responses to reduce API costs
4. **Monitoring**: Set up alerts for API failures

### Cost Optimization

- **Token Limits**: Set reasonable token limits for responses
- **Caching**: Cache similar requests
- **Batch Processing**: Group similar AI requests
- **Usage Monitoring**: Track costs and optimize prompts

## 🐛 Troubleshooting

### Common Issues

**"API key not found"**
- Check your `.env.local` file has `ANTHROPIC_API_KEY`
- Restart your development server

**"Failed to generate action plan"**
- Verify your Anthropic API key is valid
- Check Supabase connection
- Review server logs for detailed errors

**Slow AI responses**
- Claude responses typically take 2-5 seconds
- Check your internet connection
- Consider implementing response caching

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
ANTHROPIC_DEBUG=true
```

## 📈 Future Enhancements

### Planned Features
1. **Predictive Analytics**: Forecast user progress trajectories
2. **Document Processing**: AI analysis of financial documents
3. **Peer Matching**: AI-powered community connections
4. **Automated Reminders**: Smart notification scheduling

### Integration Points
- RoadScholar API (when available)
- Advanced analytics dashboard
- Mobile push notifications
- Voice interface for coaches

## 🎉 Success Metrics

Track these KPIs to measure AI feature success:

- **Engagement**: 50% increase in weekly active users
- **Plan Completion**: 30% improvement in assessment completion
- **User Satisfaction**: 4.5+ star rating for AI features
- **Progress Acceleration**: 25% faster tier progression
- **Cost Efficiency**: <$0.10 per AI interaction

## 📞 Support

For issues with AI integration:
1. Check the Anthropic status page
2. Review server logs for API errors
3. Test with a simple prompt first
4. Contact the development team

---

**Ready to revolutionize trucking business coaching with AI! 🚛✨**
