'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
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

// Add a new TypewriterText component for animated responses
const TypewriterText = ({ content }: { content: string }) => {
  // Split content into paragraphs and sections
  const sections = content.split('\n\n').filter(p => p.trim() !== '');
  
  return (
    <div className="prose prose-invert max-w-none">
      {sections.map((section, sIndex) => {
        // Check if this is a list section
        const isList = section.trim().startsWith('-') || section.trim().startsWith('*');
        
        return (
          <motion.div
            key={sIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: sIndex * 0.2 }}
            className={`${
              isList 
                ? 'bg-gray-800/30 rounded-xl p-4 border border-gray-700/50 my-2' 
                : 'my-4'
            }`}
          >
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-3">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 text-gray-300">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-300 leading-relaxed">
                    {children}
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="text-blue-400 font-semibold">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="text-cyan-400 italic">
                    {children}
                  </em>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-800/50 px-1.5 py-0.5 rounded text-sm font-mono text-blue-400">
                    {children}
                  </code>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500/50 pl-4 italic text-gray-400 my-4">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {section}
            </ReactMarkdown>
          </motion.div>
        );
      })}
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

// Add this new component for the navigation tabs
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
        { label: 'Quality Perception', value: '4.2/5', change: '+0.3', trend: 'up' },
        { label: 'Market Share', value: '12%', change: '+1.5%', trend: 'up' }
      ]
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeView]);

  useEffect(() => {
    // Initialize with welcome message if context is already set
    if (contextSet && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: 'Welcome to your strategic consulting session. I\'m ready to help solve your business challenges with actionable insights. What specific challenge or opportunity would you like to discuss today?',
          recommendations: demoRecommendations,
          insights: demoInsights
        }
      ]);
    }
  }, [contextSet, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localBusinessContext.trim()) {
      localStorage.setItem('businessContext', localBusinessContext);
      if (localBusinessLocation) {
        localStorage.setItem('businessLocation', localBusinessLocation);
      }
      setContextSet(true);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendingMessage) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSendingMessage(true);
    setError('');
    setNewResponseId(null);

    // Scroll to bottom immediately after user sends message
    setTimeout(() => scrollToBottom(), 100);

    try {
      // Format messages for API
      const consultantPrompt = `As an expert business strategist, provide concise, actionable insights for this business: (${localBusinessContext}). Respond to: "${input}"${localBusinessLocation ? ` in ${localBusinessLocation}` : ''}. Keep your response under 200 words, focusing on practical, strategic advice with clear action steps. If you need more information, ask 1-2 brief questions.`;
      
      // If this is the first user message, use the consultant prompt template
      // Otherwise use the regular message format for conversation continuity
      const formattedMessages = messages.map(msg => ({ role: msg.role, content: msg.content }));
      
      // Add user message, but if it's the first message, don't add it directly since we're using the prompt template
      if (formattedMessages.length > 1) {
        formattedMessages.push({ role: 'user', content: input });
      }
      
      // For the first message, use the consultant prompt template that includes user context and message
      if (formattedMessages.length <= 1) {
        formattedMessages.push({ role: 'user', content: consultantPrompt });
      }

      // Add artificial delay for better UX (1-3 seconds)
      const minDelay = 1000;
      const artificialDelay = Math.random() * 1500 + minDelay;
      
      const responsePromise = fetch('/api/ai-consultant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: formattedMessages,
          businessContext: localBusinessContext,
          businessLocation: localBusinessLocation,
        }),
      });
      
      // Wait for both the response and the minimum delay
      const [response] = await Promise.all([
        responsePromise,
        new Promise(resolve => setTimeout(resolve, artificialDelay))
      ]);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Get the new response ID (to highlight it with animation)
      const newId = messages.length;
      
      // Add AI response to messages with demo recommendations and insights
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: data.message.content,
          recommendations: demoRecommendations,
          insights: demoInsights 
        }
      ]);
      
      // Set the ID of the new response for animation effects
      setNewResponseId(newId);
      
      // Play a subtle sound effect when the response arrives
      const audio = new Audio('/sounds/message-received.mp3');
      audio.volume = 0.2;
      try {
        await audio.play();
      } catch (audioErr) {
        // Silent fail if the browser blocks autoplay
        console.log('Audio playback blocked by browser policy');
      }
      
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setSendingMessage(false);
      // Scroll to bottom after response arrives
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-800/50">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          AI Business Consultant
        </h2>
        <p className="text-gray-400 mt-1">
          Get expert advice and strategic recommendations for your business
        </p>
      </div>

      {/* Navigation */}
      <div className="px-6 py-4">
        <NavigationTabs activeView={activeView} setActiveView={setActiveView} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeView === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-6 p-6">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 ${
                          message.role === 'user'
                            ? 'bg-blue-500/10 border border-blue-500/20'
                            : 'bg-gray-800/50 border border-gray-700/50'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <p className="text-gray-200">{message.content}</p>
                        ) : (
                          <TypewriterText content={message.content} />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {sendingMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%] rounded-2xl p-4 bg-gray-800/50 border border-gray-700/50">
                      <LoadingIndicator />
                    </div>
                  </motion.div>
                )}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="flex justify-center"
                  >
                    <div className="bg-red-900/30 border border-red-700/50 text-red-400 px-6 py-4 rounded-lg flex items-center space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>Error: {error}. Please try again.</span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <div className="p-6 border-t border-gray-800/50">
                <form onSubmit={handleSendMessage} className="flex space-x-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask your business question..."
                    className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                    disabled={sendingMessage}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || sendingMessage}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      !input.trim() || sendingMessage
                        ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                    }`}
                  >
                    {sendingMessage ? 'Sending...' : 'Send'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {activeView === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full overflow-y-auto p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {demoInsights.map((insight) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
                  >
                    <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-3">
                      {insight.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{insight.description}</p>
                    <div className="space-y-3">
                      {insight.metrics.map((metric, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-400">{metric.label}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-200 font-medium">{metric.value}</span>
                            {metric.change && (
                              <span className={`text-sm ${
                                metric.trend === 'up' ? 'text-green-400' :
                                metric.trend === 'down' ? 'text-red-400' :
                                'text-gray-400'
                              }`}>
                                {metric.change}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeView === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full overflow-y-auto p-6"
            >
              <div className="grid grid-cols-1 gap-6">
                {demoRecommendations.map((rec) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
                  >
                    <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-3">
                      {rec.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{rec.description}</p>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Implementation Steps:</h4>
                        <ul className="list-disc list-inside space-y-2 text-gray-400">
                          {rec.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
                        <div>
                          <span className="text-sm text-gray-400">Impact:</span>
                          <p className="text-green-400 font-medium">{rec.impact}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">Timeframe:</span>
                          <p className="text-blue-400 font-medium">{rec.timeframe}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 