'use client';

import { useBusinessPlan } from '@/contexts/BusinessPlanContext';
import { StarIcon, FlagIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

// Helper function to convert numbers to strings, avoiding NaN issues
const safeNumber = (value: number | undefined): string => {
  if (value === undefined || isNaN(value)) {
    return '0';
  }
  return value.toString();
};

export default function GoalSummaryCard() {
  const { goalSummary } = useBusinessPlan();

  // If no goal summary exists, show a placeholder
  if (!goalSummary) {
    return (
      <div className="mb-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-400 to-fuchsia-500 p-0.5 mr-3">
            <div className="w-full h-full rounded-[9px] bg-white dark:bg-gray-900 flex items-center justify-center">
              <FlagIcon className="h-5 w-5 text-violet-500" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Business Goal Summary</h3>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          No business goal has been set yet. Create a business plan to see your goal summary.
        </p>
        <a 
          href="/plan-generator"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium text-sm shadow-lg hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105"
        >
          Create Business Plan
        </a>
      </div>
    );
  }

  // Ensure difficulty is a valid number between 1-10
  const difficulty = Math.max(1, Math.min(10, isNaN(Number(goalSummary.difficulty)) ? 5 : Number(goalSummary.difficulty)));
  
  // Calculate percentage for the difficulty bar
  const difficultyPercentage = `${(difficulty / 10) * 100}%`;

  return (
    <div className="mb-8 group relative">
      {/* Enhanced glowing background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-2xl blur-xl opacity-80 group-hover:opacity-100 transition-opacity" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/60 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-violet-100/80 dark:border-violet-800/50 overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-full blur-lg -translate-y-6 translate-x-6"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 rounded-full blur-lg translate-y-6 -translate-x-6"></div>
        <div className="absolute -left-8 top-1/2 w-16 h-96 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-violet-500/0 rotate-12 blur-xl"></div>
        
        {/* Header with improved animation */}
        <div className="flex items-center mb-6">
          <motion.div 
            whileHover={{ scale: 1.2, rotate: 5 }}
            transition={{ type: "spring", stiffness: 500, damping: 10 }}
            className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-400 to-fuchsia-500 p-0.5 mr-4 shadow-lg shadow-violet-500/20"
          >
            <div className="w-full h-full rounded-[10px] bg-white dark:bg-gray-900 flex items-center justify-center">
              <FlagIcon className="h-6 w-6 text-violet-500" />
            </div>
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
              Business Goal Summary
            </h3>
            <div className="h-0.5 w-1/2 bg-gradient-to-r from-violet-500/50 to-fuchsia-500/50 rounded-full mt-1"></div>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-800 dark:text-gray-200 text-lg mb-6 leading-relaxed font-medium">
            {goalSummary.rephrased || "Develop a successful business strategy"}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
            {/* Enhanced Difficulty Meter */}
            <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-lg overflow-hidden relative group">
              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 mr-2 text-amber-500" />
                  <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
                    Difficulty Level
                  </span>
                </div>
                <motion.div 
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-700 dark:text-violet-300 text-sm font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm border border-violet-200 dark:border-violet-800/30"
                >
                  {difficulty.toString()}/10
                </motion.div>
              </div>
              
              <div className="relative h-12 mb-2">
                {/* Base layer with improved glass morphism */}
                <div className="absolute inset-0 bg-gray-100/70 dark:bg-gray-700/40 rounded-lg overflow-hidden backdrop-blur-sm border border-gray-200/70 dark:border-gray-700/70"></div>
                
                {/* Progress bar with enhanced gradient and animation */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: difficultyPercentage }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-600 rounded-lg shadow-[0_0_15px_rgba(149,76,233,0.5)] overflow-hidden"
                >
                  {/* Enhanced pulse effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-pulse-slow"></div>
                  
                  {/* Improved glowing edge */}
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/70 blur-md"></div>
                </motion.div>
                
                {/* Markers for each difficulty level */}
                <div className="absolute inset-0 flex justify-between items-center px-1.5 pointer-events-none">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: i + 1 <= difficulty ? 16 : 10 }}
                        transition={{ duration: 0.4, delay: 0.6 + i * 0.05 }}
                        className={`w-0.5 ${
                          i + 1 <= difficulty 
                            ? 'bg-white/90' 
                            : 'bg-gray-300 dark:bg-gray-600'
                        } rounded-full`}
                      ></motion.div>
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 1 + i * 0.05 }}
                        className={`mt-1 text-[10px] font-medium ${
                          i + 1 <= difficulty 
                            ? 'text-violet-700 dark:text-violet-300' 
                            : 'text-gray-400 dark:text-gray-500'
                        }`}
                      >
                        {i + 1}
                      </motion.div>
                    </div>
                  ))}
                </div>
                
                {/* Animated current difficulty marker */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.6, type: "spring" }}
                  className="absolute top-0 h-full"
                  style={{ 
                    left: `calc(${difficultyPercentage} - 8px)`,
                    display: difficulty > 0 ? 'block' : 'none'
                  }}
                >
                  <div className="h-full flex items-center">
                    <motion.div 
                      animate={{ 
                        boxShadow: ['0 0 5px rgba(139, 92, 246, 0.7)', '0 0 15px rgba(139, 92, 246, 0.7)', '0 0 5px rgba(139, 92, 246, 0.7)']
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-5 h-5 rounded-full bg-white shadow-md border-2 border-violet-500"
                    ></motion.div>
                  </div>
                </motion.div>
              </div>
              
              <div className="flex justify-between px-1.5 mt-2">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Beginner</span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Expert</span>
              </div>
            </div>
            
            {/* Enhanced Time Estimate */}
            <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-lg relative group overflow-hidden">
              {/* Subtle ambient animation */}
              <div className="absolute -right-12 -top-12 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute -left-12 -bottom-12 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2 rounded-lg shadow-lg mr-3">
                  <ClockIcon className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  Estimated Timeline
                </span>
              </div>
              
              <div className="relative">
                {/* Digital-style display */}
                <div className="flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30 shadow-inner mb-3">
                  <div className="flex items-baseline">
                    <motion.span 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.3 }}
                      className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-600 tracking-tight"
                    >
                      {safeNumber(goalSummary.timeEstimate)}
                    </motion.span>
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="ml-2 text-lg font-medium text-indigo-600/80 dark:text-indigo-400/80"
                    >
                      {goalSummary.timeUnit || "days"}
                    </motion.span>
                  </div>
                  
                  {/* Decorative dash lines */}
                  <div className="w-full flex justify-center space-x-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div 
                        key={i}
                        initial={{ width: 0 }}
                        animate={{ width: 8 }}
                        transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                        className="h-0.5 bg-indigo-200 dark:bg-indigo-700 rounded-full"
                      ></motion.div>
                    ))}
                  </div>
                </div>
                
                <p className="text-center text-sm text-indigo-600/70 dark:text-indigo-400/70 mt-2 font-medium">
                  Estimated time to achieve your goal
                </p>
                
                {/* Progress indicator dots */}
                <div className="flex justify-center mt-3 space-x-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 1, 0.5] 
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: i * 0.6 
                      }}
                      className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 dark:bg-indigo-400/50"
                    ></motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 