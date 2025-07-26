-- Simple Admin Access Test
-- This will help us debug the 500 errors

-- 1. Check if comprehensive_assessments table exists
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'comprehensive_assessments'
ORDER BY ordinal_position;

-- 2. Check RLS policies on comprehensive_assessments
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'comprehensive_assessments';

-- 3. Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'comprehensive_assessments';

-- 4. Try to select from comprehensive_assessments (this should work for admin)
SELECT 
  id,
  user_id,
  total_spi_score,
  tier,
  assessment_date
FROM comprehensive_assessments 
LIMIT 5;

-- 5. Check if there's any data
SELECT COUNT(*) as total_assessments FROM comprehensive_assessments; 