-- Quick Admin Fix
-- This will make the most recent user an admin

UPDATE profiles SET is_admin = true WHERE id = (SELECT id FROM profiles ORDER BY created_at DESC LIMIT 1);

-- Verify the change
SELECT id, email, is_admin FROM profiles WHERE is_admin = true; 