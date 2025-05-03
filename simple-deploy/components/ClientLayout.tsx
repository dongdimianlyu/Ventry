'use client';

import { ReactNode, useState, useEffect } from 'react';
import { BusinessPlanProvider } from '@/contexts/BusinessPlanContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isClient, setIsClient] = useState(false);
  
  // Handle hydration mismatch by only rendering on client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Create a simplified layout structure for the initial server-rendered content
  // that closely matches what will be rendered client-side to reduce hydration errors
  return (
    <>
      {!isClient ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 dark:bg-gray-950">
          <div className="animate-pulse rounded-md bg-gray-800 dark:bg-gray-800 h-96 w-96"></div>
        </div>
      ) : (
        <ThemeProvider>
          <BusinessPlanProvider>
            {children}
          </BusinessPlanProvider>
        </ThemeProvider>
      )}
    </>
  );
} 