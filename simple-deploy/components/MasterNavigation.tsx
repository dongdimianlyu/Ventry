'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  HomeIcon, 
  ChartBarIcon, 
  FolderIcon, 
  CalendarIcon, 
  Cog6ToothIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  count?: number;
}

export default function MasterNavigation() {
  const [activeItem, setActiveItem] = useState('dashboard');
  
  const primaryNavigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Projects', href: '/projects', icon: FolderIcon, count: 12 },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];
  
  const secondaryNavigation: NavigationItem[] = [
    { name: 'Documents', href: '/documents', icon: DocumentTextIcon, count: 3 },
    { name: 'Financial', href: '/financial', icon: CurrencyDollarIcon },
    { name: 'Team', href: '/team', icon: UserGroupIcon },
    { name: 'Growth', href: '/growth', icon: ArrowTrendingUpIcon },
  ];
  
  return (
    <div className="fixed top-20 left-6 z-20 hidden 2xl:block">
      <div className="dashboard-card flex flex-col items-center w-14 bg-white/70 dark:bg-gray-900/70 rounded-2xl py-5 shadow-xl">
        <nav className="flex flex-col items-center space-y-2">
          {primaryNavigation.map((item) => (
            <motion.div 
              key={item.name}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link
                href={item.href}
                onClick={() => setActiveItem(item.name.toLowerCase())}
                className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                  activeItem === item.name.toLowerCase()
                    ? 'bg-gray-800 dark:bg-gray-700 text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.count && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-semibold text-white bg-red-500 rounded-full">
                    {item.count}
                  </span>
                )}
              </Link>
              <div className="absolute left-full ml-3 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 invisible pointer-events-none transform -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0">
                {item.name}
              </div>
            </motion.div>
          ))}
          
          <div className="w-8 h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
          
          {secondaryNavigation.map((item) => (
            <motion.div 
              key={item.name}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link
                href={item.href}
                onClick={() => setActiveItem(item.name.toLowerCase())}
                className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                  activeItem === item.name.toLowerCase()
                    ? 'bg-gray-800 dark:bg-gray-700 text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.count && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-semibold text-white bg-red-500 rounded-full">
                    {item.count}
                  </span>
                )}
              </Link>
              <div className="absolute left-full ml-3 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 invisible pointer-events-none transform -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0">
                {item.name}
              </div>
            </motion.div>
          ))}
        </nav>
      </div>
      
      <div className="dashboard-card flex flex-col items-center w-14 bg-white/70 dark:bg-gray-900/70 rounded-2xl py-4 mt-4 shadow-xl">
        <div className="flex flex-col items-center justify-center">
          <div className="group relative cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 mb-2 group-hover:bg-gray-400 dark:group-hover:bg-gray-600 transition-colors duration-200"></div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">73%</p>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-1">Storage</p>
        </div>
      </div>
    </div>
  );
} 