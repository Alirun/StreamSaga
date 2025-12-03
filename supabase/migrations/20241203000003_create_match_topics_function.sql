-- Create a function to search for similar topics
create or replace function match_topics (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    topics.id,
    topics.title,
    1 - (topics.embedding <=> query_embedding) as similarity
  from topics
  where 1 - (topics.embedding <=> query_embedding) > match_threshold
  order by topics.embedding <=> query_embedding
  limit match_count;
end;
$$;
