-- Fix Infinite Recursion in RLS Policies (Final)
-- This avoids self-referencing the profiles table

-- 1. First, disable RLS temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE comprehensive_assessments DISABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies to start fresh
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

-- 3. Create a security definer function to check admin status
-- This avoids the recursion by using a function with elevated privileges
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create policies using the function (no recursion!)
-- Profiles policies
CREATE POLICY "profiles_select_policy"
ON profiles FOR SELECT
USING (
  auth.uid() = id  -- Users can see their own profile
  OR
  auth.is_admin()  -- Admins can see all profiles
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
  auth.is_admin()       -- Admins can see all progress
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
  auth.is_admin()       -- Admins can see all assessments
);

CREATE POLICY "assessments_insert_policy"
ON comprehensive_assessments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 5. Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE comprehensive_assessments ENABLE ROW LEVEL SECURITY;

-- 6. Test the function
SELECT 'Testing admin function:' as info;
SELECT auth.is_admin() as is_admin;

-- 7. Test queries
SELECT 'Testing profile access:' as info;
SELECT COUNT(*) as visible_profiles FROM profiles;

SELECT 'Testing user_progress access:' as info;
SELECT COUNT(*) as visible_progress FROM user_progress;

-- 8. Verify policies
SELECT 'New policies created:' as info;
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_progress', 'comprehensive_assessments')
ORDER BY tablename, policyname; 