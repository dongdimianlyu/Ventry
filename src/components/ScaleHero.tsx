import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import TypingText from './TypingText';

interface ScaleHeroProps {
  mounted?: boolean;
}

const ScaleHero: React.FC<ScaleHeroProps> = ({ mounted = false }) => {
  // Updated typing effect words with terms focused on what the app can help with
  const changingWords = [
    "increase revenue",
    "scale operations",
    "boost profitability",
    "optimize marketing",
    "reduce costs"
  ];

  // Basic content to show immediately while animations load
  const renderContent = () => (
    <div className="relative z-10 container mx-auto px-4 text-center">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-8">
          <div className="min-h-[120px] flex items-center justify-center">
            {mounted ? (
              <TypingText words={changingWords} />
            ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                increase revenue
              </span>
            )}
          </div>
          <span className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-300 block mt-4">
            with optimal and actionable planning
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-gray-300 mt-6 mb-8">
          Ventry transforms overwhelming business goals into clear daily actions with AI-powered strategic planning tailored to your small business's exact needs and location.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/auth/signup" 
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-400 text-black font-medium rounded-lg hover:shadow-lg hover:from-blue-600 hover:to-teal-500 transition-all duration-300 transform hover:-translate-y-1"
          >
            Join Beta
          </Link>
          <a 
            href="#features"
            className="px-8 py-4 border border-gray-600 rounded-lg font-medium text-gray-300 hover:bg-white/5 hover:border-gray-400 transition-all duration-300"
          >
            See How It Works
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative flex flex-col items-center justify-center bg-black text-white overflow-hidden py-20 md:py-32 lg:py-48">
      {/* Grid background similar to Scale.com */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-40"></div>
      </div>
      
      {/* Animated elements only when mounted */}
      {mounted && (
        <>
          {/* Subtle animated gradient accent */}
          <motion.div 
            className="absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-blue-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <motion.div 
            className="absolute bottom-1/4 -right-20 w-80 h-80 bg-gradient-to-r from-teal-400/20 to-blue-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          {/* AI power badge - Added new element */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute top-8 left-8 md:top-12 md:left-12 bg-gradient-to-r from-blue-900/40 to-blue-800/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-blue-700/30 flex items-center gap-2"
          >
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-teal-300 flex items-center justify-center animate-pulse-slow">
              <div className="w-1.5 h-1.5 rounded-full bg-white/90"></div>
            </div>
            <span className="text-xs font-medium text-blue-200">Powered by AI</span>
          </motion.div>
        </>
      )}
      
      {/* Conditionally use motion components when mounted */}
      {mounted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 container mx-auto px-4 text-center mb-8"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-8">
            <div className="min-h-[120px] flex items-center justify-center">
              <TypingText words={changingWords} />
            </div>
            <span className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-300 block mt-4">
              with optimal and actionable planning
            </span>
          </h1>
          
          <motion.p 
            className="max-w-2xl mx-auto text-xl text-gray-300 mt-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Ventry transforms overwhelming business goals into clear daily actions with AI-powered strategic planning tailored to your small business's exact needs and location.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              href="/auth/signup" 
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-400 text-black font-medium rounded-lg hover:shadow-lg hover:from-blue-600 hover:to-teal-500 transition-all duration-300 transform hover:-translate-y-1"
            >
              Join Beta
            </Link>
            <a 
              href="#features"
              className="px-8 py-4 border border-gray-600 rounded-lg font-medium text-gray-300 hover:bg-white/5 hover:border-gray-400 transition-all duration-300"
            >
              See How It Works
            </a>
          </motion.div>
        </motion.div>
      ) : (
        // Static version for immediate render
        renderContent()
      )}
    </div>
  );
};

export default ScaleHero; 