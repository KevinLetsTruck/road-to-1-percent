-- Fix Admin Dashboard Data Issues
-- Run this script in your Supabase SQL Editor

-- 1. First, ensure RLS is enabled on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE comprehensive_assessments ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing restrictive policies
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can view own assessments" ON comprehensive_assessments;
DROP POLICY IF EXISTS "Enable read access for users to own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for users to own progress" ON user_progress;
DROP POLICY IF EXISTS "Admin users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin users can view all progress" ON user_progress;
DROP POLICY IF EXISTS "Admin users can view all assessments" ON comprehensive_assessments;

-- 3. Create comprehensive policies that allow admin access

-- Profiles table - Allow admins to see all profiles, others see only their own
CREATE POLICY "Users and admins can view profiles" 
ON profiles FOR SELECT 
TO authenticated
USING (
  auth.uid() = id 
  OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  )
);

-- User Progress table - Allow admins to see all progress
CREATE POLICY "Users and admins can view progress" 
ON user_progress FOR SELECT 
TO authenticated
USING (
  auth.uid() = user_id 
  OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  )
);

-- Comprehensive Assessments table - Allow admins to see all assessments
CREATE POLICY "Users and admins can view assessments" 
ON comprehensive_assessments FOR SELECT 
TO authenticated
USING (
  auth.uid() = user_id 
  OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  )
);

-- 4. Keep existing INSERT and UPDATE policies for users
CREATE POLICY IF NOT EXISTS "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update own progress" 
ON user_progress FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own progress" 
ON user_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own assessments" 
ON comprehensive_assessments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own assessments" 
ON comprehensive_assessments FOR UPDATE 
USING (auth.uid() = user_id);

-- 5. Create test data if none exists
-- First, check if we have any users
DO $$
DECLARE
    user_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM profiles;
    
    -- If no users exist, create some test data
    IF user_count = 0 THEN
        -- Insert test users
        INSERT INTO profiles (id, email, is_admin, created_at) VALUES
        ('test-user-1', 'test1@example.com', false, NOW() - INTERVAL '30 days'),
        ('test-user-2', 'test2@example.com', false, NOW() - INTERVAL '20 days'),
        ('test-user-3', 'test3@example.com', false, NOW() - INTERVAL '10 days'),
        ('test-user-4', 'test4@example.com', false, NOW() - INTERVAL '5 days'),
        ('test-user-5', 'test5@example.com', false, NOW() - INTERVAL '1 day');
        
        -- Insert test user progress
        INSERT INTO user_progress (user_id, spi_score, current_tier, financial_foundation_score, market_intelligence_score, risk_management_score, support_systems_score, created_at) VALUES
        ('test-user-1', 85, '1%', 30, 18, 12, 8, NOW() - INTERVAL '25 days'),
        ('test-user-2', 72, '9%', 25, 16, 10, 7, NOW() - INTERVAL '15 days'),
        ('test-user-3', 65, '9%', 22, 14, 9, 6, NOW() - INTERVAL '8 days'),
        ('test-user-4', 45, '90%', 18, 12, 8, 5, NOW() - INTERVAL '3 days'),
        ('test-user-5', 35, '90%', 15, 10, 6, 4, NOW() - INTERVAL '12 hours');
        
        -- Insert test comprehensive assessments
        INSERT INTO comprehensive_assessments (user_id, assessment_date, standout_strength_1, standout_strength_2, total_spi_score, tier, created_at) VALUES
        ('test-user-1', NOW() - INTERVAL '25 days', 'Financial Foundation', 'Market Intelligence', 85, '1%', NOW() - INTERVAL '25 days'),
        ('test-user-2', NOW() - INTERVAL '15 days', 'Risk Management', 'Support Systems', 72, '9%', NOW() - INTERVAL '15 days'),
        ('test-user-3', NOW() - INTERVAL '8 days', 'Market Intelligence', 'Financial Foundation', 65, '9%', NOW() - INTERVAL '8 days'),
        ('test-user-4', NOW() - INTERVAL '3 days', 'Support Systems', 'Risk Management', 45, '90%', NOW() - INTERVAL '3 days'),
        ('test-user-5', NOW() - INTERVAL '12 hours', 'Financial Foundation', 'Support Systems', 35, '90%', NOW() - INTERVAL '12 hours');
        
        RAISE NOTICE 'Created test data with 5 users, progress records, and assessments';
    ELSE
        RAISE NOTICE 'Users already exist, skipping test data creation';
    END IF;
END $$;

-- 6. Verify the policies were created correctly
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_progress', 'comprehensive_assessments')
ORDER BY tablename, policyname;

-- 7. Test the admin dashboard query
SELECT 
  p.id,
  p.email,
  p.created_at,
  up.spi_score,
  up.current_tier,
  up.financial_foundation_score,
  up.market_intelligence_score,
  up.risk_management_score,
  up.support_systems_score,
  ca.assessment_date,
  ca.standout_strength_1,
  ca.standout_strength_2
FROM profiles p
LEFT JOIN user_progress up ON p.id = up.user_id
LEFT JOIN comprehensive_assessments ca ON p.id = ca.user_id
ORDER BY p.created_at DESC
LIMIT 10; 