'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SubscribePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check without Firebase
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [router]);

  const handleContinue = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">Ventry</h1>
          <p className="text-indigo-400 text-lg">AI-powered writing assistant</p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white text-center mb-2">Early Access Granted!</h2>
            <p className="text-gray-300 text-center mb-6">Ventry is currently free while in beta.</p>
            
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">Pro Plan</span>
                <span className="text-white font-bold">Free</span>
              </div>
              <div className="text-gray-400 text-sm mb-4">During our beta period</div>
              <ul className="space-y-2 text-gray-300 text-sm mb-2">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  AI Monthly Plan Generator
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  AI Business Consultant
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Unlimited Usage
                </li>
              </ul>
            </div>
            
            <button
              onClick={handleContinue}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800"
            >
              Go to Dashboard
            </button>
          </div>
          
          <div className="px-8 py-4 bg-gray-750 border-t border-gray-700">
            <p className="text-gray-400 text-xs text-center">
              We'll notify you when pricing changes. No credit card required during beta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 