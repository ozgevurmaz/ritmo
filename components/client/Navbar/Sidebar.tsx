"use client"

import { useEffect, useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { NAV_LINKS } from '@/lib/constants';
import Link from 'next/link';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // Handle window resize to auto-collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside
      className={`border-r min-h-screen bg-background transition-all duration-300 sticky pt-14 ${
        collapsed ? 'w-16' : 'w-50'
      }`}
    >
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-3 top-4 h-6 w-6 rounded-full border bg-background shadow-sm cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
      
      <nav className="p-4">
        {NAV_LINKS.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <link.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{link.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}