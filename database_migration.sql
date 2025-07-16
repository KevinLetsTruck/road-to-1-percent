-- Database Migration for Road to 1% - Comprehensive SPI Assessment
-- Run this in your Supabase SQL Editor

-- Create user_tier enum type
CREATE TYPE user_tier AS ENUM ('90%', '9%', '1%');

-- Create assessment_period enum type
CREATE TYPE assessment_period AS ENUM ('Q1', 'Q2', 'Q3', 'Q4');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  current_tier user_tier DEFAULT '90%',
  spi_completed BOOLEAN DEFAULT false,
  spi_score NUMERIC DEFAULT 0,
  standout_completed BOOLEAN DEFAULT false,
  standout_score NUMERIC DEFAULT 0,
  leadership_completed BOOLEAN DEFAULT false,
  leadership_score NUMERIC DEFAULT 0,
  customer_service_completed BOOLEAN DEFAULT false,
  customer_service_score NUMERIC DEFAULT 0,
  operational_completed BOOLEAN DEFAULT false,
  operational_score NUMERIC DEFAULT 0,
  health_completed BOOLEAN DEFAULT false,
  health_score NUMERIC DEFAULT 0,
  financial_foundation_completed BOOLEAN DEFAULT false,
  financial_foundation_score NUMERIC DEFAULT 0,
  market_intelligence_completed BOOLEAN DEFAULT false,
  market_intelligence_score NUMERIC DEFAULT 0,
  personal_strengths_completed BOOLEAN DEFAULT false,
  personal_strengths_score NUMERIC DEFAULT 0,
  risk_management_completed BOOLEAN DEFAULT false,
  risk_management_score NUMERIC DEFAULT 0,
  support_systems_completed BOOLEAN DEFAULT false,
  support_systems_score NUMERIC DEFAULT 0,
  business_track_progress INTEGER DEFAULT 0,
  personal_track_progress INTEGER DEFAULT 0,
  health_track_progress INTEGER DEFAULT 0,
  milestones_achieved JSONB DEFAULT '[]',
  program_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_assessment_date TIMESTAMP WITH TIME ZONE,
  next_quarterly_assessment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comprehensive_assessments table
CREATE TABLE IF NOT EXISTS comprehensive_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Current Situation
  current_situation TEXT,
  fleet_size INTEGER,
  load_sources TEXT[],
  
  -- Standout Assessment Results
  standout_strength_1 TEXT,
  standout_strength_2 TEXT,
  
  -- Financial Foundation (35 points)
  net_worth NUMERIC DEFAULT 0,
  monthly_savings NUMERIC DEFAULT 0,
  emergency_fund_months INTEGER DEFAULT 0,
  debt_to_income_ratio NUMERIC DEFAULT 0,
  business_capital NUMERIC DEFAULT 0,
  credit_score INTEGER DEFAULT 0,
  
  -- Market Intelligence (20 points)
  rate_understanding INTEGER DEFAULT 0,
  cost_analysis INTEGER DEFAULT 0,
  customer_knowledge INTEGER DEFAULT 0,
  industry_trends INTEGER DEFAULT 0,
  strategic_planning INTEGER DEFAULT 0,
  
  -- Personal Strengths (20 points)
  pioneer_strength INTEGER DEFAULT 0,
  creator_strength INTEGER DEFAULT 0,
  innovator_strength INTEGER DEFAULT 0,
  connector_strength INTEGER DEFAULT 0,
  advisor_strength INTEGER DEFAULT 0,
  
  -- Risk Management (15 points)
  contingency_planning INTEGER DEFAULT 0,
  business_continuity INTEGER DEFAULT 0,
  risk_assessment INTEGER DEFAULT 0,
  
  -- Support Systems (10 points)
  family_alignment INTEGER DEFAULT 0,
  professional_network INTEGER DEFAULT 0,
  mentorship INTEGER DEFAULT 0,
  industry_reputation INTEGER DEFAULT 0,
  
  -- Calculated Scores
  total_spi_score NUMERIC DEFAULT 0,
  tier user_tier DEFAULT '90%',
  strength_combination TEXT,
  
  assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quarterly_assessments table
CREATE TABLE IF NOT EXISTS quarterly_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  assessment_period assessment_period NOT NULL,
  year INTEGER NOT NULL,
  
  -- Financial Metrics
  current_net_worth NUMERIC DEFAULT 0,
  net_worth_change NUMERIC DEFAULT 0,
  monthly_revenue NUMERIC DEFAULT 0,
  monthly_expenses NUMERIC DEFAULT 0,
  profit_margin NUMERIC DEFAULT 0,
  emergency_fund_months INTEGER DEFAULT 0,
  
  -- Business Metrics
  active_customers INTEGER DEFAULT 0,
  customer_retention_rate NUMERIC DEFAULT 0,
  average_rate_per_mile NUMERIC DEFAULT 0,
  miles_per_month INTEGER DEFAULT 0,
  equipment_utilization NUMERIC DEFAULT 0,
  
  -- Personal Development
  skills_improved TEXT[],
  certifications_earned TEXT[],
  networking_events_attended INTEGER DEFAULT 0,
  mentorship_sessions INTEGER DEFAULT 0,
  
  -- Health & Wellness
  health_score INTEGER DEFAULT 0,
  stress_level INTEGER DEFAULT 0,
  work_life_balance INTEGER DEFAULT 0,
  sleep_quality INTEGER DEFAULT 0,
  
  -- Goals & Planning
  goals_achieved TEXT[],
  goals_set_for_next_quarter TEXT[],
  challenges_faced TEXT[],
  lessons_learned TEXT[],
  
  -- Overall Assessment
  overall_satisfaction INTEGER DEFAULT 0,
  confidence_level INTEGER DEFAULT 0,
  readiness_for_next_tier INTEGER DEFAULT 0,
  
  -- Calculated Fields
  total_score NUMERIC DEFAULT 0,
  tier_progress NUMERIC DEFAULT 0,
  
  assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, assessment_period, year)
);

-- Create assessment_reminders table
CREATE TABLE IF NOT EXISTS assessment_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  reminder_type TEXT NOT NULL, -- 'quarterly', 'comprehensive', 'individual'
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create action_plans table
CREATE TABLE IF NOT EXISTS action_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  assessment_id UUID,
  plan_type TEXT NOT NULL, -- 'comprehensive', 'quarterly', 'individual'
  
  -- Plan Details
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  category TEXT NOT NULL, -- 'financial', 'business', 'personal', 'health'
  
  -- Goals
  goal TEXT NOT NULL,
  target_value NUMERIC,
  current_value NUMERIC,
  unit TEXT, -- 'dollars', 'percentage', 'number', etc.
  
  -- Timeline
  start_date DATE,
  target_date DATE,
  completed_date DATE,
  
  -- Actions
  actions JSONB DEFAULT '[]',
  resources_needed TEXT[],
  
  -- Progress Tracking
  progress_percentage NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed', 'overdue'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create progress_milestones table
CREATE TABLE IF NOT EXISTS progress_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  milestone_type TEXT NOT NULL, -- 'tier_upgrade', 'assessment_completion', 'goal_achievement'
  title TEXT NOT NULL,
  description TEXT,
  achieved_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_comprehensive_assessments_user_id ON comprehensive_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_quarterly_assessments_user_id ON quarterly_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_quarterly_assessments_period_year ON quarterly_assessments(assessment_period, year);
CREATE INDEX IF NOT EXISTS idx_assessment_reminders_user_id ON assessment_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_reminders_due_date ON assessment_reminders(due_date);
CREATE INDEX IF NOT EXISTS idx_action_plans_user_id ON action_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_milestones_user_id ON progress_milestones(user_id);

-- Create trigger function to update user_progress when comprehensive assessment is submitted
CREATE OR REPLACE FUNCTION update_user_progress_from_comprehensive()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user_progress table
  INSERT INTO user_progress (
    user_id,
    spi_completed,
    spi_score,
    current_tier,
    last_assessment_date,
    next_quarterly_assessment_date,
    updated_at
  ) VALUES (
    NEW.user_id,
    true,
    NEW.total_spi_score,
    NEW.tier,
    NEW.assessment_date,
    NEW.assessment_date + INTERVAL '3 months',
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    spi_completed = true,
    spi_score = NEW.total_spi_score,
    current_tier = NEW.tier,
    last_assessment_date = NEW.assessment_date,
    next_quarterly_assessment_date = NEW.assessment_date + INTERVAL '3 months',
    updated_at = NOW();
  
  -- Mark standout assessment as completed
  UPDATE user_progress 
  SET standout_completed = true,
      updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for comprehensive assessment
DROP TRIGGER IF EXISTS trigger_comprehensive_assessment ON comprehensive_assessments;
CREATE TRIGGER trigger_comprehensive_assessment
  AFTER INSERT ON comprehensive_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_user_progress_from_comprehensive();

-- Create trigger function to update quarterly assessment reminders
CREATE OR REPLACE FUNCTION create_quarterly_assessment_reminder()
RETURNS TRIGGER AS $$
BEGIN
  -- Create reminder for next quarterly assessment
  INSERT INTO assessment_reminders (
    user_id,
    reminder_type,
    due_date
  ) VALUES (
    NEW.user_id,
    'quarterly',
    NEW.next_quarterly_assessment_date
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for quarterly assessment reminders
DROP TRIGGER IF EXISTS trigger_quarterly_reminder ON user_progress;
CREATE TRIGGER trigger_quarterly_reminder
  AFTER INSERT OR UPDATE ON user_progress
  FOR EACH ROW
  WHEN (NEW.next_quarterly_assessment_date IS NOT NULL)
  EXECUTE FUNCTION create_quarterly_assessment_reminder();

-- Create function to calculate next quarterly assessment date
CREATE OR REPLACE FUNCTION get_next_quarterly_date()
RETURNS DATE AS $$
DECLARE
  current_date DATE := CURRENT_DATE;
  current_quarter INTEGER;
  current_year INTEGER;
  next_quarter_date DATE;
BEGIN
  current_year := EXTRACT(YEAR FROM current_date);
  current_quarter := EXTRACT(QUARTER FROM current_date);
  
  -- Calculate next quarter
  IF current_quarter = 4 THEN
    next_quarter_date := DATE(current_year + 1 || '-01-01');
  ELSE
    next_quarter_date := DATE(current_year || '-' || (current_quarter * 3 + 1) || '-01');
  END IF;
  
  RETURN next_quarter_date;
END;
$$ LANGUAGE plpgsql;

-- Create function to get assessment period from date
CREATE OR REPLACE FUNCTION get_assessment_period(input_date DATE)
RETURNS TEXT AS $$
DECLARE
  quarter INTEGER;
  year INTEGER;
BEGIN
  year := EXTRACT(YEAR FROM input_date);
  quarter := EXTRACT(QUARTER FROM input_date);
  
  RETURN 'Q' || quarter || ' ' || year;
END;
$$ LANGUAGE plpgsql; 