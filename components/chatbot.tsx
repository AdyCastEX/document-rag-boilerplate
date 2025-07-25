'use client';

import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Chatbot() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat();

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <Bot className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">AI Chatbot</h2>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-white dark:bg-gray-900">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-400 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400">Start a conversation with the AI assistant!</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-full",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "flex items-start gap-2 max-w-[80%]",
                  message.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full",
                    message.role === 'user'
                      ? "bg-blue-600 dark:bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  )}
                >
                  {message.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm max-w-[80%]",
                    message.role === 'user'
                      ? "bg-blue-600 dark:bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  )}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {(status === 'streaming' || status === 'submitted') && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="flex items-start gap-2">
                <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                  <Bot className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </div>
                <div className="rounded-lg px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={status === 'submitted'}
            className="flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
          />
          <Button 
            type="submit" 
            disabled={status === 'submitted' || !input.trim()}
            className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
