-- Create the votes table
create table if not exists votes (
  id uuid default gen_random_uuid() primary key,
  proposal_id uuid references proposals(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  archived_at timestamp with time zone
);

-- Create unique index for non-archived votes (one active vote per user per proposal)
create unique index if not exists votes_user_proposal_active_idx 
  on votes(user_id, proposal_id) 
  where archived_at is null;

-- Create index on proposal_id for faster vote count lookups
create index if not exists votes_proposal_id_idx on votes(proposal_id);

-- Create index on user_id for faster user vote lookups
create index if not exists votes_user_id_idx on votes(user_id);

-- Enable Row Level Security (RLS)
alter table votes enable row level security;

-- Policy for viewing votes (Public can view non-archived)
create policy "Public can view non-archived votes"
  on votes for select
  using (archived_at is null);

-- Policy for inserting votes (Authenticated users can create votes)
create policy "Authenticated users can create votes"
  on votes for insert
  with check (auth.uid() = user_id);

-- Policy for updating votes (Users can update their own votes - for soft delete)
create policy "Users can update their own votes"
  on votes for update
  using (auth.uid() = user_id);

-- Enable realtime for votes
alter publication supabase_realtime add table votes;
