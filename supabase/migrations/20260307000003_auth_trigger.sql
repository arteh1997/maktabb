-- Trigger: on new auth user signup, create school + admin teacher record
-- This runs when a teacher/admin signs up via email+password.
-- Parent accounts are created by admins, not via self-signup.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_school_id uuid;
  user_name text;
  school_name text;
BEGIN
  -- Only process if raw_user_meta_data has a school_name (i.e. staff signup)
  IF NEW.raw_user_meta_data->>'school_name' IS NOT NULL THEN
    user_name := COALESCE(NEW.raw_user_meta_data->>'name', 'Admin');
    school_name := NEW.raw_user_meta_data->>'school_name';

    -- Create the school
    INSERT INTO schools (name)
    VALUES (school_name)
    RETURNING id INTO new_school_id;

    -- Create the admin teacher record
    INSERT INTO teachers (school_id, auth_user_id, name, email, role)
    VALUES (new_school_id, NEW.id, user_name, NEW.email, 'admin');
  END IF;

  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
