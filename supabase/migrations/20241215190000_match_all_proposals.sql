-- Create function to match all proposals by embedding similarity (no topic restriction)
create or replace function match_all_proposals (
  query_embedding vector(1536),
  match_threshold float default 0.5,
  match_count int default 10
)
returns table (
  id uuid,
  title text,
  description text,
  topic_id uuid,
  user_id uuid,
  created_at timestamp with time zone,
  similarity float
)
language sql stable
as $$
  select
    proposals.id,
    proposals.title,
    proposals.description,
    proposals.topic_id,
    proposals.user_id,
    proposals.created_at,
    1 - (proposals.embedding <=> query_embedding) as similarity
  from proposals
  where 
    proposals.archived_at is null
    and 1 - (proposals.embedding <=> query_embedding) > match_threshold
  order by proposals.embedding <=> query_embedding
  limit match_count;
$$;
