-- Create a function to match embeddings using cosine similarity
-- This function takes a query embedding and returns the most similar embeddings
create or replace function match_embeddings (
  query_embedding vector(1536),
  match_threshold float default 0.78,
  match_count int default 10
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  chunk_index int,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    embeddings.id,
    embeddings.document_id,
    embeddings.content,
    embeddings.chunk_index,
    embeddings.metadata,
    1 - (embeddings.embedding <=> query_embedding) as similarity
  from embeddings
  where 1 - (embeddings.embedding <=> query_embedding) > match_threshold
  order by embeddings.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Create an RPC function wrapper for easier client-side access
create or replace function rpc_match_embeddings (
  query_embedding vector(1536),
  match_threshold float default 0.78,
  match_count int default 10
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  chunk_index int,
  metadata jsonb,
  similarity float
)
language sql
as $$
  select * from match_embeddings(query_embedding, match_threshold, match_count);
$$;

-- Grant execute permissions to authenticated users
grant execute on function match_embeddings to authenticated;
grant execute on function rpc_match_embeddings to authenticated;

-- Grant execute permissions to anon users (for public access if needed)
grant execute on function match_embeddings to anon;
grant execute on function rpc_match_embeddings to anon;
