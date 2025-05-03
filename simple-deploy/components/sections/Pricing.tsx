import React from 'react';
import Link from 'next/link';

const Pricing = () => {
  return (
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
            <Link
              href="/auth/signup"
              className={`w-full block py-3 px-6 rounded-lg font-medium transition-all text-center ${
                plan.color === 'blue' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 
                plan.color === 'indigo' ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 
                'bg-purple-600 hover:bg-purple-500 text-white'
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing; 