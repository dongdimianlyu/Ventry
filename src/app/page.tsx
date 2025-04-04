'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Import Three.js components
import dynamic from 'next/dynamic';

// Import components with dynamic imports to prevent SSR issues
const AnimatedBackground = dynamic(() => import('../components/three/AnimatedBackground').then(mod => mod.default || mod), { ssr: false });
const ScaleHero = dynamic(() => import('../components/ScaleHero').then(mod => mod.default || mod), { ssr: false });
const FeaturesBackground = dynamic(() => import('../components/three/FeaturesBackground').then(mod => mod.default || mod), { ssr: false });
const TestimonialsEffect = dynamic(() => import('../components/three/TestimonialsEffect').then(mod => mod.default || mod), { ssr: false });
const PricingGradient = dynamic(() => import('../components/three/PricingGradient').then(mod => mod.default || mod), { ssr: false });
const FAQVisual = dynamic(() => import('../components/three/FAQVisual').then(mod => mod.default || mod), { ssr: false });

// Import the cinematic 3D Globe scene
const SimpleGlobe = dynamic(() => import('../components/three/SimpleGlobe').then(mod => mod.default), { ssr: false });

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    
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
                Log In
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
                Log In
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
      {mounted && <ScaleHero mounted={mounted} />}

      {/* Clean section divider */}
      <div className="h-24 bg-gradient-to-b from-transparent to-black"></div>

      {/* Features Section - Redesigned */}
      <section id="features" className="bg-black py-20 relative">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-full h-full bg-[url('/grid.svg')] opacity-10"></div>
          {mounted && <FeaturesBackground />}
          <div className="absolute top-0 right-0 w-1/3 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-teal-400/20 border border-blue-500/30 text-blue-400 text-sm font-medium mb-4">
              Built for Small Business Owners
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-3xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">Strategic Growth</span> Made Simple
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your ambitious business goals into actionable daily steps without expensive consultants or complex planning tools.
            </p>
          </div>

          {/* Main Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-gray-800 shadow-xl group hover:border-blue-500/30 transition-all duration-300">
              <div className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Business Goal Planner</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Enter your specific business goal—whether it's increasing revenue, expanding locations, or cutting costs—and get a day-by-day action plan customized for your business type and location.
              </p>
              <ul className="space-y-3 mb-8">
                  {[
                    "Daily actionable steps that build to significant results",
                    "Industry-specific strategies based on proven frameworks",
                    "Adaptive plans that adjust as your business evolves",
                    "Balanced workload designed for busy business owners"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-blue-400 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                      <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
                <Link 
                  href="/goal-planner" 
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium group"
                >
                  <span>Create Your Plan</span>
                  <svg 
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
              </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-gray-800 shadow-xl group hover:border-purple-500/30 transition-all duration-300">
              <div className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-400 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">Strategic Business Advisor</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Get on-demand strategic advice that rivals costly consultants. Our AI advisor analyzes your business metrics and market conditions to recommend targeted growth opportunities.
              </p>
              <ul className="space-y-3 mb-8">
                  {[
                    "Answers to your most pressing business questions",
                    "Competitor analysis and market positioning guidance",
                    "Data-backed recommendations for maximizing profitability",
                    "Customized strategies based on your specific industry"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-purple-400 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                      <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
                <Link 
                  href="/advisor" 
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium group"
                >
                  <span>Consult Your Advisor</span>
                  <svg 
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
              </Link>
              </div>
            </div>
          </div>

          {/* Secondary Features in Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-blue-800/50 transition-all duration-300 hover:shadow-md hover:shadow-blue-500/5 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Progress Tracking</h3>
              <p className="text-gray-400 leading-relaxed">
                Visualize your business journey with intuitive progress tracking. Stay motivated as you see real results from your consistent actions.
            </p>
          </div>

            {/* Feature 2 */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-green-800/50 transition-all duration-300 hover:shadow-md hover:shadow-green-500/5 group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">Financial Projections</h3>
              <p className="text-gray-400 leading-relaxed">
                Make confident decisions with financial projections that translate your strategic actions into expected revenue and profit metrics.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-amber-800/50 transition-all duration-300 hover:shadow-md hover:shadow-amber-500/5 group">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-400 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">Resource Optimization</h3>
              <p className="text-gray-400 leading-relaxed">
                Maximize your limited resources with AI-powered insights on optimizing time, budget, and personnel allocation for greatest ROI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New redesigned sections will go here */}
      
      {/* Testimonials Section - Redesigned */}
      <section className="bg-gradient-to-b from-black to-gray-950 py-24 relative overflow-hidden">
        {/* Visual elements */}
        <div className="absolute inset-0 pointer-events-none">
          {mounted && <TestimonialsEffect />}
          <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-400/20 border border-purple-500/30 text-purple-400 text-sm font-medium mb-4">
              Success Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-3xl">
              Real <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">Small Business Success</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover how small businesses like yours have achieved measurable growth with Ventry's strategic planning tools
            </p>
          </div>

          {/* Testimonials Showcase */}
          <div className="relative">
            {/* Testimonial Cards Carousel */}
            <div className="flex justify-center mb-16">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="absolute w-full max-w-4xl bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl shadow-xl border border-gray-800 overflow-hidden"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ 
                    opacity: index === activeTestimonial ? 1 : 0,
                    y: index === activeTestimonial ? 0 : 20,
                    scale: index === activeTestimonial ? 1 : 0.95,
                    pointerEvents: index === activeTestimonial ? 'auto' : 'none'
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-8 md:p-10 flex flex-col justify-center">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white/10 mr-4">
                          <img src={testimonial.avatar} alt={testimonial.author} className="w-full h-full object-cover" />
                </div>
                <div>
                          <div className="text-white font-bold text-lg">{testimonial.author}</div>
                          <div className="text-gray-400 text-sm">{testimonial.position}</div>
              </div>
            </div>

                      <blockquote>
                        <svg className="w-10 h-10 text-purple-500/30 mb-4" fill="currentColor" viewBox="0 0 32 32">
                          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path>
                        </svg>
                        <p className="text-xl text-gray-200 italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
                  </blockquote>
                      
                      {/* Growth metrics */}
                      <div className="mt-auto bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                        <div className="text-white font-medium mb-2">Results Achieved:</div>
                        <div className="space-y-2">
                    <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">Revenue Growth</span>
                              <span className="text-green-400">{30 + index * 5}%</span>
                    </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full" 
                                style={{width: `${30 + index * 5}%`}}
                              ></div>
                  </div>
                </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">Operational Efficiency</span>
                              <span className="text-green-400">{20 + index * 10}%</span>
            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full" 
                                style={{width: `${20 + index * 10}%`}}
                              ></div>
          </div>
                </div>
            </div>
          </div>
          </div>
                    
                    {/* Right column - background/industry context */}
                    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-8 md:p-10 flex flex-col">
                      <div className="py-4">
                        <div className="text-purple-400 text-sm font-medium mb-2">INDUSTRY CONTEXT</div>
                        <h3 className="text-xl font-bold text-white mb-4">
                          {index === 0 ? "Retail" : index === 1 ? "Professional Services" : "Financial Services"}
                        </h3>
                        <p className="text-gray-300 mb-6">
                          {index === 0 
                            ? "Facing intense online competition and changing consumer habits, this retail business needed a strategic edge to grow in-store traffic and sales."
                            : index === 1 
                              ? "As an independent consultant in a crowded market, building a reputation and scaling services presented unique challenges requiring strategic focus."
                              : "In a highly regulated industry with established players, this accounting firm needed to identify underserved niches and develop competitive advantages."
                          }
                        </p>
                        
                        <div className="text-purple-400 text-sm font-medium mb-2">THE CHALLENGES</div>
                        <ul className="space-y-2 mb-6">
                          {(index === 0 
                            ? ["Declining foot traffic", "Thin profit margins", "Inventory management issues", "Limited marketing budget"]
                            : index === 1 
                              ? ["Finding ideal clients", "Pricing services appropriately", "Scaling beyond billable hours", "Standing out from competitors"]
                              : ["Differentiation in crowded market", "Client acquisition costs", "Regulatory complexity", "Talent retention issues"]
                          ).map((challenge, i) => (
                            <li key={i} className="flex items-start">
                              <svg className="w-5 h-5 text-purple-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                          </svg>
                              <span className="text-gray-300">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                        
                        <div className="text-purple-400 text-sm font-medium mb-2">VENTRY'S APPROACH</div>
                        <ul className="space-y-2">
                          {(index === 0 
                            ? ["Targeted local marketing strategy", "Inventory optimization plan", "Customer loyalty program", "Experiential retail concepts"]
                            : index === 1 
                              ? ["Client value-based pricing model", "Scalable service offerings", "Authority positioning strategy", "Strategic networking plan"]
                              : ["Niche market identification", "Service differentiation strategy", "Digital transformation roadmap", "Client retention program"]
                          ).map((approach, i) => (
                            <li key={i} className="flex items-start">
                              <svg className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                              <span className="text-gray-300">{approach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                </div>
                </motion.div>
              ))}
              </div>
              
            {/* Testimonial Navigation Dots */}
            <div className="flex justify-center space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none ${
                    index === activeTestimonial 
                      ? 'bg-purple-500 scale-110' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
                </div>
                
          {/* Measurable Business Impact */}
          <div className="mt-20 text-center">
            <h3 className="text-xl text-white font-bold mb-8">Measurable Business Impact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { metric: "Average Revenue Growth", value: "28%", color: "blue" },
                { metric: "Operational Efficiency", value: "35%", color: "green" },
                { metric: "Strategic Goal Achievement", value: "82%", color: "purple" },
                { metric: "Profit Margin Improvement", value: "23%", color: "orange" }
              ].map((stat, index) => (
                <div key={index} className={`p-4 rounded-xl ${
                  stat.color === 'blue' ? 'bg-blue-900/20 border border-blue-700/30' : 
                  stat.color === 'green' ? 'bg-green-900/20 border border-green-700/30' : 
                  stat.color === 'purple' ? 'bg-purple-900/20 border border-purple-700/30' : 
                  'bg-orange-900/20 border border-orange-700/30'
                }`}>
                  <div className={`text-2xl font-bold mb-1 ${
                    stat.color === 'blue' ? 'text-blue-400' : 
                    stat.color === 'green' ? 'text-green-400' : 
                    stat.color === 'purple' ? 'text-purple-400' : 
                    'text-orange-400'
                  }`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.metric}</div>
                  </div>
              ))}
            </div>
          </div>
          
          {/* CTA */}
          <div className="mt-20 text-center">
            <div className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-500/30 p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-4">Join these success stories</h3>
              <p className="text-gray-300 mb-6 max-w-2xl">
                Transform your business goals into reality with strategic planning that actually works for small businesses
              </p>
              <Link 
                href="/auth/signup" 
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30"
              >
                Start Your Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Redesigned */}
      <section className="bg-black py-24 relative">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-full h-full bg-[url('/grid.svg')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-teal-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center mb-20">
            <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-teal-400/20 border border-blue-500/30 text-blue-400 text-sm font-medium mb-4">
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-3xl">
              How <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">Ventry Works</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A streamlined process that turns your business ambitions into daily achievable actions
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8 mb-20">
            {[
              {
                number: "01",
                title: "Define Your Goal",
                description: "Specify your business objective—increasing revenue, expanding locations, or optimizing costs.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                ),
                color: "blue"
              },
              {
                number: "02",
                title: "AI Analysis",
                description: "Our AI analyzes your business type, industry, and goal to identify the optimal strategic approach.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                ),
                color: "teal"
              },
              {
                number: "03",
                title: "Get Your Plan",
                description: "Receive a comprehensive, day-by-day action plan customized for your specific situation.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                ),
                color: "purple"
              },
              {
                number: "04",
                title: "Execute & Adapt",
                description: "Implement your plan with confidence, tracking progress and refining strategies as needed.",
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                  </svg>
                ),
                color: "pink"
              }
            ].map((step, index) => (
                <div 
                  key={index}
                className="flex flex-col items-center text-center group"
              >
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 ${
                    step.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-400 shadow-blue-500/20' : 
                    step.color === 'teal' ? 'bg-gradient-to-r from-teal-500 to-teal-400 shadow-teal-500/20' : 
                    step.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-purple-400 shadow-purple-500/20' : 
                    'bg-gradient-to-r from-pink-500 to-pink-400 shadow-pink-500/20'
                  }`}>
                    <div className="text-black">{step.icon}</div>
                </div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-black border border-gray-700 flex items-center justify-center">
                    <span className={`font-bold text-sm ${
                      step.color === 'blue' ? 'text-blue-400' : 
                      step.color === 'teal' ? 'text-teal-400' : 
                      step.color === 'purple' ? 'text-purple-400' : 
                      'text-pink-400'
                    }`}>{step.number}</span>
            </div>
            </div>
                <h3 className={`text-xl font-bold text-white mb-3 transition-colors ${
                  step.color === 'blue' ? 'group-hover:text-blue-400' : 
                  step.color === 'teal' ? 'group-hover:text-teal-400' : 
                  step.color === 'purple' ? 'group-hover:text-purple-400' : 
                  'group-hover:text-pink-400'
                }`}>{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
          </div>
            ))}
        </div>
          
          {/* Real Business Example */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-950 rounded-2xl p-8 border border-gray-800 mt-16">
            <h3 className="text-2xl font-bold text-white mb-6">Real Business Example</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                </div>
                  <h4 className="text-xl text-blue-400 font-medium">Local Coffee Shop</h4>
              </div>
                <p className="text-gray-300 mb-6">
                  A boutique coffee shop wanted to increase monthly revenue by 40% while maintaining quality and customer satisfaction.
                </p>
                <div className="bg-black/30 rounded-xl p-6 border border-gray-800">
                  <h5 className="text-white font-medium mb-3">Ventry Created a Plan With:</h5>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                      <span>Menu optimization based on margin analysis</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                      <span>Targeted local marketing campaign</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Customer loyalty program implementation</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Staff training for upselling techniques</span>
                    </li>
                  </ul>
              </div>
            </div>
            
              <div className="bg-gradient-to-br from-blue-900/20 to-teal-900/20 rounded-xl p-8 border border-gray-800">
                <div className="text-green-400 text-sm font-medium mb-3">RESULTS ACHIEVED</div>
                <h5 className="text-white text-2xl font-bold mb-6">52% Revenue Increase in 5 Months</h5>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Average Transaction Value</span>
                      <span className="text-green-400">+18%</span>
              </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full" style={{width: '68%'}}></div>
            </div>
          </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Customer Return Rate</span>
                      <span className="text-green-400">+32%</span>
        </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full" style={{width: '82%'}}></div>
        </div>
          </div>
            <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Social Media Engagement</span>
                      <span className="text-green-400">+215%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full" style={{width: '95%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
              <Link 
                href="/auth/signup" 
              className="inline-block px-10 py-4 bg-gradient-to-r from-blue-500 to-teal-400 text-black font-medium rounded-xl hover:from-blue-600 hover:to-teal-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
              >
              Create Your Growth Plan Now
              </Link>
            <p className="text-gray-400 mt-4">
              No credit card required. Free during beta.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section - Redesigned */}
      <section id="pricing" className="bg-black py-24 relative">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {mounted && <PricingGradient />}
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-400/20 border border-blue-500/30 text-blue-400 text-sm font-medium mb-4">
              Beta Testing Stage
          </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-3xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-300">Free Access</span> During Beta
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6">
              Join Ventry today and get complete access to all features at no cost during our beta testing stage
            </p>
            
            {/* Beta Testing Stage Banner - Highly Visible */}
            <div className="mb-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 border border-indigo-400/30 shadow-lg shadow-indigo-500/10">
              <div className="flex items-center">
                <div className="mr-4 bg-white rounded-full p-2">
                  <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Limited-Time Offer: FREE During Beta</h4>
                  <p className="text-white/90">All accounts created during our beta testing phase get <span className="font-bold underline">completely free</span> access to all premium features!</p>
                    </div>
                    </div>
                  </div>
          </div>
          
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold text-white mb-4">Future Pricing Plans</h3>
            <p className="text-gray-300 max-w-3xl mx-auto">
              These plans will be available after our beta testing period. Join now to lock in special beta-tester discounts.
            </p>
          </div>
          
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter Plan",
                price: "$29",
                betaNote: "FREE during beta",
                description: "Perfect for small businesses just starting with strategic planning.",
                features: [
                  "One business goal plan per month",
                  "7-day action plans",
                  "Email support",
                  "Basic analytics"
                ],
                cta: "Start Free",
                popular: false,
                color: "blue"
              },
              {
                name: "Pro Plan",
                price: "$79",
                betaNote: "FREE during beta",
                description: "Ideal for growing businesses with multiple strategic initiatives.",
                features: [
                  "Three business goal plans per month",
                  "30-day detailed action plans",
                  "AI business consultation",
                  "Advanced analytics",
                  "Priority support"
                ],
                cta: "Start Free",
                popular: true,
                color: "indigo"
              },
              {
                name: "Enterprise Plan",
                price: "$199",
                betaNote: "FREE during beta",
                description: "Comprehensive solution for established businesses with complex needs.",
                features: [
                  "Unlimited business goal plans",
                  "90-day comprehensive strategies",
                  "Unlimited AI business consultation",
                  "Team collaboration tools",
                  "Custom reporting",
                  "Dedicated account manager"
                ],
                cta: "Start Free",
                popular: false,
                color: "purple"
              }
            ].map((plan, index) => (
              <div 
                key={index}
                className={`rounded-2xl backdrop-blur-sm border p-8 relative ${
                  plan.popular 
                    ? "bg-gradient-to-b from-indigo-900/40 to-indigo-900/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10" 
                    : "bg-black/40 border-gray-800 hover:border-gray-700"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                </div>
                )}
                <div className="mb-5">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-1">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-1">/month</span>
                  </div>
                  <div className="text-indigo-400 font-bold text-sm mb-4">{plan.betaNote}</div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className={`w-5 h-5 mr-2 mt-0.5 ${
                        plan.color === 'blue' ? 'text-blue-400' : 
                        plan.color === 'indigo' ? 'text-indigo-400' : 
                        'text-purple-400'
                      }`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                  plan.color === 'blue' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 
                  plan.color === 'indigo' ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 
                  'bg-purple-600 hover:bg-purple-500 text-white'
                }`}>
                  {plan.cta}
                </button>
              </div>
              ))}
            </div>

          {/* Additional Benefits */}
          <div className="mt-12 flex flex-col md:flex-row justify-center gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-4 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full p-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
              <div>
                <h4 className="text-white font-bold mb-1">Free During Beta</h4>
                <p className="text-gray-400">Complete access at no cost while we perfect the platform</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-4 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full p-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
            </div>
            <div>
                <h4 className="text-white font-bold mb-1">Early Adopter Discount</h4>
                <p className="text-gray-400">Special pricing for beta testers after launch</p>
            </div>
            </div>
          </div>
          
          {/* Legal Disclaimer */}
          <div className="mt-16 p-4 border border-gray-800 rounded-lg bg-gray-900/30">
            <p className="text-xs text-gray-500 leading-relaxed">
              <strong>BETA PROGRAM NOTICE:</strong> During the beta testing phase, all Ventry accounts receive complimentary access to all features at no cost. Upon conclusion of the beta phase, users will be notified before any billing commences. Ventry provides business strategy recommendations based on AI analysis of industry data and best practices. Results may vary based on implementation, market conditions, and other factors outside our control. Ventry is not a substitute for professional business, legal, or financial advice. By using Ventry, you agree that decisions made based on our recommendations are at your own discretion and risk.
            </p>
            </div>
          </div>
      </section>
    </div>
  );
}
