-- Find and confirm the most recent user's email
SELECT 'Finding unconfirmed users:' as info;
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN 'NEEDS CONFIRMATION'
    ELSE 'Already Confirmed'
  END as status
FROM auth.users
WHERE email LIKE '%gmail.com'
ORDER BY created_at DESC
LIMIT 5;

-- Manually confirm the most recent user
UPDATE auth.users 
SET 
  email_confirmed_at = NOW()
WHERE email LIKE 'test.user.%@gmail.com'
AND email_confirmed_at IS NULL
RETURNING id, email, email_confirmed_at;

-- Verify the update
SELECT 'After confirmation:' as info;
SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  'Email Confirmed' as status
FROM auth.users
WHERE email LIKE 'test.user.%@gmail.com'
ORDER BY created_at DESC
LIMIT 1; 