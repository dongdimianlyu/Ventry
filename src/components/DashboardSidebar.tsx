'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, 
  ChartBarIcon, 
  BuildingOfficeIcon, 
  DocumentTextIcon, 
  ChatBubbleBottomCenterTextIcon, 
  ChevronLeftIcon 
} from '@heroicons/react/24/outline';
import { RocketLaunchIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

interface DashboardSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  showFeedback?: () => void;
}

export default function DashboardSidebar({
  activeSection,
  setActiveSection,
  showFeedback
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSection = searchParams.get('section') || '';
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  
  // Animation variants
  const sidebarVariants = {
    expanded: { width: '260px', transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
    collapsed: { width: '80px', transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } }
  };
  
  const textVariants = {
    expanded: { 
      opacity: 1, 
      display: 'block',
      transition: { 
        opacity: { duration: 0.2, delay: 0.1 },
        display: { delay: 0.1 }
      }
    },
    collapsed: { 
      opacity: 0, 
      display: 'none',
      transition: { 
        opacity: { duration: 0.1 },
        display: { delay: 0.1 }
      }
    }
  };
  
  const headerTextVariants = {
    expanded: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, delay: 0.1 }
    },
    collapsed: { 
      opacity: 0, 
      x: -10,
      transition: { duration: 0.2 }
    }
  };

  // Define a type for nav items to fix the error
  interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
    isActive: (currentPath: string) => boolean;
    activeGradient: string;
    activeIndicator: string;
    soon: boolean;
    onClick?: () => void;
  }

  // Then update the navigation items initialization to use this type
  const mainNavItems: NavItem[] = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: <HomeIcon className="h-5 w-5 text-white" />,
      isActive: (currentPath: string) => currentPath === '/dashboard' && !currentSection,
      activeGradient: "from-indigo-600/90 to-blue-600/90",
      activeIndicator: "from-indigo-400 to-blue-400",
      soon: false
    },
    {
      href: '/plan-generator',
      label: 'Plan Generator',
      icon: <DocumentTextIcon className="h-5 w-5 text-white" />,
      isActive: (currentPath: string) => currentPath === '/plan-generator',
      activeGradient: "from-emerald-600/90 to-green-600/90",
      activeIndicator: "from-emerald-400 to-green-400",
      soon: false
    }
  ];

  const toolsNavItems: NavItem[] = [
    {
      href: '/financial-tools',
      label: 'Financial Tools',
      icon: <ChartBarIcon className="h-5 w-5 text-white" />,
      isActive: (currentPath: string) => pathname === '/financial-tools' || currentSection === 'financial-tools',
      activeGradient: "from-purple-600/90 to-fuchsia-600/90",
      activeIndicator: "from-purple-400 to-fuchsia-400",
      soon: false,
      onClick: () => {
        setActiveSection('financial-tools');
        router.push('/financial-tools');
      }
    },
    {
      href: '#',
      label: 'Business Analytics',
      icon: <BuildingOfficeIcon className="h-5 w-5 text-white" />,
      isActive: (currentPath: string) => false,
      activeGradient: "from-amber-600/90 to-orange-600/90",
      activeIndicator: "from-amber-400 to-orange-400",
      soon: true
    }
  ];
  
  return (
    <motion.div 
      className="h-screen relative overflow-hidden z-20"
      initial="expanded"
      animate={collapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
    >
      {/* Modern gradient background with depth effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 h-48 w-48 bg-gradient-to-br from-indigo-600/10 to-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 h-64 w-64 bg-gradient-to-br from-purple-600/5 to-fuchsia-600/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 left-0 right-0 h-1/3 bg-gradient-to-r from-indigo-900/5 via-blue-900/5 to-indigo-900/5 rounded-full blur-3xl"></div>
      
      {/* Enhanced noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] [mask-image:url(/noise.png)] bg-repeat pointer-events-none"></div>
      
      {/* Subtle pixel grid pattern - gives a tech feel */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      {/* Sidebar container with glass effect */}
      <div className="relative h-full flex flex-col p-4">
        {/* Logo and brand */}
        <div className="flex items-center justify-between mb-8 mt-1">
          <div className="flex items-center space-x-3">
            {/* Logo - always visible */}
            <div className="w-9 h-9 relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-blue-500 to-cyan-500 rounded-xl"></div>
              <div className="absolute inset-[2px] bg-gray-900 rounded-[9px] flex items-center justify-center">
                <RocketLaunchIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-md transform rotate-12 animate-pulse"></div>
            </div>
            
            {/* Brand text - only visible when expanded */}
            <motion.div 
              variants={headerTextVariants}
              className="flex flex-col"
            >
              <span className="text-lg font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">Ventry</span>
              <div className="h-0.5 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-0.5"></div>
            </motion.div>
          </div>
          
          {/* Collapse/Expand button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 rounded-lg bg-gray-800/80 dark:bg-gray-700/80 flex items-center justify-center text-gray-300 hover:text-white transition-colors border border-gray-700/50 hover:border-gray-600 shadow-sm backdrop-blur-sm"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeftIcon className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </motion.button>
        </div>
        
        {/* Subtle gradient divider */}
        <div className="mx-1 h-px bg-gradient-to-r from-transparent via-gray-700/40 to-transparent mb-5"></div>
        
        {/* Navigation menu */}
        <nav className="flex-1 pr-1 pt-1 pb-6 overflow-y-auto custom-scrollbar space-y-7">
          {/* Main navigation */}
          <div className="space-y-1.5">
            <AnimatePresence>
              {!collapsed && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-2 overflow-hidden pl-2"
                >
                  <h3 className="text-xs uppercase tracking-wider text-indigo-300/90 font-medium">Main Menu</h3>
                </motion.div>
              )}
            </AnimatePresence>
            
            {mainNavItems.map((item, index) => (
              <NavItem 
                key={`main-${index}`}
                href={item.href} 
                currentPath={pathname}
                currentSection={currentSection}
                icon={item.icon}
                label={item.label}
                isActive={item.isActive(pathname)}
                activeGradient={item.activeGradient}
                activeIndicator={item.activeIndicator}
                collapsed={collapsed}
                textVariants={textVariants}
                soon={item.soon}
                onClick={item.onClick}
              />
            ))}
          </div>
          
          {/* Business Tools Section */}
          <div className="space-y-1.5">
            <AnimatePresence>
              {!collapsed && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-2 overflow-hidden pl-2"
                >
                  <h3 className="text-xs uppercase tracking-wider text-indigo-300/90 font-medium">Business Tools</h3>
                </motion.div>
              )}
            </AnimatePresence>
            
            {toolsNavItems.map((item, index) => (
              <NavItem 
                key={`tool-${index}`}
                href={item.href} 
                currentPath={pathname}
                currentSection={currentSection}
                icon={item.icon}
                label={item.label}
                isActive={item.isActive(pathname)}
                activeGradient={item.activeGradient}
                activeIndicator={item.activeIndicator}
                collapsed={collapsed}
                textVariants={textVariants}
                soon={item.soon}
                onClick={item.onClick}
              />
            ))}
          </div>
          
          {/* Beta Status - Only visible when expanded */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="mt-auto pt-5"
              >
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative p-4 rounded-xl overflow-hidden"
                >
                  {/* Enhanced gradient background with animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-900/70 to-violet-900/80 rounded-xl"></div>
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.07]"></div>
                  
                  {/* Animated glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 rounded-3xl opacity-50 blur-xl">
                    <motion.div 
                      animate={{ 
                        x: ['0%', '100%', '0%'],
                      }}
                      transition={{ 
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut" 
                      }}
                      className="w-full h-full bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"
                    />
                  </div>
                  
                  {/* Live indicator */}
                  <div className="absolute right-4 top-4 flex items-center">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut" 
                      }}
                      className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5"
                    />
                    <span className="text-xs text-emerald-300 font-medium">BETA</span>
                  </div>
                  
                  {/* Content */}
                  <div className="relative">
                    <h4 className="text-white font-semibold mb-2">Beta Program Active</h4>
                    <p className="text-xs text-blue-100/80 mb-3">
                      You're using an early release. Your feedback helps us improve!
                    </p>
                    <button 
                      onClick={showFeedback}
                      className="inline-flex items-center text-xs font-medium text-white bg-blue-600/30 hover:bg-blue-600/40 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Share Feedback
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-3 w-3 ml-1" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </motion.div>
  );
}

// Enhanced Nav Item component with better visuals
interface NavItemProps {
  href: string;
  currentPath: string;
  currentSection: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  activeGradient?: string;
  activeIndicator?: string;
  collapsed: boolean;
  textVariants: any;
  soon?: boolean;
  onClick?: () => void;
}

function NavItem({ 
  href, 
  currentPath, 
  currentSection, 
  icon, 
  label, 
  isActive, 
  activeGradient = "from-blue-600/90 to-indigo-600/90",
  activeIndicator = "from-blue-400 to-indigo-400",
  collapsed,
  textVariants,
  soon = false,
  onClick
}: NavItemProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }} 
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <Link href={soon ? '#' : href} 
        className={`relative overflow-hidden flex items-center px-3 py-2.5 rounded-xl group ${soon ? 'opacity-70 cursor-default' : ''}`}
        onClick={(e) => {
          if (soon) {
            e.preventDefault();
            return;
          }
          
          if (onClick) {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {/* Active/hover background with animated gradient */}
        <div className={`absolute inset-0 ${
          isActive
            ? `bg-gradient-to-r ${activeGradient} opacity-100` 
            : 'bg-gray-800/60 opacity-0 group-hover:opacity-100'
        } rounded-xl transition-all duration-200`}></div>
        
        {/* Icon container with subtle glow on active */}
        <div className={`flex-shrink-0 w-9 h-9 rounded-lg ${
          isActive
            ? 'bg-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]' 
            : 'bg-gray-800/60 group-hover:bg-white/10'
        } flex items-center justify-center ${collapsed ? 'mx-auto' : 'mr-3'} transition-all shadow-sm`}>
          {icon}
        </div>
        
        {/* Menu text */}
        <motion.div 
          variants={textVariants}
          className="flex-1"
        >
          <span className={`text-sm font-medium ${
            isActive
              ? 'text-white' 
              : 'text-gray-300 group-hover:text-white'
          } transition-colors whitespace-nowrap`}>
            {label}
          </span>
          
          {/* "Coming soon" badge */}
          {soon && (
            <span className="ml-2 text-[9px] font-semibold bg-gray-700/60 text-gray-300 px-1.5 py-0.5 rounded-full">
              SOON
            </span>
          )}
        </motion.div>
        
        {/* Active indicator line with subtle glow */}
        {isActive && (
          <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b ${activeIndicator} rounded-r-full shadow-[0_0_8px_rgba(96,165,250,0.5)]`}></div>
        )}
      </Link>
    </motion.div>
  );
} 