'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ScaleHero from '../components/ScaleHero';

// Dynamic import for regular components
import dynamic from 'next/dynamic';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Set mounted in the next tick to improve initial render time
    const timer = setTimeout(() => {
      setMounted(true);
    }, 10);
    
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 3);
    }, 8000);
    
    // Handle scroll event to change navbar styling
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Use deterministic values instead of random ones
  const generateDeterministicValue = (seed: number, min: number, max: number) => {
    return ((seed * 9301 + 49297) % 233280) / 233280 * (max - min) + min;
  };

  const testimonials = [
    {
      quote: "Ventry helped me grow my retail store revenue by 32% in just 4 months. The daily action steps kept me focused on high-impact activities instead of getting lost in day-to-day operations.",
      author: "Sarah Martinez",
      position: "Owner, Bloom Boutique",
      avatar: "/avatars/sarah.jpg"
    },
    {
      quote: "As a solo consultant trying to scale, Ventry's roadmap showed me exactly where to focus. I've doubled my client base and increased my rates without working more hours.",
      author: "Michael Jordan",
      position: "Financial Consultant",
      avatar: "/avatars/michael.jpg"
    },
    {
      quote: "The strategic advisor helped me identify a completely untapped market segment. We've completely repositioned our services and seen a 45% increase in new clients.",
      author: "Amelia Wong",
      position: "Co-founder, ClearPath Accounting",
      avatar: "/avatars/amelia.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <header 
        className={`fixed w-full top-0 z-50 backdrop-blur-md transition-all duration-300 ${
          scrolled 
            ? 'bg-black/80 shadow-md border-b border-gray-800/30' 
            : 'bg-black/60 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center py-1.5">
                <span className={`text-white font-bold transition-all duration-300 ${scrolled ? 'text-md' : 'text-lg'}`}>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">V</span>entry
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
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          <div 
            className={`md:hidden bg-black/90 border-b border-gray-800/30 overflow-hidden transition-all duration-200 ease-in-out ${
              mobileMenuOpen ? 'max-h-64 opacity-100 py-1' : 'max-h-0 opacity-0 py-0'
            }`}
          >
            <div className="px-2 space-y-0.5">
              <Link 
                href="#features" 
                className="block px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-sm transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="#how-it-works" 
                className="block px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-sm transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                href="#faq" 
                className="block px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-sm transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link 
                href="/about" 
                className="block px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-sm transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <div className="border-t border-gray-800/30 my-1"></div>
              <Link 
                href="/auth/login" 
                className="block px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-sm transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className="block mx-3 mt-1 mb-0.5 py-1.5 text-center text-sm font-medium text-black bg-gradient-to-r from-blue-500/90 to-teal-400/90 hover:from-blue-500 hover:to-teal-400 rounded-sm transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Join Beta
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Add spacing to account for fixed header */}
      <div className="h-12"></div>
      
      {/* Hero Section - Scale.com Style */}
      <ScaleHero mounted={mounted} />

      {/* Clean section divider */}
      <div className="h-24 bg-gradient-to-b from-transparent to-black"></div>

      {/* Section 1: Your Personalized Growth Roadmap */}
      <section id="growth-roadmap" className="bg-black py-20 relative">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-full h-full bg-[url('/grid.svg')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-1/3 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-teal-400/20 border border-blue-500/30 text-blue-400 text-sm font-medium mb-4">
              Your Personalized Growth Roadmap
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-3xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">Actionable Plans</span> for Real Results
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-gray-800 shadow-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">What It Is:</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                An intelligent plan that translates your key business objectives—whether it's boosting revenue, scaling operations, or reducing costs—into clear, daily tasks.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-gray-800 shadow-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Why It Matters:</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                No more guesswork. Every action is backed by AI insights to ensure you're always on the fastest path to success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How It Works */}
      <section id="how-it-works" className="bg-black py-20 relative">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-blue-900/5 to-teal-900/5"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-400/20 border border-purple-500/30 text-purple-400 text-sm font-medium mb-4">
              How It Works
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-3xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-300">Simple Process</span>, Powerful Results
            </h2>
            <p className="text-gray-300 max-w-3xl mb-8">
              Our AI-powered platform transforms your business goals into actionable plans with daily tasks, comprehensive tracking, and strategic insights.
            </p>
            </div>

          {/* Feature 1: Business Plan Calendar */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-24 items-center">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-gray-800 shadow-xl p-8 relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Business Plan Calendar</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Our intelligent system transforms your business objectives into a comprehensive calendar with color-coded tasks and categories. Each day includes strategic activities tailored to your specific business type and goals.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500 mt-1"></div>
                    <span className="ml-2 text-gray-300">Daily tasks organized by business function</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 mt-1"></div>
                    <span className="ml-2 text-gray-300">Interactive monthly view with progressions</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500 mt-1"></div>
                    <span className="ml-2 text-gray-300">Auto-generated priority levels for focus</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-950 rounded-2xl overflow-hidden border border-gray-800/50 shadow-xl p-2">
                <img 
                  src="/images/calendar-screenshot.jpg" 
                  alt="Business Plan Calendar"
                  className="w-full h-auto rounded-lg"
                  style={{objectFit: 'cover'}}
                />
              </div>
            </div>
          </div>

          {/* Feature 2: Task Tracking & Progress (moved up) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-24 items-center">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-gray-800 shadow-xl p-8 relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-white font-bold">2</span>
                    </div>
                <h3 className="text-2xl font-bold text-white mb-3">Task Tracking & Progress</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Monitor your business journey with our comprehensive tracking system. Completed tasks are automatically logged, creating a visual timeline of your achievements and keeping you motivated.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 mt-1"></div>
                    <span className="ml-2 text-gray-300">Chronological task completion history</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500 mt-1"></div>
                    <span className="ml-2 text-gray-300">Category-based performance tracking</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 mt-1"></div>
                    <span className="ml-2 text-gray-300">Achievement milestone celebrations</span>
                  </li>
                </ul>
                    </div>
              </div>
            
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-950 rounded-2xl overflow-hidden border border-gray-800/50 shadow-xl">
                <div className="aspect-video rounded-xl bg-[#131825]">
                  <div className="w-full h-full flex items-center justify-center p-6">
                    {/* Task tracking visualization */}
                    <div className="w-full max-w-3xl bg-gray-900/50 rounded-lg p-4">
                      <div className="border-b border-gray-800 pb-2 mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                    </div>
                          <h3 className="text-xl text-white font-semibold">Recently Completed Tasks</h3>
                    </div>
                    </div>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-800">
                          <div className="flex items-center mb-2">
                            <div className="w-6 h-6 bg-red-600/40 rounded-full flex items-center justify-center mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                    </div>
                            <h4 className="text-white font-medium">Research Local Market</h4>
                            <div className="ml-auto text-gray-400 text-sm">Marketing</div>
              </div>
                          <div className="text-gray-400 text-sm">Day 2, Week 1</div>
            </div>
                        
                        <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-800">
                          <div className="flex items-center mb-2">
                            <div className="w-6 h-6 bg-red-600/40 rounded-full flex items-center justify-center mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
            </div>
                            <h4 className="text-white font-medium">Launch Online Promotions</h4>
                            <div className="ml-auto text-gray-400 text-sm">Marketing</div>
          </div>
                          <div className="text-gray-400 text-sm">Day 6, Week 1</div>
        </div>
        </div>
          </div>
                  </div>
                </div>
                </div>
              </div>
            </div>

          {/* Feature 3: Strategic Action Plans (moved up) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-24 items-center">
            <div className="lg:col-span-3 order-1">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-950 rounded-2xl overflow-hidden border border-gray-800/50 shadow-xl">
                <div className="aspect-video rounded-xl bg-[#131825]">
                  <div className="w-full h-full flex items-center justify-center p-6">
                    {/* Action plans visualization */}
                    <div className="w-full max-w-3xl bg-gray-900/50 rounded-lg p-4">
                      <div className="border-b border-gray-800 pb-2 mb-4">
                  <div className="flex items-center">
                          <div className="w-10 h-10 bg-teal-600/20 rounded-full flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                      </div>
                          <h3 className="text-xl text-white font-semibold">Upcoming Tasks</h3>
                    </div>
                    </div>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-800">
                          <div className="flex items-center mb-1">
                            <div className="bg-blue-600/30 px-2 py-0.5 rounded text-xs text-blue-300">Day 7</div>
                            <div className="ml-auto bg-red-600/30 px-2 py-0.5 rounded text-xs text-red-300">High</div>
                  </div>
                          <h4 className="text-white font-medium text-lg mb-1">Inventory Cost Analysis</h4>
                          <p className="text-gray-400 text-sm mb-2">Review inventory costs and negotiate with suppliers for better pricing on bulk purchases.</p>
                          <div className="bg-yellow-900/20 px-2 py-1 rounded text-xs text-yellow-400 inline-block">Finance</div>
          </div>

                        <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-800">
                          <div className="flex items-center mb-1">
                            <div className="bg-blue-600/30 px-2 py-0.5 rounded text-xs text-blue-300">Day 8</div>
                            <div className="ml-auto bg-red-600/30 px-2 py-0.5 rounded text-xs text-red-300">High</div>
                </div>
                          <h4 className="text-white font-medium text-lg mb-1">Launch Happy Hour Specials</h4>
                          <p className="text-gray-400 text-sm mb-2">Introduce a daily happy hour menu with discounted drinks to attract the evening crowd.</p>
                          <div className="bg-purple-900/20 px-2 py-1 rounded text-xs text-purple-400 inline-block">Product</div>
            </div>
          </div>
          </div>
        </div>
        </div>
                  </div>
                </div>
                
            <div className="lg:col-span-2 order-2">
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-gray-800 shadow-xl p-8 relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Strategic Action Plans</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Each task in your plan comes with detailed information on implementation, priority level, and business category. Our system ensures you always know what to focus on next to drive maximum growth.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 mt-1"></div>
                    <span className="ml-2 text-gray-300">Detailed task descriptions and guidance</span>
                        </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500 mt-1"></div>
                    <span className="ml-2 text-gray-300">Business category classification</span>
                        </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500 mt-1"></div>
                    <span className="ml-2 text-gray-300">Priority-based implementation sequence</span>
                  </li>
                    </ul>
              </div>
                  </div>
                </div>
                
          {/* Feature 4: Goal Summary & Timeline (moved to last position) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-20 items-center">
            <div className="lg:col-span-3 order-1">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-950 rounded-2xl overflow-hidden border border-gray-800/50 shadow-xl">
                <div className="aspect-video rounded-xl bg-[#131825]">
                  <div className="w-full h-full flex items-center justify-center p-6">
                    {/* Goal summary visualization */}
                    <div className="w-full max-w-3xl bg-gray-900/50 rounded-lg p-6">
                      <div className="border border-purple-900/30 rounded-lg p-5 bg-gray-900/50">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-purple-600/30 rounded-full flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                            </svg>
                </div>
                          <h3 className="text-xl text-white font-semibold">Business Goal Summary</h3>
              </div>
              
                        <div className="text-lg text-white mb-6">
                          Increase the restaurant's monthly profit by $20k through strategic marketing, operational efficiency, and menu optimization.
                </div>
                
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="border border-indigo-900/30 rounded p-4 bg-gray-900/30">
                            <div className="text-indigo-400 mb-2 font-medium">Difficulty Level</div>
                            <div className="flex items-center">
                              <div className="text-3xl font-bold text-white">7</div>
                              <div className="text-gray-400 ml-2">/10</div>
                  </div>
                            <div className="h-3 bg-gray-800 rounded-full mt-2 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" style={{width: '70%'}}></div>
            </div>
          </div>
          
                          <div className="border border-blue-900/30 rounded p-4 bg-gray-900/30">
                            <div className="text-blue-400 mb-2 font-medium">Estimated Timeline</div>
                            <div className="text-3xl font-bold text-white">6 <span className="text-lg text-blue-400 font-normal">months</span></div>
                            <div className="text-gray-400 text-sm mt-1">Estimated time to achieve your goal</div>
            </div>
          </div>
        </div>
        </div>
          </div>
                </div>
            </div>
            </div>
            
            <div className="lg:col-span-2 order-2">
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-gray-800 shadow-xl p-8 relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Goal Summary & Timeline</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Visualize your business goals with our intuitive dashboard that provides clear metrics on difficulty levels and estimated completion times. Our AI analyzes your objectives and creates realistic timelines for achievement.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500 mt-1"></div>
                    <span className="ml-2 text-gray-300">Dynamic difficulty assessment</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 mt-1"></div>
                    <span className="ml-2 text-gray-300">Estimated achievement timeline</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500 mt-1"></div>
                    <span className="ml-2 text-gray-300">Visual progress indicators</span>
                  </li>
                </ul>
            </div>
                </div>
              </div>
              
          {/* CTA Button */}
          <div className="flex justify-center mt-12">
                <Link 
                  href="/auth/signup" 
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg text-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 transform hover:-translate-y-1"
            >
              Join Beta
                </Link>
          </div>
        </div>
      </section>

      {/* Section 3: Experience Our Exclusive Early Access */}
      <section id="early-access" className="bg-black py-20 relative">
        <div className="absolute inset-0 pointer-events-none bg-black opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-400/20 border border-indigo-500/30 text-indigo-400 text-sm font-medium mb-4">
              Experience Our Exclusive Early Access
          </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-3xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-300">Be Among the First</span> to Benefit
            </h2>
            </div>
            
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gradient-to-br from-indigo-900/20 to-gray-950 rounded-2xl overflow-hidden border border-indigo-800/30 shadow-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Join the Revolution:</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Gain full, unrestricted access to our platform during our pioneering launch phase.
              </p>
          </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-gray-950 rounded-2xl overflow-hidden border border-purple-800/30 shadow-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Risk-Free:</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Start immediately with no credit card required – 100% free access for early adopters.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
              <Link 
                href="/auth/signup" 
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg text-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 transform hover:-translate-y-1"
              >
              Join Beta
              </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Real Results for Real Businesses */}
      <section id="testimonials" className="bg-black py-20 relative">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-teal-900/5 to-blue-900/5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-teal-500/20 to-blue-400/20 border border-teal-500/30 text-teal-400 text-sm font-medium mb-4">
              Real Results for Real Businesses
          </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-3xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-300">Real Impact</span> on Growth
            </h2>
                </div>
                
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-gray-800 shadow-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Proven Impact:</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Hear from early users who have transformed their operations and accelerated growth.
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
                  <p className="italic text-gray-300 mb-4">"Ventry helped me grow my retail store revenue by 32% in just 4 months. The daily action steps kept me focused on high-impact activities."</p>
                  <p className="text-teal-400 font-medium">— Sarah M., Retail Store Owner</p>
                    </div>
                <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
                  <p className="italic text-gray-300 mb-4">"I've doubled my client base and increased my rates without working more hours, thanks to the clear roadmap Ventry provided."</p>
                  <p className="text-teal-400 font-medium">— Michael J., Financial Consultant</p>
                    </div>
                  </div>
                </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-gray-800 shadow-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Trusted & Transparent:</h3>
              <p className="text-gray-300 leading-relaxed">
                A genuine solution built to empower small businesses with clarity, precision, and confidence.
              </p>
          </div>
          
            <div className="bg-gradient-to-br from-teal-900/30 to-gray-950 rounded-2xl overflow-hidden border border-teal-800/30 shadow-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Get Started Today</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Claim your free early access and begin your journey to success!
              </p>
              <Link 
                href="/auth/signup" 
                className="block w-full py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold rounded-lg text-center shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all duration-300"
              >
                Join Beta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:justify-between">
            <div className="mb-8 md:mb-0">
              <Link href="/" className="flex items-center">
                <span className="text-white font-bold text-xl">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">V</span>entry
                </span>
              </Link>
              <p className="text-gray-400 mt-2 max-w-sm">
                AI-powered business planning for strategic growth and measurable results.
              </p>
                    </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Product</h3>
                <ul className="space-y-3">
                  <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</Link></li>
                  <li><Link href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</Link></li>
              </ul>
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Company</h3>
                <ul className="space-y-3">
                  <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                  <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link></li>
                  <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Ventry. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.7,3H4.3C3.582,3,3,3.582,3,4.3v15.4C3,20.418,3.582,21,4.3,21h15.4c0.718,0,1.3-0.582,1.3-1.3V4.3 C21,3.582,20.418,3,19.7,3z M8.339,18.338H5.667v-8.59h2.672V18.338z M7.004,8.574c-0.857,0-1.549-0.694-1.549-1.548 c0-0.855,0.691-1.548,1.549-1.548c0.854,0,1.547,0.694,1.547,1.548C8.551,7.881,7.858,8.574,7.004,8.574z M18.339,18.338h-2.669 v-4.177c0-0.996-0.017-2.278-1.387-2.278c-1.389,0-1.601,1.086-1.601,2.206v4.249h-2.667v-8.59h2.559v1.174h0.037 c0.356-0.675,1.227-1.387,2.526-1.387c2.703,0,3.203,1.779,3.203,4.092V18.338z"></path>
                </svg>
              </a>
              </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
    