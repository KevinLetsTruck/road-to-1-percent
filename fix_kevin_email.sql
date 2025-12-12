-- Fix kevin@letstruck.com email confirmation
UPDATE auth.users 
SET 
  email_confirmed_at = NOW(),
  confirmed_at = NOW(),
  updated_at = NOW()
WHERE email = 'kevin@letstruck.com';

-- Verify the fix
SELECT 'After fix check:' as info;
SELECT 
  email,
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ FIXED - Email now confirmed!'
    ELSE '❌ Still not confirmed'
  END as status
FROM auth.users
WHERE email = 'kevin@letstruck.com';
