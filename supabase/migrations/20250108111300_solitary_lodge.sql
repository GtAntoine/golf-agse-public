/*
  # Add trigger for automatic AGSE status on license payment
  
  1. Changes
    - Add trigger to automatically set member_type to 'AGSE' when license is paid
    - Set member_type to NULL by default instead of 'RATTACHE'
  
  2. Security
    - Trigger runs with the same permissions as the payment_history table
*/

-- First, modify the default value of member_type to be NULL
ALTER TABLE payment_history 
ALTER COLUMN member_type DROP DEFAULT;

-- Create function to handle license payment
CREATE OR REPLACE FUNCTION handle_license_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- If license is being set to paid and member_type is not already set
  IF NEW.license_paid = true AND (NEW.member_type IS NULL OR NEW.member_type = 'RATTACHE') THEN
    NEW.member_type := 'AGSE';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER set_agse_on_license_payment
  BEFORE INSERT OR UPDATE ON payment_history
  FOR EACH ROW
  EXECUTE FUNCTION handle_license_payment();