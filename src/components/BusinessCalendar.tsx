'use client';

import { useState, useEffect } from 'react';
import { useBusinessPlan } from '@/contexts/BusinessPlanContext';
import TaskTooltip from './TaskTooltip';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date string
  week: number;
  day: number;
  completed: boolean;
  category: string;
  description?: string;
}

export default function BusinessCalendar() {
  const { timelineTasks, markTaskCompleted } = useBusinessPlan();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  
  // Map timeline tasks to calendar events
  useEffect(() => {
    if (timelineTasks.length > 0) {
      // Start from the first day of the current month
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      
      const mappedEvents = timelineTasks.map(task => {
        // Calculate the date based on the day number
        const taskDate = new Date(firstDayOfMonth);
        taskDate.setDate(task.day);
        
        return {
          id: task.id,
          title: task.title,
          date: taskDate.toISOString(),
          week: task.week,
          day: task.day,
          completed: task.completed,
          category: task.category,
          description: task.description
        };
      });
      
      setEvents(mappedEvents);
    }
  }, [timelineTasks]);
  
  // Change month
  const changeMonth = (amount: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + amount);
    setCurrentMonth(newMonth);
  };
  
  // Generate calendar days for the current month view
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Calculate days from previous month to fill the first week
    const daysFromPrevMonth = firstDay.getDay();
    // Total days in the current month
    const daysInMonth = lastDay.getDate();
    
    // Calculate days from next month to fill the last week
    const lastDayOfWeek = lastDay.getDay();
    const daysFromNextMonth = lastDayOfWeek === 6 ? 0 : 6 - lastDayOfWeek;
    
    // Create an array of days
    const days = [];
    
    // Add days from previous month
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
      const date = new Date(year, month - 1, i);
      days.push({
        date,
        dayOfMonth: i,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // Add days from current month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        dayOfMonth: i,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime()
      });
    }
    
    // Add days from next month
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        dayOfMonth: i,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    return days;
  };
  
  // Render events for a specific day
  const renderEventsForDay = (date: Date) => {
    // Filter events for this date
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
    
    if (dayEvents.length === 0) return null;
    
    return (
      <div className="mt-1 max-h-16 overflow-y-auto text-xs">
        {dayEvents.map((event) => {
          // Find the matching full task from timelineTasks
          const fullTask = timelineTasks.find(task => task.id === event.id);
          
          if (!fullTask) {
            return (
              <div
                key={event.id}
                className={`mb-1 px-1 py-0.5 rounded cursor-pointer ${getEventColor(event.category)} ${
                  event.completed ? 'opacity-60 line-through' : ''
                }`}
                onClick={() => handleToggleComplete(event.id, !event.completed)}
              >
                {event.title}
              </div>
            );
          }
          
          return (
            <TaskTooltip 
              key={event.id} 
              task={fullTask}
              position="cursor"
            >
              <div
                className={`mb-1 px-1.5 py-1 rounded-md cursor-pointer transition-all hover:translate-x-0.5 hover:shadow-sm ${getEventColor(event.category)} ${
                  event.completed ? 'opacity-60 line-through' : ''
                }`}
                onClick={() => handleToggleComplete(event.id, !event.completed)}
              >
                {event.title}
              </div>
            </TaskTooltip>
          );
        })}
      </div>
    );
  };
  
  // Toggle task completion status
  const handleToggleComplete = (taskId: string, completed: boolean) => {
    markTaskCompleted(taskId, completed);
  };
  
  // Get background color based on category
  const getEventColor = (category: string = '') => {
    if (!category) return 'bg-indigo-900/40 text-indigo-200 border border-indigo-700/30';
    
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory.includes('market')) {
      return 'bg-blue-900/40 text-blue-200 border border-blue-700/30';
    } else if (lowerCategory.includes('financ') || lowerCategory.includes('budget')) {
      return 'bg-amber-900/40 text-amber-200 border border-amber-700/30';
    } else if (lowerCategory.includes('product') || lowerCategory.includes('develop')) {
      return 'bg-purple-900/40 text-purple-200 border border-purple-700/30';
    } else if (lowerCategory.includes('operat')) {
      return 'bg-green-900/40 text-green-200 border border-green-700/30';
    } else {
      return 'bg-indigo-900/40 text-indigo-200 border border-indigo-700/30';
    }
  };
  
  const days = generateCalendarDays();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Business Plan Calendar</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-gray-200">
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="p-1 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="bg-gray-900/30 rounded-lg border border-gray-700 overflow-hidden">
        <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs text-gray-400 p-2 border-b border-gray-700">
          {weekdays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 p-2">
          {days.map((day, i) => (
            <div
              key={i}
              className={`
                p-1 min-h-[80px] border rounded-md 
                ${day.isCurrentMonth
                  ? day.isToday
                    ? 'bg-indigo-900/30 border-indigo-600/50 text-white'
                    : 'bg-gray-800/40 border-gray-700 text-gray-200'
                  : 'bg-gray-900/30 border-gray-800 text-gray-500'}
              `}
            >
              <div className="text-right text-sm">
                {day.dayOfMonth}
              </div>
              {renderEventsForDay(day.date)}
            </div>
          ))}
        </div>
      </div>
      
      {timelineTasks.length === 0 && (
        <div className="mt-6 text-center py-8 bg-gray-800/30 rounded-lg border border-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400 mb-4">No tasks found</p>
          <a href="/plan-generator" className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
            Create Business Plan
          </a>
        </div>
      )}
    </div>
  );
} 