/*
  # Add member type tracking
  
  1. Changes
    - Add member_type field to payment_history table
    - Add enum type for member types
*/

-- Create enum for member types
CREATE TYPE member_type AS ENUM ('RATTACHE', 'AGSE');

-- Add member_type column to payment_history
ALTER TABLE payment_history 
ADD COLUMN member_type member_type DEFAULT 'RATTACHE';