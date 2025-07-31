-- Bulk reset multiple test users back to normal
-- Add the email addresses you want to reset

-- Create temporary table with emails to reset
DROP TABLE IF EXISTS temp_users_to_reset;
CREATE TEMP TABLE temp_users_to_reset (email TEXT);

-- Add the emails you want to reset (one per line)
INSERT INTO temp_users_to_reset (email) VALUES
    ('driver1@example.com'),
    ('driver2@example.com'),
    ('driver3@example.com');
    -- Add more emails as needed

-- Show what will be reset
SELECT 'Users to be reset:' as info;
SELECT p.id, p.email, p.first_name, p.last_name
FROM profiles p
INNER JOIN temp_users_to_reset t ON p.email = t.email
WHERE p.is_test_user = true;

-- Reset the users
UPDATE profiles 
SET is_test_user = false
WHERE email IN (SELECT email FROM temp_users_to_reset)
  AND is_test_user = true;

-- Verify the reset
SELECT 'Users after reset:' as info;
SELECT p.id, p.email, p.first_name, p.last_name, p.is_test_user
FROM profiles p
INNER JOIN temp_users_to_reset t ON p.email = t.email;

-- Show remaining test users
SELECT 'Remaining test users:' as info;
SELECT id, email, first_name, last_name
FROM profiles
WHERE is_test_user = true
ORDER BY email; 