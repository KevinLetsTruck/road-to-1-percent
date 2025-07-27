-- Delete a user completely by email address
-- Replace 'user@example.com' with the actual email you want to delete

-- Set the email to delete
DO $$
DECLARE
    user_email TEXT := 'user@example.com'; -- CHANGE THIS to the email you want to delete
    user_id_to_delete UUID;
BEGIN
    -- Get the user ID from auth.users
    SELECT id INTO user_id_to_delete
    FROM auth.users
    WHERE email = user_email;
    
    IF user_id_to_delete IS NULL THEN
        RAISE NOTICE 'User with email % not found in auth.users', user_email;
        RETURN;
    END IF;
    
    RAISE NOTICE 'Deleting user % with ID %', user_email, user_id_to_delete;
    
    -- Delete from all tables in correct order (due to foreign key constraints)
    DELETE FROM assessment_responses WHERE user_id = user_id_to_delete;
    DELETE FROM comprehensive_assessments WHERE user_id = user_id_to_delete;
    DELETE FROM user_progress WHERE user_id = user_id_to_delete;
    DELETE FROM profiles WHERE id = user_id_to_delete;
    
    -- Finally delete from auth.users (requires service role permissions)
    DELETE FROM auth.users WHERE id = user_id_to_delete;
    
    RAISE NOTICE 'User % deleted successfully', user_email;
END $$;

-- Verify the user is gone
SELECT 'Checking if user still exists:' as check;
SELECT COUNT(*) as count FROM auth.users WHERE email = 'user@example.com'; -- CHANGE THIS too 