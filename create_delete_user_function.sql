-- Create a function to completely delete a user
-- This includes deleting from auth.users which requires elevated privileges

-- Create the function with SECURITY DEFINER to run with elevated privileges
CREATE OR REPLACE FUNCTION public.delete_user_completely(user_id UUID)
RETURNS json AS $$
DECLARE
    deleted_count INTEGER := 0;
    result json;
BEGIN
    -- Check if the caller is an admin
    IF NOT public.is_admin_user() THEN
        RETURN json_build_object('success', false, 'error', 'Admin access required');
    END IF;

    -- Prevent admin from deleting themselves
    IF user_id = auth.uid() THEN
        RETURN json_build_object('success', false, 'error', 'Cannot delete your own account');
    END IF;

    -- Delete from assessment_responses
    DELETE FROM public.assessment_responses WHERE user_id = delete_user_completely.user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Delete from comprehensive_assessments
    DELETE FROM public.comprehensive_assessments WHERE user_id = delete_user_completely.user_id;
    
    -- Delete from user_progress
    DELETE FROM public.user_progress WHERE user_id = delete_user_completely.user_id;
    
    -- Delete from profiles
    DELETE FROM public.profiles WHERE id = delete_user_completely.user_id;
    
    -- Delete from auth.users (this requires the function to have proper permissions)
    DELETE FROM auth.users WHERE id = delete_user_completely.user_id;
    
    result := json_build_object(
        'success', true,
        'message', 'User deleted successfully',
        'user_id', delete_user_completely.user_id
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (admin check is inside the function)
GRANT EXECUTE ON FUNCTION public.delete_user_completely(UUID) TO authenticated;

-- Example usage:
-- SELECT public.delete_user_completely('user-id-here');

-- Note: To delete from auth.users, you need to run this in the Supabase dashboard
-- or ensure your database user has the necessary permissions 