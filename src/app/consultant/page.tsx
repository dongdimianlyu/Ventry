import DashboardLayout from '@/components/DashboardLayout';
import ConsultantContent from '@/components/ConsultantContent';

export const metadata = {
  title: 'AI Business Consultant | Ventry',
  description: 'Get expert business advice and strategic recommendations from our AI Business Consultant.',
};

export default function ConsultantPage() {
  return (
    <DashboardLayout>
      <ConsultantContent />
    </DashboardLayout>
  );
} 