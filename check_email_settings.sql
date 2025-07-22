-- Check if there are any email domain restrictions
SELECT 'Checking existing users and their email domains:' as info;
SELECT 
  SUBSTRING(email FROM '@(.*)$') as domain,
  COUNT(*) as user_count
FROM auth.users
WHERE email IS NOT NULL
GROUP BY domain
ORDER BY user_count DESC;

-- Check if we can see auth configuration
SELECT 'Auth configuration (if accessible):' as info;
SELECT * FROM auth.config LIMIT 1;

-- Test if specific domains work
SELECT 'Testing email validation:' as info;
DO $$
DECLARE
  test_emails text[] := ARRAY[
    'test@gmail.com',
    'test@outlook.com', 
    'test@yahoo.com',
    'test@protonmail.com',
    'test@example.com',
    'test@test.com'
  ];
  email text;
BEGIN
  FOREACH email IN ARRAY test_emails
  LOOP
    RAISE NOTICE 'Testing email: %', email;
  END LOOP;
END $$; 