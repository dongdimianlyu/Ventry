import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
  week: number;
  day: number;
}

interface PlanTimelineProps {
  plan: string;
  businessType: string;
}

export default function BusinessPlanTimeline({ plan, businessType }: PlanTimelineProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDateTasks, setSelectedDateTasks] = useState<Task[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState<number[]>([0, 0, 0, 0]);
  
  // Format a date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Get today's date in YYYY-MM-DD format
  const today = formatDate(new Date());
  
  // Extract tasks from the markdown plan
  useEffect(() => {
    if (!plan) return;
    
    const extractedTasks = extractTasks(plan);
    setTasks(extractedTasks);
    
    // Calculate tasks for the selected date
    const selectedDateFormatted = formatDate(selectedDate);
    const tasksForSelectedDate = extractedTasks.filter(task => task.dueDate === selectedDateFormatted);
    setSelectedDateTasks(tasksForSelectedDate);
    
    // Calculate progress
    updateProgressStats(extractedTasks);
  }, [plan, selectedDate]);

  // Function to extract tasks from the markdown plan
  const extractTasks = (markdownPlan: string): Task[] => {
    const tasks: Task[] = [];
    const weekSections = markdownPlan.match(/### Week \d+[^\n]*\n([\s\S]*?)(?=### Week \d+|## |$)/g) || [];
    
    // Get today's date to calculate the starting date (beginning of the 30-day plan)
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - (currentDate.getDay() + 6) % 7); // Start from the most recent Monday
    
    weekSections.forEach((weekSection, weekIndex) => {
      const weekNumber = weekIndex + 1;
      
      // Extract bullet points under "Priority Tasks & Initiatives"
      const taskSection = weekSection.match(/Priority Tasks & Initiatives\s*\n([\s\S]*?)(?=\n\s*-\s*Resource Requirements|$)/);
      
      if (taskSection && taskSection[1]) {
        const taskLines = taskSection[1].match(/- [^\n]+/g) || [];
        
        taskLines.forEach((taskLine, dayIndex) => {
          const title = taskLine.replace(/^- /, '').trim();
          const day = dayIndex + 1;
          
          // Create a due date based on the week and day
          const dueDate = new Date(startDate);
          dueDate.setDate(startDate.getDate() + (weekNumber - 1) * 7 + dayIndex);
          
          // Set status based on date
          let status: 'not-started' | 'in-progress' | 'completed' = 'not-started';
          const formattedDueDate = formatDate(dueDate);
          
          // Get saved task status from localStorage if it exists
          const savedTaskKey = `task-${weekNumber}-${day}`;
          const savedTask = localStorage.getItem(savedTaskKey);
          
          if (savedTask) {
            try {
              const parsedTask = JSON.parse(savedTask);
              status = parsedTask.status;
            } catch (e) {
              console.error('Error parsing saved task:', e);
              // If today or past, set 50% chance of being in progress
              if (formattedDueDate <= today) {
                status = Math.random() < 0.5 ? 'in-progress' : 'not-started';
              }
            }
          } else {
            // For demo purposes only, past dates have a chance to be completed
            if (formattedDueDate < today) {
              status = Math.random() < 0.7 ? 'completed' : 'in-progress';
            } else if (formattedDueDate === today) {
              status = Math.random() < 0.3 ? 'in-progress' : 'not-started';
            }
          }
          
          tasks.push({
            id: `task-${weekNumber}-${day}`,
            title,
            dueDate: formattedDueDate,
            status,
            week: weekNumber,
            day
          });
        });
      }
    });
    
    return tasks;
  };

  // Update a task's status
  const handleTaskStatusChange = (taskId: string, newStatus: 'not-started' | 'in-progress' | 'completed') => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        // Save updated task status to localStorage
        localStorage.setItem(task.id, JSON.stringify({
          ...task,
          status: newStatus
        }));
        
        return { ...task, status: newStatus };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    
    // Update selected date tasks
    const selectedDateFormatted = formatDate(selectedDate);
    const updatedSelectedDateTasks = updatedTasks.filter(task => task.dueDate === selectedDateFormatted);
    setSelectedDateTasks(updatedSelectedDateTasks);
    
    // Update progress statistics
    updateProgressStats(updatedTasks);
  };
  
  // Calculate overall and weekly progress
  const updateProgressStats = (taskList: Task[]) => {
    // Calculate overall progress
    const totalTasks = taskList.length;
    const completedTasks = taskList.filter(task => task.status === 'completed').length;
    const calculatedProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    setOverallProgress(calculatedProgress);
    
    // Calculate weekly progress
    const weeklyStats = Array(4).fill(0).map((_, weekIndex) => {
      const weekNumber = weekIndex + 1;
      const weekTasks = taskList.filter(task => task.week === weekNumber);
      const weekCompletedTasks = weekTasks.filter(task => task.status === 'completed').length;
      
      return weekTasks.length > 0 ? Math.round((weekCompletedTasks / weekTasks.length) * 100) : 0;
    });
    
    setWeeklyProgress(weeklyStats);
  };
  
  // Generate calendar days for the current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0 is Sunday)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Calculate days from previous month to fill the first week
    const daysFromPrevMonth = [];
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      const day = daysInPrevMonth - firstDayOfWeek + i + 1;
      const date = new Date(year, month - 1, day);
      daysFromPrevMonth.push(date);
    }
    
    // Current month days
    const daysInMonth = [];
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(year, month, i);
      daysInMonth.push(date);
    }
    
    // Calculate days from next month to fill the last week
    const lastDayOfWeek = lastDayOfMonth.getDay();
    const daysFromNextMonth = [];
    
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      const date = new Date(year, month + 1, i);
      daysFromNextMonth.push(date);
    }
    
    return [...daysFromPrevMonth, ...daysInMonth, ...daysFromNextMonth];
  };
  
  // Get tasks for a specific day
  const getTasksForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return tasks.filter(task => task.dueDate === dateStr);
  };
  
  // Handle date selection
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const selectedDateFormatted = formatDate(date);
    const tasksForSelectedDate = tasks.filter(task => task.dueDate === selectedDateFormatted);
    setSelectedDateTasks(tasksForSelectedDate);
  };
  
  // Navigation for calendar
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };
  
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };
  
  // Format month name
  const formatMonth = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };
  
  // Determine the color based on task status
  const getStatusColor = (status: 'not-started' | 'in-progress' | 'completed') => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-300';
    }
  };
  
  // Calculate task counts for a specific date
  const getTasksStats = (date: Date) => {
    const dateStr = formatDate(date);
    const dateTasks = tasks.filter(task => task.dueDate === dateStr);
    
    if (dateTasks.length === 0) return null;
    
    const completed = dateTasks.filter(task => task.status === 'completed').length;
    const inProgress = dateTasks.filter(task => task.status === 'in-progress').length;
    const notStarted = dateTasks.filter(task => task.status === 'not-started').length;
    
    return { total: dateTasks.length, completed, inProgress, notStarted };
  };
  
  // Check if a date is today
  const isToday = (date: Date) => {
    return formatDate(date) === formatDate(new Date());
  };
  
  // Check if a date is the selected date
  const isSelected = (date: Date) => {
    return formatDate(date) === formatDate(selectedDate);
  };
  
  // Calendar days for the current month
  const calendarDays = getDaysInMonth(currentMonth);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-900 rounded-xl">
      {/* Calendar Section */}
      <div className="lg:w-3/5 bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
        {/* Calendar Header */}
        <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">{formatMonth(currentMonth)}</h2>
            <div className="flex space-x-2">
              <button 
                onClick={goToPreviousMonth}
                className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={goToToday}
                className="px-3 py-1 text-xs font-medium rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              >
                Today
              </button>
                <button 
                onClick={goToNextMonth}
                className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
            </div>
          </div>
          
          {/* Day Labels */}
          <div className="grid grid-cols-7 gap-1 mt-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
                {day}
              </div>
            ))}
              </div>
            </div>
        
        {/* Calendar Grid */}
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              const formattedDate = formatDate(date);
              const taskStats = getTasksStats(date);
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.01 }}
                  onClick={() => handleDateClick(date)}
                  className={`
                    aspect-square flex flex-col p-1 rounded-lg cursor-pointer transition-all
                    ${isToday(date) ? 'bg-indigo-900/50 ring-1 ring-indigo-500' : ''}
                    ${isSelected(date) ? 'bg-indigo-700/30 ring-2 ring-indigo-400' : 'hover:bg-gray-700/50'}
                    ${!isCurrentMonth ? 'opacity-40' : ''}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-medium 
                      ${isToday(date) ? 'text-indigo-300' : 'text-gray-400'}
                      ${isSelected(date) ? 'text-indigo-200' : ''}
                    `}>
                      {date.getDate()}
                    </span>
                    
                    {taskStats && (
                      <div className="flex -space-x-1">
                        {taskStats.completed > 0 && (
                          <div className="w-2 h-2 rounded-full bg-green-500" title={`${taskStats.completed} completed`}></div>
                        )}
                        {taskStats.inProgress > 0 && (
                          <div className="w-2 h-2 rounded-full bg-blue-500" title={`${taskStats.inProgress} in progress`}></div>
                        )}
                        {taskStats.notStarted > 0 && (
                          <div className="w-2 h-2 rounded-full bg-gray-400" title={`${taskStats.notStarted} not started`}></div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {taskStats && (
                    <div className="mt-auto">
                      <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden mt-1">
                        <div 
                          className="h-full bg-indigo-500" 
                          style={{ width: `${(taskStats.completed / taskStats.total) * 100}%` }}
                        ></div>
              </div>
            </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Overall Progress */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-300">Overall Progress</span>
              <span className="text-sm font-medium text-indigo-400">{overallProgress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600" 
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
            
            {/* Weekly Progress */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {weeklyProgress.map((progress, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-400">Week {index + 1}</span>
                    <span className="text-xs font-medium text-indigo-400">{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${index === 0 ? 'bg-indigo-500' : index === 1 ? 'bg-blue-500' : index === 2 ? 'bg-purple-500' : 'bg-pink-500'}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tasks for Selected Date */}
      <div className="lg:w-2/5">
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 h-full">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center">
              <div className="mr-4">
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center
                  ${isToday(selectedDate) ? 'bg-indigo-600' : 'bg-gray-700'}
                `}>
                  <span className="text-xl font-bold text-white">{selectedDate.getDate()}</span>
                            </div>
                          </div>
                          <div>
                <h2 className="text-lg font-semibold text-white">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h2>
                <p className="text-sm text-gray-400">
                  {selectedDateTasks.length} {selectedDateTasks.length === 1 ? 'task' : 'tasks'} for today
                </p>
              </div>
            </div>
          </div>
          
          {selectedDateTasks.length > 0 ? (
            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {selectedDateTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`
                    p-4 rounded-lg border transition-all
                    ${task.status === 'completed' 
                      ? 'bg-green-900/20 border-green-800' 
                      : task.status === 'in-progress' 
                        ? 'bg-blue-900/20 border-blue-800' 
                        : 'bg-gray-700/50 border-gray-700'
                    }
                  `}
                >
                  <div className="flex items-start">
                    <div className="mr-3">
                      <button
                        onClick={() => {
                          const newStatus = task.status === 'not-started' 
                            ? 'in-progress' 
                            : task.status === 'in-progress' 
                              ? 'completed' 
                              : 'not-started';
                          handleTaskStatusChange(task.id, newStatus);
                        }}
                        className={`
                          w-5 h-5 rounded-full flex items-center justify-center border
                          ${task.status === 'completed' 
                            ? 'bg-green-500 border-green-600' 
                            : task.status === 'in-progress'
                              ? 'bg-blue-500 border-blue-600'
                              : 'border-gray-500 hover:border-indigo-400'
                          }
                        `}
                      >
                        {task.status === 'completed' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {task.status === 'in-progress' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      <p className={`
                        font-medium text-sm
                        ${task.status === 'completed' 
                          ? 'text-green-300 line-through' 
                          : 'text-white'
                        }
                      `}>
                        {task.title}
                      </p>
                      
                      <div className="mt-2 flex items-center">
                        <span className="text-xs text-gray-400">Week {task.week}, Day {task.day}</span>
                        <span className={`
                          ml-2 text-xs px-1.5 py-0.5 rounded-full
                          ${task.status === 'completed' 
                            ? 'bg-green-900/50 text-green-400' 
                            : task.status === 'in-progress' 
                              ? 'bg-blue-900/50 text-blue-400' 
                              : 'bg-gray-700 text-gray-400'
                          }
                        `}>
                          {task.status === 'completed' 
                            ? 'Completed' 
                            : task.status === 'in-progress' 
                              ? 'In Progress' 
                              : 'Not Started'
                          }
                            </span>
                          </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-6 flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-1">No Tasks for This Day</h3>
              <p className="text-sm text-gray-500 max-w-xs">
                There are no scheduled tasks for this day in your 30-day plan.
              </p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
} 