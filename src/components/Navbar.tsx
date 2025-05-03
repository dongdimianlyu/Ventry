'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    // Set initial scroll state
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!mounted) {
    return <div className="h-16" />;
  }

  return (
    <header
      className={`fixed w-full top-0 z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 shadow-md border-b border-gray-800/30'
          : 'bg-black/60 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center py-1.5">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 mr-2 rounded-md bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-lg"
              >
                <span className="text-white font-bold text-sm">V</span>
              </motion.div>
              <span className={`text-white font-bold transition-all duration-300 ${scrolled ? 'text-lg' : 'text-xl'}`}>
                Ventry
              </span>
            </Link>
          </div>
          
          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="#features"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium px-2 py-1 hover:bg-white/5 rounded-sm"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium px-2 py-1 hover:bg-white/5 rounded-sm"
            >
              How It Works
            </Link>
            <Link
              href="#faq"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium px-2 py-1 hover:bg-white/5 rounded-sm"
            >
              FAQ
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium px-2 py-1 hover:bg-white/5 rounded-sm"
            >
              About
            </Link>
          </div>
          
          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/auth/login"
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors px-2 py-1 hover:bg-white/5 rounded-sm"
            >
              Sign In
            </Link>
            <div className="h-4 w-px bg-gray-700/50"></div>
            <Link
              href="/auth/signup"
              className="bg-gradient-to-r from-blue-500/90 to-teal-400/90 hover:from-blue-500 hover:to-teal-400 text-black px-3 py-1 rounded-sm text-sm font-medium transition-all duration-300"
            >
              Join Beta
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none transition-colors duration-200 p-1 rounded-sm hover:bg-white/5"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-black/90 border-b border-gray-800/30 overflow-hidden transition-all duration-200 ease-in-out ${
            mobileMenuOpen ? 'max-h-64 opacity-100 py-2' : 'max-h-0 opacity-0 py-0'
          }`}
        >
          <div className="px-2 space-y-1">
            <Link
              href="#features"
              className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-sm transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-sm transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="#faq"
              className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-sm transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-sm transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="border-t border-gray-800/30 my-2"></div>
            <Link
              href="/auth/login"
              className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-sm transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="block px-3 py-2 mx-2 my-2 text-center text-sm font-medium text-black bg-gradient-to-r from-blue-500/90 to-teal-400/90 hover:from-blue-500 hover:to-teal-400 rounded-sm transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Join Beta
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 