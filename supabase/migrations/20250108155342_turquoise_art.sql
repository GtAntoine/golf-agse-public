-- Drop existing policies
DROP POLICY IF EXISTS "Enable read for authenticated users" ON member_audit_log;

-- Create new policy for member_audit_log
CREATE POLICY "Enable all operations on member_audit_log"
  ON member_audit_log
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Make sure RLS is enabled
ALTER TABLE member_audit_log ENABLE ROW LEVEL SECURITY;