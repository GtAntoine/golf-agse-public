/*
  # Add RLS policies to membership applications table

  1. Security
    - Enable RLS on `membership_applications` table
    - Add policies for authenticated users to read all applications
    - Add policy for anyone to insert applications
*/

-- Enable RLS if not already enabled
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read applications" ON membership_applications;
DROP POLICY IF EXISTS "Allow anyone to insert applications" ON membership_applications;

-- Create new policies
CREATE POLICY "Allow authenticated users to read applications"
  ON membership_applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anyone to insert applications"
  ON membership_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);