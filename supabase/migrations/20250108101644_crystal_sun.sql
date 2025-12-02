/*
  # Create membership applications table

  1. New Tables
    - `membership_applications`
      - `id` (uuid, primary key)
      - `email` (text)
      - `firstName` (text)
      - `lastName` (text)
      - `address` (text)
      - `postalCode` (text)
      - `city` (text)
      - `birthDate` (date)
      - `phone` (text)
      - `emergencyContact` (text)
      - `emergencyPhone` (text)
      - `membershipType` (text)
      - `ffgLicense` (text, optional)
      - `golfIndex` (numeric, optional)
      - `licenseType` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `membership_applications` table
    - Add policies for authenticated users to read all applications
    - Add policy for anyone to insert applications
*/

CREATE TABLE membership_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  firstName text NOT NULL,
  lastName text NOT NULL,
  address text NOT NULL,
  postalCode text NOT NULL,
  city text NOT NULL,
  birthDate date NOT NULL,
  phone text NOT NULL,
  emergencyContact text NOT NULL,
  emergencyPhone text NOT NULL,
  membershipType text NOT NULL,
  ffgLicense text,
  golfIndex numeric,
  licenseType text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all applications
CREATE POLICY "Allow authenticated users to read applications"
  ON membership_applications
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow anyone to insert applications
CREATE POLICY "Allow anyone to insert applications"
  ON membership_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);