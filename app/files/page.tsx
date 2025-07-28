'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FilesPage() {
  const [filePath, setFilePath] = useState('public/files');
  const [message, setMessage] = useState('');

  const handleGenerateEmbeddings = () => {
    setMessage('Generate Embeddings functionality will be implemented here!');
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
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
              <Button onClick={handleGenerateEmbeddings} variant="default">
                Generate Embeddings
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
