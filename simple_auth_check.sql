-- Simple authentication check

-- 1. Count users
SELECT 'Total Users in Database:' as info;
SELECT COUNT(*) as user_count FROM auth.users;

-- 2. Show recent users (without sensitive data)
SELECT 'Recent Users:' as info;
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at,
  CASE 
    WHEN confirmed_at IS NOT NULL THEN 'Confirmed'
    ELSE 'Not Confirmed'
  END as status
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- 3. Check if email provider is enabled
SELECT 'Email Provider Status:' as info;
SELECT EXISTS (
  SELECT 1 
  FROM auth.users 
  WHERE email IS NOT NULL
  LIMIT 1
) as email_auth_used; 