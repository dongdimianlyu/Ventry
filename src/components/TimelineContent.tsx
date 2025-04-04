'use client';

import { useState, useEffect, useCallback } from 'react';
import { useBusinessPlan, TimelineTask } from '@/contexts/BusinessPlanContext';
import { motion } from 'framer-motion';

export default function TimelineContent() {
  const { timelineTasks, markTaskCompleted, moveOverdueTasksToCurrentDay } = useBusinessPlan();
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredTasks, setFilteredTasks] = useState<TimelineTask[]>([]);
  const [today, setToday] = useState(new Date());
  const [currentDay, setCurrentDay] = useState(1);
  
  // Set up timer to check for task continuation
  useEffect(() => {
    // Get the current day (1-indexed)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysSinceStart = Math.floor((now.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    setCurrentDay(daysSinceStart);
    
    // Check for incomplete tasks daily
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    midnight.setDate(midnight.getDate() + 1);
    
    const timeUntilMidnight = midnight.getTime() - now.getTime();
    
    // Set timeout for midnight check
    const timer = setTimeout(() => {
      handleTaskContinuation();
      setToday(new Date());
    }, timeUntilMidnight);
    
    return () => clearTimeout(timer);
  }, [today]);
  
  // Handle task continuation (move incomplete tasks to the next day)
  const handleTaskContinuation = useCallback(() => {
    // Get the current day (1-indexed)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysSinceStart = Math.floor((now.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Use the context function to move overdue tasks
    moveOverdueTasksToCurrentDay(daysSinceStart);
  }, [moveOverdueTasksToCurrentDay]);
  
  // Group tasks by week using a more robust approach
  const groupTasksByWeek = useCallback(() => {
    const grouped: Record<number, TimelineTask[]> = {};
    // Ensure we have a unique set of tasks based on ID
    const uniqueTasks = filteredTasks.reduce<Record<string, TimelineTask>>((acc, task) => {
      acc[task.id] = task;
      return acc;
    }, {});
    
    // Convert back to array and group by week
    Object.values(uniqueTasks).forEach(task => {
      const week = task.week || Math.ceil(task.day / 7);
      if (!grouped[week]) {
        grouped[week] = [];
      }
      grouped[week].push(task);
    });
    
    return grouped;
  }, [filteredTasks]);
  
  const tasksByWeek = groupTasksByWeek();

  // Sort weeks
  const sortedWeeks = Object.keys(tasksByWeek)
    .map(Number)
    .sort((a, b) => a - b);

  // Apply filters to tasks whenever active filter changes
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredTasks([...timelineTasks]); // Create a new array to force re-render
    } else {
      const filtered = timelineTasks.filter(task => 
        task.category.toLowerCase() === activeFilter.toLowerCase()
      );
      setFilteredTasks(filtered);
    }
  }, [activeFilter, timelineTasks]);

  // Get category color based on task category
  const getCategoryColor = (category: string) => {
    const lowerCategory = category.toLowerCase();
    switch (lowerCategory) {
      case 'marketing':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800'
        };
      case 'operations':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800'
        };
      case 'finance':
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-800'
        };
      case 'product':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-800'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800'
        };
    }
  };

  // Get the background color for the timeline dot
  const getTimelineDotColor = (category: string) => {
    const lowerCategory = category.toLowerCase();
    switch (lowerCategory) {
      case 'marketing':
        return 'bg-blue-100';
      case 'operations':
        return 'bg-green-100';
      case 'finance':
        return 'bg-amber-100';
      case 'product':
        return 'bg-purple-100';
      default:
        return 'bg-gray-100';
    }
  };

  // Get the inner dot color
  const getInnerDotColor = (category: string) => {
    const lowerCategory = category.toLowerCase();
    switch (lowerCategory) {
      case 'marketing':
        return 'bg-blue-600';
      case 'operations':
        return 'bg-green-600';
      case 'finance':
        return 'bg-amber-600';
      case 'product':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  // Handle task completion toggle
  const handleTaskCompleted = (taskId: string, completed: boolean) => {
    markTaskCompleted(taskId, completed);
  };

  // Determine if a task is overdue
  const isTaskOverdue = (task: TimelineTask) => {
    return task.day < currentDay && !task.completed;
  };

  // Get week title by analyzing the tasks
  const getWeekTitle = (weekNumber: number, tasks: TimelineTask[]) => {
    if (!tasks || tasks.length === 0) return `Week ${weekNumber}`;
    
    // Sort tasks by day to ensure we're using the earliest tasks for the title
    const weekTasks = [...tasks].sort((a, b) => a.day - b.day);
    
    // Try to find a common theme in the tasks for this week
    const taskTitles = weekTasks.map(t => t.title);
    const commonKeywords = [
      'foundation', 'setup', 'planning', 'launch', 
      'growth', 'scale', 'marketing', 'operations',
      'review', 'analyze', 'development', 'expansion'
    ];
    
    for (const keyword of commonKeywords) {
      if (taskTitles.some(title => title?.toLowerCase().includes(keyword))) {
        return `Week ${weekNumber}: ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`;
      }
    }
    
    // Default to first task's title if no keyword matched
    if (weekTasks[0]?.title?.includes('-')) {
      const titleParts = weekTasks[0].title.split('-');
      return `Week ${weekNumber}: ${titleParts[0].trim()}`;
    }
    
    return `Week ${weekNumber}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-indigo-700 text-transparent bg-clip-text">30-Day Timeline</h1>
            <div className="flex space-x-2">
              <button className="bg-indigo-100 text-indigo-700 py-2 px-4 rounded-md text-sm hover:bg-indigo-200">
                Download Plan
              </button>
              <button className="bg-indigo-600 text-white py-2 px-4 rounded-md text-sm hover:bg-indigo-700">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Item
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="px-8 py-6">
        {/* Current Day Indicator */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
              Day {currentDay}
            </div>
            <span className="text-gray-500 text-sm">
              {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
        
        {/* Filter Options */}
        <div className="flex space-x-2 mb-6">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              activeFilter === 'all' 
                ? 'bg-indigo-100 text-indigo-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Tasks
          </button>
          <button 
            onClick={() => setActiveFilter('marketing')}
            className={`px-3 py-1 rounded-full text-sm ${
              activeFilter === 'marketing' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Marketing
          </button>
          <button 
            onClick={() => setActiveFilter('operations')}
            className={`px-3 py-1 rounded-full text-sm ${
              activeFilter === 'operations' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Operations
          </button>
          <button 
            onClick={() => setActiveFilter('finance')}
            className={`px-3 py-1 rounded-full text-sm ${
              activeFilter === 'finance' 
                ? 'bg-amber-100 text-amber-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Finance
          </button>
          <button 
            onClick={() => setActiveFilter('product')}
            className={`px-3 py-1 rounded-full text-sm ${
              activeFilter === 'product' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Product
          </button>
        </div>
        
        {/* Timeline */}
        <div className="bg-white shadow rounded-lg p-6">
          {sortedWeeks.length > 0 ? (
            <div className="space-y-6">
              {/* Loop through each week */}
              {sortedWeeks.map((weekNumber) => (
                <div key={`week-${weekNumber}`}>
                  <h3 className="text-lg font-semibold mb-3">
                    {getWeekTitle(weekNumber, tasksByWeek[weekNumber])}
                  </h3>
                  <div className="ml-4 border-l-2 border-indigo-200 pl-4 space-y-4">
                    {/* Loop through tasks for this week */}
                    {tasksByWeek[weekNumber]
                      .sort((a, b) => a.day - b.day)
                      .map((task) => (
                        <div key={task.id} className="pb-4">
                          <div className="flex items-center">
                            <div className={`absolute -ml-8 flex h-6 w-6 items-center justify-center rounded-full ${getTimelineDotColor(task.category)}`}>
                              <div className={`h-2.5 w-2.5 rounded-full ${getInnerDotColor(task.category)}`} />
                            </div>
                            <div className="flex items-start">
                              <div className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mr-2 ${getCategoryColor(task.category).bg} ${getCategoryColor(task.category).text}`}>
                                Day {task.day}
                              </div>
                              {isTaskOverdue(task) && !task.completed && (
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">Overdue</span>
                              )}
                            </div>
                          </div>
                          <div className="ml-2">
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                checked={task.completed}
                                onChange={(e) => handleTaskCompleted(task.id, e.target.checked)}
                                className="h-4 w-4 text-indigo-600 rounded mr-2"
                              />
                              <h4 className={`text-base font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                {task.title}
                              </h4>
                            </div>
                            {task.description && (
                              <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto h-16 w-16 text-indigo-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-500 mb-6">
                Generate a business plan first to populate your 30-day timeline.
              </p>
              <a href="/plan-generator" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Create Business Plan
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 