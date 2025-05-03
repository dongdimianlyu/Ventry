'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize on component mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    // Update DOM and localStorage
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleDarkMode}
      className="relative h-10 w-10 rounded-lg bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-center transition-colors duration-200"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: isDarkMode ? 180 : 0,
          opacity: isDarkMode ? 0 : 1
        }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <SunIcon className="h-5 w-5 text-amber-500" />
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{ 
          rotate: isDarkMode ? 0 : -180,
          opacity: isDarkMode ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <MoonIcon className="h-5 w-5 text-indigo-400" />
      </motion.div>
    </motion.button>
  );
} 