'use client';

import React from 'react';
import { useBusinessPlan } from '@/contexts/BusinessPlanContext';

interface BusinessPlanDisplayProps {
  plan: string;
  businessType: string;
}

const BusinessPlanDisplay: React.FC<BusinessPlanDisplayProps> = ({ plan, businessType }) => {
  const { planType } = useBusinessPlan();
  const isStrategicPlan = planType === 'strategic';

  // Simple text display that preserves newlines and indentation
  const formatPlanContent = () => {
    // Remove any JSON blocks
    const cleanPlan = plan.replace(/```json[\s\S]*?```/g, '');
    
    // Split by paragraphs
    const paragraphs = cleanPlan.split('\n\n').filter(p => p.trim() !== '');
    
    return (
      <div className="plan-content">
        {paragraphs.map((paragraph, index) => {
          // Check if this is a heading
          if (paragraph.startsWith('# ')) {
            return (
              <h1 key={index} className="text-2xl font-bold mb-6">
                {paragraph.replace('# ', '')}
              </h1>
            );
          }
          
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={index} className="text-xl font-semibold mt-8 mb-4">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={index} className="text-lg font-medium mt-6 mb-3">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          
          // Regular paragraph
          return (
            <p key={index} className="my-3">
              {paragraph}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="prose max-w-none">
        {formatPlanContent()}
      </div>
    </div>
  );
};

export default BusinessPlanDisplay; 