-- Fix Admin RLS Policies (Corrected Version)
-- This script properly handles policy creation without IF NOT EXISTS

-- 1. First, enable RLS on all tables if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies that we're going to recreate
-- This prevents duplicate policy errors
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admin users can view all profiles" ON profiles;

DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Admin users can view all progress" ON user_progress;

DROP POLICY IF EXISTS "Users can view own assessments" ON assessment_responses;
DROP POLICY IF EXISTS "Users can insert own assessments" ON assessment_responses;
DROP POLICY IF EXISTS "Admin users can view all assessments" ON assessment_responses;

-- 3. Create policies for regular users
-- Profiles table
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- User Progress table
CREATE POLICY "Users can view own progress"
ON user_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
ON user_progress FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
ON user_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Assessment Responses table
CREATE POLICY "Users can view own assessments"
ON assessment_responses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
ON assessment_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. Create admin policies
-- Admin can view all profiles
CREATE POLICY "Admin users can view all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Admin can view all progress
CREATE POLICY "Admin users can view all progress"
ON user_progress FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Admin can view all assessments
CREATE POLICY "Admin users can view all assessments"
ON assessment_responses FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 5. Verify the policies were created
SELECT schemaname, tablename, policyname, cmd, roles, qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'user_progress', 'assessment_responses')
ORDER BY tablename, policyname; 