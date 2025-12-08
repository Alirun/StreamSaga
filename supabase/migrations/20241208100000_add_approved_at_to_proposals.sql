-- Add approved_at column to proposals table
ALTER TABLE proposals ADD COLUMN approved_at timestamp with time zone;

-- Create index for efficient filtering of approved proposals
CREATE INDEX IF NOT EXISTS proposals_approved_at_idx ON proposals(approved_at);

-- Drop the existing update policy for proposals
DROP POLICY IF EXISTS "Users can update their own proposals" ON proposals;

-- Create new update policy that blocks updates on approved proposals
-- Users can only update their own proposals that are NOT approved
CREATE POLICY "Users can update their own non-approved proposals"
  ON proposals FOR UPDATE
  USING (auth.uid() = user_id AND approved_at IS NULL);

-- Admin policy to approve proposals (set approved_at)
CREATE POLICY "Admins can approve proposals"
  ON proposals FOR UPDATE
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
