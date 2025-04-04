'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BusinessConsultantRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard with consultant panel open
    router.push('/consultant');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
} 