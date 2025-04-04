'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import DashboardSidebar from './DashboardSidebar';
import DashboardContent from './DashboardContent';
import FinancialToolsContent from './FinancialToolsContent';
import { motion, AnimatePresence } from 'framer-motion';
import { useBusinessPlan } from '@/contexts/BusinessPlanContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig.js';
import ThemeToggle from './ThemeToggle';
import { 
  BellIcon, 
  MagnifyingGlassIcon, 
  ArrowTrendingUpIcon, 
  Cog6ToothIcon, 
  ChartBarIcon, 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  pageTitle?: string;
}

export default function DashboardLayout({ pageTitle, children }: DashboardLayoutProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [fabOpen, setFabOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  
  // Get access to router for navigation
  const router = useRouter();
  const pathname = usePathname();
  
  // Effect to check authentication on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated
        setIsAuthenticated(true);
      } else {
        // User is not authenticated, redirect to login
        router.push('/auth/login');
      }
      setIsLoading(false);
    });
    
    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [router]);
  
  // Use callback for setting active section to optimize performance
  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
  }, []);
  
  // Effect to handle section from URL
  useEffect(() => {
    if (pathname === '/dashboard') {
      setActiveSection('dashboard');
    } else if (pathname === '/financial-tools') {
      setActiveSection('financial-tools');
    }
  }, [pathname]);

  // Handle sending feedback
  const handleSendFeedback = async () => {
    try {
      // Form validation
      if (feedbackRating === 0) {
        alert('Please select a rating before submitting');
        return;
      }

      // This would typically use a server endpoint to send email
      // For now, we'll just simulate a successful submission
      console.log('Sending feedback:', {
        rating: feedbackRating,
        comment: feedbackComment,
        email: 'dongdimian@gmail.com'
      });
      
      // Simulated success
      setFeedbackSent(true);
      
      // Reset form after delay
      setTimeout(() => {
        setFeedbackSent(false);
        setFeedbackRating(0);
        setFeedbackComment('');
        setShowFeedback(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error sending feedback:', error);
      alert('Failed to send feedback. Please try again.');
    }
  };

  // Render the appropriate content based on the active section
  const renderContent = () => {
    // If children are provided, render them
    if (children && (pathname === '/plan-generator')) {
      return children;
    }
    
    // Handle content based on pathname or active section
    if (pathname === '/financial-tools' || activeSection === 'financial-tools') {
      return <FinancialToolsContent />;
    }
    
    // Default to dashboard content
    return <DashboardContent />;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-16 h-16">
            <motion.div 
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute inset-0 rounded-full border-t-2 border-b-2 border-indigo-500"
            ></motion.div>
            <motion.div 
              animate={{ 
                rotate: -360,
                scale: [1, 0.9, 1],
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute inset-2 rounded-full border-r-2 border-l-2 border-blue-500"
            ></motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            </div>
          </div>
          <p className="mt-4 text-indigo-300 font-medium">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  // If not authenticated, don't render anything (redirect happens in effect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen flex overflow-hidden relative">
      {/* Enhanced animated background */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient - Light mode has softer whites, Dark mode has richer dark blues */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950"></div>
        
        {/* Enhanced subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5 bg-[url('/noise.png')]"></div>
        
        {/* Improved radial gradient accents */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent dark:from-blue-800/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-100/10 via-transparent to-transparent dark:from-indigo-800/10"></div>
        
        {/* Decorative elements - More sophisticated in light mode */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-100/20 to-indigo-100/20 dark:from-blue-600/5 dark:to-indigo-600/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full bg-gradient-to-r from-indigo-100/30 to-purple-100/20 dark:from-indigo-600/10 dark:to-purple-600/5 blur-3xl"></div>
      </div>
      
      {/* Feedback modal */}
      <AnimatePresence>
        {showFeedback && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-indigo-500" />
                  Give Feedback
                </h3>
                <button 
                  onClick={() => setShowFeedback(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              {/* Form content */}
              <div className="p-6">
                {feedbackSent ? (
                  <div className="text-center py-6">
                    <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Thank You!</h4>
                    <p className="text-gray-600 dark:text-gray-400">Your feedback has been sent successfully.</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        How would you rate your experience?
                      </label>
                      <div className="flex items-center justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button 
                            key={rating}
                            type="button"
                            onClick={() => setFeedbackRating(rating)}
                            className="focus:outline-none transition-transform"
                          >
                            {rating <= feedbackRating ? (
                              <StarIconSolid className="h-8 w-8 text-yellow-400" />
                            ) : (
                              <StarIcon className="h-8 w-8 text-gray-300 dark:text-gray-600 hover:text-yellow-400 dark:hover:text-yellow-400 transition-colors" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Feedback (Optional)
                      </label>
                      <textarea
                        id="feedback"
                        rows={3}
                        placeholder="Share your thoughts with us..."
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowFeedback(false)}
                        className="mr-3 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSendFeedback}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Send Feedback
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Sidebar with memoized callback for better performance */}
      <DashboardSidebar 
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        showFeedback={() => setShowFeedback(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10 backdrop-blur-sm bg-white/90 dark:bg-gray-950/20">
        {/* Enhanced Header Bar */}
        <header className="h-16 px-6 flex items-center justify-between border-b border-gray-200/60 dark:border-gray-800/40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-20 shadow-sm">
          <div className="flex items-center space-x-4">
            {/* Page title with enhanced animated accent */}
            <div className="relative">
              <h1 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                {pathname === '/plan-generator' ? (
                  <>
                    <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-emerald-500" />
                    Plan Generator
                  </>
                ) : pathname === '/consultant' ? (
                  <>
                    <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
                    AI Consultant
                  </>
                ) : activeSection === 'financial-tools' ? (
                  <>
                    <ChartBarIcon className="h-5 w-5 mr-2 text-indigo-500" />
                    Financial Tools
                  </>
                ) : (
                  <>
                    <ChartBarIcon className="h-5 w-5 mr-2 text-indigo-500" />
                    Dashboard
                  </>
                )}
              </h1>
              <motion.div 
                className="absolute -bottom-1 left-0 h-0.5 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                layoutId="navIndicator"
                transition={{ type: "spring", duration: 0.6 }}
              ></motion.div>
            </div>
          </div>
          
          <div className="flex items-center space-x-5">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Enhanced Search Bar */}
            <div className="relative hidden sm:block group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
              </div>
              <input 
                type="text" 
                className="block w-56 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-lg py-1.5 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/70" 
                placeholder="Search dashboard..." 
              />
            </div>
            
            {/* Simplified notification bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-colors"
              >
                <BellIcon className="h-5 w-5" />
              </button>
              
              {/* Empty notifications dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", duration: 0.35 }}
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium text-gray-900 dark:text-white">Notifications</h3>
                    </div>
                    
                    <div className="p-5 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                        <BellIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">No notifications yet</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        We'll notify you when something important happens
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Feedback button */}
            <button 
              onClick={() => setShowFeedback(true)}
              className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
            </button>
            
            {/* Settings */}
            <button className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-colors">
              <Cog6ToothIcon className="h-5 w-5" />
            </button>
            
            {/* User profile */}
            <div className="relative flex items-center">
              <button className="flex items-center space-x-2">
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-0.5">
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 font-medium">
                      AL
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto relative">
          {renderContent()}
          
          {/* Enhanced Floating Action Button with financial tools link updated */}
          <div className="absolute bottom-8 right-8 z-50">
            <AnimatePresence>
              {fabOpen && (
                <motion.div 
                  className="absolute bottom-16 right-0 flex flex-col gap-4 items-end mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ 
                    duration: 0.3, 
                    staggerChildren: 0.1, 
                    staggerDirection: -1 
                  }}
                >
                  {/* New Plan Button */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3"
                  >
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg text-gray-900 dark:text-white text-sm">
                      New Plan
                    </div>
                    <button 
                      onClick={() => router.push('/plan-generator')}
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl hover:shadow-emerald-500/20 transform transition-all hover:scale-105 active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </motion.div>
                  
                  {/* Financial Tools */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3"
                  >
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg text-gray-900 dark:text-white text-sm">
                      Financial Tools
                    </div>
                    <button 
                      onClick={() => router.push('/financial-tools')}
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-xl hover:shadow-purple-500/20 transform transition-all hover:scale-105 active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 10.586 8.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Main FAB button */}
            <button
              onClick={() => setFabOpen(!fabOpen)}
              className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <motion.div
                animate={{ rotate: fabOpen ? 225 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </motion.div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 