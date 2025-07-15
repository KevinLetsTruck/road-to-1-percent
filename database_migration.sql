-- Migration to add missing columns to user_progress table
-- Run this in your Supabase SQL editor

-- Add Standout assessment columns
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS standout_role_1 TEXT,
ADD COLUMN IF NOT EXISTS standout_role_2 TEXT,
ADD COLUMN IF NOT EXISTS standout_score INTEGER DEFAULT 0;

-- Add Financial Foundation assessment columns
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS financial_foundation_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS financial_foundation_score INTEGER DEFAULT 0;

-- Add Industry Knowledge assessment columns
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS industry_knowledge_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS industry_knowledge_score INTEGER DEFAULT 0;

-- Add Leadership assessment columns
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS leadership_communication INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS leadership_decision_making INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS leadership_team_management INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS leadership_strategic_thinking INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS leadership_personal_development INTEGER DEFAULT 0;

-- Add score columns for other assessments
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS leadership_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS customer_service_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS operational_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS health_score INTEGER DEFAULT 0;

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_progress' 
ORDER BY ordinal_position; 