'use client';

import { useState, FormEvent } from 'react';
import BusinessPlanDisplay from '@/components/BusinessPlanDisplay';
import { useBusinessPlan } from '@/contexts/BusinessPlanContext';
import Link from 'next/link';
import { motion } from 'framer-motion';

type DashboardPlanGeneratorProps = {
  businessType?: string;
  goals?: string;
  location?: string;
};

export default function DashboardPlanGenerator({
  businessType = '',
  goals = '',
  location = ''
}: DashboardPlanGeneratorProps) {
  const { 
    setBusinessPlan, 
    setBusinessType, 
    setPlanType,
    parseBusinessPlanForTimeline, 
    clearTimelineTasks, 
    timelineTasks,
    planHistory,
    savePlanToHistory,
    restorePlan,
    deletePlanFromHistory
  } = useBusinessPlan();
  
  const [activeTab, setActiveTab] = useState('generator');
  
  const [formData, setFormData] = useState({
    businessType: businessType,
    goals: goals,
    timeframe: 'monthly',
    location: location,
    planType: 'daily'
  });
  const [plan, setPlan] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setGenerating(true);

    try {
      // Clear existing timeline tasks when starting to generate a new plan
      clearTimelineTasks();
      
      // Make sure the planType parameter is properly set
      const submissionData = {
        ...formData,
        planType: formData.planType // Ensure planType is included
      };
      
      console.log("Submitting plan with type:", submissionData.planType);
      
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate plan');
      }

      // Save the plan to localStorage for use in dashboard and timeline
      localStorage.setItem('businessPlan', data.plan);
      localStorage.setItem('businessType', formData.businessType);
      localStorage.setItem('planType', formData.planType);
      
      // Update the context
      setBusinessPlan(data.plan);
      setBusinessType(formData.businessType);
      setPlanType(formData.planType);
      
      // Parse the plan to generate timeline tasks
      parseBusinessPlanForTimeline(data.plan);
      
      // Add plan to history
      savePlanToHistory(data.plan, formData.businessType, formData.planType);
      
      setPlan(data.plan);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const renderPlanHistory = () => {
    if (planHistory.length === 0) {
      return (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-gray-400">No plan history available. Generate a plan to see it here.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {planHistory.map((historyItem) => (
          <div 
            key={historyItem.id} 
            className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-lg p-4 transition-all hover:border-indigo-500/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-200 mb-1">
                  {historyItem.title}
                </h3>
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <span>{historyItem.businessType}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                  <span className="capitalize">{historyItem.planType} Plan</span>
                  <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                  <span>{new Date(historyItem.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => restorePlan(historyItem.id)}
                  className="text-indigo-400 hover:text-indigo-300 p-2"
                  title="Restore this plan"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  onClick={() => deletePlanFromHistory(historyItem.id)}
                  className="text-red-400 hover:text-red-300 p-2"
                  title="Delete from history"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-200px)] relative">
      {/* Background accent */}
      <div className="absolute top-10 right-20 w-96 h-96 rounded-full bg-emerald-600/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-40 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl -z-10"></div>
      
      {/* Header and Tabs */}
      <div className="border-b border-gray-700/30 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Business Plan Creator</h1>
          
          {timelineTasks.length > 0 && (
            <Link
              href="/dashboard?section=timeline"
              className="bg-gradient-to-r from-emerald-600/90 to-emerald-700/90 text-white py-2 px-4 rounded-lg flex items-center text-sm shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View Timeline
            </Link>
          )}
        </div>
        <nav className="flex space-x-8 relative">
          <button 
            onClick={() => setActiveTab('generator')}
            className={`pb-4 px-1 text-sm font-medium relative ${activeTab === 'generator' 
              ? 'text-emerald-400 border-b-2 border-emerald-500' 
              : 'text-gray-400 hover:text-gray-200 border-b-2 border-transparent hover:border-gray-700'
            }`}
          >
            Create New Plan
            {activeTab === 'generator' && (
              <motion.span 
                layoutId="activePlanTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('templates')}
            className={`pb-4 px-1 text-sm font-medium relative ${activeTab === 'templates' 
              ? 'text-emerald-400 border-b-2 border-emerald-500' 
              : 'text-gray-400 hover:text-gray-200 border-b-2 border-transparent hover:border-gray-700'
            }`}
          >
            Templates
            {activeTab === 'templates' && (
              <motion.span 
                layoutId="activePlanTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`pb-4 px-1 text-sm font-medium relative ${activeTab === 'history' 
              ? 'text-emerald-400 border-b-2 border-emerald-500' 
              : 'text-gray-400 hover:text-gray-200 border-b-2 border-transparent hover:border-gray-700'
            }`}
          >
            Plan History
            {activeTab === 'history' && (
              <motion.span 
                layoutId="activePlanTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        </nav>
      </div>
      
      {/* Content */}
      {activeTab === 'generator' && (
        <>
          {plan ? (
            <div className="flex-1 backdrop-blur-md bg-gray-800/40 rounded-xl shadow-xl border border-gray-700/50">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPlan('')}
                    className="py-2 px-4 bg-gradient-to-r from-emerald-600/90 to-emerald-700/90 rounded-lg text-sm font-medium text-white hover:shadow-lg transition-all duration-200 flex items-center shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create New Plan
                  </motion.button>
                  
                  <div className="flex space-x-3">
                    <Link
                      href="/dashboard?section=timeline"
                      className="bg-indigo-600/90 text-white py-2 px-4 rounded-lg flex items-center text-sm shadow-md hover:bg-indigo-700/90 transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      View Timeline
                    </Link>
                    
                    <Link
                      href="/dashboard?section=calendar"
                      className="bg-emerald-600/90 text-white py-2 px-4 rounded-lg flex items-center text-sm shadow-md hover:bg-emerald-700/90 transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      View Calendar
                    </Link>
                  </div>
                </div>
                
                <BusinessPlanDisplay 
                  plan={plan} 
                  businessType={formData.businessType} 
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 backdrop-blur-md bg-gray-800/40 rounded-xl shadow-xl border border-gray-700/50">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 max-w-4xl mx-auto"
              >
                <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 p-6 rounded-xl mb-8 border border-emerald-700/30 backdrop-blur-sm shadow-md">
                  <h2 className="text-xl font-semibold text-gray-100 mb-3">Generate Your Business Plan</h2>
                  <p className="text-gray-300">
                    Our AI-powered plan generator creates comprehensive, actionable business plans tailored to your specific needs.
                    Fill out the form below to get started.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-300 mb-1">
                      Business Type
                    </label>
                    <input
                      type="text"
                      id="businessType"
                      name="businessType"
                      placeholder="e.g., eCommerce, SaaS, Restaurant"
                      required
                      value={formData.businessType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-700 shadow-sm text-gray-200 bg-gray-800/60 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <p className="mt-1 text-sm text-gray-400">Specify your industry or business model</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="timeframe" className="block text-sm font-medium text-gray-300 mb-1">
                        Plan Timeframe
                      </label>
                      <select
                        id="timeframe"
                        name="timeframe"
                        value={formData.timeframe}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-700 shadow-sm text-gray-200 bg-gray-800/60 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="monthly">Monthly Plan</option>
                        <option value="quarterly">Quarterly Plan</option>
                        <option value="yearly">Yearly Plan</option>
                      </select>
                      <p className="mt-1 text-sm text-gray-400">Select the duration for your plan</p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                      Business Location (Optional)
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      placeholder="e.g., New York, Remote, Global"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-700 shadow-sm text-gray-200 bg-gray-800/60 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <p className="mt-1 text-sm text-gray-400">Add geographic context to your plan</p>
                  </div>

                  <div>
                    <label htmlFor="goals" className="block text-sm font-medium text-gray-300 mb-1">
                      Business Goals
                    </label>
                    <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-700/50 mb-4">
                      <h3 className="text-sm font-medium text-emerald-400 mb-2">Common Business Goals:</h3>
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        <div className="p-3 rounded-lg border border-gray-700/30 bg-gray-800/40">
                          <div className="font-medium text-gray-200 mb-1">Increasing Revenue & Profitability</div>
                          <p className="text-gray-400">Maximizing sales while keeping costs under control.</p>
                        </div>
                        <div className="p-3 rounded-lg border border-gray-700/30 bg-gray-800/40">
                          <div className="font-medium text-gray-200 mb-1">Acquiring & Retaining Customers</div>
                          <p className="text-gray-400">Building a loyal customer base for repeat business.</p>
                        </div>
                        <div className="p-3 rounded-lg border border-gray-700/30 bg-gray-800/40">
                          <div className="font-medium text-gray-200 mb-1">Scaling Efficiently</div>
                          <p className="text-gray-400">Growing without overextending resources or finances.</p>
                        </div>
                      </div>
                      <p className="mt-3 text-gray-400 text-xs">Select a goal above or describe your own specific objectives below to get a roadmap of the easiest, most actionable way to achieve your goals.</p>
                    </div>
                    <textarea
                      id="goals"
                      name="goals"
                      placeholder="Describe your business goals, challenges, and what you want to achieve..."
                      required
                      value={formData.goals}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-700 shadow-sm text-gray-200 bg-gray-800/60 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 custom-scrollbar-dark"
                    />
                    <p className="mt-1 text-sm text-gray-400">Be specific about your objectives and challenges</p>
                  </div>

                  {error && (
                    <div className="bg-red-900/30 border border-red-700/50 text-red-400 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={generating}
                    className={`w-full py-3 px-4 rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-r from-emerald-600/90 to-emerald-700/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 ${
                      generating ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {generating ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                        Creating Your Plan...
                      </span>
                    ) : (
                      'Create Business Plan'
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          )}
        </>
      )}
      
      {activeTab === 'templates' && (
        <div className="backdrop-blur-md bg-gray-800/40 rounded-xl shadow-xl border border-gray-700/50">
          <div className="text-center py-20 border-2 border-dashed border-gray-600/50 rounded-lg m-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-200 mb-2">Plan Templates</h3>
            <p className="text-gray-400 mb-4">
              This section is under development. Soon you'll be able to use and save templates for different business types and scenarios.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-emerald-900/40 text-emerald-400 py-2 px-4 rounded-lg text-sm hover:bg-emerald-900/60 transition-colors duration-200 border border-emerald-700/30"
            >
              View Documentation
            </motion.button>
          </div>
        </div>
      )}
      
      {activeTab === 'history' && (
        <div className="flex-1 backdrop-blur-md bg-gray-800/40 rounded-xl shadow-xl border border-gray-700/50">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-6">Plan History</h2>
            <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
              {renderPlanHistory()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 