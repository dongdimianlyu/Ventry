'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBusinessPlan, TimelineTask } from '@/contexts/BusinessPlanContext';

interface BusinessPlanRoadmapProps {
  plan: string;
}

// This interface extends TimelineTask with the additional properties we need
interface ExtendedTask extends TimelineTask {
  status: 'not-started' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
}

const PRIORITY_COLORS = {
  'High': 'bg-red-100 text-red-800 border-red-300',
  'Medium': 'bg-amber-100 text-amber-800 border-amber-300',
  'Low': 'bg-blue-100 text-blue-800 border-blue-300',
};

const CATEGORY_COLORS = {
  'Marketing': 'bg-blue-500',
  'Finance': 'bg-amber-500',
  'Operations': 'bg-green-500',
  'Product': 'bg-purple-500',
  'General': 'bg-gray-500',
};

export default function BusinessPlanRoadmap({ plan }: BusinessPlanRoadmapProps) {
  const { timelineTasks } = useBusinessPlan();
  const [tasks, setTasks] = useState<ExtendedTask[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    // Convert TimelineTask[] to ExtendedTask[] with added properties
    if (timelineTasks && timelineTasks.length > 0) {
      const extendedTasks: ExtendedTask[] = timelineTasks.map(task => {
        // Calculate a due date based on the day number (1-30)
        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + task.day - 1); // Adjust for days from now
        
        // Determine priority based on day (earlier = higher priority)
        let priority: 'low' | 'medium' | 'high' = 'medium';
        if (task.day <= 7) priority = 'high';
        else if (task.day > 21) priority = 'low';
        
        // Map completed property to status
        const status: 'not-started' | 'in-progress' | 'completed' = 
          task.completed ? 'completed' : 'not-started';
        
        return {
          ...task,
          status,
          priority,
          dueDate
        };
      });
      
      setTasks(extendedTasks);
      
      // Calculate overall progress
      const completed = extendedTasks.filter(task => task.status === 'completed').length;
      const progress = Math.round((completed / extendedTasks.length) * 100);
      setOverallProgress(progress);
    } else {
      // Reset tasks when timelineTasks is empty
      setTasks([]);
      setOverallProgress(0);
    }
  }, [timelineTasks]);

  const filteredTasks = tasks.filter(task => {
    if (selectedStatus && task.status !== selectedStatus) return false;
    if (selectedPriority && task.priority !== selectedPriority) return false;
    return true;
  });

  const statusOptions = [
    { value: 'not-started', label: 'Not Started', color: 'bg-gray-400' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
    { value: 'completed', label: 'Completed', color: 'bg-green-500' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-gray-300' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-400' },
    { value: 'high', label: 'High', color: 'bg-red-500' }
  ];

  const handleUpdateStatus = (taskId: string, newStatus: 'not-started' | 'in-progress' | 'completed') => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    
    // Recalculate progress
    const completed = updatedTasks.filter(task => task.status === 'completed').length;
    const progress = Math.round((completed / updatedTasks.length) * 100);
    setOverallProgress(progress);
  };

  return (
    <div className="bg-gray-800/70 rounded-lg border border-gray-700/50 overflow-hidden">
      {/* Filters - only show if we have tasks */}
      {tasks.length > 0 && (
        <>
          <div className="px-6 py-4 border-b border-gray-700/50 flex flex-wrap gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Status Filter</label>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setSelectedStatus(null)} 
                  className={`text-xs px-2 py-1 rounded-md ${!selectedStatus ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'}`}
                >
                  All
                </button>
                {statusOptions.map(option => (
                  <button 
                    key={option.value}
                    onClick={() => setSelectedStatus(selectedStatus === option.value ? null : option.value)}
                    className={`text-xs px-2 py-1 rounded-md flex items-center ${
                      selectedStatus === option.value 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${option.color} mr-1.5`}></span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Priority Filter</label>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setSelectedPriority(null)} 
                  className={`text-xs px-2 py-1 rounded-md ${!selectedPriority ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'}`}
                >
                  All
                </button>
                {priorityOptions.map(option => (
                  <button 
                    key={option.value}
                    onClick={() => setSelectedPriority(selectedPriority === option.value ? null : option.value)}
                    className={`text-xs px-2 py-1 rounded-md flex items-center ${
                      selectedPriority === option.value 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${option.color} mr-1.5`}></span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-gray-800/50 border-b border-gray-700/50 px-6 py-3">
            <div className="flex items-center">
              <div className="w-full">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-gray-300">30-Day Roadmap Progress</span>
                  <span className="text-sm font-medium text-emerald-400">{overallProgress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-blue-500" 
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Tasks List */}
      <div className={tasks.length > 0 ? "max-h-[calc(100vh-420px)] overflow-y-auto" : "p-10"}>
        {tasks.length === 0 ? (
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-400 mb-2">No Timeline Tasks Available</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Your business plan doesn't have any timeline tasks yet. This could be because:
            </p>
            <ul className="text-gray-500 max-w-md mx-auto mb-6 text-left space-y-2">
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>The plan doesn't include a properly formatted day-by-day roadmap</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>The JSON format in the plan might have syntax errors</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>The "Parse Timeline" function hasn't been run yet</span>
              </li>
            </ul>
            <p className="text-gray-500 max-w-md mx-auto">
              Try using the "Refresh Timeline" button above or generate a new plan with the day-by-day plan option.
            </p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-2">No tasks match your filters</div>
            <div className="text-sm text-gray-500">Try adjusting your filter options or create a timeline first</div>
          </div>
        ) : (
          <div className="divide-y divide-gray-700/30">
            {filteredTasks.map(task => (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 hover:bg-gray-700/30"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-gray-200 font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium 
                      ${task.priority === 'high' ? 'bg-red-900/30 text-red-400 border border-red-700/30' : 
                        task.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/30' : 
                        'bg-gray-800 text-gray-400 border border-gray-700/30'}`}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </div>
                    
                    <div className="text-xs text-gray-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Due {task.dueDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700/20">
                  <div className="text-xs text-gray-400">
                    <span className="bg-gray-800 px-2 py-0.5 rounded text-gray-400 border border-gray-700/30">
                      {task.category}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    {statusOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleUpdateStatus(task.id, option.value as 'not-started' | 'in-progress' | 'completed')}
                        className={`text-xs px-2 py-1 rounded flex items-center border ${
                          task.status === option.value 
                            ? `bg-${option.color.split('-')[1]}-900/30 text-${option.color.split('-')[1]}-400 border-${option.color.split('-')[1]}-700/30` 
                            : 'bg-gray-800 text-gray-400 border-gray-700/30 hover:bg-gray-700'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${option.color} mr-1.5`}></span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 