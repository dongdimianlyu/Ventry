'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useBusinessPlan } from '@/contexts/BusinessPlanContext';

interface BusinessPlanDisplayProps {
  plan: string;
  businessType: string;
}

const BusinessPlanDisplay: React.FC<BusinessPlanDisplayProps> = ({ plan, businessType }) => {
  const { planType } = useBusinessPlan();
  const [isStrategicPlan, setIsStrategicPlan] = useState(true);

  useEffect(() => {
    setIsStrategicPlan(planType === 'strategic');
  }, [planType]);

  // Custom renderer for headings
  const customRenderers = {
    h1: ({ node, ...props }: any) => (
      <h1 
        className="text-2xl md:text-3xl font-bold mb-6 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500" 
        {...props} 
      />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 
        className="text-xl md:text-2xl font-semibold mt-8 mb-4 pb-2 text-gray-100 border-b border-gray-700/50" 
        {...props} 
      />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 
        className="text-lg md:text-xl font-medium mt-6 mb-3 text-emerald-400" 
        {...props} 
      />
    ),
    h4: ({ node, ...props }: any) => (
      <h4 
        className="text-md md:text-lg font-medium mt-4 mb-2 text-blue-400" 
        {...props} 
      />
    ),
    p: ({ node, ...props }: any) => (
      <p 
        className="my-3 text-gray-300 leading-relaxed" 
        {...props} 
      />
    ),
    ul: ({ node, ...props }: any) => (
      <ul 
        className="list-disc pl-6 my-4 space-y-2" 
        {...props} 
      />
    ),
    ol: ({ node, ...props }: any) => (
      <ol 
        className="list-decimal pl-6 my-4 space-y-2" 
        {...props} 
      />
    ),
    li: ({ node, ...props }: any) => (
      <li 
        className="text-gray-300 mb-1" 
        {...props} 
      />
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      if (inline) {
        return (
          <code 
            className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 text-sm font-mono" 
            {...props}
          >
            {children}
          </code>
        );
      }
      
      const codeContent = String(children).replace(/\n$/, '');
      
      // If this is JSON content, we want to hide it (it's the tasks for timeline)
      if (codeContent.includes('"dailyTasks"')) {
        return null;
      }
      
    return (
        <pre className="rounded-lg bg-gray-900/40 p-4 my-4 overflow-x-auto border border-gray-700/50">
          <code 
            className="text-sm font-mono text-gray-300"
            {...props}
          >
            {codeContent}
          </code>
        </pre>
      );
    },
    blockquote: ({ node, ...props }: any) => (
      <blockquote 
        className="border-l-4 border-emerald-500/50 pl-4 italic my-4 text-gray-400" 
        {...props} 
      />
    ),
    table: ({ node, ...props }: any) => (
      <div className="overflow-x-auto my-6">
        <table 
          className="min-w-full divide-y divide-gray-700 border border-gray-700 rounded-lg" 
          {...props} 
        />
      </div>
    ),
    thead: ({ node, ...props }: any) => (
      <thead 
        className="bg-gray-800" 
        {...props} 
      />
    ),
    tbody: ({ node, ...props }: any) => (
      <tbody 
        className="divide-y divide-gray-700 bg-gray-900/30" 
        {...props} 
      />
    ),
    tr: ({ node, ...props }: any) => (
      <tr 
        className="hover:bg-gray-800/50 transition-colors duration-150" 
        {...props} 
      />
    ),
    th: ({ node, ...props }: any) => (
      <th 
        className="px-4 py-3 text-left text-sm font-medium text-gray-200 uppercase tracking-wider" 
        {...props} 
      />
    ),
    td: ({ node, ...props }: any) => (
      <td 
        className="px-4 py-3 text-sm text-gray-300" 
        {...props} 
      />
    ),
  };

  // Strategic Plan specific styling
  const StrategicPlanDisplay = () => (
    <div className="strategic-plan-display">
      <ReactMarkdown components={customRenderers}>{plan}</ReactMarkdown>
    </div>
  );

  // Daily Plan specific styling with custom task rendering
  const DailyPlanDisplay = () => {
    // Parse JSON tasks if available
    const jsonMatch = plan.match(/```json\s*([\s\S]*?)```/);
    let tasks = [];
    let hasTasksJson = false;
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        // Clean the JSON string and parse it
        let jsonString = jsonMatch[1].replace(/\/\/.*$/gm, '').replace(/,(\s*[\]}])/g, '$1');
        const taskData = JSON.parse(jsonString);
        
        if (taskData.dailyTasks && Array.isArray(taskData.dailyTasks)) {
          tasks = taskData.dailyTasks;
          hasTasksJson = true;
        }
      } catch (e) {
        console.error("Error parsing JSON tasks:", e);
      }
    }

    // Split the plan content for sections outside of the JSON tasks
    const planContent = plan.replace(/```json[\s\S]*?```/, '');

    return (
      <div className="daily-plan-display">
        <ReactMarkdown components={customRenderers}>{planContent}</ReactMarkdown>
        
        {hasTasksJson && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-emerald-400">Day-by-Day Tasks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task: any) => (
                <div 
                  key={`task-${task.day}`}
                  className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 hover:border-emerald-500/40 transition-all duration-200 shadow-md backdrop-blur-sm flex flex-col"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-emerald-900/40 text-emerald-400 px-2 py-1 rounded text-xs font-medium">
                      Day {task.day}
                    </span>
                    {task.priority && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        task.priority.toLowerCase() === 'high' 
                          ? 'bg-red-900/30 text-red-400' 
                          : task.priority.toLowerCase() === 'medium'
                            ? 'bg-amber-900/30 text-amber-400'
                            : 'bg-blue-900/30 text-blue-400'
                      }`}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-medium text-gray-200 mb-2">{task.title}</h4>
                  <p className="text-gray-400 text-sm flex-grow">{task.description}</p>
                  {task.category && (
                    <div className="mt-3 pt-3 border-t border-gray-700/50">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        task.category.toLowerCase().includes('market') 
                          ? 'bg-blue-900/30 text-blue-400 border border-blue-800/30' 
                          : task.category.toLowerCase().includes('financ')
                            ? 'bg-amber-900/30 text-amber-400 border border-amber-800/30'
                            : task.category.toLowerCase().includes('product')
                              ? 'bg-purple-900/30 text-purple-400 border border-purple-800/30'
                              : 'bg-green-900/30 text-green-400 border border-green-800/30'
                      }`}>
                        {task.category}
            </span>
          </div>
        )}
                </div>
              ))}
            </div>
          </div>
        )}
          </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="prose prose-invert max-w-none custom-scrollbar-dark">
        {isStrategicPlan ? <StrategicPlanDisplay /> : <DailyPlanDisplay />}
        </div>
    </div>
  );
};

export default BusinessPlanDisplay; 