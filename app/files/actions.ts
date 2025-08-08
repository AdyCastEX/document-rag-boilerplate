'use server'

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { join } from 'path'
import { openai } from '@ai-sdk/openai'
import { embed } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

/**
 * Extract text content from a PDF file
 * @param filename - Name of the PDF file in the public/files directory
 * @returns Promise<string> - Extracted text content
 */
export async function extractTextFromPDF(filename: string): Promise<string> {
  try {
    // Construct the full path to the PDF file
    const filePath = join(process.cwd(), 'public', 'files', filename)
    
    // Check if file exists
    const { access } = await import('fs/promises')
    await access(filePath)
    
    // Create PDFLoader instance and load documents
    const loader = new PDFLoader(filePath)
    const docs = await loader.load()
    
    // Combine all page content into a single string
    const fullText = docs.map(doc => doc.pageContent).join('\n\n')
    
    return fullText
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Get list of PDF files in the public/files directory
 * @returns Promise<string[]> - Array of PDF filenames
 */
export async function getPDFFiles(): Promise<string[]> {
  try {
    const { readdir } = await import('fs/promises')
    const filesDir = join(process.cwd(), 'public', 'files')
    
    const files = await readdir(filesDir)
    return files.filter(file => file.toLowerCase().endsWith('.pdf'))
  } catch (error) {
    console.error('Error reading PDF files:', error)
    return []
  }
}

/**
 * Extract text from multiple PDF files
 * @param filenames - Array of PDF filenames to process
 * @returns Promise<{filename: string, text: string, error?: string}[]>
 */
export async function extractTextFromMultiplePDFs(filenames: string[]): Promise<Array<{
  filename: string
  text: string
  error?: string
}>> {
  const results = []
  
  for (const filename of filenames) {
    try {
      const text = await extractTextFromPDF(filename)
      results.push({ filename, text })
    } catch (error) {
      results.push({
        filename,
        text: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  
  return results
}

/**
 * Chunk text into smaller pieces for embedding processing using fixed chunk size
 * @param text - The text to chunk
 * @param options - Chunking options
 * @returns Array of text chunks with metadata
 */
export async function chunkText(
  text: string,
  options: {
    chunkSize?: number
    chunkOverlap?: number
  } = {}
): Promise<Array<{
  content: string
  index: number
}>> {}

/**
 * Process all PDF files: get files, extract text, and chunk each one
 * Logs progress for each iteration
 */
export async function processFiles(): Promise<void> {
  console.log('Starting processFiles...')
  
  try {
    // Get all PDF files
    const pdfFiles = await getPDFFiles()
    console.log(`Found ${pdfFiles.length} PDF files:`, pdfFiles)
    
    // Process each file using forEach
    pdfFiles.forEach(async (filename, index) => {
      console.log(`\n--- Processing file ${index + 1}/${pdfFiles.length}: ${filename} ---`)
      
      try {
        // Extract text from PDF
        console.log(`Extracting text from ${filename}...`)
        const extractedText = await extractTextFromPDF(filename)
        console.log(`Text extraction completed for ${filename}. Length: ${extractedText.length} characters`)
        
        // Chunk the text with chunkText()
        
        // Generate UUID based on filename for document grouping
        // Convert hash to valid UUID format (8-4-4-4-12)
        
        // Create embeddings per chunk using createEmbeddings()
      } catch (error) {
        console.error(`❌ Error processing ${filename}:`, error)
      }
    })
    
    console.log('\n🎉 processFiles completed!')
    
  } catch (error) {
    console.log('❌ Error in processFiles:', error)
    throw error
  }
}

/**
 * Create embeddings for text chunks and store them in Supabase
 * @param chunks - Array of text chunks with metadata
 * @param documentId - UUID to group chunks from the same document
 * @param filename - Original filename for metadata
 */
export async function createEmbeddings(
  chunks: Array<{
    content: string
    index: number
  }>,
  documentId: string,
  filename: string
): Promise<void> {}
