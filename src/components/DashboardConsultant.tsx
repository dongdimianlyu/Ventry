'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  recommendations?: Recommendation[];
  insights?: Insight[];
};

type Recommendation = {
  id: string;
  title: string;
  description: string;
  steps: string[];
  impact: string;
  timeframe: string;
};

type Insight = {
  id: string;
  title: string;
  description: string;
  metrics: {
    label: string;
    value: string;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
  }[];
};

type DashboardConsultantProps = {
  businessContext?: string;
  businessLocation?: string;
};

// Simplified TypewriterText component without ReactMarkdown
const TypewriterText = ({ content }: { content: string }) => {
  // Split content into paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim() !== '');
  
  return (
    <div className="prose prose-invert max-w-none">
      {paragraphs.map((paragraph, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.2 }}
          className="my-4"
        >
          <p className="text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">
            {paragraph}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

const LoadingIndicator = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse opacity-20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      <div className="text-gray-400 text-sm font-medium">Generating response...</div>
      <div className="mt-4 w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-progress"></div>
      </div>
      <div className="mt-2 text-xs text-gray-500">This may take a few moments</div>
    </div>
  );
};

// Navigation tabs component
const NavigationTabs = ({ activeView, setActiveView }: { 
  activeView: 'chat' | 'insights' | 'recommendations';
  setActiveView: (view: 'chat' | 'insights' | 'recommendations') => void;
}) => {
  return (
    <div className="flex space-x-1 p-1 bg-gray-800/50 rounded-xl border border-gray-700/50">
      <button
        onClick={() => setActiveView('chat')}
        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeView === 'chat'
            ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10'
            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
        }`}
      >
        Chat
      </button>
      <button
        onClick={() => setActiveView('insights')}
        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeView === 'insights'
            ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10'
            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
        }`}
      >
        Insights
      </button>
      <button
        onClick={() => setActiveView('recommendations')}
        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeView === 'recommendations'
            ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10'
            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
        }`}
      >
        Recommendations
      </button>
    </div>
  );
};

export default function DashboardConsultant({ 
  businessContext = '', 
  businessLocation = '' 
}: DashboardConsultantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState('');
  const [contextSet, setContextSet] = useState(!!businessContext);
  const [localBusinessContext, setLocalBusinessContext] = useState(businessContext);
  const [localBusinessLocation, setLocalBusinessLocation] = useState(businessLocation);
  const [activeView, setActiveView] = useState<'chat' | 'insights' | 'recommendations'>('chat');
  const [newResponseId, setNewResponseId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample demo data for UI display
  const demoRecommendations: Recommendation[] = [
    {
      id: 'rec-1',
      title: 'Optimize Digital Marketing Strategy',
      description: 'Reallocate budget to high-performing channels based on customer acquisition cost analysis.',
      steps: [
        'Analyze performance metrics across all digital channels',
        'Identify channels with lowest customer acquisition costs',
        'Reallocate 30% of budget from underperforming to high-performing channels',
        'Implement A/B testing on ad creative for top channels'
      ],
      impact: 'Potential 25% increase in marketing ROI',
      timeframe: 'Implementation: 2-4 weeks'
    },
    {
      id: 'rec-2',
      title: 'Implement Customer Loyalty Program',
      description: 'Increase customer retention through tiered rewards system.',
      steps: [
        'Design loyalty program tiers and benefits',
        'Select and implement loyalty platform',
        'Create email campaign announcing program',
        'Train staff on program details and benefits'
      ],
      impact: 'Projected 15% increase in repeat purchases',
      timeframe: 'Implementation: 1-2 months'
    }
  ];

  const demoInsights: Insight[] = [
    {
      id: 'ins-1',
      title: 'Customer Retention Analysis',
      description: 'Analysis of customer retention metrics compared to industry benchmarks.',
      metrics: [
        { label: 'Customer Retention Rate', value: '68%', change: '+3%', trend: 'up' },
        { label: 'Average Order Value', value: '$58.60', change: '+$4.20', trend: 'up' },
        { label: 'Industry Benchmark', value: '65%', trend: 'neutral' }
      ]
    },
    {
      id: 'ins-2',
      title: 'Market Positioning',
      description: 'Competitive analysis based on price point and service quality.',
      metrics: [
        { label: 'Price Competitiveness', value: 'Mid-tier', trend: 'neutral' },
        { label: 'Service Quality Rating', value: '4.2/5', change: '+0.3', trend: 'up' },
        { label: 'Market Share', value: '12%', change: '+2%', trend: 'up' }
      ]
    }
  ];

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle business context form submission
  const handleContextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localBusinessContext) {
      // Save to localStorage
      localStorage.setItem('businessContext', localBusinessContext);
      if (localBusinessLocation) {
        localStorage.setItem('businessLocation', localBusinessLocation);
      }
      
      setContextSet(true);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendingMessage) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSendingMessage(true);
    
    try {
      // For demo purposes, simulate a response after a delay
      setTimeout(() => {
        const demoResponse: Message = {
          role: 'assistant',
          content: `Based on your query about "${input}" for your ${localBusinessContext} business in ${localBusinessLocation || 'your area'}, here are some insights:\n\nThis is a simulated response for demonstration purposes. In a production environment, this would connect to an AI service to provide tailored business advice.`,
          recommendations: demoRecommendations,
          insights: demoInsights
        };
        
        setMessages(prev => [...prev, demoResponse]);
        setSendingMessage(false);
        setNewResponseId(messages.length + 1);
      }, 2000);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to get a response. Please try again.');
      setSendingMessage(false);
    }
  };

  // Business context form if not already set
  if (!contextSet) {
    return (
      <div className="p-6 bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800 shadow-2xl max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-400 mb-6">Business Context</h2>
        <p className="text-gray-400 mb-6">
          To provide you with personalized advice, I need to understand your business context.
          Please provide some basic information about your business:
        </p>
        
        <form onSubmit={handleContextSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              What type of business do you run?
            </label>
            <input
              type="text"
              value={localBusinessContext}
              onChange={(e) => setLocalBusinessContext(e.target.value)}
              placeholder="e.g., Coffee shop, SaaS startup, Consulting firm"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Where is your business located? (Optional)
            </label>
            <input
              type="text"
              value={localBusinessLocation}
              onChange={(e) => setLocalBusinessLocation(e.target.value)}
              placeholder="e.g., New York, London, Online only"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Get Started
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Navigation Tabs */}
      <div className="mb-4">
        <NavigationTabs activeView={activeView} setActiveView={setActiveView} />
      </div>
      
      {/* Chat View */}
      {activeView === 'chat' && (
        <div className="flex flex-col h-full">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 rounded-t-xl bg-gray-900/30">
            {messages.length === 0 ? (
              <div className="py-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-blue-400 mb-2">Strategic Business Advisor</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Ask me about growth strategies, market analysis, customer acquisition, or any business challenges you're facing.
                </p>
                
                <div className="mt-6 space-y-2">
                  <button 
                    onClick={() => setInput("What are the most effective customer acquisition strategies for a business like mine?")}
                    className="w-full text-left px-4 py-3 bg-gray-800/70 hover:bg-gray-700/70 rounded-lg text-gray-300 transition"
                  >
                    What are the most effective customer acquisition strategies for a business like mine?
                  </button>
                  <button 
                    onClick={() => setInput("How can I differentiate my business from competitors?")}
                    className="w-full text-left px-4 py-3 bg-gray-800/70 hover:bg-gray-700/70 rounded-lg text-gray-300 transition"
                  >
                    How can I differentiate my business from competitors?
                  </button>
                  <button 
                    onClick={() => setInput("What metrics should I be tracking for my business type?")}
                    className="w-full text-left px-4 py-3 bg-gray-800/70 hover:bg-gray-700/70 rounded-lg text-gray-300 transition"
                  >
                    What metrics should I be tracking for my business type?
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`px-4 py-3 rounded-xl max-w-[85%] ${
                        message.role === 'user' 
                          ? 'bg-blue-600/20 border border-blue-500/30 text-blue-100' 
                          : 'bg-gray-800/70 border border-gray-700/50 text-gray-200'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      ) : (
                        <TypewriterText content={message.content} />
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {sendingMessage && (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 rounded-xl max-w-[85%] bg-gray-800/70 border border-gray-700/50">
                      <LoadingIndicator />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Input Form */}
          <div className="p-4 border-t border-gray-800 bg-gray-800/50 rounded-b-xl">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about business strategy, market analysis, or growth tactics..."
                className="flex-1 bg-gray-700/70 border border-gray-600/50 rounded-lg px-4 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={sendingMessage}
              />
              <button
                type="submit"
                disabled={sendingMessage || !input.trim()}
                className={`p-2 rounded-lg ${
                  sendingMessage || !input.trim()
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-800'
                } transition-all duration-200`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Insights View */}
      {activeView === 'insights' && (
        <div className="bg-gray-900/30 rounded-xl p-6 space-y-6">
          {demoInsights.map(insight => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-700/50">
                <h3 className="text-lg font-medium text-blue-400">{insight.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{insight.description}</p>
              </div>
              
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {insight.metrics.map((metric, i) => (
                  <div key={i} className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs font-medium">{metric.label}</p>
                    <div className="flex items-baseline mt-1">
                      <p className="text-xl font-semibold text-gray-200">{metric.value}</p>
                      {metric.change && (
                        <span className={`ml-2 text-xs font-medium ${
                          metric.trend === 'up' ? 'text-green-500' : 
                          metric.trend === 'down' ? 'text-red-500' : 
                          'text-gray-500'
                        }`}>
                          {metric.change}
                          {metric.trend === 'up' && ' ↑'}
                          {metric.trend === 'down' && ' ↓'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Recommendations View */}
      {activeView === 'recommendations' && (
        <div className="bg-gray-900/30 rounded-xl p-6 space-y-6">
          {demoRecommendations.map(recommendation => (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-700/50">
                <h3 className="text-lg font-medium text-blue-400">{recommendation.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{recommendation.description}</p>
              </div>
              
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Implementation Steps:</h4>
                <ul className="space-y-2 mb-4">
                  {recommendation.steps.map((step, i) => (
                    <li key={i} className="flex items-start">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs mr-2 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-gray-300 text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-500">Impact</p>
                    <p className="text-sm text-blue-400 font-medium mt-1">{recommendation.impact}</p>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-500">Timeframe</p>
                    <p className="text-sm text-purple-400 font-medium mt-1">{recommendation.timeframe}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 