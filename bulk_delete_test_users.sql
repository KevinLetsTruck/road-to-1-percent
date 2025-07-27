-- Bulk Delete Test Users
-- This script allows you to delete multiple test accounts at once

-- STEP 1: First, let's see what test users you have
-- Modify the WHERE clause to identify your test accounts
SELECT 'Test users to review:' as info;
SELECT id, email, created_at, last_sign_in_at
FROM auth.users
WHERE 
    -- Uncomment and modify these conditions to match your test users:
    -- email LIKE '%test%' OR
    -- email LIKE '%demo%' OR
    -- email IN ('user1@example.com', 'user2@example.com', 'user3@example.com')
    email != 'kevin@letstruck.com'  -- Always exclude your admin account!
ORDER BY created_at;

-- STEP 2: Create a temporary table with users to delete
-- Replace the email addresses with the actual test accounts you want to delete
DROP TABLE IF EXISTS temp_users_to_delete;
CREATE TEMP TABLE temp_users_to_delete (email TEXT);

-- Add the test user emails you want to delete (one per line)
INSERT INTO temp_users_to_delete (email) VALUES
    ('test1@example.com'),
    ('test2@example.com'),
    ('test3@example.com');
    -- Add more emails as needed

-- STEP 3: Verify the users that will be deleted
SELECT 'Users that will be deleted:' as info;
SELECT u.id, u.email, u.created_at, 
       CASE WHEN p.id IS NOT NULL THEN 'Has profile' ELSE 'No profile' END as profile_status
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email IN (SELECT email FROM temp_users_to_delete)
ORDER BY u.email;

-- STEP 4: Count data that will be deleted
SELECT 'Data to be deleted:' as info;
SELECT 
    COUNT(DISTINCT u.id) as users_to_delete,
    COUNT(DISTINCT p.id) as profiles_to_delete,
    COUNT(DISTINCT up.id) as user_progress_to_delete,
    COUNT(DISTINCT ca.id) as comprehensive_assessments_to_delete,
    COUNT(DISTINCT ar.id) as assessment_responses_to_delete
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
LEFT JOIN user_progress up ON up.user_id = u.id
LEFT JOIN comprehensive_assessments ca ON ca.user_id = u.id
LEFT JOIN assessment_responses ar ON ar.user_id = u.id
WHERE u.email IN (SELECT email FROM temp_users_to_delete);

-- STEP 5: PERFORM THE DELETION
-- IMPORTANT: Comment out this section until you've verified the users above!
/*
DO $$
DECLARE
    deleted_count INTEGER := 0;
    user_record RECORD;
BEGIN
    -- Loop through each user to delete
    FOR user_record IN 
        SELECT u.id, u.email 
        FROM auth.users u 
        WHERE u.email IN (SELECT email FROM temp_users_to_delete)
    LOOP
        -- Delete in correct order due to foreign key constraints
        DELETE FROM assessment_responses WHERE user_id = user_record.id;
        DELETE FROM comprehensive_assessments WHERE user_id = user_record.id;
        DELETE FROM user_progress WHERE user_id = user_record.id;
        DELETE FROM profiles WHERE id = user_record.id;
        DELETE FROM auth.users WHERE id = user_record.id;
        
        deleted_count := deleted_count + 1;
        RAISE NOTICE 'Deleted user: %', user_record.email;
    END LOOP;
    
    RAISE NOTICE 'Total users deleted: %', deleted_count;
END $$;
*/

-- STEP 6: Verify deletion (run after uncommenting and executing STEP 5)
SELECT 'Remaining users after deletion:' as info;
SELECT COUNT(*) as remaining_users FROM auth.users;
SELECT email FROM auth.users ORDER BY email; 