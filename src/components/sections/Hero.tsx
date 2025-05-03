import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative z-10 container mx-auto px-4 py-24 sm:py-32">
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div 
          className="text-center max-w-4xl mx-auto will-change-transform"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
            Strategic Growth for Small Business
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Transform your business goals into actionable daily steps. Get the clarity and direction you need to grow—without expensive consultants.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/auth/signup" 
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-400 rounded-xl font-medium text-black shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
            >
              Start Your Free Trial
            </Link>
            <Link 
              href="#features" 
              className="px-8 py-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl font-medium text-white transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero; 