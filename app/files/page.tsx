'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { extractTextFromMultiplePDFs, getPDFFiles } from './actions';

export default function FilesPage() {
  const [filePath, setFilePath] = useState('public/files');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerateEmbeddings = async () => {
    setIsProcessing(true);
    setMessage('Processing PDF files...');
    
    try {
      // Get all PDF files from public/files
      const pdfFiles = await getPDFFiles();
      
      if (pdfFiles.length === 0) {
        setMessage('No PDF files found in public/files directory');
        console.log('No PDF files found in public/files directory');
        return;
      }
      
      console.log(`Found ${pdfFiles.length} PDF files:`, pdfFiles);
      
      // Extract text from all PDFs
      const results = await extractTextFromMultiplePDFs(pdfFiles);
      
      // Log results to console
      console.log('PDF Text Extraction Results:');
      results.forEach((result, index) => {
        console.log(`\n--- PDF ${index + 1}: ${result.filename} ---`);
        if (result.error) {
          console.error(`Error: ${result.error}`);
        } else {
          console.log(`Text length: ${result.text.length} characters`);
          console.log('Extracted text:', result.text.substring(0, 500) + '...');
        }
      });
      
      setMessage(`Successfully processed ${results.length} PDF files. Check console for extracted text.`);
    } catch (error) {
      console.error('Error processing PDFs:', error);
      setMessage(`Error processing PDFs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 transition-colors">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            File Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your document files and folders
          </p>
        </div>

        <div className="mb-6">
          <nav className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Link href="/" className="flex-1">
              <Button variant="ghost" className="w-full">
                Chat
              </Button>
            </Link>
            <Button variant="default" className="flex-1">
              Files
            </Button>
          </nav>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="filepath" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                File Path
              </label>
              <Input
                id="filepath"
                type="text"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                placeholder="Enter file path..."
                className="w-full"
              />
            </div>
            
            <div>
              <Button onClick={handleGenerateEmbeddings} variant="default" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Generate Embeddings'}
              </Button>
            </div>
            
            {message && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  {message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
