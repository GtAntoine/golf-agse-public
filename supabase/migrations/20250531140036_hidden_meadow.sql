-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS get_member_details;

-- Recreate the function with birthdate included
CREATE OR REPLACE FUNCTION get_member_details(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  membershiptype text,
  licensetype text,
  created_at timestamptz,
  firstname text,
  lastname text,
  birthdate date,
  phone text,
  address text,
  postalcode text,
  city text,
  ffglicense text,
  golfindex numeric,
  emergencycontact text,
  emergencyphone text,
  role text,
  email text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ma.id,
    ma.user_id,
    ma.membershiptype,
    ma.licensetype,
    ma.created_at,
    p.firstname,
    p.lastname,
    p.birthdate,
    p.phone,
    p.address,
    p.postalcode,
    p.city,
    p.ffglicense,
    p.golfindex,
    p.emergencycontact,
    p.emergencyphone,
    p.role,
    auth.email
  FROM membership_applications ma
  JOIN profiles p ON p.id = ma.user_id
  JOIN auth.users auth ON auth.id = ma.user_id
  WHERE ma.user_id = p_user_id
  ORDER BY ma.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;