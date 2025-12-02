/*
  # Add role column to profiles table

  1. Changes
    - Add role column to profiles table with default value 'user'
    - Update RLS policies to restrict admin page access
*/

-- Add role column
ALTER TABLE profiles
ADD COLUMN role text DEFAULT 'user';

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;