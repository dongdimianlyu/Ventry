'use client';

import { useBusinessPlan } from '@/contexts/BusinessPlanContext';
import { ChartBarIcon, ClockIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export const ProgressTabSection = () => {
  const { timelineTasks, goalSummary } = useBusinessPlan();
  
  // Calculate progress statistics
  const calculateProgress = () => {
    if (!timelineTasks || timelineTasks.length === 0) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        progressPercentage: 0,
        tasksByCategory: {},
        weeklyProgress: Array(4).fill(0)
      };
    }

    const totalTasks = timelineTasks.length;
    const completedTasks = timelineTasks.filter(task => task.completed).length;
    const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

    // Calculate tasks by category
    const tasksByCategory = timelineTasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate weekly progress
    const weeklyProgress = Array(4).fill(0);
    timelineTasks.forEach(task => {
      if (task.completed) {
        weeklyProgress[task.week - 1]++;
      }
    });

    return {
      totalTasks,
      completedTasks,
      progressPercentage,
      tasksByCategory,
      weeklyProgress
    };
  };

  const progress = calculateProgress();

  return (
    <div className="space-y-6 mb-8">
      {/* Overall Progress */}
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overall Progress</h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{progress.progressPercentage}%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {progress.completedTasks} of {progress.totalTasks} tasks completed
            </p>
            
            {goalSummary && (
              <div className="mt-3 flex items-center text-gray-600 dark:text-gray-300">
                <ClockIcon className="h-4 w-4 mr-1 text-indigo-500" />
                <p className="text-sm">
                  Estimated completion: <span className="font-medium">{goalSummary.timeEstimate} {goalSummary.timeUnit}</span>
                </p>
              </div>
            )}
          </div>
          <div className="w-24 h-24">
            <svg className="transform -rotate-90 w-24 h-24">
              <circle
                cx="48"
                cy="48"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="48"
                cy="48"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-blue-500"
                strokeDasharray={`${progress.progressPercentage * 2.26} 226`}
                strokeDashoffset="0"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Progress</h3>
        <div className="grid grid-cols-4 gap-4">
          {progress.weeklyProgress.map((completed, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {completed}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Week {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks by Category */}
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tasks by Category</h3>
        <div className="space-y-4">
          {Object.entries(progress.tasksByCategory).map(([category, count]) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">{category}</span>
              <div className="flex items-center">
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(count / progress.totalTasks) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 