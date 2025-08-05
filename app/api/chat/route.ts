import { openai } from '@ai-sdk/openai';
import { streamText, embed } from 'ai';
import { createClient } from '@/lib/supabase/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // Get the last user message for embedding
  const lastUserMessage = messages.filter((msg: any) => msg.role === 'user').pop();
  const query = lastUserMessage?.content || '';
  
  let contextualPrompt = `You are a helpful AI assistant. Answer the user's questions based on the provided context and your general knowledge.`;
  
  if (query) {
    try {
      console.log('🔍 Searching for relevant context for:', query);
      
      // Generate embedding for the query
      const { embedding } = await embed({
        model: openai.embedding('text-embedding-3-small'),
        value: query,
      });
      
      // Search for relevant documents
      // TODO: Implement search embeddings as a tool
      const supabase = await createClient();
      const { data, error } = await supabase.rpc('rpc_match_embeddings', {
        query_embedding: embedding,
        match_threshold: 0.4,
        match_count: 10
      });

      if (error) {
        console.error('❌ Supabase RPC error:', error);
      } else if (data && data.length > 0) {
        console.log('📊 Search Results Details:');
        console.log(`Found ${data.length} documents with similarity >= ${0.4}`);
        
        data.forEach((result: any, index: number) => {
          console.log(`\n📄 Document ${index + 1}:`);
          console.log(`  Similarity: ${result.similarity.toFixed(4)}`);
          console.log(`  Content length: ${result.content?.length || 0} characters`);
          console.log(`  Content preview: "${(result.content || '').substring(0, 100)}${result.content?.length > 100 ? '...' : ''}"`); 
          if (result.metadata) {
            console.log(`  Metadata:`, JSON.stringify(result.metadata, null, 2));
          }
        });
        
        // Format the context from search results with better structure
        const contextDocs = data.map((result: any, index: number) => ({
          id: index + 1,
          similarity: result.similarity.toFixed(3),
          content: result.content.trim(),
          // Add metadata if available
          ...(result.metadata && { metadata: result.metadata })
        }));
        
        const context = contextDocs.map(doc => 
          `## Document ${doc.id} (Similarity: ${doc.similarity})
${doc.metadata ? `**Source:** ${doc.metadata.source || 'Unknown'}
${doc.metadata.title ? `**Title:** ${doc.metadata.title}` : ''}
${doc.metadata.page ? `**Page:** ${doc.metadata.page}` : ''}

` : ''}**Content:**
${doc.content}

---`
        ).join('\n\n');
        
        contextualPrompt = `You are a helpful AI assistant with access to a knowledge base. Use the following context documents to help answer the user's questions accurately and comprehensively.

## Instructions:
- Prioritize information from documents with higher similarity scores
- Cite specific documents when referencing information (e.g., "According to Document 2...")
- If the context doesn't contain sufficient information, clearly state this limitation
- Combine information from multiple documents when relevant

## Retrieved Context:

${context}

## User Question:
Please answer the following question based on the above context and your general knowledge.`;
        
        console.log(`✅ Found ${data.length} relevant documents for context`);
      } else {
        console.log('ℹ️ No relevant documents found');
      }
    } catch (error) {
      console.error('❌ Error during embedding search:', error);
    }
  }

  const result = await streamText({
    model: openai('gpt-4o'),
    messages,
    system: contextualPrompt,
  });
  
  return result.toDataStreamResponse();
}
