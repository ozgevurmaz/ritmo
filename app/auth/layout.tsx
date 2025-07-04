import Navbar from '@/components/landing/navbar';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Navbar />
      <div className='mt-20 '>
      {children}
      </div>
    </div>
  );
}

