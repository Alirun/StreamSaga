-- Fix RLS policy for updating proposals
-- The existing policy only has USING clause, needs WITH CHECK for actual updates

-- Drop the existing update policy
drop policy if exists "Users can update their own proposals" on proposals;

-- Create a more complete update policy with both USING and WITH CHECK
-- USING: determines which rows CAN be selected for update (must own the row)
-- WITH CHECK: determines if the NEW row values are allowed (must still own it)
create policy "Users can update their own proposals"
  on proposals for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
