import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Features = () => {
  const features = [
    {
      id: 1,
      title: "Strategic Business Assessment",
      description: "We analyze your business type, size, location, and goals to understand your unique needs.",
      icon: "/images/assessment.png",
      delay: 0.1,
    },
    {
      id: 2,
      title: "AI-Generated Growth Roadmap",
      description: "Our AI creates a custom growth strategy with specific milestones tailored to your business.",
      icon: "/images/roadmap.png",
      delay: 0.3,
    },
    {
      id: 3,
      title: "Daily Action Plans",
      description: "Transform big goals into manageable daily tasks that build toward your strategic objectives.",
      icon: "/images/daily-plan.png",
      delay: 0.5,
    },
    {
      id: 4,
      title: "Progress Tracking & Adaptation",
      description: "Track your progress while our AI adapts your plan based on results and changing conditions.",
      icon: "/images/tracking.png",
      delay: 0.7,
    },
  ];

  return (
    <section id="features" className="relative bg-gray-950 py-20 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black to-transparent"></div>
      
      <motion.div 
        className="absolute -left-64 top-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        animate={{ 
          opacity: [0.1, 0.15, 0.1], 
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          repeatType: "reverse" 
        }}
      />
      
      <motion.div 
        className="absolute -right-64 bottom-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
        animate={{ 
          opacity: [0.1, 0.15, 0.1], 
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          repeatType: "reverse" 
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-xl text-gray-300"
          >
            Our streamlined process turns complex business growth into simple, actionable steps
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: feature.delay }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 relative overflow-hidden group"
            >
              {/* Animated border on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="flex items-start">
                <div className="mr-5 rounded-lg bg-gradient-to-br from-blue-900/50 to-blue-800/30 p-3">
                  {feature.icon && (
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={36}
                      height={36}
                      className="w-9 h-9 object-contain"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
              
              {/* Step number */}
              <div className="absolute bottom-4 right-4 text-6xl font-bold text-blue-900/20">
                {feature.id}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <a 
            href="/auth/signup" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-400 text-black font-medium rounded-lg hover:shadow-lg hover:from-blue-600 hover:to-teal-500 transition-all duration-300 transform hover:-translate-y-1"
          >
            Get Your Growth Plan
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Features; 