'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signInWithGoogle } from '@/lib/auth';
import { auth } from '@/lib/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

// Dynamic import for particle field
import dynamic from 'next/dynamic';
const ParticleField = dynamic(() => import('@/components/three/ParticleField'), { ssr: false });

// Animated chess knight component
const ChessKnight = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background gradient effects */}
      <motion.div 
        className="absolute w-[600px] h-[600px] bg-gradient-to-r from-blue-600/20 to-indigo-900/30 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 5, 0], 
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          repeatType: "reverse", 
          ease: "easeInOut" 
        }}
      />
      
      <motion.div 
        className="absolute w-[400px] h-[400px] bg-gradient-to-r from-teal-500/20 to-blue-500/30 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, -5, 0], 
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          repeatType: "reverse", 
          ease: "easeInOut", 
          delay: 1 
        }}
      />

      {/* Abstract chess board pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      {/* Main Knight visualization */}
      <div className="relative z-10 w-48 h-48">
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path 
              d="M19 22H5C4.44772 22 4 21.5523 4 21V17.5H6V16C6 15.0572 6.36876 14.1924 6.99963 13.5615C7.53465 13.0265 8.22165 12.6501 9 12.4858V11H8C6.89543 11 6 10.1046 6 9V5L9 2H11L14 5V9C14 10.1046 13.1046 11 12 11H11V12.4858C11.7784 12.6501 12.4654 13.0265 13.0004 13.5615C13.6312 14.1924 14 15.0572 14 16V17.5H16C16 16.1193 17.1193 15 18.5 15C19.8807 15 21 16.1193 21 17.5V21C21 21.5523 20.5523 22 20 22H19Z" 
              stroke="url(#gradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="4" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6" />
                <stop offset="1" stopColor="#4F46E5" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
      
      {/* Strategic tagline */}
      <motion.div 
        className="absolute bottom-28 left-0 right-0 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
          Strategize your small business now!
        </h2>
        <p className="text-blue-300/80 text-sm mt-3 max-w-sm mx-auto">
          Gain access to AI-powered tools that transform your business strategy from reactive to proactive
        </p>
      </motion.div>
      
      {/* Floating elements */}
      <motion.div 
        className="absolute top-28 right-28 w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500/30 to-indigo-500/30 backdrop-blur-md border border-white/10"
        animate={{ 
          y: [0, -10, 0], 
          rotate: [0, 5, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut" 
        }}
      />
      
      <motion.div 
        className="absolute bottom-28 left-28 w-12 h-12 rounded-full bg-gradient-to-r from-teal-500/20 to-blue-500/20 backdrop-blur-md border border-white/10"
        animate={{ 
          y: [0, 10, 0], 
          x: [0, -5, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.5
        }}
      />
    </div>
  );
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Mount animations
  useEffect(() => {
    setMounted(true);
    
    // Check if user is already authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is already logged in, redirect to dashboard
        router.push('/dashboard');
      }
    });
    
    return () => unsubscribe();
  }, [router]);

  const handleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle(setLoading, rememberMe);
      // Note: The redirect will be handled by the signInWithGoogle function
    } catch (err: any) {
      console.error("Sign in error:", err);
      // Set appropriate error message based on error code
      if (err.code === 'auth/cancelled-popup-request' || 
          err.code === 'auth/popup-closed-by-user') {
        setError('Sign in was canceled. Please try again.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Error signing in. Please try again later.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex overflow-hidden">
      {/* Background particle effect */}
      {mounted && <ParticleField />}
      
      {/* Left side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 relative z-10">
        <motion.div 
          className="mx-auto w-full max-w-sm lg:w-96"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="/" className="block">
              <motion.span 
                className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Ventry
              </motion.span>
            </Link>
            <motion.h2 
              className="mt-6 text-3xl font-bold text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Welcome back
            </motion.h2>
            <motion.p 
              className="mt-2 text-sm text-blue-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Don't have an account?{' '}
              <Link href="/auth/signup" className="font-medium text-blue-500 hover:text-blue-400 transition-colors">
                Sign up
              </Link>
            </motion.p>
          </motion.div>

          <motion.div 
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="space-y-6">
              {/* Error message */}
              {error && (
                <motion.div 
                  className="bg-red-900/30 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}
              
              {/* Remember me checkbox */}
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <div className="relative">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="h-5 w-5 border border-gray-600 rounded-md bg-gray-800/80 peer-checked:bg-blue-600 peer-checked:border-blue-500 transition-colors">
                    <div className="flex items-center justify-center h-full w-full opacity-0 peer-checked:opacity-100 transition-opacity">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300 cursor-pointer">
                  Remember me
                </label>
              </motion.div>

              {/* Google Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <button
                  onClick={handleSignIn}
                  disabled={loading}
                  className="relative w-full flex justify-center py-3 px-4 rounded-lg overflow-hidden group transition-all"
                >
                  {/* Button background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:from-blue-500 group-hover:to-indigo-500"></div>
                  
                  {/* Button content */}
                  <div className="flex items-center relative z-10">
                    {loading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                          <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                          <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                          <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                          <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                        </g>
                      </svg>
                    )}
                    <span className="text-sm font-medium text-white">
                      {loading ? 'Signing in...' : 'Sign in with Google'}
                    </span>
                  </div>
                </button>
              </motion.div>

              <motion.div 
                className="mt-6 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-950 text-gray-400">Or continue with</span>
                </div>
              </motion.div>

              {/* Email Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Link
                  href="/auth/login/email"
                  className="relative w-full flex justify-center py-3 px-4 rounded-lg overflow-hidden group"
                >
                  {/* Button background */}
                  <div className="absolute inset-0 bg-gray-800/30 transition-all duration-300 group-hover:bg-gray-700/30"></div>
                  
                  {/* Button border */}
                  <div className="absolute inset-0 rounded-lg p-px bg-gradient-to-r from-gray-700 via-blue-900/30 to-gray-700 opacity-40 group-hover:opacity-70 transition-opacity"></div>
                  
                  {/* Button content */}
                  <span className="text-sm font-medium text-white transition-colors group-hover:text-blue-100">
                    Sign in with Email
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Right side - Knight Chess Piece Visualization */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-gray-900/40 z-10"></div>
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {mounted && (
            <div className="w-full h-full bg-black">
              {/* Chess Piece Visualization component would go here */}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 