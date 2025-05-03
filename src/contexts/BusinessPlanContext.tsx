'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Simple interface for the context
interface BusinessPlanContextType {
  businessPlan: string;
  businessType: string;
  planType: string;
  setBusinessPlan: (plan: string) => void;
  setBusinessType: (type: string) => void;
  setPlanType: (type: string) => void;
}

// Create the context with default values
const BusinessPlanContext = createContext<BusinessPlanContextType>({
  businessPlan: '',
  businessType: '',
  planType: 'strategic',
  setBusinessPlan: () => {},
  setBusinessType: () => {},
  setPlanType: () => {},
});

// Define the props for the provider component
interface BusinessPlanProviderProps {
  children: ReactNode;
}

// Create the provider component
export function BusinessPlanProvider({ children }: BusinessPlanProviderProps) {
  const [businessPlan, setBusinessPlan] = useState<string>('');
  const [businessType, setBusinessType] = useState<string>('');
  const [planType, setPlanType] = useState<string>('strategic');

  return (
    <BusinessPlanContext.Provider
      value={{
        businessPlan,
        businessType,
        planType,
        setBusinessPlan,
        setBusinessType,
        setPlanType,
      }}
    >
      {children}
    </BusinessPlanContext.Provider>
  );
}

// Create a hook to use the context
export function useBusinessPlan() {
  return useContext(BusinessPlanContext);
} 