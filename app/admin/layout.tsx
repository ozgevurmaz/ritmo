'use client';

import { useUser } from '@/context/auth-context';
import { redirect } from 'next/navigation';
import { Toaster } from 'sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;
  if (!user || user.user_metadata.role !== 'admin') {
    redirect('/not-authorized');
  }

  return (
    <div className="flex h-screen">
      {children}
      <Toaster position="top-right"
              theme="system"
              toastOptions={{
                duration: 3000,
              }} />
    </div>
  );
}
