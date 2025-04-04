'use client';

import { useEffect } from 'react';
import { initializeAuth, checkRedirectResult } from '@/lib/auth';

export default function AuthInitializer() {
  useEffect(() => {
    // Initialize authentication when the app loads
    initializeAuth();
    
    // Explicitly check for redirect results
    const handleRedirectResult = async () => {
      try {
        await checkRedirectResult();
      } catch (error) {
        console.error('Error handling redirect result:', error);
      }
    };
    
    handleRedirectResult();
  }, []);

  // This component doesn't render anything
  return null;
} 