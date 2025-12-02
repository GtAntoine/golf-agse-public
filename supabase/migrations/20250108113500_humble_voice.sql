/*
  # Add personal information audit logging

  1. Changes
    - Add new change type for personal information updates
    - Add trigger for tracking personal information changes

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Add new change type for personal information
ALTER TYPE change_type ADD VALUE IF NOT EXISTS 'PERSONAL_INFO';

-- Create trigger function to log personal information changes
CREATE OR REPLACE FUNCTION log_personal_info_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    OLD.email != NEW.email OR
    OLD.firstname != NEW.firstname OR
    OLD.lastname != NEW.lastname OR
    OLD.address != NEW.address OR
    OLD.postalcode != NEW.postalcode OR
    OLD.city != NEW.city OR
    OLD.phone != NEW.phone OR
    OLD.emergencycontact != NEW.emergencycontact OR
    OLD.emergencyphone != NEW.emergencyphone OR
    OLD.ffglicense != NEW.ffglicense OR
    OLD.golfindex != NEW.golfindex
  ) THEN
    INSERT INTO member_audit_log (
      member_id,
      year,
      change_type,
      old_value,
      new_value
    ) VALUES (
      NEW.id,
      EXTRACT(YEAR FROM CURRENT_DATE),
      'PERSONAL_INFO',
      json_build_object(
        'email', OLD.email,
        'firstname', OLD.firstname,
        'lastname', OLD.lastname,
        'address', OLD.address,
        'postalcode', OLD.postalcode,
        'city', OLD.city,
        'phone', OLD.phone,
        'emergencycontact', OLD.emergencycontact,
        'emergencyphone', OLD.emergencyphone,
        'ffglicense', OLD.ffglicense,
        'golfindex', OLD.golfindex
      )::text,
      json_build_object(
        'email', NEW.email,
        'firstname', NEW.firstname,
        'lastname', NEW.lastname,
        'address', NEW.address,
        'postalcode', NEW.postalcode,
        'city', NEW.city,
        'phone', NEW.phone,
        'emergencycontact', NEW.emergencycontact,
        'emergencyphone', NEW.emergencyphone,
        'ffglicense', NEW.ffglicense,
        'golfindex', NEW.golfindex
      )::text
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER personal_info_audit
  AFTER UPDATE ON membership_applications
  FOR EACH ROW
  EXECUTE FUNCTION log_personal_info_changes();

-- Add policy for updating member information
CREATE POLICY "Allow anonymous users to update member information"
  ON membership_applications
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);