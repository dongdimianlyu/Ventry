'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { ChangeEvent, useCallback } from "react";
import { Menu, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon, BellIcon, ChevronDownIcon, Cog6ToothIcon, UserIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { SparklesIcon, ChartBarIcon, CalendarIcon, ClockIcon, CheckIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/solid";
import { signOut } from '@/lib/auth';
import { useBusinessPlan } from '@/contexts/BusinessPlanContext';
import { ProgressTabSection } from './ProgressTabSection';
import BusinessCalendar from './BusinessCalendar';
import GoalSummaryCard from './GoalSummaryCard';

// Task interface for today's tasks
interface Task {
  id: string;
  title: string;
  week: number;
  day: number;
  status: 'not-started' | 'in-progress' | 'completed';
}

// Dashboard Header component for futuristic UI
const DashboardHeader = ({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (query: string) => void }) => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0.98]);
  const scale = useTransform(scrollY, [0, 100], [1, 0.98]);
  
  return (
    <motion.header 
      style={{ opacity, scale }}
      className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-20 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse-slow opacity-70 blur-md" />
              <div className="relative w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text drop-shadow-sm">
              Ventry Dashboard
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative max-w-xs w-full hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 block w-60 pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200"
                placeholder="Search..."
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 bg-white/70 dark:bg-gray-800/70 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-200"
              >
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-pink-500"></span>
                <BellIcon className="h-5 w-5" />
              </motion.button>
              
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="flex items-center space-x-2 p-1.5 px-3 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/70 dark:bg-gray-800/70 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                    <span className="text-xs font-bold text-white">AL</span>
                  </div>
                  <span>Alex Lyu</span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </Menu.Button>
                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 focus:outline-none overflow-hidden">
                    <div className="p-1">
                      <Menu.Item>
                        {({ active }: { active: boolean }) => (
                          <button className={`${active ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-200'} flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors duration-150`}>
                            <UserIcon className="h-4 w-4 mr-2" />
                            Your Profile
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }: { active: boolean }) => (
                          <button className={`${active ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-200'} flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors duration-150`}>
                            <Cog6ToothIcon className="h-4 w-4 mr-2" />
                            Settings
                          </button>
                        )}
                      </Menu.Item>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                      <Menu.Item>
                        {({ active }: { active: boolean }) => (
                          <button 
                            onClick={signOut}
                            className={`${active ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'text-gray-700 dark:text-gray-200'} flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors duration-150`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

// Quick Actions Section Component
const QuickActionsSection = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-5 flex items-center">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </div>
        <span className="relative">
          Quick Actions
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></span>
        </span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur-xl opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-xl p-6 shadow-xl border border-emerald-100/80 dark:border-emerald-900/30 h-full overflow-hidden">
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-md" />
            <div className="absolute left-0 top-0 w-20 h-20 bg-gradient-to-r from-emerald-300/10 to-teal-300/10 rounded-full blur-md" />
            
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 p-0.5 mb-4 group-hover:scale-110 transition-transform duration-300">
                <div className="w-full h-full rounded-[10px] bg-white dark:bg-gray-900 flex items-center justify-center">
                  <SparklesIcon className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                Create Business Plan
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Create a comprehensive AI-powered strategic plan tailored to your business goals</p>
              
              <Link 
                href="/plan-generator" 
                className="group inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium text-sm shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
              >
                <span>Create Your Plan</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
              </Link>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-xl opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-xl p-6 shadow-xl border border-purple-100/80 dark:border-purple-900/30 h-full overflow-hidden">
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-md" />
            <div className="absolute left-0 top-0 w-20 h-20 bg-gradient-to-r from-purple-300/10 to-pink-300/10 rounded-full blur-md" />
            
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 p-0.5 mb-4 group-hover:scale-110 transition-transform duration-300">
                <div className="w-full h-full rounded-[10px] bg-white dark:bg-gray-900 flex items-center justify-center">
                  <ChartBarIcon className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                Financial Tools
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Analyze projections, manage budgets, and create financial scenarios</p>
              
              <Link 
                href="/dashboard?section=financial-tools" 
                className="group inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              >
                <span>View Financial Tools</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Today's Tasks Section Component
const TodaysTasksSection = ({ todaysTasks, handleTaskStatusChange }: { 
  todaysTasks: Task[], 
  handleTaskStatusChange: (taskId: string, completed: boolean) => void 
}) => {
  return (
    <div className="lg:col-span-2 group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />
      <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-xl border border-violet-100/80 dark:border-violet-900/30 h-full overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-400 to-purple-500 p-0.5 mr-3 group-hover:scale-110 transition-transform duration-300">
                <div className="w-full h-full rounded-[9px] bg-white dark:bg-gray-900 flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-purple-500" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Today's Tasks</h3>
            </div>
            
            <Link href="/monthly-plan/timeline" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
              View All
            </Link>
          </div>
        </div>
        
        <div className="p-5">
          {todaysTasks.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {todaysTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`relative rounded-xl border overflow-hidden transition-all duration-300 group/task
                    ${task.status === 'completed' 
                      ? 'bg-green-50/70 dark:bg-green-900/20 border-green-100 dark:border-green-800/30' 
                      : 'bg-white/70 dark:bg-gray-800/70 border-gray-100 dark:border-gray-700/50 hover:bg-gray-50/90 dark:hover:bg-gray-700/50'}
                  `}
                >
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500/80 to-purple-500/80 transform origin-left scale-x-0 group-hover/task:scale-x-100 transition-transform duration-300" />
                  <div className="flex items-start p-4">
                    <div className="mr-3 pt-0.5">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleTaskStatusChange(task.id, task.status === 'completed' ? false : true)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors
                          ${task.status === 'completed' 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-transparent' 
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-violet-500 dark:hover:border-violet-400'}`}
                      >
                        {task.status === 'completed' && (
                          <CheckIcon className="h-3.5 w-3.5 text-white" />
                        )}
                      </motion.button>
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium text-gray-800 dark:text-gray-200 ${task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                        {task.title}
                      </p>
                      <div className="mt-1 flex items-center flex-wrap gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md">
                          Week {task.week}, Day {task.day}
                        </span>
                        
                        {task.status === 'not-started' && (
                          <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-md flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1"></span>
                            Not Started
                          </span>
                        )}
                        {task.status === 'in-progress' && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-md flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1"></span>
                            In Progress
                          </span>
                        )}
                        {task.status === 'completed' && (
                          <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-60 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-3">
                <CheckIcon className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium text-center">All caught up!</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-1">
                You've completed all your tasks for today.
              </p>
            </div>
          )}
          
          {todaysTasks.length > 0 && todaysTasks.every(task => task.status === 'completed') && (
            <div className="mt-5 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-lg opacity-30" />
              <div className="relative p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <div className="flex items-center">
                  <div className="relative w-10 h-10 mr-4">
                    <div className="absolute inset-0 bg-white/30 rounded-full animate-ping opacity-30"></div>
                    <div className="relative bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">All Tasks Completed!</h4>
                    <p className="text-pink-100 text-sm">Great job! You're making excellent progress on your business goals.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Statistics Section Component
const StatisticsSection = () => {
  const { timelineTasks } = useBusinessPlan();
  
  // Calculate statistics
  const calculateStats = () => {
    if (!timelineTasks || timelineTasks.length === 0) {
      return {
        tasksCompleted: 0,
        totalTasks: 0,
        completedToday: 0,
        progressPercentage: 0
      };
    }
    
    const totalTasks = timelineTasks.length;
    const completedTasks = timelineTasks.filter(task => task.completed).length;
    
    // Calculate today's completed tasks
    const today = new Date();
    const dayOfMonth = today.getDate();
    const todaysTasks = timelineTasks.filter(task => task.day === dayOfMonth);
    const completedToday = todaysTasks.filter(task => task.completed).length;
    
    // Calculate overall progress percentage
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      totalTasks: completedTasks,
      tasksCompleted: progressPercentage,
      completedToday,
      progressPercentage
    };
  };

  const stats = calculateStats();

  return (
    <div className="lg:col-span-1 group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />
      <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-100/80 dark:border-blue-900/30 h-full overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-500 p-0.5 mr-3 group-hover:scale-110 transition-transform duration-300">
              <div className="w-full h-full rounded-[9px] bg-white dark:bg-gray-900 flex items-center justify-center">
                <ArrowTrendingUpIcon className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Progress Stats</h3>
          </div>
        </div>
        
        <div className="p-5">
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Overall Completion</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{stats.tasksCompleted}%</span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stats.tasksCompleted}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full relative"
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundRepeat: 'no-repeat' }}></div>
              </motion.div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">Tasks Completed</p>
                <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <CheckIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTasks}</p>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 10.586 14.586 13H12z" clipRule="evenodd" />
                </svg>
                {Math.max(0, stats.totalTasks - 4)} since last week
              </p>
            </div>
            
            <div className="rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">Completed Today</p>
                <div className="w-7 h-7 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedToday}</p>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 10.586 14.586 13H12z" clipRule="evenodd" />
                </svg>
                {Math.max(0, stats.completedToday - 2)} more than yesterday
              </p>
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-4 bg-white/80 dark:bg-gray-800/80">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Weekly Progress</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Task completion by day</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 px-4 py-3">
              <div className="flex items-end justify-between h-24">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  const height = [60, 35, 80, 45, 65, 30, 50][i];
                  return (
                    <div key={day} className="flex flex-col items-center">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="w-5 rounded-t-lg bg-gradient-to-t from-blue-400 to-cyan-400 dark:from-blue-500 dark:to-cyan-500 relative group"
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-md py-1 px-2 transition-opacity duration-300">
                          {Math.round(height * 0.1)} tasks
                        </div>
                        <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                      </motion.div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// KPI Cards Section Component
const KpiCardsSection = () => {
  return (
    <div className="mb-8">
      {/* KPI Cards removed - not functional */}
    </div>
  );
};

export default function DashboardContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const { timelineTasks, markTaskCompleted, businessPlan } = useBusinessPlan();
  const router = useRouter();
  
  // Try to use context if available, fallback to localStorage
  useEffect(() => {
    if (timelineTasks.length > 0) {
      const tasks = extractTasksFromTimelineTasks(timelineTasks);
      setTodaysTasks(tasks);
    } else if (businessPlan) {
      const tasks = extractTasksForToday(businessPlan);
      setTodaysTasks(tasks);
    } else {
      // Try to load plan from localStorage as fallback
    const savedPlan = localStorage.getItem('businessPlan');
    if (savedPlan) {
        const tasks = extractTasksForToday(savedPlan);
        setTodaysTasks(tasks);
      }
    }
  }, [timelineTasks, businessPlan]);
  
  // Format a date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Convert timeline tasks to today's tasks
  const extractTasksFromTimelineTasks = (tasks: any[]): Task[] => {
    // Get current date info
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    
    // Calculate which week we're on
    const currentWeek = Math.ceil(dayOfMonth / 7);
    
    // Filter tasks for today
    return tasks
      .filter(task => task.day === dayOfMonth)
      .map(task => ({
          id: task.id,
          title: task.title,
        week: task.week || currentWeek,
          day: task.day,
        status: task.completed ? 'completed' as const : 'not-started' as const
      }));
  };
  
  // Extract today's tasks from the business plan
  const extractTasksForToday = (markdownPlan: string): Task[] => {
    // First, try to extract the JSON tasks from the plan
    const jsonMatch = markdownPlan.match(/```json\s*([\s\S]*?)```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        // Clean the JSON string
        let jsonString = jsonMatch[1].replace(/\/\/.*$/gm, '').replace(/,(\s*[\]}])/g, '$1');
        const taskData = JSON.parse(jsonString);
        
        if (taskData.dailyTasks && Array.isArray(taskData.dailyTasks)) {
          // Get current date info
          const currentDate = new Date();
          const dayOfMonth = currentDate.getDate();
          
          // Filter tasks for today and map to Task interface
          return taskData.dailyTasks
            .filter((task: any) => task.day === dayOfMonth)
            .map((task: any, index: number) => ({
              id: `json-task-${task.day}-${index}`,
              title: task.title,
              week: Math.ceil(task.day / 7),
              day: task.day,
              status: 'not-started' as const
            }));
        }
      } catch (e) {
        console.error("Error parsing JSON tasks:", e);
      }
    }
    
    // Fallback to text parsing if JSON parsing fails
    const tasks: Task[] = [];
    const weekSections = markdownPlan.match(/### Week \d+[^\n]*\n([\s\S]*?)(?=### Week \d+|## |$)/g) || [];
    
    // Get current date info
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    
    // Calculate which week and day we're on
    const currentWeek = Math.ceil(dayOfMonth / 7);
    
    // Only process if we're still within the 30-day plan
    if (currentWeek <= 4) {
      weekSections.forEach((weekSection, weekIndex) => {
        const weekNumber = weekIndex + 1;
        
        // Only extract tasks for the current week
        if (weekNumber === currentWeek) {
          // Extract bullet points under "Priority Tasks & Initiatives"
          const taskSection = weekSection.match(/Priority Tasks & Initiatives\s*\n([\s\S]*?)(?=\n\s*-\s*Resource Requirements|$)/);
          
          if (taskSection && taskSection[1]) {
            const taskLines = taskSection[1].match(/- [^\n]+/g) || [];
            
            // Map each bullet point to a task for the current day
            const dayInWeek = ((dayOfMonth - 1) % 7) + 1; // Convert to 1-7 for days in week
              
            if (dayInWeek <= taskLines.length) {
              const taskLine = taskLines[dayInWeek - 1];
                const title = taskLine.replace(/^- /, '').trim();
                
                tasks.push({
                id: `task-${weekNumber}-${dayInWeek}`,
                  title,
                  week: weekNumber,
                day: dayOfMonth,
                  status: 'not-started' as const
                });
              }
          }
        }
      });
    }
    
    // If no tasks are found for today, return demo tasks
    if (tasks.length === 0) {
      // Return 3 demo tasks for demonstration purposes
      return [
        {
          id: 'demo-task-1',
          title: 'Connect with 3 potential clients via email',
          week: 1,
          day: 1,
          status: 'not-started' as const
        },
        {
          id: 'demo-task-2',
          title: 'Review pricing strategy for main products',
          week: 1,
          day: 1,
          status: 'not-started' as const
        },
        {
          id: 'demo-task-3',
          title: 'Schedule team meeting for project kickoff',
          week: 1,
          day: 1,
          status: 'not-started' as const
        }
      ];
    }
    
    return tasks;
  };
  
  // Handle task status change
  const handleTaskStatusChange = (taskId: string, completed: boolean) => {
    // First update the local state for immediate UI feedback
    setTodaysTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: completed ? 'completed' : 'not-started' } 
          : task
      )
    );
    
    // Then update the business plan context if it's a timeline task
    if (timelineTasks.length > 0) {
      const timelineTask = timelineTasks.find(task => task.id === taskId);
      if (timelineTask) {
        markTaskCompleted(taskId, completed);
      }
    }
  };
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5 transition-all duration-300 ease-in-out focus:translate-y-[-2px] shadow-md focus:shadow-xl"
            placeholder="Search across your dashboard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-8">
        {/* Quick Actions */}
        <QuickActionsSection />

        {/* Content Grid with Today's Tasks and Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <TodaysTasksSection todaysTasks={todaysTasks} handleTaskStatusChange={handleTaskStatusChange} />
          <StatisticsSection />
        </div>

        {/* 30-Day Calendar Section */}
          <div className="group relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-100/80 dark:border-blue-900/30 p-6">
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 mb-5 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg mr-3">
                  <CalendarIcon className="h-4 w-4 text-white" />
                </div>
                <span className="relative">
                  30-Day Calendar
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-full"></span>
                </span>
              </h2>
              
            {timelineTasks.length > 0 ? (
                <div className="mt-4">
                <BusinessCalendar />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full flex items-center justify-center mb-3">
                    <CalendarIcon className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium text-center">No Business Plan Found</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-1 max-w-md">
                  Create a business plan to view your 30-day calendar with tasks and milestones.
                  </p>
                  <Link 
                    href="/plan-generator"
                    className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:translate-y-[-2px]"
                  >
                    Create Business Plan
                  </Link>
                </div>
              )}
            </div>
          </div>

        {/* KPI Cards Section */}
        <KpiCardsSection />

        {/* Goal Summary Card */}
        <GoalSummaryCard />

        {/* Progress Tab Section */}
        <ProgressTabSection />

        {/* Activity and Upcoming Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-orange-500/10 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-xl border border-rose-100/80 dark:border-rose-900/30 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-rose-400 to-orange-500 p-0.5 mr-3 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-full h-full rounded-[9px] bg-white dark:bg-gray-900 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recently Completed Tasks</h3>
                </div>
              </div>
              
              <div className="p-5">
                <div className="relative pl-6 space-y-6 before:absolute before:top-0 before:bottom-0 before:left-2.5 before:w-0.5 before:bg-gradient-to-b before:from-rose-500 before:to-orange-500">
                  {timelineTasks.filter(task => task.completed).slice(0, 5).length > 0 ? (
                    timelineTasks
                      .filter(task => task.completed)
                      .slice(0, 5)
                      .map((task, index) => (
                    <div key={index} className="relative">
                      <span className="absolute -left-6 flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 shadow-lg z-10">
                            <CheckIcon className="h-3 w-3 text-white" />
                      </span>
                      <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
                            <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{task.category || 'General Task'}</p>
                            <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 inline-block">Day {task.day}, Week {task.week}</span>
                      </div>
                    </div>
                      ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-400 dark:text-gray-500">No completed tasks yet. Start checking off items from your plan!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Upcoming Tasks */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-100/80 dark:border-amber-900/30 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 p-0.5 mr-3 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-full h-full rounded-[9px] bg-white dark:bg-gray-900 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Tasks</h3>
                </div>
              </div>
              
              <div className="p-5">
                <div className="space-y-3">
                  {timelineTasks.filter(task => !task.completed).slice(0, 5).length > 0 ? (
                    timelineTasks
                      .filter(task => !task.completed)
                      .sort((a, b) => a.week * 7 + a.day - (b.week * 7 + b.day))
                      .slice(0, 5)
                      .map((task, index) => {
                        // Map priority based on keywords in the title or description
                        let priority = "medium";
                        const content = (task.title + " " + (task.description || "")).toLowerCase();
                        if (content.includes("urgent") || content.includes("critical") || content.includes("important")) {
                          priority = "high";
                        } else if (content.includes("consider") || content.includes("optional")) {
                          priority = "low";
                        }
                        
                        // Generate a friendly date (actual or relative)
                        const currentDate = new Date();
                        const currentDay = currentDate.getDate();
                        const dayDiff = task.day - currentDay;
                        
                        let friendlyDate = "";
                        if (dayDiff === 0) friendlyDate = "Today";
                        else if (dayDiff === 1) friendlyDate = "Tomorrow";
                        else if (dayDiff > 1 && dayDiff < 7) friendlyDate = `In ${dayDiff} days`;
                        else friendlyDate = `Day ${task.day}, Week ${task.week}`;
                        
                        return (
                          <div key={index} className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                        <span className={`
                          text-xs px-2 py-0.5 rounded-md inline-flex items-center
                                ${priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' : 
                                 priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300' : 
                           'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'}
                        `}>
                          <span className={`
                            w-1.5 h-1.5 rounded-full mr-1
                                  ${priority === 'high' ? 'bg-red-500' : 
                                   priority === 'medium' ? 'bg-amber-500' : 
                             'bg-blue-500'}
                          `}></span>
                                {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                              {task.category && (
                                <span className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                  {task.category}
                                </span>
                              )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                {friendlyDate}
                        </span>
                      </div>
                    </div>
                        );
                      })
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-400 dark:text-gray-500">No upcoming tasks found. Create a business plan to see your upcoming tasks.</p>
                      <Link 
                        href="/plan-generator"
                        className="mt-3 inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300 hover:shadow-md"
                      >
                        Create Business Plan
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 