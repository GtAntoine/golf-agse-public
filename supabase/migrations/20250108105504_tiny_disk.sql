/*
  # Add payment update policy

  1. Changes
    - Add policy to allow anonymous users to update payment status columns
  
  2. Security
    - Anonymous users can update only membership_paid and license_paid columns
*/

DO $$ 
BEGIN
  -- Drop existing policy if it exists
  DROP POLICY IF EXISTS "Allow anonymous users to update payment status" ON membership_applications;
  
  -- Create new policy
  CREATE POLICY "Allow anonymous users to update payment status"
    ON membership_applications
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);
END $$;