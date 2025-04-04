'use client';

import { auth } from '@/lib/firebaseConfig.js';
import { GoogleAuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig.js';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        // Store auth state in Firestore for more reliable tracking
        const userDoc = doc(db, 'users', result.user.uid);
        const docSnap = await getDoc(userDoc);
        
        if (!docSnap.exists()) {
          await setDoc(userDoc, {
            email: result.user.email,
            createdAt: serverTimestamp(),
          });
          router.push('/subscribe');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      setError('Failed to sign in with Google');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome</h2>
          <p className="mt-2 text-gray-600">Sign in to continue</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-3 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          } bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>
      </div>
    </div>
  );
} 