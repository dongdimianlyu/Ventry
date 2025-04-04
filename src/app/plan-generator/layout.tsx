'use client';

import { ReactNode } from 'react';
import AuthGuard from '@/components/AuthGuard';
import DashboardLayout from '@/components/DashboardLayout';

export default function PlanGeneratorLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <DashboardLayout pageTitle="Business Plan Generator">
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
} 