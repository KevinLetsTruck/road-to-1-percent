-- Fix Admin RLS - Simple Version
-- Creates the admin check function in public schema

-- 1. Drop existing problematic policies
DROP POLICY IF EXISTS "users_and_admins_view_profiles" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "allow_users_view_own_profile" ON profiles;
DROP POLICY IF EXISTS "allow_users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "allow_users_insert_own_profile" ON profiles;

DROP POLICY IF EXISTS "users_and_admins_view_progress" ON user_progress;
DROP POLICY IF EXISTS "users_update_own_progress" ON user_progress;
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;

DROP POLICY IF EXISTS "users_and_admins_view_assessments" ON comprehensive_assessments;
DROP POLICY IF EXISTS "Users can view own assessments" ON comprehensive_assessments;

-- 2. Create the admin check function in PUBLIC schema
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the current user is an admin
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;

-- 3. Create simple policies using the function
-- Profiles policies
CREATE POLICY "profiles_select_policy"
ON profiles FOR SELECT
USING (
  auth.uid() = id  -- Users can see their own profile
  OR
  public.is_admin_user()  -- Admins can see all profiles
);

CREATE POLICY "profiles_update_policy"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- User progress policies
CREATE POLICY "user_progress_select_policy"
ON user_progress FOR SELECT
USING (
  auth.uid() = user_id  -- Users can see their own progress
  OR
  public.is_admin_user()  -- Admins can see all progress
);

CREATE POLICY "user_progress_update_policy"
ON user_progress FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "user_progress_insert_policy"
ON user_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Comprehensive assessments policies
CREATE POLICY "assessments_select_policy"
ON comprehensive_assessments FOR SELECT
USING (
  auth.uid() = user_id  -- Users can see their own assessments
  OR
  public.is_admin_user()  -- Admins can see all assessments
);

CREATE POLICY "assessments_insert_policy"
ON comprehensive_assessments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. Test the function
SELECT 'Testing admin function:' as info;
SELECT public.is_admin_user() as is_admin;

-- 5. Test queries
SELECT 'Your profile:' as info;
SELECT id, email, is_admin FROM profiles WHERE id = auth.uid();

SELECT 'All profiles count (if admin):' as info;
SELECT COUNT(*) as total_profiles FROM profiles;

-- 6. Verify policies were created
SELECT 'Policies created:' as info;
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_progress', 'comprehensive_assessments')
ORDER BY tablename, policyname; 