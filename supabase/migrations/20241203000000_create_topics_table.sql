-- Enable the vector extension if it's not already enabled
create extension if not exists vector;

-- Create the topics table
create table if not exists topics (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  status text not null default 'open' check (status in ('open', 'closed', 'archived')),
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  archived_at timestamp with time zone,
  embedding vector(1536)
);

-- Enable Row Level Security (RLS)
alter table topics enable row level security;

-- Create policies
-- Policy for viewing topics (Public can view)
create policy "Public topics are viewable by everyone"
  on topics for select
  using (true);

-- Policy for inserting topics (Admin only - handled by app logic/middleware for now, but good to have DB level too if possible, 
-- but since we don't have custom claims easily accessible in simple RLS without setup, we'll rely on authenticated users for now 
-- and application layer for admin check, OR we can check app_metadata if Supabase config allows. 
-- For simplicity in this step, we'll allow authenticated users to insert, but the App will gate it.)
-- Actually, let's restrict to authenticated users at least.
-- Policy for inserting topics (Admin only)
create policy "Admins can insert topics"
  on topics for insert
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Policy for updating topics (Admin only)
create policy "Admins can update topics"
  on topics for update
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
