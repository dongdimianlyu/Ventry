'use client';

import { useState, useEffect } from 'react';
import DashboardConsultant from '@/components/DashboardConsultant';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressTabSection } from './ProgressTabSection';

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
        
        {/* Features highlight (only show on chat tab) */}
        {activeTab === 'chat' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          >
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 backdrop-blur-sm rounded-xl p-4 border border-blue-700/20 shadow-sm">
              <div className="flex items-start">
                <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-400">Personalized Strategy</h3>
                  <p className="text-xs text-gray-400 mt-1">Custom insights based on your business context and location</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 backdrop-blur-sm rounded-xl p-4 border border-purple-700/20 shadow-sm">
              <div className="flex items-start">
                <div className="bg-purple-500/20 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1
                    0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-purple-400">Concise Insights</h3>
                  <p className="text-xs text-gray-400 mt-1">Action-focused advice without unnecessary fluff</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 backdrop-blur-sm rounded-xl p-4 border border-emerald-700/20 shadow-sm">
              <div className="flex items-start">
                <div className="bg-emerald-500/20 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-emerald-400">Actionable Steps</h3>
                  <p className="text-xs text-gray-400 mt-1">Clear action items you can implement immediately</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
              >
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="border-b border-gray-700/30"
                >
                  <div className="px-6 py-4">
                    <h2 className="text-lg font-medium text-white">Strategic Business Consulting</h2>
                    <p className="text-gray-400 text-xs mt-1">Ask questions about your business challenges and receive strategic guidance</p>
                  </div>
                </motion.div>
                
                <DashboardConsultant 
                  businessContext={businessContext} 
                  businessLocation={businessLocation} 
                />
              </motion.div>
            )}
            
            {activeTab === 'insights' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex justify-between items-center mb-8"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-white">Market & Performance Analytics</h2>
                    <p className="text-gray-400 text-sm mt-1">Key metrics and competitive analysis for strategic decision-making</p>
                  </div>
                  <div className="flex space-x-3">
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white py-2.5 px-5 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414-1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Export Insights
                    </motion.button>
                  </div>
                </motion.div>

                {/* Direct insights display - will be handled by DashboardConsultant now */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="text-center py-16"
                >
                  <div className="inline-block bg-gradient-to-br from-blue-900/20 to-indigo-900/20 p-8 rounded-xl border border-blue-700/20">
                    <motion.div
                      initial={{ y: 5 }}
                      animate={{ y: [5, -5, 5] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-500/70 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </motion.div>
                    <p className="text-gray-300 mb-4">Please use the Strategic Advisor tab to generate new market analytics</p>
                    <motion.button 
                      whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab('chat')}
                      className="mt-4 px-5 py-2 bg-blue-600/70 hover:bg-blue-600/90 text-white rounded-lg text-sm flex items-center mx-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      Go to Strategic Advisor
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
            
            {activeTab === 'recommendations' && (
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Strategic Implementation Roadmap</h2>
                    <p className="text-gray-400 text-sm mt-1">Actionable, high-impact recommendations with implementation plans</p>
                  </div>
                  <div className="flex space-x-3">
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white py-2.5 px-5 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                        <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                      </svg>
                      Implement All
                    </motion.button>
                  </div>
                </div>
                
                {/* Direct recommendations display - will be handled by DashboardConsultant now */}
                <div className="text-center py-16">
                  <p className="text-gray-300">Please use the Strategic Advisor tab to generate new strategic recommendations</p>
                  <button
                      onClick={() => setActiveTab('chat')}
                    className="mt-4 px-5 py-2 bg-blue-600/70 hover:bg-blue-600/90 text-white rounded-lg text-sm"
                  >
                    Go to Strategic Advisor
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'history' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex justify-between items-center mb-8"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-white">Consulting Engagement History</h2>
                    <p className="text-gray-400 text-sm mt-1">Review previous strategic analyses and recommendations</p>
                  </div>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search history..."
                        className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                  </div>
                </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="text-center py-16">
                    <motion.div
                      initial={{ y: 5 }}
                      animate={{ y: [5, -5, 5] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-indigo-500/70 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </motion.div>
                    <p className="text-gray-300">Your advisory history will appear here</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </motion.div>
  );
} 