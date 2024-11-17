-- Add new columns to user_exercises
ALTER TABLE user_exercises
ADD COLUMN active boolean DEFAULT true,
ADD COLUMN created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Create a new table for daily exercise assignments
CREATE TABLE daily_exercise_assignments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    user_exercise_id uuid REFERENCES user_exercises(id) ON DELETE CASCADE,
    date date NOT NULL DEFAULT CURRENT_DATE,
    completed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, date)
);

-- Create a function to randomly assign an exercise for the day
CREATE OR REPLACE FUNCTION get_or_create_daily_exercise(p_user_id uuid)
RETURNS TABLE (
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
