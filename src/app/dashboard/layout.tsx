'use client';

import { ReactNode } from 'react';
import AuthGuard from '@/components/AuthGuard';
import DashboardLayout from '@/components/DashboardLayout';

export default function DashboardRootLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <DashboardLayout pageTitle="Dashboard">
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
} 