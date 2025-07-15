-- Database Migration for Road to 1% - Comprehensive SPI Assessment
-- Run this in your Supabase SQL Editor

-- Add missing columns to user_progress table
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS financial_foundation_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS financial_foundation_score INTEGER,
ADD COLUMN IF NOT EXISTS market_intelligence_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS market_intelligence_score INTEGER,
ADD COLUMN IF NOT EXISTS personal_strengths_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS personal_strengths_score INTEGER,
ADD COLUMN IF NOT EXISTS risk_management_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS risk_management_score INTEGER,
ADD COLUMN IF NOT EXISTS support_systems_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS support_systems_score INTEGER,
ADD COLUMN IF NOT EXISTS spi_score INTEGER,
ADD COLUMN IF NOT EXISTS standout_score INTEGER,
ADD COLUMN IF NOT EXISTS industry_knowledge_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS industry_knowledge_score INTEGER,
ADD COLUMN IF NOT EXISTS leadership_communication INTEGER,
ADD COLUMN IF NOT EXISTS leadership_decision_making INTEGER,
ADD COLUMN IF NOT EXISTS leadership_team_management INTEGER,
ADD COLUMN IF NOT EXISTS leadership_strategic_thinking INTEGER,
ADD COLUMN IF NOT EXISTS leadership_personal_development INTEGER;

-- Create comprehensive_assessments table for detailed SPI assessment data
CREATE TABLE IF NOT EXISTS comprehensive_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Financial Foundation (35 points)
  financial_emergency_fund INTEGER DEFAULT 0,
  financial_budget_tracking INTEGER DEFAULT 0,
  financial_debt_management INTEGER DEFAULT 0,
  financial_investment_strategy INTEGER DEFAULT 0,
  financial_insurance_coverage INTEGER DEFAULT 0,
  financial_tax_planning INTEGER DEFAULT 0,
  financial_retirement_planning INTEGER DEFAULT 0,
  
  -- Market Intelligence (20 points)
  market_industry_trends INTEGER DEFAULT 0,
  market_competitor_analysis INTEGER DEFAULT 0,
  market_customer_research INTEGER DEFAULT 0,
  market_technology_adoption INTEGER DEFAULT 0,
  market_regulatory_awareness INTEGER DEFAULT 0,
  
  -- Personal Strengths (20 points)
  personal_leadership_skills INTEGER DEFAULT 0,
  personal_communication_abilities INTEGER DEFAULT 0,
  personal_problem_solving INTEGER DEFAULT 0,
  personal_adaptability INTEGER DEFAULT 0,
  personal_continuous_learning INTEGER DEFAULT 0,
  
  -- Risk Management (15 points)
  risk_identification INTEGER DEFAULT 0,
  risk_mitigation_strategies INTEGER DEFAULT 0,
  risk_insurance_planning INTEGER DEFAULT 0,
  risk_legal_protection INTEGER DEFAULT 0,
  risk_operational_safeguards INTEGER DEFAULT 0,
  
  -- Support Systems (10 points)
  support_mentorship INTEGER DEFAULT 0,
  support_networking INTEGER DEFAULT 0,
  support_family_involvement INTEGER DEFAULT 0,
  support_professional_development INTEGER DEFAULT 0,
  support_community_engagement INTEGER DEFAULT 0,
  
  -- Overall scores
  total_score INTEGER DEFAULT 0,
  current_tier TEXT DEFAULT '90%',
  
  -- Metadata
  assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comprehensive_assessments_user_id ON comprehensive_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_comprehensive_assessments_date ON comprehensive_assessments(assessment_date);

-- Add RLS (Row Level Security) policies
ALTER TABLE comprehensive_assessments ENABLE ROW LEVEL SECURITY;

-- Policy for users to see only their own assessments
CREATE POLICY "Users can view own comprehensive assessments" ON comprehensive_assessments
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own assessments
CREATE POLICY "Users can insert own comprehensive assessments" ON comprehensive_assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own assessments
CREATE POLICY "Users can update own comprehensive assessments" ON comprehensive_assessments
  FOR UPDATE USING (auth.uid() = user_id);

-- Create a function to automatically update user_progress when comprehensive assessment is completed
CREATE OR REPLACE FUNCTION update_user_progress_from_comprehensive()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user_progress table with comprehensive assessment results
  UPDATE user_progress 
  SET 
    financial_foundation_completed = true,
    financial_foundation_score = NEW.financial_emergency_fund + NEW.financial_budget_tracking + NEW.financial_debt_management + NEW.financial_investment_strategy + NEW.financial_insurance_coverage + NEW.financial_tax_planning + NEW.financial_retirement_planning,
    market_intelligence_completed = true,
    market_intelligence_score = NEW.market_industry_trends + NEW.market_competitor_analysis + NEW.market_customer_research + NEW.market_technology_adoption + NEW.market_regulatory_awareness,
    personal_strengths_completed = true,
    personal_strengths_score = NEW.personal_leadership_skills + NEW.personal_communication_abilities + NEW.personal_problem_solving + NEW.personal_adaptability + NEW.personal_continuous_learning,
    risk_management_completed = true,
    risk_management_score = NEW.risk_identification + NEW.risk_mitigation_strategies + NEW.risk_insurance_planning + NEW.risk_legal_protection + NEW.risk_operational_safeguards,
    support_systems_completed = true,
    support_systems_score = NEW.support_mentorship + NEW.support_networking + NEW.support_family_involvement + NEW.support_professional_development + NEW.support_community_engagement,
    spi_completed = true,
    spi_score = NEW.total_score,
    current_tier = NEW.current_tier,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update user_progress
CREATE TRIGGER trigger_update_user_progress_comprehensive
  AFTER INSERT OR UPDATE ON comprehensive_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_user_progress_from_comprehensive();

-- Verify the migration
SELECT 'Migration completed successfully!' as status; 