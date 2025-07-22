-- Check existing users and their status
SELECT 'Existing users with passwords:' as info;
SELECT 
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN 'Confirmed'
    ELSE 'Not Confirmed'
  END as email_status,
  CASE 
    WHEN last_sign_in_at IS NOT NULL THEN 'Has signed in'
    ELSE 'Never signed in'
  END as signin_status
FROM auth.users
WHERE encrypted_password IS NOT NULL
ORDER BY created_at DESC;

-- Let's pick one of the existing users and reset their password
-- Using leesa@letstruck.com as an example
SELECT 'Resetting password for leesa@letstruck.com:' as info;

-- We can't directly update the password, but we can check if this user can sign in
-- First, let's make sure their email is confirmed
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'leesa@letstruck.com'
AND email_confirmed_at IS NULL
RETURNING email, email_confirmed_at;

-- Check the final state
SELECT 
  email,
  email_confirmed_at,
  'Ready for testing' as status
FROM auth.users
WHERE email = 'leesa@letstruck.com'; 