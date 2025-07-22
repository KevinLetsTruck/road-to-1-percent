-- Check the most recently created user
SELECT 'Most recent user:' as info;
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  confirmed_at,
  last_sign_in_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN 'Email Confirmed'
    ELSE 'Email NOT Confirmed'
  END as confirmation_status
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Check if profile and user_progress were created
SELECT 'Profile and Progress status:' as info;
SELECT 
  u.email,
  CASE WHEN p.id IS NOT NULL THEN 'Has Profile' ELSE 'NO PROFILE' END as profile_status,
  CASE WHEN up.user_id IS NOT NULL THEN 'Has Progress' ELSE 'NO PROGRESS' END as progress_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_progress up ON u.id = up.user_id
ORDER BY u.created_at DESC
LIMIT 5;

-- Check the raw password data (for debugging)
SELECT 'User password info:' as info;
SELECT 
  email,
  encrypted_password IS NOT NULL as has_password,
  LENGTH(encrypted_password) as password_length
FROM auth.users
ORDER BY created_at DESC
LIMIT 5; 