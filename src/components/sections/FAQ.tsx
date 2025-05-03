import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-700 last:border-b-0">
      <button
        className="flex justify-between items-center w-full py-6 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-white">{question}</h3>
        <span className={`ml-6 flex-shrink-0 text-indigo-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
      >
        <div className="text-gray-300 leading-relaxed">{answer}</div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const faqs: FAQItemProps[] = [
    {
      question: "What is Ventry?",
      answer: (
        <p>
          Ventry is an AI-powered business planning platform that helps entrepreneurs and business owners create actionable strategic plans. We combine advanced AI with business expertise to convert your high-level goals into concrete, day-by-day action plans customized for your specific industry and business size.
        </p>
      )
    },
    {
      question: "How does the Business Goal Planner work?",
      answer: (
        <div className="space-y-2">
          <p>
            Our Business Goal Planner takes your high-level business objectives and breaks them down into actionable steps:
          </p>
          <ol className="list-decimal list-inside pl-4 space-y-1">
            <li>Enter your specific business goal</li>
            <li>Provide basic details about your company and industry</li>
            <li>Our AI analyzes your goal and creates a custom action plan</li>
            <li>Receive a day-by-day breakdown of tasks to accomplish your goal</li>
            <li>Track progress and adjust as needed</li>
          </ol>
        </div>
      )
    },
    {
      question: "Is Ventry really free during beta?",
      answer: (
        <p>
          Yes! During our beta testing phase, all Ventry features are completely free. This includes the Business Goal Planner, Strategic Advisor, and all premium features that will later be part of our paid plans. By joining during the beta, you'll also be eligible for special discounts when we launch our paid tiers.
        </p>
      )
    },
    {
      question: "How accurate are the AI-generated business plans?",
      answer: (
        <p>
          Our AI is trained on best practices from thousands of successful businesses across various industries. The plans are designed to be practical and realistic, drawing on proven business strategies. That said, the quality of output depends partly on the specificity of your inputs. We continuously improve our AI models based on user feedback during this beta phase.
        </p>
      )
    },
    {
      question: "Can I use Ventry for different types of businesses?",
      answer: (
        <p>
          Absolutely! Ventry is designed to work with businesses of all sizes and across all industries. Whether you're a solo entrepreneur, a small business, or managing a larger company, our AI adapts its recommendations to suit your specific context. We have specialized knowledge for retail, SaaS, service businesses, manufacturing, and many other sectors.
        </p>
      )
    },
    {
      question: "How is my business data handled?",
      answer: (
        <div className="space-y-2">
          <p>
            We take data privacy extremely seriously. All your business information is:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>Encrypted in transit and at rest</li>
            <li>Never shared with third parties</li>
            <li>Used only to generate your personalized plans</li>
            <li>Stored securely in compliance with industry standards</li>
          </ul>
          <p>You can request deletion of your data at any time through your account settings.</p>
        </div>
      )
    },
    {
      question: "What happens after the beta period ends?",
      answer: (
        <p>
          After our beta period concludes, we'll transition to our tiered pricing model as shown in the Pricing section. However, all beta users will receive special benefits as a thank you for your early support. These include a significant discount on paid plans and certain premium features that will remain free for beta users.
        </p>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      <div className="text-center mb-12">
        <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-400/20 border border-purple-500/30 text-purple-400 text-sm font-medium mb-4">
          FAQ
        </div>
        <h2 className="text-4xl font-bold text-white">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
          Got questions? We've got answers. If you don't see what you're looking for, reach out to our team.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto divide-y divide-gray-700 rounded-2xl backdrop-blur-sm border border-gray-800 bg-black/30 p-6">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-gray-300">
          Still have questions? <a href="/contact" className="text-indigo-400 hover:text-indigo-300 font-medium">Contact our team</a>
        </p>
      </div>
    </div>
  );
};

export default FAQ; 