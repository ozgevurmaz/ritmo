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
import { useTranslations } from 'next-intl';
import SteakBadge from '../custom/StreakBadge';
import ProfilePhoto from '../shared/profilePhoto';
import LoadingScreen from '../shared/pageStyles/Loading';

export function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const t = useTranslations("nav")
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

  if(isLoading) return <LoadingScreen/>

  if(!profile){
    return
  }

  return (
   <aside
      className={`hidden ${profile && "lg:flex"} relative flex-col h-full bg-sidebar border-r border-border text-sidebar-foreground transition-all duration-300 ${collapsed ? 'w-16' : 'w-50'}`}
    >
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-sidebar-border shadow-sm cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground z-10"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Navigation - Scrollable area */}
      <nav className="flex-1 p-4 pt-16 overflow-y-auto">
        {Links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2 mb-2 rounded-lg text-md font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${collapsed ? 'justify-center' : ''}`}
          >
            <link.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{t(link.name)}</span>}
          </Link>
        ))}
        {!isAdmin && (
          <Link
            href="/admin"
            className={`${profile?.role === "admin" ? "flex" : "hidden"} items-center gap-3 px-3 py-2 rounded-lg text-md font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${collapsed ? 'justify-center' : ''}`}
          >
            <ShieldUser className='h-4 w-4 shrink-0' />
            {!collapsed && <span>Admin Panel</span>}
          </Link>
        )}
      </nav>

      {/* User Profile*/}
      <div className="px-4 py-1 border-t border-border">
        {collapsed ? (
          <div className="flex justify-center py-3">
            <ProfilePhoto profile={profile} size="sm"/>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ProfilePhoto profile={profile}  size="md"/>
            <div className="flex-1 flex flex-col items-center p-0 w-full">
              <p className="text-sm px-2 py-1">{profile?.name}</p>
              <SteakBadge streak={profile?.streak || 0} border={false} isTextShown />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}