'use client';

import React, { useEffect, useState } from 'react';
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

  // Simple text display that preserves newlines and indentation
  const SimplePlanDisplay = () => {
    // Remove any JSON blocks
    const cleanPlan = plan.replace(/```json[\s\S]*?```/g, '');
    
    // Split by paragraphs
    const paragraphs = cleanPlan.split('\n\n').filter(p => p.trim() !== '');
    
    return (
      <div className="plan-content">
        {paragraphs.map((paragraph, index) => {
          // Check if this is a heading
          if (paragraph.startsWith('# ')) {
            return (
              <h1 
                key={index}
                className="text-2xl md:text-3xl font-bold mb-6 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500" 
              >
                {paragraph.replace('# ', '')}
              </h1>
            );
          }
          
          if (paragraph.startsWith('## ')) {
            return (
              <h2 
                key={index}
                className="text-xl md:text-2xl font-semibold mt-8 mb-4 pb-2 text-gray-100 border-b border-gray-700/50" 
              >
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          
          if (paragraph.startsWith('### ')) {
            return (
              <h3 
                key={index}
                className="text-lg md:text-xl font-medium mt-6 mb-3 text-emerald-400" 
              >
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          
          if (paragraph.startsWith('#### ')) {
            return (
              <h4 
                key={index}
                className="text-md md:text-lg font-medium mt-4 mb-2 text-blue-400" 
              >
                {paragraph.replace('#### ', '')}
              </h4>
            );
          }
          
          // Check if this is a list
          if (paragraph.includes('\n- ')) {
            const listItems = paragraph.split('\n- ').filter(item => item.trim());
            return (
              <ul key={index} className="list-disc pl-6 my-4 space-y-2">
                {listItems.map((item, i) => (
                  <li key={i} className="text-gray-300 mb-1">{item}</li>
                ))}
              </ul>
            );
          }
          
          // Regular paragraph
          return (
            <p 
              key={index}
              className="my-3 text-gray-300 leading-relaxed whitespace-pre-wrap" 
            >
              {paragraph}
            </p>
          );
        })}
      </div>
    );
  };

  // Parse daily tasks directly
  const DailyPlanDisplay = () => {
    // Parse JSON tasks if available
    const jsonMatch = plan.match(/```json\s*([\s\S]*?)```/);
    let tasks: any[] = [];
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

    return (
      <div className="daily-plan-display">
        <SimplePlanDisplay />
        
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
        {isStrategicPlan ? <SimplePlanDisplay /> : <DailyPlanDisplay />}
      </div>
    </div>
  );
};

export default BusinessPlanDisplay; 