-- Add daily_assignment_id to sets table to track which daily assignment this set belongs to
ALTER TABLE sets ADD COLUMN daily_assignment_id uuid REFERENCES daily_exercise_assignments(id);

-- Remove the completed column from daily_exercise_assignments as we'll track completion through sets
ALTER TABLE daily_exercise_assignments DROP COLUMN completed;

-- Add a function to count sets for today's exercise
CREATE OR REPLACE FUNCTION get_todays_sets_count(p_daily_assignment_id uuid)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::integer
        FROM sets s
        WHERE s.daily_assignment_id = p_daily_assignment_id
        AND DATE(s.timestamp) = CURRENT_DATE
    );
END;
$$;

-- Drop the existing function first
DROP FUNCTION IF EXISTS get_or_create_daily_exercise(uuid);

-- Create updated function with sets count
CREATE FUNCTION get_or_create_daily_exercise(p_user_id uuid)
RETURNS TABLE (
    daily_assignment_id uuid,
    user_exercise_id uuid,
    exercise_id uuid,
    exercise_name text,
    target_reps integer,
    sets_count integer
) 
LANGUAGE plpgsql
AS $$
DECLARE
    v_assignment_id uuid;
    v_user_exercise_id uuid;
BEGIN
    -- First try to get existing assignment for today
    SELECT dea.id, dea.user_exercise_id
    INTO v_assignment_id, v_user_exercise_id
    FROM daily_exercise_assignments dea
    WHERE dea.user_id = p_user_id 
    AND dea.date = CURRENT_DATE;

    -- If no assignment exists for today, create one
    IF v_assignment_id IS NULL THEN
        -- Randomly select an active exercise
        SELECT ue.id INTO v_user_exercise_id
        FROM user_exercises ue
        WHERE ue.user_id = p_user_id
        AND ue.active = true
        ORDER BY random()
        LIMIT 1;

        -- Create new assignment
        IF v_user_exercise_id IS NOT NULL THEN
            INSERT INTO daily_exercise_assignments 
                (user_id, user_exercise_id)
            VALUES 
                (p_user_id, v_user_exercise_id)
            RETURNING id INTO v_assignment_id;
        END IF;
    END IF;

    -- Return the exercise details with sets count
    RETURN QUERY
    SELECT 
        dea.id::uuid,
        dea.user_exercise_id::uuid,
        e.id::uuid,
        e.name::text,
        ue.target_reps::integer,
        get_todays_sets_count(dea.id)::integer
    FROM daily_exercise_assignments dea
    JOIN user_exercises ue ON ue.id = dea.user_exercise_id
    JOIN exercises e ON e.id = ue.exercise_id
    WHERE dea.id = v_assignment_id;
END;
$$;

-- Update the RLS policy for sets to check daily_assignment_id
DROP POLICY IF EXISTS "Users can insert their own sets" ON sets;
CREATE POLICY "Users can insert their own sets" ON sets
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM daily_exercise_assignments dea
            WHERE dea.id = daily_assignment_id
            AND dea.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can view their own sets" ON sets;
CREATE POLICY "Users can view their own sets" ON sets
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM daily_exercise_assignments dea
            WHERE dea.id = daily_assignment_id
            AND dea.user_id = auth.uid()
        )
    );
