'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signInWithGoogle } from '@/lib/auth';
import { auth } from '@/lib/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

// Strategic Chess Visual Component
const StrategicChessVisual = () => {
  // Array of strategy elements to animate in sequence
  const strategyElements = [
    { id: 1, label: "Plan", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { id: 2, label: "Execute", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
    { id: 3, label: "Analyze", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { id: 4, label: "Adapt", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
  ];

  return (
    <div className="relative h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Chessboard grid background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      {/* Strategic Chess Knight SVG */}
      <motion.div 
        className="relative w-64 h-64 mb-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Chess piece base */}
          <motion.path
            d="M60 160C60 160 70 140 80 130C90 120 100 115 100 100C100 85 90 80 80 70C70 60 70 40 70 40L130 40C130 40 130 60 120 70C110 80 100 85 100 100C100 115 110 120 120 130C130 140 140 160 140 160"
            stroke="url(#chess-gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          
          {/* Chess piece stand */}
          <motion.path
            d="M50 170C50 165 55 160 60 160H140C145 160 150 165 150 170V180H50V170Z"
            fill="url(#chess-gradient-fill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 1, delay: 1.5 }}
          />
          
          <motion.path
            d="M50 170C50 165 55 160 60 160H140C145 160 150 165 150 170V180H50V170Z"
            stroke="url(#chess-gradient)"
            strokeWidth="4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          />
          
          {/* Chess piece details */}
          <motion.path
            d="M90 55C90 55 100 70 110 55"
            stroke="url(#chess-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          />
          
          <defs>
            <linearGradient id="chess-gradient" x1="50" y1="40" x2="150" y2="180" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60A5FA" />
              <stop offset="1" stopColor="#3730A3" />
            </linearGradient>
            <linearGradient id="chess-gradient-fill" x1="50" y1="160" x2="150" y2="180" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60A5FA" />
              <stop offset="1" stopColor="#3730A3" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-blue-500/5 blur-3xl -z-10"></div>
      </motion.div>
      
      {/* Strategize text */}
      <motion.h2 
        className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        Strategize your small business now!
      </motion.h2>
      
      {/* Strategy elements */}
      <div className="grid grid-cols-2 gap-6 max-w-md">
        {strategyElements.map((element, index) => (
          <motion.div
            key={element.id}
            className="relative rounded-lg backdrop-blur-sm flex flex-col items-center p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.7 + index * 0.1 }}
          >
            {/* Animated border */}
            <div className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-blue-500/30"></div>
            <div className="absolute inset-0 rounded-lg bg-gray-900/40 -z-10"></div>
            
            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={element.icon} />
              </svg>
            </div>
            
            {/* Label */}
            <span className="text-sm font-medium text-blue-100">{element.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
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

  const handleSignUp = async () => {
    setError(null);
    try {
      await signInWithGoogle(setLoading, rememberMe);
      // Note: The redirect will be handled by the signInWithGoogle function
    } catch (err: any) {
      console.error("Sign up error:", err);
      // Set appropriate error message based on error code
      if (err.code === 'auth/cancelled-popup-request' || 
          err.code === 'auth/popup-closed-by-user') {
        setError('Sign up was canceled. Please try again.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Error creating account. Please try again later.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-gray-900 to-gray-950">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
      </div>
      
      {/* Left side - Sign Up Form */}
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
              Create your account
            </motion.h2>
            <motion.p 
              className="mt-2 text-sm text-blue-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium text-blue-500 hover:text-blue-400 transition-colors">
                Sign in
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

              {/* Sign up button */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.button
                  onClick={handleSignUp}
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
                  Sign up with Google
                </motion.button>
              </motion.div>
              
              {/* Terms and privacy policy note */}
              <motion.p 
                className="text-center text-xs text-gray-500"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                By signing up, you agree to our Terms of Service and Privacy Policy
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right side - Strategic Chess Visual */}
      <div className="hidden md:flex flex-1 relative">
        <StrategicChessVisual />
      </div>
    </div>
  );
} 