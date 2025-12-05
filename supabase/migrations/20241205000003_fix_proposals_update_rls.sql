-- Fix RLS policy for archiving proposals
-- The auth.uid() should work with server-side Supabase client when using cookies

-- Drop all existing update policies to start fresh
drop policy if exists "Users can update their own proposals" on proposals;

-- Single policy: authenticated users can update rows they own
-- auth.uid() gets the user from the JWT in the session cookies
create policy "Authenticated users can update own proposals"
  on proposals for update
  to authenticated  -- Only applies to authenticated users
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
