/*
  # Add audit table for member changes

  1. New Tables
    - `member_audit_log`
      - `id` (uuid, primary key)
      - `member_id` (uuid, references membership_applications)
      - `year` (integer)
      - `change_type` (enum: MEMBERSHIP_PAYMENT, LICENSE_PAYMENT, MEMBER_TYPE)
      - `old_value` (text)
      - `new_value` (text)
      - `created_at` (timestamp)
      - `created_by` (text)

  2. Security
    - Enable RLS on `member_audit_log` table
    - Add policy for authenticated users to read audit logs
    - Add policy for anonymous users to insert audit logs (temporary until auth is implemented)

  3. Functions
    - Add trigger function to automatically log changes to payment_history
*/

-- Create enum for change types
CREATE TYPE change_type AS ENUM ('MEMBERSHIP_PAYMENT', 'LICENSE_PAYMENT', 'MEMBER_TYPE');

-- Create audit log table
CREATE TABLE member_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES membership_applications(id),
  year integer NOT NULL,
  change_type change_type NOT NULL,
  old_value text,
  new_value text,
  created_at timestamptz DEFAULT now(),
  created_by text
);

-- Enable RLS
ALTER TABLE member_audit_log ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow authenticated users to read audit logs"
  ON member_audit_log
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow anonymous users to insert audit logs"
  ON member_audit_log
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create trigger function to log changes
CREATE OR REPLACE FUNCTION log_payment_history_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log membership payment changes
  IF (OLD IS NULL AND NEW.membership_paid = true) OR (OLD.membership_paid IS DISTINCT FROM NEW.membership_paid) THEN
    INSERT INTO member_audit_log (member_id, year, change_type, old_value, new_value)
    VALUES (
      NEW.member_id,
      NEW.year,
      'MEMBERSHIP_PAYMENT',
      CASE WHEN OLD IS NULL THEN 'false' ELSE OLD.membership_paid::text END,
      NEW.membership_paid::text
    );
  END IF;

  -- Log license payment changes
  IF (OLD IS NULL AND NEW.license_paid = true) OR (OLD.license_paid IS DISTINCT FROM NEW.license_paid) THEN
    INSERT INTO member_audit_log (member_id, year, change_type, old_value, new_value)
    VALUES (
      NEW.member_id,
      NEW.year,
      'LICENSE_PAYMENT',
      CASE WHEN OLD IS NULL THEN 'false' ELSE OLD.license_paid::text END,
      NEW.license_paid::text
    );
  END IF;

  -- Log member type changes
  IF (OLD IS NULL AND NEW.member_type IS NOT NULL) OR (OLD.member_type IS DISTINCT FROM NEW.member_type) THEN
    INSERT INTO member_audit_log (member_id, year, change_type, old_value, new_value)
    VALUES (
      NEW.member_id,
      NEW.year,
      'MEMBER_TYPE',
      OLD.member_type::text,
      NEW.member_type::text
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER payment_history_audit
  AFTER INSERT OR UPDATE ON payment_history
  FOR EACH ROW
  EXECUTE FUNCTION log_payment_history_changes();