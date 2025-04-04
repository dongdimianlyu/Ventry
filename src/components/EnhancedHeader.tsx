'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Image from "next/image";
import { Menu, Transition } from '@headlessui/react';
import { 
  MagnifyingGlassIcon, BellIcon, ChevronDownIcon, 
  Cog6ToothIcon, UserIcon, ArrowPathIcon,
  Bars3Icon, XMarkIcon
} from "@heroicons/react/24/outline";
import { signOut } from '@/lib/auth';

interface NavItem {
  name: string;
  href: string;
  current: boolean;
}

export default function EnhancedHeader() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0.98]);
  const scale = useTransform(scrollY, [0, 100], [1, 0.98]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Generate navigation based on current path
  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', current: pathname === '/dashboard' },
    { name: 'Projects', href: '/projects', current: pathname === '/projects' },
    { name: 'Calendar', href: '/calendar', current: pathname === '/calendar' },
    { name: 'Analytics', href: '/analytics', current: pathname.includes('/analytics') },
    { name: 'Financial', href: '/financial', current: pathname.includes('/financial') },
  ];
  
  useEffect(() => {
    // Close mobile menu when pathname changes
    setMobileMenuOpen(false);
  }, [pathname]);
  
  return (
    <motion.header
      style={{ opacity, scale }}
      className="sticky top-0 z-40 w-full"
    >
      {/* Main header */}
      <div className="bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl border-b border-gray-200/70 dark:border-gray-800/70 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            {/* Logo and company name */}
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 rounded-md bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center mr-2 shadow-lg"
                  >
                    <span className="text-white font-bold text-sm">V</span>
                  </motion.div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Ventry</span>
                </div>
              </Link>
              
              {/* Desktop navigation */}
              <nav className="hidden md:ml-10 md:flex md:items-center md:space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`nav-item px-1 py-2 text-sm font-medium ${
                      item.current 
                        ? 'text-gray-900 dark:text-white active' 
                        : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search bar */}
              <div className="relative max-w-xs w-full hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-white/40 dark:bg-gray-800/40 block w-64 pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-500 focus:border-transparent shadow-sm transition-all duration-300"
                  placeholder="Search in dashboard..."
                />
              </div>
              
              {/* Notification button */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white bg-white/70 dark:bg-gray-800/70 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200"
              >
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                <BellIcon className="h-5 w-5" />
              </motion.button>
              
              {/* Profile menu */}
              <Menu as="div" className="relative z-10">
                {({ open }) => (
                  <>
                    <Menu.Button className="flex items-center space-x-2 p-1.5 px-3 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/70 dark:bg-gray-800/70 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                        <span className="text-xs font-bold text-white">AL</span>
                      </div>
                      <span>Alex Lyu</span>
                      <ChevronDownIcon className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${open ? 'transform rotate-180' : ''}`} />
                    </Menu.Button>
                    
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 focus:outline-none overflow-hidden">
                        <div className="p-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button className={`${active ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'text-gray-700 dark:text-gray-200'} flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors duration-150`}>
                                <UserIcon className="h-4 w-4 mr-2" />
                                Your Profile
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button className={`${active ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'text-gray-700 dark:text-gray-200'} flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors duration-150`}>
                                <Cog6ToothIcon className="h-4 w-4 mr-2" />
                                Settings
                              </button>
                            )}
                          </Menu.Item>
                          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                          <Menu.Item>
                            {({ active }) => (
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
                  </>
                )}
              </Menu>
              
              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Secondary header - contextual actions */}
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/30 py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm">
            <div className="hidden lg:flex items-center space-x-1 text-gray-500 dark:text-gray-400">
              <span className="font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
              <span>•</span>
              <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <Link 
              href="/plan-generator"
              className="flex items-center space-x-1 py-1 px-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <span>New Plan</span>
            </Link>
            
            <button className="flex items-center space-x-1 py-1 px-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200">
              <ArrowPathIcon className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on mobile menu state */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-800">
          <nav className="px-4 py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  item.current
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </motion.header>
  );
} 