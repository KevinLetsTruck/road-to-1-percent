-- AI Integration Database Migration
-- Add tables for AI-powered features in the Road to 1% app

-- Create ai_insights table to store AI-generated recommendations and insights
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('action_plan', 'weekly_summary', 'insight', 'prediction')),
  content JSONB NOT NULL,
  focus_areas TEXT[] DEFAULT '{}',
  time_frame TEXT,
  is_active BOOLEAN DEFAULT true,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_conversations table to store chat history
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  conversation_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  message_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_ai_preferences table for personalization
CREATE TABLE IF NOT EXISTS user_ai_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  ai_features_enabled BOOLEAN DEFAULT true,
  conversation_style TEXT DEFAULT 'professional' CHECK (conversation_style IN ('casual', 'professional', 'detailed')),
  notification_preferences JSONB DEFAULT '{"weekly_summary": true, "insights": true, "reminders": false}',
  data_sharing_consent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_usage_metrics table for analytics
CREATE TABLE IF NOT EXISTS ai_usage_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  feature_type TEXT NOT NULL CHECK (feature_type IN ('chat', 'action_plan', 'insights', 'predictions')),
  tokens_used INTEGER DEFAULT 0,
  response_quality_rating INTEGER CHECK (response_quality_rating >= 1 AND response_quality_rating <= 5),
  usage_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_type ON ai_insights(user_id, type);
CREATE INDEX IF NOT EXISTS idx_ai_insights_generated_at ON ai_insights(generated_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_conversation ON ai_conversations(user_id, conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created_at ON ai_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_metrics_user_date ON ai_usage_metrics(user_id, usage_date);

-- Add RLS policies
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ai_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_metrics ENABLE ROW LEVEL SECURITY;

-- AI Insights policies
CREATE POLICY "Users can view their own AI insights" ON ai_insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI insights" ON ai_insights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI insights" ON ai_insights
  FOR UPDATE USING (auth.uid() = user_id);

-- AI Conversations policies
CREATE POLICY "Users can view their own conversations" ON ai_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" ON ai_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User AI Preferences policies
CREATE POLICY "Users can view their own AI preferences" ON user_ai_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI preferences" ON user_ai_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI preferences" ON user_ai_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- AI Usage Metrics policies (admin only for viewing)
CREATE POLICY "Users can insert their own usage metrics" ON ai_usage_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to get or create user AI preferences
CREATE OR REPLACE FUNCTION get_or_create_ai_preferences(user_uuid UUID)
RETURNS user_ai_preferences AS $$
DECLARE
  prefs user_ai_preferences;
BEGIN
  -- Try to get existing preferences
  SELECT * INTO prefs FROM user_ai_preferences WHERE user_id = user_uuid;

  -- If not found, create default preferences
  IF NOT FOUND THEN
    INSERT INTO user_ai_preferences (user_id) VALUES (user_uuid)
    RETURNING * INTO prefs;
  END IF;

  RETURN prefs;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old conversations (keep last 100 messages per user)
CREATE OR REPLACE FUNCTION cleanup_old_conversations()
RETURNS void AS $$
BEGIN
  DELETE FROM ai_conversations
  WHERE id IN (
    SELECT id FROM (
      SELECT id,
             ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
      FROM ai_conversations
    ) ranked
    WHERE rn > 100
  );
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE ai_insights IS 'Stores AI-generated insights, action plans, and recommendations';
COMMENT ON TABLE ai_conversations IS 'Stores chat conversations between users and AI coach';
COMMENT ON TABLE user_ai_preferences IS 'User preferences for AI features and personalization';
COMMENT ON TABLE ai_usage_metrics IS 'Analytics for AI feature usage and performance';

-- Insert default preferences for existing users who don't have them
INSERT INTO user_ai_preferences (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_ai_preferences)
ON CONFLICT (user_id) DO NOTHING;
