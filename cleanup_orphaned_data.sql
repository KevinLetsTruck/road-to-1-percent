-- Cleanup orphaned data from all tables
-- This removes records that have no corresponding auth.users entry

-- First, let's see what we're about to delete
SELECT 'Data to be deleted:' as info;
SELECT 
    (SELECT COUNT(*) FROM profiles p LEFT JOIN auth.users au ON au.id = p.id WHERE au.id IS NULL) as orphaned_profiles,
    (SELECT COUNT(*) FROM user_progress up LEFT JOIN auth.users au ON au.id = up.user_id WHERE au.id IS NULL) as orphaned_progress,
    (SELECT COUNT(*) FROM comprehensive_assessments ca LEFT JOIN auth.users au ON au.id = ca.user_id WHERE au.id IS NULL) as orphaned_assessments,
    (SELECT COUNT(*) FROM assessment_responses ar LEFT JOIN auth.users au ON au.id = ar.user_id WHERE au.id IS NULL) as orphaned_responses;

-- Delete orphaned assessment_responses
DELETE FROM assessment_responses
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Delete orphaned comprehensive_assessments
DELETE FROM comprehensive_assessments
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Delete orphaned user_progress
DELETE FROM user_progress
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Delete orphaned profiles
DELETE FROM profiles
WHERE id NOT IN (SELECT id FROM auth.users);

-- Verify cleanup
SELECT 'After cleanup - remaining orphaned records:' as info;
SELECT 
    (SELECT COUNT(*) FROM profiles p LEFT JOIN auth.users au ON au.id = p.id WHERE au.id IS NULL) as orphaned_profiles,
    (SELECT COUNT(*) FROM user_progress up LEFT JOIN auth.users au ON au.id = up.user_id WHERE au.id IS NULL) as orphaned_progress,
    (SELECT COUNT(*) FROM comprehensive_assessments ca LEFT JOIN auth.users au ON au.id = ca.user_id WHERE au.id IS NULL) as orphaned_assessments,
    (SELECT COUNT(*) FROM assessment_responses ar LEFT JOIN auth.users au ON au.id = ar.user_id WHERE au.id IS NULL) as orphaned_responses; 