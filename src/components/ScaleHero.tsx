'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ScaleHero({ mounted = true }) {
  return (
    <section className="relative min-h-[85vh] flex items-center">
      <div className="absolute inset-0 backdrop-blur-[1px] bg-black/30 z-0"></div>
      
      {/* Static gradient background instead of animated canvas */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-[-1]">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-700/30 via-transparent to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text content - left side */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Your Business. <br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
                  Strategically Planned.
                </span>
              </h1>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="mt-6 text-xl text-gray-300 max-w-lg">
                AI-powered strategic planning that translates ambitious goals into daily actionable steps for small businesses.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <Link 
                href="/auth/signup" 
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-black rounded-md font-medium text-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 text-center"
              >
                Join Beta
              </Link>
              <Link 
                href="#how-it-works" 
                className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-md font-medium text-lg hover:bg-white/20 transition-all duration-300 text-center"
              >
                Learn More
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-12"
            >
              <p className="text-gray-400 text-sm">Trusted by small business owners across industries</p>
              <div className="mt-4 flex flex-wrap gap-8">
                <div className="text-gray-500 font-medium">Retail Partners</div>
                <div className="text-gray-500 font-medium">Restaurant Group</div>
                <div className="text-gray-500 font-medium">Service Pros</div>
              </div>
            </motion.div>
          </div>
          
          {/* Image placeholder - right side */}
          <div className="relative rounded-xl overflow-hidden">
            <div className="aspect-[4/3] bg-gradient-to-br from-blue-900/30 via-gray-900 to-teal-900/30 rounded-xl border border-gray-700/50">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Strategic Planning Dashboard</h3>
                  <p className="text-gray-300">Action-oriented business planning with AI-powered insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 