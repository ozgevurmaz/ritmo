'use client';

import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {


  return (
    <div className="flex h-screen">
      <nav className="sticky top-0 z-40 w-full drop-shadow-sm shadow-sm shadow-foreground/10 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-10">
        <Link className="flex items-center gap-2 h-14 " href="/">
          <Zap className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold tracking-tight">Ritmo</span>
        </Link>
        {children}
      </nav>
    </div>
  );
}
