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

