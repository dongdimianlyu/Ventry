'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signInWithGoogle } from '@/lib/auth';
import { auth } from '@/lib/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

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
    
    // Check if user is already authenticated - but don't auto-redirect unless coming from login action
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Only auto-redirect if user specifically triggered a login action
      const autoRedirect = sessionStorage.getItem('auth_login_attempted');
      if (user && autoRedirect) {
        // User is already logged in and has attempted login, redirect to dashboard
        router.push('/dashboard');
        // Clean up session storage
        sessionStorage.removeItem('auth_login_attempted');
      }
    });
    
    return () => unsubscribe();
  }, [router]);

  const handleSignIn = async () => {
    setError(null);
    try {
      // Set a flag to indicate user has explicitly attempted login
      sessionStorage.setItem('auth_login_attempted', 'true');
      await signInWithGoogle(setLoading, rememberMe);
      // Note: The redirect will be handled by the signInWithGoogle function
    } catch (err: any) {
      console.error("Sign in error:", err);
      // Clean up session storage on error
      sessionStorage.removeItem('auth_login_attempted');
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
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        {/* Animated dots */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-blue-500 animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 rounded-full bg-indigo-500 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 rounded-full bg-blue-300 animate-pulse-slow"></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 rounded-full bg-purple-400 animate-pulse-slow"></div>
        {/* Gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>
      
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-700 rounded bg-gray-800/70"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </motion.div>

              {/* Sign in button */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.button
                  onClick={handleSignIn}
                  disabled={loading}
                  className="flex justify-center items-center w-full px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                  bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-60"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                  )}
                  Sign in with Google
                </motion.button>
              </motion.div>
              
              {/* Alternative sign in options note (placeholder) */}
              <motion.p 
                className="text-center text-xs text-gray-500"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                By signing in, you agree to our Terms of Service and Privacy Policy
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Right side - Illustration/Branding */}
      <div className="hidden md:flex flex-1 relative">
        <ChessKnight />
      </div>
    </div>
  );
} 