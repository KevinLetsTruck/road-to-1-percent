-- View assessment results for tj2moro@gmail.com (simplified)
-- Only queries tables and columns that actually exist

-- 1. Get user profile info
SELECT 'User Profile:' as info;
SELECT id, email, first_name, last_name, created_at, is_test_user
FROM profiles
WHERE email = 'tj2moro@gmail.com';

-- 2. Get comprehensive assessment results
SELECT 'Comprehensive Assessment Results:' as info;
SELECT 
    assessment_date,
    total_spi_score,
    tier,
    standout_strength_1,
    standout_strength_2,
    created_at
FROM comprehensive_assessments
WHERE user_id = (SELECT id FROM profiles WHERE email = 'tj2moro@gmail.com')
ORDER BY assessment_date DESC;

-- 3. Get user progress data
SELECT 'User Progress Data:' as info;
SELECT 
    spi_score,
    current_tier
FROM user_progress
WHERE user_id = (SELECT id FROM profiles WHERE email = 'tj2moro@gmail.com'); 