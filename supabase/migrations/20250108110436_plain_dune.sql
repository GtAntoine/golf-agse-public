/*
  # Add payment history system
  
  1. New Tables
    - `payment_history`
      - `id` (uuid, primary key)
      - `member_id` (uuid, references membership_applications)
      - `year` (integer)
      - `membership_paid` (boolean)
      - `license_paid` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on payment_history table
    - Add policies for anonymous access (temporary)
*/

CREATE TABLE payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES membership_applications(id),
  year integer NOT NULL,
  membership_paid boolean DEFAULT false,
  license_paid boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow anonymous users to read payment history"
  ON payment_history
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous write access
CREATE POLICY "Allow anonymous users to insert payment history"
  ON payment_history
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous update access
CREATE POLICY "Allow anonymous users to update payment history"
  ON payment_history
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);