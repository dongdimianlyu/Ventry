'use client';

import { useEffect } from 'react';

export default function AuthInitializer() {
  useEffect(() => {
    // Simplified version for deployment that doesn't use Firebase
    console.log('Auth initialization skipped for deployment build');
  }, []);

  // This component doesn't render anything
  return null;
} 