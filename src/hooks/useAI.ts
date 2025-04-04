import { useState } from 'react';
import { AIRequestType } from '@/lib/ai';

interface UseAIResult {
  generateResponse: (prompt: string, type: AIRequestType) => Promise<void>;
  response: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useAI(): UseAIResult {
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (prompt: string, type: AIRequestType) => {
    try {
      setIsLoading(true);
      setError(null);
      setResponse(null);

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, type }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate response');
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateResponse,
    response,
    isLoading,
    error,
  };
} 