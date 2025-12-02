/*
  # Allow anonymous read access to membership applications
  
  1. Security Changes
    - Add policy to allow anonymous users to read membership applications
*/

-- Allow anonymous users to read all applications
CREATE POLICY "Allow anonymous users to read applications"
  ON membership_applications
  FOR SELECT
  TO anon
  USING (true);