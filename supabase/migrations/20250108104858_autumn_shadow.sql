/*
  # Add payment tracking columns
  
  1. New Columns
    - `membership_paid` (boolean) - Track if membership fee is paid
    - `license_paid` (boolean) - Track if license fee is paid
*/

ALTER TABLE membership_applications 
ADD COLUMN membership_paid boolean DEFAULT false,
ADD COLUMN license_paid boolean DEFAULT false;