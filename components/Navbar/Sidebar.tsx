"use client"

import { useEffect, useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  ShieldUser,
} from 'lucide-react';

import { ADMIN_NAV_LINKS, NAV_LINKS } from '@/lib/constants';
import Link from 'next/link';
import { useProfile } from '@/lib/Queries/useProfile';
import { Button } from '../ui/button';

export function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const { data: profile, isLoading, error } = useProfile();
  const [collapsed, setCollapsed] = useState(false);
  const Links = isAdmin ? ADMIN_NAV_LINKS : NAV_LINKS

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
      className={`hidden ${profile && "lg:flex"} min-h-screen bg-sidebar border-r border-sidebar-border text-sidebar-foreground transition-all duration-300 sticky pt-14 ${collapsed ? 'w-16' : 'w-50'
        }`}
    >
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-3 top-4 h-6 w-6 rounded-full border border-sidebar-border shadow-sm cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground "
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      <nav className="p-4">
        {Links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-md font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${collapsed ? 'justify-center' : ''
              }`}
          >
            <link.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{link.name}</span>}
          </Link>
        ))}
        {
          !isAdmin &&
          <Link
            href="/admin"
            className={`${profile?.role === "admin" ? "flex" : "hidden"} items-center gap-3 px-3 py-2 rounded-lg text-md font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${collapsed ? 'justify-center' : ''
              }`}>
            <ShieldUser className='h-4 w-4 shrink-0' />
            {!collapsed && <span>Admin Panel</span>}
          </Link>
        }
      </nav>
    </aside>
  );
}