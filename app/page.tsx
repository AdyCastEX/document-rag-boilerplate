import Chatbot from '@/components/chatbot';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 flex items-center justify-center transition-colors">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            AI Chatbot Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Built with Vercel AI SDK, OpenAI, Radix UI, and Tailwind CSS
          </p>
        </div>
        <Chatbot />
      </div>
    </div>
  );
}
