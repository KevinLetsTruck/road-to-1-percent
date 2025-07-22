-- Fix user_progress table and policies
-- This script addresses potential conflicts causing 409 errors

-- First, let's check if there are any duplicate user_id entries
SELECT user_id, COUNT(*) 
FROM user_progress 
GROUP BY user_id 
HAVING COUNT(*) > 1;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;

-- Ensure user_id is unique (if not already)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'user_progress_user_id_key' 
        AND conrelid = 'user_progress'::regclass
    ) THEN
        ALTER TABLE user_progress ADD CONSTRAINT user_progress_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- Create or replace the function to handle user progress initialization
CREATE OR REPLACE FUNCTION initialize_user_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert user progress record only if it doesn't exist
    INSERT INTO user_progress (
        user_id,
        current_tier,
        spi_completed,
        standout_completed,
        leadership_completed,
        customer_service_completed,
        operational_completed,
        health_completed,
        business_track_progress,
        personal_track_progress,
        health_track_progress,
        milestones_achieved,
        program_start_date
    )
    VALUES (
        NEW.id,
        '90%',
        false,
        false,
        false,
        false,
        false,
        false,
        0,
        0,
        0,
        ARRAY[]::text[],
        NOW()
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION initialize_user_progress();

-- Recreate RLS policies with proper conflict handling
CREATE POLICY "Users can view own progress" 
    ON user_progress FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" 
    ON user_progress FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" 
    ON user_progress FOR UPDATE 
    USING (auth.uid() = user_id);

-- Create a function to safely get or create user progress
CREATE OR REPLACE FUNCTION get_or_create_user_progress(p_user_id uuid)
RETURNS user_progress AS $$
DECLARE
    v_progress user_progress;
BEGIN
    -- Try to get existing progress
    SELECT * INTO v_progress
    FROM user_progress
    WHERE user_id = p_user_id;
    
    -- If not found, create it
    IF NOT FOUND THEN
        INSERT INTO user_progress (
            user_id,
            current_tier,
            spi_completed,
            standout_completed,
            leadership_completed,
            customer_service_completed,
            operational_completed,
            health_completed,
            business_track_progress,
            personal_track_progress,
            health_track_progress,
            milestones_achieved,
            program_start_date
        )
        VALUES (
            p_user_id,
            '90%',
            false,
            false,
            false,
            false,
            false,
            false,
            0,
            0,
            0,
            ARRAY[]::text[],
            NOW()
        )
        ON CONFLICT (user_id) DO UPDATE 
        SET updated_at = NOW()
        RETURNING * INTO v_progress;
    END IF;
    
    RETURN v_progress;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_or_create_user_progress(uuid) TO authenticated;

-- Fix any existing users that don't have progress records
INSERT INTO user_progress (
    user_id,
    current_tier,
    spi_completed,
    standout_completed,
    leadership_completed,
    customer_service_completed,
    operational_completed,
    health_completed,
    business_track_progress,
    personal_track_progress,
    health_track_progress,
    milestones_achieved,
    program_start_date
)
SELECT 
    id,
    '90%',
    false,
    false,
    false,
    false,
    false,
    false,
    0,
    0,
    0,
    ARRAY[]::text[],
    NOW()
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_progress)
ON CONFLICT (user_id) DO NOTHING; 