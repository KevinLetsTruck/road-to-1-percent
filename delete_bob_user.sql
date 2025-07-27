-- Delete bobthebuilder@letstruck.com completely
-- Run this in Supabase SQL Editor

-- First, get the user ID
SELECT id, email FROM auth.users WHERE email = 'bobthebuilder@letstruck.com';

-- Option 1: If you have the delete_user_completely function
-- SELECT public.delete_user_completely('USER_ID_HERE');

-- Option 2: Manual deletion (run each step)
-- Replace USER_ID_HERE with the actual ID from the first query

-- Step 1: Delete from all application tables
DELETE FROM assessment_responses WHERE user_id = 'USER_ID_HERE';
DELETE FROM comprehensive_assessments WHERE user_id = 'USER_ID_HERE';
DELETE FROM user_progress WHERE user_id = 'USER_ID_HERE';
DELETE FROM profiles WHERE id = 'USER_ID_HERE';

-- Step 2: Delete from auth.users (requires proper permissions)
-- This might fail if you don't have service role access
DELETE FROM auth.users WHERE id = 'USER_ID_HERE';

-- If the above fails, you'll need to delete from the Supabase dashboard 