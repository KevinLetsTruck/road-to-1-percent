-- ============================================
-- FULL DIAGNOSTIC - FIND THE REAL ISSUE
-- ============================================

-- Check ALL triggers on auth.users
SELECT '=== ALL TRIGGERS ON AUTH.USERS ===' as section;
SELECT 
  tgname as trigger_name,
  CASE WHEN tgenabled = 'O' THEN 'ENABLED' ELSE 'DISABLED' END as status,
  proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'auth' 
AND c.relname = 'users'
AND NOT tgisinternal;

-- Check kevin account details
SELECT '=== KEVIN ACCOUNT FULL DETAILS ===' as section;
SELECT 
  id,
  email,
  encrypted_password IS NOT NULL as has_password,
  LENGTH(encrypted_password) as password_length,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  created_at
FROM auth.users
WHERE email = 'kevin@letstruck.com';

-- Check test account details
SELECT '=== TEST ACCOUNTS FULL DETAILS ===' as section;
SELECT 
  id,
  email,
  encrypted_password IS NOT NULL as has_password,
  LENGTH(encrypted_password) as password_length,
  email_confirmed_at,
  raw_app_meta_data,
  aud,
  role
FROM auth.users
WHERE email LIKE '%test%' OR email LIKE '%demo%' OR email LIKE '%manual%';

-- Check profiles table structure
SELECT '=== PROFILES TABLE COLUMNS ===' as section;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Check for any RLS policies that might block
SELECT '=== PROFILES RLS POLICIES ===' as section;
SELECT 
  polname as policy_name,
  polcmd as command,
  polpermissive as permissive
FROM pg_policy
WHERE polrelid = 'profiles'::regclass;

-- Check if identities table has entries (required for Supabase Auth)
SELECT '=== AUTH IDENTITIES CHECK ===' as section;
SELECT 
  u.email,
  i.id IS NOT NULL as has_identity,
  i.provider
FROM auth.users u
LEFT JOIN auth.identities i ON u.id = i.user_id
WHERE u.email IN ('kevin@letstruck.com', 'manual-test@example.com', 'demo@test.com');
