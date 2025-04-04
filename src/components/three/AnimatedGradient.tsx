'use client';

import { motion } from 'framer-motion';

const AnimatedGradient = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gray-950"></div>
      
      {/* Animated gradient blobs */}
      <motion.div 
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-blue-900/10 blur-5xl"
        animate={{ 
          x: [0, 30, 0], 
          y: [0, -20, 0],
          scale: [1, 1.1, 1], 
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
      
      <motion.div 
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-indigo-900/10 blur-5xl"
        animate={{ 
          x: [0, -30, 0], 
          y: [0, 20, 0],
          scale: [1, 1.1, 1], 
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      <motion.div 
        className="absolute top-[30%] right-[5%] w-[40%] h-[40%] rounded-full bg-blue-700/5 blur-5xl"
        animate={{ 
          x: [0, -20, 0], 
          y: [0, 30, 0],
          scale: [1, 1.05, 1], 
        }}
        transition={{ 
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
};

export default AnimatedGradient; 