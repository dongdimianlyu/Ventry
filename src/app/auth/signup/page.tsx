'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signInWithGoogle } from '@/lib/auth';
import { auth } from '@/lib/firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';

// Dynamic import for animated gradient
import dynamic from 'next/dynamic';
const AnimatedGradient = dynamic(() => import('@/components/three/AnimatedGradient'), { ssr: false });

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
      {/* Dynamic background gradient */}
      {mounted && <AnimatedGradient />}
      
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
                  Stay signed in
                </label>
              </motion.div>

              {/* Google Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <button
                  onClick={handleSignUp}
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
                      {loading ? 'Creating account...' : 'Sign up with Google'}
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
                  href="/auth/signup/email"
                  className="relative w-full flex justify-center py-3 px-4 rounded-lg overflow-hidden group"
                >
                  {/* Button background */}
                  <div className="absolute inset-0 bg-gray-800/30 transition-all duration-300 group-hover:bg-gray-700/30"></div>
                  
                  {/* Button border */}
                  <div className="absolute inset-0 rounded-lg p-px bg-gradient-to-r from-gray-700 via-blue-900/30 to-gray-700 opacity-40 group-hover:opacity-70 transition-opacity"></div>
                  
                  {/* Button content */}
                  <span className="text-sm font-medium text-white transition-colors group-hover:text-blue-100">
                    Sign up with Email
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Right side - Strategic Chess Visualization */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gray-900 overflow-hidden">
          {/* Strategic visual */}
          {mounted && <StrategicChessVisual />}
        </div>
      </div>
    </div>
  );
} 