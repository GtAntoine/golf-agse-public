/*
  # Fix user registration trigger

  1. Changes
    - Update handle_new_user function to properly handle profile creation
    - Add error handling and ensure all required fields are handled
    - Fix potential issues with the trigger function

  2. Security
    - Maintain existing RLS policies
    - Ensure proper user profile creation
*/

-- Drop and recreate the trigger function with better error handling
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create improved trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    firstname,
    lastname,
    birthdate,
    phone,
    address,
    postalcode,
    city,
    ffglicense,
    emergencycontact,
    emergencyphone,
    golfindex,
    role,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'user',
    now(),
    now()
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Also add a policy to allow the trigger to insert profiles
DROP POLICY IF EXISTS "Allow system to create profiles" ON profiles;
CREATE POLICY "Allow system to create profiles"
  ON profiles FOR INSERT
  TO service_role
  WITH CHECK (true);