-- Add name column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS name TEXT;

-- Update the handle_new_user function to include name from auth.users metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = new.id) THEN
        INSERT INTO public.users (id, email, name)
        VALUES (
            new.id,
            new.email,
            COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email)
        );
    END IF;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
