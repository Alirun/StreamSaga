-- Create the proposals table
create table if not exists proposals (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  topic_id uuid references topics(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  archived_at timestamp with time zone,
  embedding vector(1536)
);

-- Create index on topic_id for faster lookups
create index if not exists proposals_topic_id_idx on proposals(topic_id);

-- Create index on user_id for faster lookups
create index if not exists proposals_user_id_idx on proposals(user_id);

-- Enable Row Level Security (RLS)
alter table proposals enable row level security;

-- Policy for viewing proposals (Public can view non-archived)
create policy "Public can view non-archived proposals"
  on proposals for select
  using (archived_at is null);

-- Policy for inserting proposals (Authenticated users can create proposals for open topics)
create policy "Authenticated users can create proposals"
  on proposals for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from topics
      where topics.id = topic_id
      and topics.status = 'open'
    )
  );

-- Policy for updating proposals (Users can update their own proposals)
create policy "Users can update their own proposals"
  on proposals for update
  using (auth.uid() = user_id);

-- Enable realtime for proposals
alter publication supabase_realtime add table proposals;
