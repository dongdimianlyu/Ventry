'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-24 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Something went wrong</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We're sorry, but there was an error processing your request.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 bg-red-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-red-800">Error details:</h3>
              <div className="mt-2 text-sm text-red-700 whitespace-pre-wrap">
                {error.message}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={reset}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
} 