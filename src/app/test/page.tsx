'use client';

import { useState } from 'react';

export default function TestPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Simple Test Page</h1>
        
        <p className="text-xl text-gray-300 mb-6">Count: {count}</p>
        
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Increment
        </button>
        
        <div className="mt-8 text-gray-400">
          <p>This page has no external dependencies.</p>
          <p>It's a test to verify basic React and Next.js functionality.</p>
        </div>
      </div>
    </div>
  );
} 