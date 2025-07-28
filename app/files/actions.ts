'use server'

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { join } from 'path'

/**
 * Extract text content from a PDF file
 * @param filename - Name of the PDF file in the public/files directory
 * @returns Promise<string> - Extracted text content
 */
export async function extractTextFromPDF(filename: string): Promise<string> {
  try {
    // Construct the full path to the PDF file
    const filePath = join(process.cwd(), 'public', 'files', filename)
    console.log('Attempting to extract text from:', filePath)
    
    // Check if file exists
    const { access } = await import('fs/promises')
    await access(filePath)
    console.log('File exists, initializing LangChain PDFLoader...')
    
    // Create PDFLoader instance
    const loader = new PDFLoader(filePath)
    console.log('PDFLoader created, starting document loading...')
    
    // Load documents using LangChain
    const docs = await loader.load()
    console.log('PDF loading completed')
    console.log('Number of documents/pages:', docs.length)
    
    // Combine all page content into a single string
    const fullText = docs.map(doc => doc.pageContent).join('\n\n')
    console.log('Combined text from all pages')
    console.log('Total text length:', fullText.length, 'characters')
    
    // Log the actual extracted text
    console.log('Extracted text content:')
    console.log('--- START OF EXTRACTED TEXT ---')
    console.log(fullText)
    console.log('--- END OF EXTRACTED TEXT ---')
    
    // Log metadata from first document
    if (docs.length > 0) {
      console.log('PDF metadata:', {
        source: docs[0].metadata.source,
        totalPages: docs[0].metadata.pdf?.totalPages,
        version: docs[0].metadata.pdf?.version
      })
    }
    
    return fullText
  } catch (error) {
    console.error('Error extracting text from PDF:', error)
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
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
