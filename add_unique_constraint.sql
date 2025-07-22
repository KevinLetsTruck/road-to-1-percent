-- Add unique constraint to comprehensive_assessments table
-- This ensures each user can only have one comprehensive assessment
-- Run this in your Supabase SQL Editor

-- First, check if there are any duplicate user_id entries
-- This query will show users with multiple assessments
SELECT user_id, COUNT(*) as assessment_count
FROM comprehensive_assessments
GROUP BY user_id
HAVING COUNT(*) > 1;

-- If there are duplicates, keep only the most recent one for each user
-- Uncomment and run this if needed:
/*
DELETE FROM comprehensive_assessments a
USING (
  SELECT user_id, MAX(assessment_date) as max_date
  FROM comprehensive_assessments
  GROUP BY user_id
  HAVING COUNT(*) > 1
) b
WHERE a.user_id = b.user_id 
AND a.assessment_date < b.max_date;
*/

-- Add the unique constraint
ALTER TABLE comprehensive_assessments 
ADD CONSTRAINT comprehensive_assessments_user_id_unique 
UNIQUE (user_id);

-- Now the UPSERT with ON CONFLICT (user_id) will work properly