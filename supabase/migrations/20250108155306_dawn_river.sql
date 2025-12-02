-- Drop existing policies
DROP POLICY IF EXISTS "Users can view payment history" ON payment_history;
DROP POLICY IF EXISTS "Admins can manage payment history" ON payment_history;

-- Create new policies for payment_history
CREATE POLICY "Enable all operations on payment_history"
  ON payment_history
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Make sure RLS is enabled
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;