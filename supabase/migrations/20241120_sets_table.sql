-- Enable RLS
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own sets
CREATE POLICY "Users can insert their own sets" ON sets
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_exercises ue
            WHERE ue.id = user_exercise_id
            AND ue.user_id = auth.uid()
        )
    );

-- Create policy to allow users to read their own sets
CREATE POLICY "Users can view their own sets" ON sets
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_exercises ue
            WHERE ue.id = user_exercise_id
            AND ue.user_id = auth.uid()
        )
    );
