# Document RAG Boilerplate

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) that provides a document-based Retrieval-Augmented Generation (RAG) system using Supabase for vector storage and OpenAI for embeddings and chat.

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key

## Getting Started

First, install dependencies:

```bash
npm install
```

Next, create a Supabase project:

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from the project settings

## Environment Variables

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PROJECT_REF=your_supabase_project_ref
NEXT_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Setup

### 1. Initialize Supabase

```bash
# Login to Supabase
npx supabase login

# Link to your remote project
source .env.local && npx supabase link --project-ref $NEXT_PUBLIC_SUPABASE_PROJECT_REF
```

### 2. Push Migrations

This project includes pre-built migrations for the RAG system:

```bash
# Push all migrations to your linked Supabase project
npx supabase db push --linked

# Or apply migrations one by one
npx supabase migration up
```

The migrations include:
- **Vector extension**: Enables pgvector for embeddings
- **Embeddings table**: Stores document chunks and their vector embeddings
- **Match function**: RPC function for similarity search

## Running the Development Server

After completing the setup above, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding Documents

To process PDF documents with the RAG system, place your PDF files in the `public/files/` directory. The application will automatically detect and process documents from this location.

## Implementation Tasks

The following functions need to be implemented to complete the RAG system:

### 1. Text Chunking (`app/files/actions.ts`)
Implement the `chunkText` function to split document text into manageable chunks for embedding:
- Split text into overlapping chunks (starting point: 200 characters with 40 character overlap)
- Preserve sentence boundaries when possible
- Return an array of text chunks

### 2. Embedding Creation (`app/files/actions.ts`)
Implement the `createEmbeddings` function to generate vector embeddings:
- Use OpenAI's `text-embedding-3-small` model
- Process text chunks and generate embeddings
- Store embeddings in Supabase with associated metadata

### 3. File Processing Integration (`app/files/actions.ts`)
Apply the above functions in the `processFiles` function:
- Extract text from PDF files
- Chunk the extracted text using `chunkText`
- Generate embeddings using `createEmbeddings`
- Store results in the database

### 4. Search Tool Implementation (Challenge) (`app/api/chat/route.ts`)
Implement search embeddings as an AI SDK tool:
- Create a `searchEmbeddings` tool that integrates with AI SDK tool calling
- Use the existing RPC function `rpc_match_embeddings` for similarity search
- Enable the chat system to automatically search for relevant context
- Configure similarity threshold and match count parameters

