-- Check if aaron@letstruck.com is an admin
-- Run this in your Supabase SQL Editor

-- First, let's check the current admin status for aaron@letstruck.com
SELECT 
    p.id,
    p.email,
    p.is_admin,
    p.first_name,
    p.last_name
FROM profiles p
WHERE p.email = 'aaron@letstruck.com';

-- If the user exists but is not an admin, uncomment and run this update:
/*
UPDATE profiles
SET is_admin = true
WHERE email = 'aaron@letstruck.com';
*/

-- Let's also check all current admins
SELECT 
    id,
    email,
    first_name,
    last_name,
    is_admin,
    created_at
FROM profiles
WHERE is_admin = true
ORDER BY created_at;