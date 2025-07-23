-- Test queries to diagnose admin dashboard data issues
-- Run these in your Supabase SQL Editor

-- 1. Check if you are properly set as admin
SELECT id, email, is_admin 
FROM profiles 
WHERE is_admin = true;

-- 2. Check if there are any users in the profiles table
SELECT COUNT(*) as total_users 
FROM profiles;

-- 3. Check if there's any user_progress data
SELECT COUNT(*) as progress_records 
FROM user_progress;

-- 4. Check if there are any comprehensive assessments
SELECT COUNT(*) as assessment_count 
FROM comprehensive_assessments;

-- 5. Get a sample of user data with their progress (similar to what admin dashboard queries)
SELECT 
  p.id,
  p.email,
  p.created_at,
  up.spi_score,
  up.current_tier,
  up.financial_foundation_score,
  up.market_intelligence_score,
  up.risk_management_score,
  up.support_systems_score
FROM profiles p
LEFT JOIN user_progress up ON p.id = up.user_id
LIMIT 5;

-- 6. Check if the relationships are working properly
SELECT 
  p.email,
  COUNT(up.id) as progress_count,
  COUNT(ca.id) as assessment_count
FROM profiles p
LEFT JOIN user_progress up ON p.id = up.user_id
LEFT JOIN comprehensive_assessments ca ON p.id = ca.user_id
GROUP BY p.email
LIMIT 10; 