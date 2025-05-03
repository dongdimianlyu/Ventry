'use client';

import { useState, useEffect } from 'react';
import DashboardConsultant from '@/components/DashboardConsultant';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConsultantContent() {
  const [activeTab, setActiveTab] = useState('chat');
  const [businessContext, setBusinessContext] = useState<string>('');
  const [businessLocation, setBusinessLocation] = useState<string>('');

  // Get business context and location from localStorage on mount
  useEffect(() => {
    // Check URL for tab parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['chat', 'insights', 'recommendations', 'history'].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    const context = localStorage.getItem('businessContext');
    const location = localStorage.getItem('businessLocation');
    
    if (context) setBusinessContext(context);
    if (location) setBusinessLocation(location);
  }, []);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'chat':
        return 'Strategic Advisor';
      case 'insights':
        return 'Market Analytics';
      case 'recommendations':
        return 'Strategic Roadmap';
      case 'history':
        return 'Advisory History';
      default:
        return 'Strategic Advisor';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto px-4 py-8"
    >
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] bg-gradient-to-br from-blue-600/10 to-indigo-600/5 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-[30%] -left-[10%] w-[70%] h-[70%] bg-gradient-to-br from-indigo-600/10 to-purple-600/5 blur-3xl rounded-full"></div>
      </div>
      
      {/* Glass Header with Premium Styling */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="backdrop-blur-md bg-gradient-to-r from-gray-800/80 to-gray-900/80 sticky top-0 z-20 rounded-xl shadow-xl border border-gray-700/50 mb-6 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              {getTabTitle()}
            </h1>
              <p className="text-gray-400 text-sm mt-1">Data-driven strategic insights for informed business decisions</p>
            </div>
            
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                Save Session
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Main Content with refined spacing */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-6 relative z-10">
        {/* Simplified Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="backdrop-blur-md bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-xl p-1 shadow-lg mb-6 overflow-hidden border border-gray-700/50"
        >
          <nav className="flex justify-around text-center">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('chat')}
              className={`py-3 px-4 rounded-lg text-sm font-medium relative flex-1 ${
                activeTab === 'chat' 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-blue-300'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                <span>Strategic Advisor</span>
              </span>
              {activeTab === 'chat' && (
                <motion.div
                  layoutId="activeConsultantTab"
                  className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-lg border border-blue-700/30 -z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('insights')}
              className={`py-3 px-4 rounded-lg text-sm font-medium relative flex-1 ${
                activeTab === 'insights' 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-blue-300'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                <span>Market Analytics</span>
              </span>
              {activeTab === 'insights' && (
                <motion.div
                  layoutId="activeConsultantTab"
                  className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-lg border border-blue-700/30 -z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('history')}
              className={`py-3 px-4 rounded-lg text-sm font-medium relative flex-1 ${
                activeTab === 'history' 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-blue-300'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>History</span>
              </span>
              {activeTab === 'history' && (
                <motion.div
                  layoutId="activeConsultantTab"
                  className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-lg border border-blue-700/30 -z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          </nav>
        </motion.div>
        
        {/* Content Area with Premium Styling */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="backdrop-blur-md bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-xl shadow-xl border border-gray-700/50 overflow-hidden"
          >
            {activeTab === 'chat' && (
              <div className="p-6">
                <DashboardConsultant 
                  businessContext={businessContext}
                  businessLocation={businessLocation}
                />
              </div>
            )}
            
            {activeTab === 'insights' && (
              <div className="p-6">
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600/10 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-indigo-400 mb-2">Market Analytics Coming Soon</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    In-depth market analysis and competitive intelligence for your business sector will be available here soon.
                  </p>
                  <div className="mt-6">
                    <button 
                      onClick={() => setActiveTab('chat')}
                      className="py-2 px-4 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg text-indigo-400 transition flex items-center space-x-2 mx-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                      </svg>
                      <span>Return to Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'history' && (
              <div className="p-6">
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600/10 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-2">Session History Coming Soon</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    View and review your past consultation sessions and strategic recommendations in this section.
                  </p>
                  <div className="mt-6">
                    <button 
                      onClick={() => setActiveTab('chat')}
                      className="py-2 px-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-400 transition flex items-center space-x-2 mx-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                      </svg>
                      <span>Return to Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </motion.div>
  );
} 