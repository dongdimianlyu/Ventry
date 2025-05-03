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
            {/* Enhanced Difficulty Meter - Updated with futuristic & minimalistic design */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/90 rounded-xl p-5 border border-gray-800/50 shadow-xl overflow-hidden relative group">
              {/* Ambient glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"></div>
              <div className="absolute inset-0 backdrop-blur-sm bg-black/5"></div>
              
              <div className="relative flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <SparklesIcon className="h-5 w-5 mr-2 text-cyan-400" />
                  <span className="text-base font-semibold text-gray-100 tracking-wide">
                    Difficulty Level
                  </span>
                </div>
                <motion.div 
                  whileTap={{ scale: 0.95 }}
                  className="bg-black/30 text-cyan-300 text-sm font-medium px-3 py-1.5 rounded-md border border-cyan-900/50 flex items-center space-x-1"
                >
                  <span className="font-mono">{difficulty.toString()}</span>
                  <span className="text-gray-500">/</span>
                  <span className="text-gray-400">10</span>
                </motion.div>
              </div>
              
              <div className="relative h-10 mb-3">
                {/* Base layer with holographic effect */}
                <div className="absolute inset-0 bg-black/50 rounded-md overflow-hidden backdrop-blur-sm border border-gray-800/50"></div>
                
                {/* Futuristic scan line effect */}
                <div className="absolute inset-0 overflow-hidden rounded-md">
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent absolute top-1/2 transform -translate-y-1/2 animate-scan-x"></div>
                </div>
                
                {/* Enhanced progress bar with neon glow */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: difficultyPercentage }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-700 to-cyan-400 rounded-md overflow-hidden"
                >
                  {/* Light reflection effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-200/30 to-transparent animate-pulse-slow"></div>
                  
                  {/* Edge glow effect */}
                  <motion.div 
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute right-0 top-0 bottom-0 w-1 bg-cyan-300 blur-md"
                  ></motion.div>
                </motion.div>
                
                {/* Minimalist segment markers */}
                <div className="absolute inset-0 flex justify-between items-center px-1 pointer-events-none">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.04 }}
                      className="h-full flex items-center"
                    >
                      <div className={`h-2 w-px ${
                        i + 1 <= difficulty 
                          ? 'bg-white/70' 
                          : 'bg-gray-700/70'
                      }`}></div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Futuristic current difficulty indicator */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.5, type: "spring" }}
                  className="absolute top-0 h-full z-10"
                  style={{ 
                    left: `calc(${difficultyPercentage} - 5px)`,
                    display: difficulty > 0 ? 'block' : 'none'
                  }}
                >
                  <div className="h-full flex items-center">
                    <motion.div 
                      animate={{ 
                        boxShadow: ['0 0 4px rgba(34, 211, 238, 0.7)', '0 0 8px rgba(34, 211, 238, 0.9)', '0 0 4px rgba(34, 211, 238, 0.7)']
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-3 h-8 rounded-sm bg-cyan-400 shadow-lg"
                    >
                      <div className="w-full h-full bg-gradient-to-b from-cyan-200 via-cyan-400 to-cyan-600"></div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
              
              {/* Futuristic scale labels */}
              <div className="flex justify-between px-0.5 mt-2 text-[10px] font-mono">
                <span className="text-gray-500">BASELINE</span>
                <span className="text-cyan-400/80">ADVANCED</span>
              </div>

              {/* Data readout section */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.5 }}
                className="mt-3 pt-3 border-t border-gray-800/50 text-[10px] text-gray-500 font-mono flex justify-between"
              >
                <div>COMPLEXITY <span className="text-cyan-400 ml-1">{difficulty < 4 ? 'LOW' : difficulty < 7 ? 'MEDIUM' : 'HIGH'}</span></div>
                <div>STATUS <span className="text-green-400 ml-1">ANALYZING</span></div>
              </motion.div>
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