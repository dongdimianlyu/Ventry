'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  // Script to handle theme before React hydration to prevent flash
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      (function() {
        try {
          const storedTheme = localStorage.getItem('theme');
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const theme = storedTheme || (prefersDark ? 'dark' : 'light');
          
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } catch (e) {
          // Fallback if localStorage is not available
          console.error('Theme initialization error:', e);
        }
      })();
    `;
    script.async = false;
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Update DOM with the theme class
  const updateDOMTheme = (newTheme: Theme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    updateDOMTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);
    
    // Check for localStorage theme
    let storedTheme: Theme | null = null;
    
    try {
      storedTheme = localStorage.getItem('theme') as Theme | null;
    } catch (e) {
      console.error('Error reading theme from localStorage:', e);
    }
    
    if (storedTheme) {
      setTheme(storedTheme);
      updateDOMTheme(storedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDark ? 'dark' : 'light';
      setTheme(defaultTheme);
      updateDOMTheme(defaultTheme);
      
      try {
        localStorage.setItem('theme', defaultTheme);
      } catch (e) {
        console.error('Error writing theme to localStorage:', e);
      }
    }
  }, []);

  // Listen for system preference changes
  useEffect(() => {
    if (!mounted) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only change if user hasn't explicitly set a preference
      try {
        if (!localStorage.getItem('theme')) {
          const newTheme = e.matches ? 'dark' : 'light';
          setTheme(newTheme);
          updateDOMTheme(newTheme);
        }
      } catch (e) {
        console.error('Error handling theme change:', e);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 