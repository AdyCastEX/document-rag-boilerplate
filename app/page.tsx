import Chatbot from '@/components/chatbot';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 flex items-center justify-center transition-colors">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            AI Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Built with Vercel AI SDK, OpenAI, Radix UI, and Tailwind CSS
          </p>
        </div>
        
        <div className="mb-6">
          <nav className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Button variant="default" className="flex-1">
              Chat
            </Button>
            <Link href="/files" className="flex-1">
              <Button variant="ghost" className="w-full">
                Files
              </Button>
            </Link>
          </nav>
        </div>
        
        <Chatbot />
      </div>
    </div>
  );
}
