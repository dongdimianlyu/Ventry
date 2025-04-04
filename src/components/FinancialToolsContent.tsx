'use client';

import { useState, useEffect } from 'react';
import BudgetPlanner from '@/components/BudgetPlanner';
import CashFlowProjector from '@/components/CashFlowProjector';
import ScenarioSimulator from '@/components/ScenarioSimulator';
import { motion, AnimatePresence } from 'framer-motion';

export default function FinancialToolsContent() {
  const [activeTab, setActiveTab] = useState('cash-flow');
  const [businessPlan, setBusinessPlan] = useState<string>('');
  const [businessType, setBusinessType] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  // Get business plan and type from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    
    // Only access window/localStorage on the client side
    if (typeof window !== 'undefined') {
      // Check URL for tab parameter
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam && ['cash-flow', 'budget', 'scenarios', 'reports'].includes(tabParam)) {
        setActiveTab(tabParam);
      }

      // Get business plan from localStorage
      const storedPlan = localStorage.getItem('businessPlan');
      const storedType = localStorage.getItem('businessType');
      
      if (storedPlan) {
        setBusinessPlan(storedPlan);
      }
      
      if (storedType) {
        setBusinessType(storedType);
      }
    }
  }, []);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'cash-flow':
        return 'Advanced Cash Flow Forecasting';
      case 'budget':
        return 'Strategic Budget Allocation';
      case 'scenarios':
        return 'Financial Scenario Modeling';
      case 'reports':
        return 'Enterprise Financial Analytics';
      default:
        return 'Enterprise Financial Planning Suite';
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Premium subtle background elements */}
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-blue-600/5 blur-[100px]"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-indigo-600/10 blur-[80px]"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-purple-600/5 blur-[120px]"></div>
      
      {/* Header with premium glass effect */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-md bg-gradient-to-r from-gray-900/90 to-gray-800/90 border-b border-gray-700/50 sticky top-0 z-20 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              {getTabTitle()}
            </h1>
              <p className="text-gray-400 text-sm mt-1">Enterprise-grade financial planning and analysis</p>
            </div>
            
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gray-800/80 text-gray-300 py-2 px-4 rounded-lg text-sm font-medium border border-gray-700/50 shadow-sm hover:bg-gray-700/80 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export Report
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                Save Analysis
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Main Content with refined spacing */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10 relative z-10">
        {/* Premium Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="backdrop-blur-md bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-1.5 shadow-lg mb-10 overflow-hidden border border-gray-700/50"
        >
          <nav className="flex justify-around text-center">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('cash-flow')}
              className={`py-4 px-6 rounded-xl text-sm font-medium relative flex-1 ${
                activeTab === 'cash-flow' 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-blue-300'
              }`}
            >
              <span className="relative z-10 flex flex-col items-center space-y-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <span>Cash Flow Forecast</span>
              </span>
              {activeTab === 'cash-flow' && (
                <motion.div
                  layoutId="activeFinancialTab"
                  className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-700/30 -z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('budget')}
              className={`py-4 px-6 rounded-xl text-sm font-medium relative flex-1 ${
                activeTab === 'budget' 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-blue-300'
              }`}
            >
              <span className="relative z-10 flex flex-col items-center space-y-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Strategic Budget</span>
              </span>
              {activeTab === 'budget' && (
                <motion.div
                  layoutId="activeFinancialTab"
                  className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-700/30 -z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('scenarios')}
              className={`py-4 px-6 rounded-xl text-sm font-medium relative flex-1 ${
                activeTab === 'scenarios' 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-blue-300'
              }`}
            >
              <span className="relative z-10 flex flex-col items-center space-y-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                  <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                  <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                </svg>
                <span>Scenario Modeling</span>
              </span>
              {activeTab === 'scenarios' && (
                <motion.div
                  layoutId="activeFinancialTab"
                  className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-700/30 -z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-6 rounded-xl text-sm font-medium relative flex-1 ${
                activeTab === 'reports' 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-blue-300'
              }`}
            >
              <span className="relative z-10 flex flex-col items-center space-y-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                </svg>
                <span>Financial Analytics</span>
              </span>
              {activeTab === 'reports' && (
                <motion.div
                  layoutId="activeFinancialTab"
                  className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-700/30 -z-0"
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
            className="backdrop-blur-md bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden"
          >
            {activeTab === 'cash-flow' && (
              <div>
                <div className="flex justify-between items-center p-8 border-b border-gray-700/30">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Advanced Cash Flow Forecasting</h2>
                    <p className="text-gray-400 text-sm mt-1">Industry-specific variables and sensitivity analysis</p>
                  </div>
                  <div className="flex space-x-3">
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white py-2.5 px-5 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                        <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                      </svg>
                      Save Forecast
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-gray-700/70 text-gray-200 py-2.5 px-5 rounded-lg text-sm font-medium border border-gray-600/50 shadow-sm hover:bg-gray-600/70 transition-all flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Export to Excel
                    </motion.button>
                  </div>
                </div>
                  <CashFlowProjector businessType={businessType} plan={businessPlan} />
              </div>
            )}
            
            {activeTab === 'budget' && (
              <div>
                <div className="flex justify-between items-center p-8 border-b border-gray-700/30">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Strategic Budget Allocation</h2>
                    <p className="text-gray-400 text-sm mt-1">Enterprise-level budget planning with optimization algorithms and variance analysis</p>
                  </div>
                  <div className="flex space-x-3">
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white py-2.5 px-5 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Save Budget Plan
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-gray-700/70 text-gray-200 py-2.5 px-5 rounded-lg text-sm font-medium border border-gray-600/50 shadow-sm hover:bg-gray-600/70 transition-all flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                        <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      Generate Report
                    </motion.button>
                  </div>
                </div>
                <div className="p-0">
                  <BudgetPlanner businessType={businessType} plan={businessPlan} />
                </div>
              </div>
            )}
            
            {activeTab === 'scenarios' && (
              <div>
                <div className="flex justify-between items-center p-8 border-b border-gray-700/30">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Advanced Scenario Modeling</h2>
                    <p className="text-gray-400 text-sm mt-1">Multi-variable simulation with Monte Carlo analysis and risk assessment metrics</p>
                  </div>
                  <div className="flex space-x-3">
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white py-2.5 px-5 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                      </svg>
                      Run Simulation
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-gray-700/70 text-gray-200 py-2.5 px-5 rounded-lg text-sm font-medium border border-gray-600/50 shadow-sm hover:bg-gray-600/70 transition-all flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                      Executive Summary
                    </motion.button>
                  </div>
                </div>
                <div className="p-0">
                  <ScenarioSimulator businessType={businessType} plan={businessPlan} />
                </div>
              </div>
            )}
            
            {activeTab === 'reports' && (
              <div>
                <div className="flex justify-between items-center p-8 border-b border-gray-700/30">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Enterprise Financial Analytics</h2>
                    <p className="text-gray-400 text-sm mt-1">Comprehensive financial performance metrics with industry benchmarks and trend analysis</p>
                  </div>
                  <div className="flex space-x-3">
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white py-2.5 px-5 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      Generate Report
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-gray-700/70 text-gray-200 py-2.5 px-5 rounded-lg text-sm font-medium border border-gray-600/50 shadow-sm hover:bg-gray-600/70 transition-all flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Email to Stakeholders
                    </motion.button>
                  </div>
                </div>
                <div className="p-8 space-y-8">
                  {/* Advanced Financial Analytics Dashboard */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Key Performance Metrics */}
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 border border-gray-700/50 shadow-xl"
                    >
                      <h3 className="text-lg font-semibold text-white mb-4">Key Performance Indicators</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700/50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-xs">Gross Profit Margin</span>
                            <span className="text-green-400 text-sm font-medium">36.8%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '36.8%' }}></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-gray-500 text-xs">Industry Avg: 32.4%</span>
                            <span className="text-green-400 text-xs">+4.4%</span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700/50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-xs">Return on Investment</span>
                            <span className="text-green-400 text-sm font-medium">22.5%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '22.5%' }}></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-gray-500 text-xs">Industry Avg: 18.2%</span>
                            <span className="text-green-400 text-xs">+4.3%</span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700/50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-xs">Debt-to-Equity Ratio</span>
                            <span className="text-amber-400 text-sm font-medium">1.2</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-gray-500 text-xs">Industry Avg: 0.8</span>
                            <span className="text-amber-400 text-xs">+0.4</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Cash Flow Analysis */}
                <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 border border-gray-700/50 shadow-xl"
                    >
                      <h3 className="text-lg font-semibold text-white mb-4">Cash Flow Analytics</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700/50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-xs">Operating Cash Flow</span>
                            <span className="text-green-400 text-sm font-medium">$48,250</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-green-400 mr-1">
                              <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </span>
                            <span className="text-green-400 text-xs">12.3% vs. Previous Period</span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700/50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-xs">Cash Conversion Cycle</span>
                            <span className="text-blue-400 text-sm font-medium">24 days</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-blue-400 mr-1">
                              <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </span>
                            <span className="text-blue-400 text-xs">3 days improvement</span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700/50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-xs">Free Cash Flow</span>
                            <span className="text-green-400 text-sm font-medium">$32,150</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-green-400 mr-1">
                              <svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                            </span>
                            <span className="text-green-400 text-xs">8.4% vs. Previous Period</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Financial Risk Assessment */}
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 border border-gray-700/50 shadow-xl"
                    >
                      <h3 className="text-lg font-semibold text-white mb-4">Risk Assessment</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700/50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-xs">Liquidity Risk</span>
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                              <span className="text-white text-sm font-medium">Low</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400">Current ratio of 2.4 indicates strong short-term financial health</p>
                        </div>
                        
                        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700/50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-xs">Market Risk</span>
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-amber-400 mr-2"></div>
                              <span className="text-white text-sm font-medium">Medium</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400">Moderate exposure to market fluctuations with 28% variable costs</p>
                        </div>
                        
                        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700/50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-xs">Operational Risk</span>
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                              <span className="text-white text-sm font-medium">Low</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400">Well-diversified supplier base and automated processes</p>
                        </div>
                      </div>
                </motion.div>
                  </div>
                  
                  <div className="text-center pt-6">
                <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white py-3 px-6 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      Generate Comprehensive Financial Report
                </motion.button>
                    <p className="text-gray-500 text-xs mt-2">Detailed analysis with benchmark comparisons and future projections</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
} 