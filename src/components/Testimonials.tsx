import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface TestimonialsProps {
  currentTestimonial: number;
  setCurrentTestimonial: React.Dispatch<React.SetStateAction<number>>;
}

const Testimonials: React.FC<TestimonialsProps> = ({ 
  currentTestimonial, 
  setCurrentTestimonial 
}) => {
  const testimonials = [
    {
      quote: "Ventry helped me grow my retail store revenue by 32% in just 4 months. The daily action steps kept me focused on high-impact activities instead of getting lost in day-to-day operations.",
      author: "Sarah Martinez",
      position: "Owner, Bloom Boutique",
      avatar: "/images/avatars/sarah.jpg"
    },
    {
      quote: "As a solo consultant trying to scale, Ventry's roadmap showed me exactly where to focus. I've doubled my client base and increased my rates without working more hours.",
      author: "Michael Jordan",
      position: "Financial Consultant",
      avatar: "/images/avatars/michael.jpg"
    },
    {
      quote: "The strategic advisor helped me identify a completely untapped market segment. We've completely repositioned our services and seen a 45% increase in new clients.",
      author: "Amelia Wong",
      position: "Co-founder, ClearPath Accounting",
      avatar: "/images/avatars/amelia.jpg"
    }
  ];

  return (
    <section className="bg-black py-20 md:py-32 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      
      <motion.div 
        className="absolute -right-40 top-10 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"
        animate={{ 
          opacity: [0.05, 0.1, 0.05], 
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          repeatType: "reverse" 
        }}
      />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400"
          >
            Success Stories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-xl text-gray-300"
          >
            See how businesses just like yours are growing with Ventry
          </motion.p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div className="flex flex-col">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-opacity duration-500 ${
                    index === currentTestimonial ? 'opacity-100' : 'hidden'
                  }`}
                >
                  <motion.div 
                    className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-8 md:p-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center mb-6">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-800 mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                        <Image
                          src={testimonial.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.author)}&background=random`}
                          alt={testimonial.author}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // @ts-ignore
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.author)}&background=random`;
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{testimonial.author}</h3>
                        <p className="text-blue-400">{testimonial.position}</p>
                      </div>
                    </div>
                    <p className="text-lg md:text-xl text-gray-300 italic leading-relaxed">"{testimonial.quote}"</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Dots/navigation */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setCurrentTestimonial(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 