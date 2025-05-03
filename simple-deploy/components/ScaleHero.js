import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Simple implementation of TypingText component to avoid dynamic import issues
const TypingText = ({ words }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let timeout;
    
    if (!isDeleting && currentText !== currentWord) {
      timeout = setTimeout(() => {
        setCurrentText(currentWord.substring(0, currentText.length + 1));
      }, 80);
    } else if (!isDeleting && currentText === currentWord) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && currentText !== '') {
      timeout = setTimeout(() => {
        setCurrentText(currentWord.substring(0, currentText.length - 1));
      }, 40);
    } else if (isDeleting && currentText === '') {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setCurrentWordIndex((currentWordIndex + 1) % words.length);
      }, 200);
    }
    
    return () => clearTimeout(timeout);
  }, [currentText, currentWordIndex, isDeleting, words]);
  
  return (
    <div className="inline-flex items-baseline">
      <span className="text-4xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
        {currentText}
        <span className="animate-blink">|</span>
      </span>
    </div>
  );
};

const ScaleHero = ({ mounted = false }) => {
  // Updated typing effect words with terms focused on what the app can help with
  const changingWords = [
    "increase revenue",
    "scale operations",
    "boost profitability",
    "optimize marketing",
    "reduce costs"
  ];

  return (
    <div className="relative flex flex-col items-center justify-center bg-black text-white overflow-hidden py-20 md:py-32 lg:py-48">
      {/* Grid background similar to Scale.com */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-40"></div>
      </div>
      
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
      <div className="absolute top-24 sm:top-32 right-8 sm:right-12 md:right-24 transform rotate-3">
        <div className="bg-gradient-to-r from-blue-600/90 to-teal-500/90 px-4 py-2 rounded-lg shadow-lg">
          <span className="text-white text-sm sm:text-base font-medium flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Power your small business with AI
          </span>
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Scale.com-style heading with animated typing text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-8">
            <div className="min-h-[120px] flex items-center justify-center">
              {mounted && <TypingText words={changingWords} />}
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
              Start Your Plan Today
            </Link>
            <a 
              href="#features"
              className="px-8 py-4 border border-gray-600 rounded-lg font-medium text-gray-300 hover:bg-white/5 hover:border-gray-400 transition-all duration-300"
            >
              See How It Works
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScaleHero; 