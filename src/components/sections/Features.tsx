import React from 'react';
import Link from 'next/link';

const Features = () => {
  return (
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
    </div>
  );
};

export default Features; 