-- Find orphaned data in application tables
-- These are records that exist in our tables but have no corresponding auth.users entry

-- 1. Find orphaned profiles
SELECT 'Orphaned Profiles (no auth.users match):' as check_type;
SELECT p.* 
FROM profiles p
LEFT JOIN auth.users au ON au.id = p.id
WHERE au.id IS NULL;

-- 2. Find orphaned user_progress records
SELECT 'Orphaned User Progress:' as check_type;
SELECT up.* 
FROM user_progress up
LEFT JOIN auth.users au ON au.id = up.user_id
WHERE au.id IS NULL;

-- 3. Find orphaned comprehensive_assessments
SELECT 'Orphaned Comprehensive Assessments:' as check_type;
SELECT ca.* 
FROM comprehensive_assessments ca
LEFT JOIN auth.users au ON au.id = ca.user_id
WHERE au.id IS NULL;

-- 4. Find orphaned assessment_responses
SELECT 'Orphaned Assessment Responses Count:' as check_type;
SELECT COUNT(*) as orphaned_count
FROM assessment_responses ar
LEFT JOIN auth.users au ON au.id = ar.user_id
WHERE au.id IS NULL;

-- 5. Check specifically for bobthebuilder
SELECT 'Searching for bobthebuilder@letstruck.com in profiles:' as check_type;
SELECT * FROM profiles WHERE email = 'bobthebuilder@letstruck.com'; 