-- Add onboarding_completed column to users table with default false
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Update the handle_new_user function to initialize onboarding_completed
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = new.id) THEN
        INSERT INTO public.users (id, email, name, onboarding_completed)
        VALUES (
            new.id,
            new.email,
            COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email),
            false
        );
    END IF;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 