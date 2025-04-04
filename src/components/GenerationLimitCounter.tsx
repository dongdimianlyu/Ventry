import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { auth } from '@/lib/firebaseConfig';
import { User } from 'firebase/auth';

export default function GenerationLimitCounter() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get the current user
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchGenerationLimit(currentUser.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchGenerationLimit = async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const currentCount = userData.generationCount || 0;
        const maxAllowed = userData.maxGenerations || 2;
        setRemaining(Math.max(0, maxAllowed - currentCount));
      }
    } catch (error) {
      console.error('Error fetching generation limit:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return null;
  }

  // Determine text color based on remaining count
  const getTextColorClass = () => {
    if (remaining === 0) return 'text-red-500 dark:text-red-400';
    if (remaining === 1) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-green-500 dark:text-green-400';
  };

  return (
    <div className="flex items-center py-2 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
      <svg className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span>
        <span className={`font-medium ${getTextColorClass()}`}>{remaining}</span> 
        <span className="text-gray-600 dark:text-gray-300 ml-1">
          {remaining === 1 ? 'generation' : 'generations'} remaining
        </span>
      </span>
    </div>
  );
} 