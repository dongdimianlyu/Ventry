'use client';

import { useState, useRef, useEffect } from 'react';
import { TimelineTask } from '@/contexts/BusinessPlanContext';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskTooltipProps {
  task: TimelineTask;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'cursor';
}

// Helper function to safely handle numbers that might be NaN
const safeNumber = (value: number | undefined): string => {
  if (value === undefined || isNaN(value)) {
    return '?';
  }
  return value.toString();
};

export default function TaskTooltip({ task, children, position = 'top' }: TaskTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Map priority to color and gradient
  const getPriorityColor = (priority?: string) => {
    if (!priority) return 'bg-blue-500';
    
    const priorityLower = priority.toLowerCase();
    if (priorityLower.includes('high')) return 'bg-red-500';
    if (priorityLower.includes('medium')) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  const getPriorityGradient = (priority?: string) => {
    if (!priority) return 'from-blue-500 to-blue-600';
    
    const priorityLower = priority.toLowerCase();
    if (priorityLower.includes('high')) return 'from-red-500 to-rose-600';
    if (priorityLower.includes('medium')) return 'from-amber-500 to-orange-600';
    return 'from-blue-500 to-cyan-600';
  };

  // Track mouse position for cursor-based tooltips
  const handleMouseMove = (e: MouseEvent) => {
    if (position === 'cursor' && isVisible) {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  // Calculate tooltip position based on parent element or mouse position
  useEffect(() => {
    if (!isVisible || !tooltipRef.current) return;

    const updatePosition = () => {
      const tooltip = tooltipRef.current;
      
      if (!tooltip) return;
      
      // Ensure the tooltip stays in the viewport
      let left, top;
      
      if (position === 'cursor') {
        // Position right beside cursor with offset
        left = mousePosition.x + 20;
        top = mousePosition.y;
        
        // Make sure tooltip stays in viewport
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if (left + tooltipRect.width > viewportWidth - 20) {
          left = mousePosition.x - tooltipRect.width - 20;
        }
        
        if (top + tooltipRect.height > viewportHeight - 20) {
          top = viewportHeight - tooltipRect.height - 20;
        }

        // Ensure the tooltip is always visible by keeping it above a minimum position
        if (top < 20) {
          top = 20;
        }
      } else if (parentRef.current) {
        const parent = parentRef.current.getBoundingClientRect();
        
        switch (position) {
          case 'bottom':
            left = parent.left + parent.width / 2;
            top = parent.bottom + 8;
            break;
          case 'left':
            left = parent.left - 8;
            top = parent.top + parent.height / 2;
            break;
          case 'right':
            left = parent.right + 8;
            top = parent.top + parent.height / 2;
            break;
          case 'top':
          default:
            left = parent.left + parent.width / 2;
            top = parent.top - 8;
            break;
        }
      }
      
      if (left !== undefined && top !== undefined) {
        tooltip.style.setProperty('--left', `${left}px`);
        tooltip.style.setProperty('--top', `${top}px`);
      }
    };

    // Initial position update
    updatePosition();
    
    // Update position on scroll, resize, and mouse move
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isVisible, position, mousePosition]);

  // Create safe task info with all values explicitly converted to strings when needed
  const safeTask = {
    id: task.id || '',
    title: task.title || 'Untitled Task',
    description: task.description || '',
    day: safeNumber(task.day),
    week: safeNumber(task.week),
    category: task.category || 'General',
    priority: task.priority || 'Medium',
    completed: Boolean(task.completed)
  };

  return (
    <div 
      ref={parentRef}
      className="relative z-10"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[9999]" // Higher z-index to ensure it's above all other elements
            style={{
              left: 'var(--left, 0)',
              top: 'var(--top, 0)',
              transform: position === 'cursor' 
                ? 'none' 
                : `translate(-50%, ${position === 'top' ? '-100%' : position === 'bottom' ? '0' : '-50%'})`,
              marginTop: position === 'top' ? '-8px' : position === 'bottom' ? '8px' : '0',
              marginLeft: position === 'left' ? '-8px' : position === 'right' ? '8px' : '0',
              pointerEvents: 'none', // Allow mouse events to pass through
            }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Task header with gradient based on priority */}
              <div className={`bg-gradient-to-r ${getPriorityGradient(safeTask.priority)} p-3`}>
                <h4 className="font-semibold text-white text-sm">{safeTask.title}</h4>
              </div>
              
              <div className="p-3">
                {/* Task description */}
                {safeTask.description && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1 mb-3">{safeTask.description}</p>
                )}
                
                {/* Task details */}
                <div className="flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center">
                    <span className="w-3 h-3 mr-1 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-gray-400"></span>
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Week {safeTask.week}, Day {safeTask.day}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300">
                    {safeTask.category}
                  </div>
                </div>
                
                {/* Task completion status */}
                <div className="flex items-center mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(safeTask.priority)} mr-2`}></div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {safeTask.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Arrow connector - only shown for directional positions, not for cursor */}
            {position !== 'cursor' && (
              <div 
                className={`absolute w-2 h-2 bg-white dark:bg-gray-800 transform rotate-45 border-${
                  position === 'top' ? 'b-r' : 
                  position === 'bottom' ? 't-l' : 
                  position === 'left' ? 'r-t' : 
                  'l-t'
                } border-gray-200 dark:border-gray-700`}
                style={{
                  left: position === 'top' || position === 'bottom' ? '50%' : position === 'left' ? '100%' : '0',
                  top: position === 'left' || position === 'right' ? '50%' : position === 'top' ? '100%' : '0',
                  transform: `translate(-50%, -50%) rotate(45deg)`,
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 