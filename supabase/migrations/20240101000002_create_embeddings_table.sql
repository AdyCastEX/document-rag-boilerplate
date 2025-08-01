-- Create embeddings table with content and vector embedding columns
create table if not exists public.embeddings (
  id uuid default gen_random_uuid() primary key,
  document_id uuid not null, -- Groups chunks from the same document
  content text not null,
  embedding vector(1536), -- OpenAI embeddings are 1536 dimensions
  chunk_index integer not null default 0, -- Position of this chunk in the document
  total_chunks integer, -- Total number of chunks for this document
  metadata jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create an index on the embedding column for efficient similarity search
create index if not exists embeddings_embedding_idx on public.embeddings 
using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Create indexes for efficient chunking queries
create index if not exists embeddings_document_id_idx on public.embeddings (document_id);
create index if not exists embeddings_document_chunk_idx on public.embeddings (document_id, chunk_index);

-- Create a function to update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create a trigger to automatically update the updated_at column
create trigger handle_embeddings_updated_at
  before update on public.embeddings
  for each row execute function public.handle_updated_at();
