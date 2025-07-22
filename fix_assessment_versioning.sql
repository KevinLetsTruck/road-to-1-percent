-- Fix for Missing Assessment Versioning Functions
-- Run this in your Supabase SQL Editor to fix the "get_next_version_number" error

-- Create assessment history table to track versions over time
CREATE TABLE IF NOT EXISTS assessment_history (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_data JSONB NOT NULL,
  
  -- Scores
  total_spi_score INTEGER NOT NULL,
  financial_foundation_score NUMERIC(4, 2) NOT NULL,
  market_intelligence_score NUMERIC(4, 2) NOT NULL,
  risk_management_score NUMERIC(4, 2) NOT NULL,
  support_systems_score NUMERIC(4, 2) NOT NULL,
  standout_bonus NUMERIC(4, 2) NOT NULL,
  
  -- Tier and strengths
  current_tier VARCHAR(10) NOT NULL,
  standout_strength_1 VARCHAR(50),
  standout_strength_2 VARCHAR(50),
  
  -- Version tracking
  version_number INTEGER NOT NULL,
  is_current BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure unique version numbers per user
  UNIQUE(user_id, version_number)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_assessment_history_user_id ON assessment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_history_created_at ON assessment_history(created_at);
CREATE INDEX IF NOT EXISTS idx_assessment_history_is_current ON assessment_history(is_current);

-- Function to get the next version number for a user
CREATE OR REPLACE FUNCTION get_next_version_number(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE(
    (SELECT MAX(version_number) + 1 
     FROM assessment_history 
     WHERE user_id = p_user_id),
    1
  );
END;
$$ LANGUAGE plpgsql;

-- Function to set current assessment
CREATE OR REPLACE FUNCTION set_current_assessment(p_user_id UUID, p_version_number INTEGER)
RETURNS VOID AS $$
BEGIN
  -- First, set all assessments for this user to not current
  UPDATE assessment_history 
  SET is_current = false 
  WHERE user_id = p_user_id;
  
  -- Then set the specified version as current
  UPDATE assessment_history 
  SET is_current = true 
  WHERE user_id = p_user_id AND version_number = p_version_number;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT ALL ON assessment_history TO authenticated;
GRANT ALL ON assessment_history_id_seq TO authenticated;
GRANT EXECUTE ON FUNCTION get_next_version_number(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION set_current_assessment(UUID, INTEGER) TO authenticated;