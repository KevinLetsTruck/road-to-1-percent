-- Fix Admin Visibility
-- This ensures admins can see all users' data

-- 1. Drop existing policies that might be limiting visibility
DROP POLICY IF EXISTS "allow_users_view_own_profile" ON profiles;
DROP POLICY IF EXISTS "allow_users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "allow_users_insert_own_profile" ON profiles;

-- 2. Create new policies that allow admins to see everything
-- Users can see their own profile OR admins can see all profiles
CREATE POLICY "users_and_admins_view_profiles"
ON profiles FOR SELECT
USING (
  auth.uid() = id 
  OR 
  EXISTS (
    SELECT 1 FROM profiles admin_profile 
    WHERE admin_profile.id = auth.uid() 
    AND admin_profile.is_admin = true
  )
);

-- Users can update only their own profile
CREATE POLICY "users_update_own_profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Users can insert only their own profile
CREATE POLICY "users_insert_own_profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- 3. Add admin policies for user_progress table
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;

CREATE POLICY "users_and_admins_view_progress"
ON user_progress FOR SELECT
USING (
  auth.uid() = user_id 
  OR 
  EXISTS (
    SELECT 1 FROM profiles admin_profile 
    WHERE admin_profile.id = auth.uid() 
    AND admin_profile.is_admin = true
  )
);

CREATE POLICY "users_update_own_progress"
ON user_progress FOR UPDATE
USING (auth.uid() = user_id);

-- 4. Add admin policies for comprehensive_assessments table
DROP POLICY IF EXISTS "Users can view own assessments" ON comprehensive_assessments;

CREATE POLICY "users_and_admins_view_assessments"
ON comprehensive_assessments FOR SELECT
USING (
  auth.uid() = user_id 
  OR 
  EXISTS (
    SELECT 1 FROM profiles admin_profile 
    WHERE admin_profile.id = auth.uid() 
    AND admin_profile.is_admin = true
  )
);

-- 5. Verify the policies were created
SELECT 'New policies created:' as info;
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_progress', 'comprehensive_assessments')
ORDER BY tablename, policyname; 