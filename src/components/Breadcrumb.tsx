'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  name: string;
  href: string;
  current: boolean;
}

export default function Breadcrumb() {
  const [pages, setPages] = useState<BreadcrumbItem[]>([]);
  const pathname = usePathname();
  
  useEffect(() => {
    // Generate breadcrumb items based on current path
    const pathSegments = pathname.split('/').filter(Boolean);
    
    const breadcrumbItems: BreadcrumbItem[] = [
      { name: 'Home', href: '/', current: pathname === '/' }
    ];
    
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Format the segment for display (capitalize, replace hyphens with spaces)
      const formattedName = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbItems.push({
        name: formattedName,
        href: currentPath,
        current: index === pathSegments.length - 1
      });
    });
    
    setPages(breadcrumbItems);
  }, [pathname]);
  
  // Don't show breadcrumbs on homepage
  if (pathname === '/') return null;
  
  return (
    <nav className="hidden md:flex items-center px-4 sm:px-6 lg:px-8 py-4 mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {pages.map((page, index) => (
          <li key={page.href} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon 
                className="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 mx-1" 
                aria-hidden="true" 
              />
            )}
            <div className={`flex items-center ${
              index === 0 ? 'text-gray-500 dark:text-gray-400' : ''
            }`}>
              {index === 0 && (
                <HomeIcon className="flex-shrink-0 h-4 w-4 mr-1" aria-hidden="true" />
              )}
              
              {page.current ? (
                <span className="font-medium text-gray-800 dark:text-gray-200" aria-current="page">
                  {page.name}
                </span>
              ) : (
                <Link
                  href={page.href}
                  className="nav-item text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {page.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
} 