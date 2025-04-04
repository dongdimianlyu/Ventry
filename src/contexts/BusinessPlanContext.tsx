'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the goal summary structure
export interface GoalSummary {
  rephrased: string;
  difficulty: number;
  timeEstimate: number;
  timeUnit: string;
}

// Define the task structure
export interface TimelineTask {
  id: string;
  title: string;
  description: string;
  day: number;
  week: number;
  category: string;
  priority?: string;
  completed: boolean;
}

// Define the business plan structure
export interface StoredBusinessPlan {
  id: string;
  businessType: string;
  planType: string;
  title: string;
  plan: string;
  createdAt: string;
}

// Define the context type
interface BusinessPlanContextType {
  businessPlan: string;
  businessType: string;
  planType: string;
  timelineTasks: TimelineTask[];
  planHistory: StoredBusinessPlan[];
  goalSummary: GoalSummary | null;
  setBusinessPlan: (plan: string) => void;
  setBusinessType: (type: string) => void;
  setPlanType: (type: string) => void;
  parseBusinessPlanForTimeline: (plan: string) => void;
  markTaskCompleted: (taskId: string, completed: boolean) => void;
  clearTimelineTasks: () => void;
  savePlanToHistory: (plan: string, businessType: string, planType: string) => void;
  restorePlan: (planId: string) => void;
  deletePlanFromHistory: (planId: string) => void;
  moveOverdueTasksToCurrentDay: (currentDay: number) => void;
}

// Create the context with default values
const BusinessPlanContext = createContext<BusinessPlanContextType>({
  businessPlan: '',
  businessType: '',
  planType: 'strategic',
  timelineTasks: [],
  planHistory: [],
  goalSummary: null,
  setBusinessPlan: () => {},
  setBusinessType: () => {},
  setPlanType: () => {},
  parseBusinessPlanForTimeline: () => {},
  markTaskCompleted: () => {},
  clearTimelineTasks: () => {},
  savePlanToHistory: () => {},
  restorePlan: () => {},
  deletePlanFromHistory: () => {},
  moveOverdueTasksToCurrentDay: () => {},
});

// Define the props for the provider component
interface BusinessPlanProviderProps {
  children: ReactNode;
}

// Generate a unique ID with a timestamp and random number
const generateUniqueId = (prefix: string, index: number) => {
  return `${prefix}-${Date.now()}-${index}-${Math.floor(Math.random() * 10000)}`;
};

// Create the provider component
export function BusinessPlanProvider({ children }: BusinessPlanProviderProps) {
  const [businessPlan, setBusinessPlan] = useState<string>('');
  const [businessType, setBusinessType] = useState<string>('');
  const [planType, setPlanType] = useState<string>('strategic');
  const [timelineTasks, setTimelineTasks] = useState<TimelineTask[]>([]);
  const [planHistory, setPlanHistory] = useState<StoredBusinessPlan[]>([]);
  const [goalSummary, setGoalSummary] = useState<GoalSummary | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedPlan = localStorage.getItem('businessPlan');
    const storedType = localStorage.getItem('businessType');
    const storedPlanType = localStorage.getItem('planType');
    const storedTasks = localStorage.getItem('timelineTasks');
    const storedHistory = localStorage.getItem('planHistory');
    const storedGoalSummary = localStorage.getItem('goalSummary');
    
    if (storedPlan) {
      setBusinessPlan(storedPlan);
      // Parse the stored plan for timeline tasks
      if (!storedTasks) {
        parseBusinessPlanForTimeline(storedPlan);
      }
    }
    
    if (storedType) {
      setBusinessType(storedType);
    }

    if (storedPlanType) {
      setPlanType(storedPlanType);
    }

    if (storedTasks) {
      try {
        setTimelineTasks(JSON.parse(storedTasks));
      } catch (e) {
        console.error('Error parsing stored tasks:', e);
        localStorage.removeItem('timelineTasks');
      }
    }

    if (storedHistory) {
      try {
        setPlanHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error('Error parsing plan history:', e);
        localStorage.removeItem('planHistory');
      }
    }
    
    if (storedGoalSummary) {
      try {
        setGoalSummary(JSON.parse(storedGoalSummary));
      } catch (e) {
        console.error('Error parsing goal summary:', e);
        localStorage.removeItem('goalSummary');
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (timelineTasks.length > 0) {
      localStorage.setItem('timelineTasks', JSON.stringify(timelineTasks));
    }
  }, [timelineTasks]);

  // Save plan history to localStorage whenever it changes
  useEffect(() => {
    if (planHistory.length > 0) {
      localStorage.setItem('planHistory', JSON.stringify(planHistory));
    }
  }, [planHistory]);
  
  // Save goal summary to localStorage whenever it changes
  useEffect(() => {
    if (goalSummary) {
      localStorage.setItem('goalSummary', JSON.stringify(goalSummary));
    }
  }, [goalSummary]);

  // Clear all timeline tasks
  const clearTimelineTasks = () => {
    setTimelineTasks([]);
    setGoalSummary(null);
    localStorage.removeItem('timelineTasks');
    localStorage.removeItem('goalSummary');
  };

  // Function to parse a business plan into timeline tasks
  const parseBusinessPlanForTimeline = (plan: string) => {
    // Reset existing tasks
    clearTimelineTasks();
    const tasks: TimelineTask[] = [];
    let taskIndex = 0;
    
    try {
      // First, try to extract the JSON-formatted roadmap
      const jsonMatch = plan.match(/```json\s*([\s\S]*?)```/);
      
      if (jsonMatch && jsonMatch[1]) {
        try {
          // Clean the JSON string - remove comments and properly format
          let jsonString = jsonMatch[1];
          // Remove any comments (like "// Repeat for all 30 days")
          jsonString = jsonString.replace(/\/\/.*$/gm, '');
          // Handle any trailing commas that might cause parsing errors
          jsonString = jsonString.replace(/,(\s*[\]}])/g, '$1');
          
          // Parse the cleaned JSON
          const roadmapData = JSON.parse(jsonString);
          
          // Extract goal summary if available
          if (roadmapData.goalSummary) {
            setGoalSummary(roadmapData.goalSummary);
          }
          
          if (roadmapData.dailyTasks && Array.isArray(roadmapData.dailyTasks)) {
            // Process the daily tasks from the JSON data
            roadmapData.dailyTasks.forEach((task: any) => {
              if (task.day && task.title) {
                const dayNumber = typeof task.day === 'number' ? task.day : parseInt(task.day, 10);
                if (isNaN(dayNumber)) return;
                
                tasks.push({
                  id: generateUniqueId(`task-${dayNumber}`, taskIndex++),
                  title: task.title,
                  description: task.description || '',
                  day: dayNumber,
                  week: Math.ceil(dayNumber / 7),
                  category: task.category || 'General',
                  priority: task.priority || 'Medium',
                  completed: false
                });
              }
            });
            
            // If we successfully parsed the JSON data, sort tasks and update state
            if (tasks.length > 0) {
              tasks.sort((a, b) => a.day - b.day);
              setTimelineTasks(tasks);
              return;
            }
          }
        } catch (jsonError) {
          console.error('Error parsing JSON roadmap data:', jsonError);
          console.log('Problematic JSON string:', jsonMatch[1]);
          // Continue with regular parsing if JSON parsing fails
        }
      }
      
      // If JSON parsing failed or didn't yield results, fall back to the existing text-based parsing
      // Look for a section that might contain daily tasks
      const lines = plan.split('\n');
      let inTimelineSection = false;
      let currentDay = 0;
      let currentWeek = 1;
      let category = 'General';
      
      // Check if we're in a roadmap or timeline section
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        if (line.match(/##\s*(roadmap|timeline|detailed action plan|day-by-day|30-day)/i)) {
          inTimelineSection = true;
          continue;
        }
        
        if (inTimelineSection && line.startsWith('##')) {
          inTimelineSection = false;
          continue;
        }
        
        if (!inTimelineSection) continue;
        
        // Check for week headers
        if (line.toLowerCase().includes('week') && line.match(/week\s+\d+/i)) {
          const weekMatch = line.match(/week\s+(\d+)/i);
          if (weekMatch && weekMatch[1]) {
            currentWeek = parseInt(weekMatch[1], 10);
            continue;
          }
        }
        
        // Check for day headers or items
        const dayMatch = line.match(/day\s+(\d+)[:|\s-]+(.+)/i);
        if (dayMatch) {
          currentDay = parseInt(dayMatch[1], 10);
          const taskTitle = dayMatch[2].trim();
          
          // Get the description from the next line if available
          let description = '';
          if (i + 1 < lines.length && !lines[i + 1].trim().startsWith('Day')) {
            description = lines[i + 1].trim();
          }
          
          // Determine category based on keywords in the task
          if (taskTitle.toLowerCase().includes('market') || taskTitle.toLowerCase().includes('promotion')) {
            category = 'Marketing';
          } else if (taskTitle.toLowerCase().includes('financ') || taskTitle.toLowerCase().includes('budget') || taskTitle.toLowerCase().includes('cost')) {
            category = 'Finance';
          } else if (taskTitle.toLowerCase().includes('product') || taskTitle.toLowerCase().includes('develop') || taskTitle.toLowerCase().includes('design')) {
            category = 'Product';
          } else if (taskTitle.toLowerCase().includes('operat') || taskTitle.toLowerCase().includes('process')) {
            category = 'Operations';
          }
          
          tasks.push({
            id: generateUniqueId(`task-${currentDay}`, taskIndex++),
            title: taskTitle,
            description: description,
            day: currentDay,
            week: Math.ceil(currentDay / 7),
            category: category,
            completed: false
          });
        }
      }
      
      // If no day-by-day breakdown was found, try to create weekly tasks
      if (tasks.length === 0) {
        let currentWeek = 0;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          // Check for week headers
          if (line.toLowerCase().includes('week') && line.match(/week\s+\d+/i)) {
            const weekMatch = line.match(/week\s+(\d+)[:|.|\s-]+(.+)/i);
            if (weekMatch && weekMatch[1]) {
              currentWeek = parseInt(weekMatch[1], 10);
              
              if (weekMatch[2]) {
                const title = weekMatch[2].trim();
                
                // Get the details from the following lines
                let j = i + 1;
                let description = '';
                while (j < lines.length && 
                       !lines[j].trim().toLowerCase().includes('week') && 
                       !lines[j].trim().match(/week\s+\d+/i)) {
                  if (lines[j].trim()) {
                    description += lines[j].trim() + '\n';
                  }
                  j++;
                }
                
                // Create tasks for each day of the week based on the week's focus
                for (let day = 1; day <= 7; day++) {
                  const actualDay = (currentWeek - 1) * 7 + day;
                  if (actualDay <= 30) {
                    // Determine task category based on keywords
                    if (title.toLowerCase().includes('market') || title.toLowerCase().includes('promotion')) {
                      category = 'Marketing';
                    } else if (title.toLowerCase().includes('financ') || title.toLowerCase().includes('budget')) {
                      category = 'Finance';
                    } else if (title.toLowerCase().includes('product') || title.toLowerCase().includes('develop')) {
                      category = 'Product';
                    } else if (title.toLowerCase().includes('operat') || title.toLowerCase().includes('process')) {
                      category = 'Operations';
                    } else {
                      category = 'General';
                    }
                    
                    tasks.push({
                      id: generateUniqueId(`task-${actualDay}`, taskIndex++),
                      title: `${title} - Day ${day}`,
                      description: description.trim(),
                      day: actualDay,
                      week: currentWeek,
                      category: category,
                      completed: false
                    });
                  }
                }
              }
            }
          }
        }
      }
      
      // Sort tasks by day
      tasks.sort((a, b) => a.day - b.day);
      
      // Update the state with the parsed tasks
      setTimelineTasks(tasks);
    } catch (error) {
      console.error('Error parsing business plan for timeline:', error);
    }
  };

  // Function to mark a task as completed
  const markTaskCompleted = (taskId: string, completed: boolean) => {
    setTimelineTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed } : task
      )
    );
  };

  // Function to move overdue tasks to current day
  const moveOverdueTasksToCurrentDay = (currentDay: number) => {
    setTimelineTasks(prevTasks => 
      prevTasks.map(task => {
        // If the task is incomplete and overdue, move it to the current day
        if (!task.completed && task.day < currentDay) {
          return {
            ...task,
            day: currentDay,
            week: Math.ceil(currentDay / 7),
            // Add a note to the description that this task was moved
            description: task.description 
              ? `${task.description}\n(Moved from Day ${task.day})` 
              : `(Moved from Day ${task.day})`
          };
        }
        return task;
      })
    );
  };

  // Function to save a plan to history
  const savePlanToHistory = (plan: string, businessType: string, planType: string) => {
    const title = getPlanTitle(plan, businessType);
    const newPlan: StoredBusinessPlan = {
      id: generateUniqueId('plan', Date.now()),
      businessType,
      planType,
      title,
      plan,
      createdAt: new Date().toISOString(),
    };

    // Add to history and limit to most recent 10 plans
    setPlanHistory(prev => {
      const newHistory = [newPlan, ...prev];
      return newHistory.slice(0, 10);
    });
  };

  // Function to extract a title from a plan
  const getPlanTitle = (plan: string, businessType: string): string => {
    // Try to extract a meaningful title from the plan
    const lines = plan.split('\n');
    
    // Look for a suitable title in the first few lines
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      
      // If line starts with # and contains the business type, it's likely our title
      if (line.startsWith('#') && line.toUpperCase().includes(businessType.toUpperCase())) {
        return line.replace(/#/g, '').trim();
      }
    }
    
    // Fallback title if no suitable title found
    return `${businessType} Business Plan`;
  };

  // Function to restore a plan from history
  const restorePlan = (planId: string) => {
    const plan = planHistory.find(p => p.id === planId);
    if (plan) {
      setBusinessPlan(plan.plan);
      setBusinessType(plan.businessType);
      setPlanType(plan.planType);
      parseBusinessPlanForTimeline(plan.plan);
      
      // Save to localStorage
      localStorage.setItem('businessPlan', plan.plan);
      localStorage.setItem('businessType', plan.businessType);
      localStorage.setItem('planType', plan.planType);
    }
  };

  // Function to delete a plan from history
  const deletePlanFromHistory = (planId: string) => {
    setPlanHistory(prev => prev.filter(p => p.id !== planId));
  };

  // Return the context provider
  return (
    <BusinessPlanContext.Provider
      value={{
        businessPlan,
        businessType,
        planType,
        timelineTasks,
        planHistory,
        goalSummary,
        setBusinessPlan,
        setBusinessType,
        setPlanType,
        parseBusinessPlanForTimeline,
        markTaskCompleted,
        clearTimelineTasks,
        savePlanToHistory,
        restorePlan,
        deletePlanFromHistory,
        moveOverdueTasksToCurrentDay
      }}
    >
      {children}
    </BusinessPlanContext.Provider>
  );
}

// Custom hook to use the business plan context
export function useBusinessPlan() {
  const context = useContext(BusinessPlanContext);
  if (!context) {
    throw new Error('useBusinessPlan must be used within a BusinessPlanProvider');
  }
  return context;
} 