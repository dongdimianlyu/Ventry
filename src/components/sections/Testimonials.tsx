import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TestimonialProps {
  testimonials?: Array<{
    quote: string;
    author: string;
    position?: string;
    avatar?: string;
  }>;
  activeTestimonial?: number;
}

const defaultTestimonials = [
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

const Testimonials: React.FC<TestimonialProps> = ({ 
  testimonials = defaultTestimonials,
  activeTestimonial: initialActiveTestimonial = 0
}) => {
  const [activeTestimonial, setActiveTestimonial] = useState(initialActiveTestimonial);
  
  // Auto-rotate testimonials
  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(intervalId);
  }, [testimonials.length]);
  
  return (
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
        {/* Testimonial Cards */}
        <div className="flex justify-center mb-16 min-h-[300px]">
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
              <div className="p-8 md:p-10">
                <div className="flex items-center mb-6">
                  {testimonial.avatar && (
                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white/10 mr-4">
                      <img src={testimonial.avatar} alt={testimonial.author} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <div className="text-white font-bold text-lg">{testimonial.author}</div>
                    {testimonial.position && (
                      <div className="text-gray-400 text-sm">{testimonial.position}</div>
                    )}
                  </div>
                </div>

                <blockquote>
                  <svg className="w-10 h-10 text-purple-500/30 mb-4" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path>
                  </svg>
                  <p className="text-xl text-gray-200 italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
                </blockquote>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Testimonial Navigation Dots */}
        <div className="flex justify-center space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none ${
                index === activeTestimonial 
                  ? 'bg-purple-500 scale-110' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`View testimonial ${index + 1}`}
              onClick={() => setActiveTestimonial(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials; 