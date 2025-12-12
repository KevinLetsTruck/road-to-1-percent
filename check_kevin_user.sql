-- Check kevin@letstruck.com user status
SELECT 'Kevin user check:' as info;

SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  confirmed_at,
  last_sign_in_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Email Confirmed'
    WHEN confirmed_at IS NOT NULL THEN '✅ Confirmed (legacy)'
    ELSE '❌ Email NOT Confirmed - This is likely the issue!'
  END as confirmation_status,
  CASE 
    WHEN encrypted_password IS NOT NULL THEN '✅ Has Password'
    ELSE '❌ No Password Set'
  END as password_status
FROM auth.users
WHERE email = 'kevin@letstruck.com';

-- Check if profile exists
SELECT 'Profile check:' as info;
SELECT 
  CASE WHEN p.id IS NOT NULL THEN '✅ Has Profile' ELSE '❌ NO PROFILE' END as profile_status,
  CASE WHEN up.user_id IS NOT NULL THEN '✅ Has Progress' ELSE '❌ NO PROGRESS' END as progress_status,
  CASE WHEN uap.user_id IS NOT NULL THEN '✅ Has AI Preferences' ELSE '❌ NO AI PREFERENCES' END as ai_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN user_ai_preferences uap ON u.id = uap.user_id
WHERE u.email = 'kevin@letstruck.com';

-- If user exists but email not confirmed, provide confirmation instructions
SELECT 'Next Steps:' as info,
  CASE 
    WHEN u.email_confirmed_at IS NULL THEN 
      '❌ EMAIL NOT CONFIRMED - User needs to confirm email first, or run this SQL to confirm: UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = ''kevin@letstruck.com'';'
    ELSE '✅ Email confirmed - check password or contact support'
  END as action_needed
FROM auth.users u
WHERE u.email = 'kevin@letstruck.com';
