'use client';

// Make sure these paths are correct
import { useEffect } from 'react';
import { testFirebase } from '@/lib/firebaseTest';

export default function TestPage() {
  useEffect(() => {
    // Run the Firebase test when the page loads
    testFirebase().then(success => {
      if (success) {
        console.log('Firebase is properly configured!');
      }
    });
  }, []);

  return (
    <div>
      <h1>Firebase Test Page</h1>
      <p>Open the browser console (F12) to see test results</p>
    </div>
  );
} 