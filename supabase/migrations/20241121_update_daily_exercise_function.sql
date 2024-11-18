-- Drop the existing function
DROP FUNCTION IF EXISTS get_or_create_daily_exercise;

-- Create updated function with daily_assignment_id
CREATE OR REPLACE FUNCTION get_or_create_daily_exercise(p_user_id uuid)
RETURNS TABLE (
    daily_assignment_id uuid,
    exercise_id uuid,
    exercise_name text,
    target_reps integer,
    completed boolean
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

    -- Return the exercise details
    RETURN QUERY
    SELECT 
        dea.id::uuid,
        e.id::uuid,
        e.name::text,
        ue.target_reps::integer,
        dea.completed::boolean
    FROM daily_exercise_assignments dea
    JOIN user_exercises ue ON ue.id = dea.user_exercise_id
    JOIN exercises e ON e.id = ue.exercise_id
    WHERE dea.id = v_assignment_id;
END;
$$;
