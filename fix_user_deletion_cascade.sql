-- Fix User Deletion Cascade Issues
-- This migration ensures that when a user is deleted from auth.users, 
-- all related data is properly cleaned up

-- Step 1: Drop existing foreign key constraints and recreate with CASCADE
-- This ensures all user data is deleted when the auth user is deleted

-- Fix profiles table
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Fix user_progress table
ALTER TABLE user_progress 
DROP CONSTRAINT IF EXISTS user_progress_user_id_fkey;

ALTER TABLE user_progress 
ADD CONSTRAINT user_progress_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Fix spi_assessments table
ALTER TABLE spi_assessments 
DROP CONSTRAINT IF EXISTS spi_assessments_user_id_fkey;

ALTER TABLE spi_assessments 
ADD CONSTRAINT spi_assessments_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Fix comprehensive_assessments table (if exists)
ALTER TABLE comprehensive_assessments 
DROP CONSTRAINT IF EXISTS comprehensive_assessments_user_id_fkey;

ALTER TABLE comprehensive_assessments 
ADD CONSTRAINT comprehensive_assessments_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Fix quarterly_assessments table (if exists)
ALTER TABLE quarterly_assessments 
DROP CONSTRAINT IF EXISTS quarterly_assessments_user_id_fkey;

ALTER TABLE quarterly_assessments 
ADD CONSTRAINT quarterly_assessments_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Fix action_plans table (if exists)
ALTER TABLE action_plans 
DROP CONSTRAINT IF EXISTS action_plans_user_id_fkey;

ALTER TABLE action_plans 
ADD CONSTRAINT action_plans_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Fix peer_groups table (if exists)
ALTER TABLE peer_groups 
DROP CONSTRAINT IF EXISTS peer_groups_created_by_fkey;

ALTER TABLE peer_groups 
ADD CONSTRAINT peer_groups_created_by_fkey 
FOREIGN KEY (created_by) 
REFERENCES auth.users(id) 
ON DELETE SET NULL;

-- Fix peer_group_members table (if exists)
ALTER TABLE peer_group_members 
DROP CONSTRAINT IF EXISTS peer_group_members_user_id_fkey;

ALTER TABLE peer_group_members 
ADD CONSTRAINT peer_group_members_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Step 2: Create a function to completely delete a user and all their data
CREATE OR REPLACE FUNCTION delete_user_completely(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
    v_user_id UUID;
    v_deleted_count INTEGER := 0;
BEGIN
    -- Get the user ID from email
    SELECT id INTO v_user_id 
    FROM auth.users 
    WHERE email = user_email;
    
    IF v_user_id IS NULL THEN
        RETURN 'User not found with email: ' || user_email;
    END IF;
    
    -- Delete from all related tables (this will happen automatically with CASCADE)
    -- But we'll do it explicitly for clarity and to get counts
    
    -- Delete assessment history
    DELETE FROM assessment_history WHERE user_id = v_user_id;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    
    -- Delete comprehensive assessments
    DELETE FROM comprehensive_assessments WHERE user_id = v_user_id;
    
    -- Delete quarterly assessments
    DELETE FROM quarterly_assessments WHERE user_id = v_user_id;
    
    -- Delete SPI assessments
    DELETE FROM spi_assessments WHERE user_id = v_user_id;
    
    -- Delete action plans
    DELETE FROM action_plans WHERE user_id = v_user_id;
    
    -- Delete peer group memberships
    DELETE FROM peer_group_members WHERE user_id = v_user_id;
    
    -- Delete user progress
    DELETE FROM user_progress WHERE user_id = v_user_id;
    
    -- Delete profile
    DELETE FROM profiles WHERE id = v_user_id;
    
    -- Finally, delete from auth.users
    DELETE FROM auth.users WHERE id = v_user_id;
    
    RETURN 'Successfully deleted user ' || user_email || ' and all related data';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to service role only
GRANT EXECUTE ON FUNCTION delete_user_completely(TEXT) TO service_role;

-- Step 3: Create a function to check for orphaned data
CREATE OR REPLACE FUNCTION find_orphaned_user_data()
RETURNS TABLE (
    table_name TEXT,
    user_id UUID,
    orphaned_count BIGINT
) AS $$
BEGIN
    -- Check profiles
    RETURN QUERY
    SELECT 'profiles'::TEXT, p.id, COUNT(*)
    FROM profiles p
    LEFT JOIN auth.users u ON p.id = u.id
    WHERE u.id IS NULL
    GROUP BY p.id;
    
    -- Check user_progress
    RETURN QUERY
    SELECT 'user_progress'::TEXT, up.user_id, COUNT(*)
    FROM user_progress up
    LEFT JOIN auth.users u ON up.user_id = u.id
    WHERE u.id IS NULL
    GROUP BY up.user_id;
    
    -- Check spi_assessments
    RETURN QUERY
    SELECT 'spi_assessments'::TEXT, sa.user_id, COUNT(*)
    FROM spi_assessments sa
    LEFT JOIN auth.users u ON sa.user_id = u.id
    WHERE u.id IS NULL
    GROUP BY sa.user_id;
    
    -- Check comprehensive_assessments
    RETURN QUERY
    SELECT 'comprehensive_assessments'::TEXT, ca.user_id, COUNT(*)
    FROM comprehensive_assessments ca
    LEFT JOIN auth.users u ON ca.user_id = u.id
    WHERE u.id IS NULL
    GROUP BY ca.user_id;
    
    -- Check assessment_history
    RETURN QUERY
    SELECT 'assessment_history'::TEXT, ah.user_id, COUNT(*)
    FROM assessment_history ah
    LEFT JOIN auth.users u ON ah.user_id = u.id
    WHERE u.id IS NULL
    GROUP BY ah.user_id;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Clean up any existing orphaned data
DO $$
DECLARE
    v_orphan RECORD;
BEGIN
    -- Clean up orphaned records
    FOR v_orphan IN SELECT * FROM find_orphaned_user_data() LOOP
        RAISE NOTICE 'Found % orphaned records in % for user_id %', 
            v_orphan.orphaned_count, v_orphan.table_name, v_orphan.user_id;
            
        -- Delete orphaned records
        EXECUTE format('DELETE FROM %I WHERE user_id = %L', 
            v_orphan.table_name, v_orphan.user_id);
    END LOOP;
END $$;