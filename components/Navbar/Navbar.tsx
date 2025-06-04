"use client"

import { useState } from 'react';
import {
  Bell,
  MessageSquare,
  Menu,
  X,
  Zap,
  Flame,
  Settings,
  LogOut,
  User,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { getInitials } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/lib/Queries/useProfile';
import StreakBadge from '../shared/StreakBadge';
import LoadingScreen from '../shared/pageStyles/Loading';
import { ThemeToggle } from '../Profile/themeToggle';

interface NavbarProps {
  isAdmin?: boolean
}

export function Navbar({ isAdmin = false }: NavbarProps) {
  const { data: profile, isLoading, error } = useProfile();

  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/auth/signout', { method: 'POST' });
    router.push('/auth')
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  if (isLoading) return <LoadingScreen />

  if (error) {
    return (
      <div>Something went wrong</div>
    )
  }
  return (
    <>
      <header className="z-40 w-full drop-shadow-sm shadow-sm shadow-foreground/10 bg-background">
        <div className="flex h-14 items-center justify-between px-3 lg:px-10">

          {/* Logo and Brand */}
          <Link className="flex items-center gap-2" href="/">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold tracking-tight">Ritmo {isAdmin && <span className='text-primary font-bold'>Admin</span>}</span>
          </Link>
          <ThemeToggle />
          {/* User Actions */}
          <div className="flex items-center">
            {
              isAdmin &&
              <div className="flex items-center gap-2 px-3 py-1.5 bg-success/40 rounded-full border border-success">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="flex text-sm font-medium text-success-foreground">
                  1,247 <span className='sm:hidden lg:flex'>live users</span>
                </span>
              </div>
            }
            {
              isAdmin &&
              <Link
                href="/"
                className="sm:hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span className='sm:hidden lg:flex'>Return to App</span>
              </Link>
            }

            {/* Streak - Hidden on small screens */}
            {!isAdmin && <StreakBadge streak={profile?.streak || 0} />}

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative hover:bg-accent/70 cursor-pointer">
              <Bell className="h-5 w-5" />
              {profile?.notifications && profile?.notifications > 0 ? (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground">
                  {profile?.notifications}
                </Badge>
              ) : ""}
            </Button>

            {/* Messages */}
            <Button variant="ghost" size="icon" className="relative hover:bg-accent/70 cursor-pointer">
              <MessageSquare className="h-5 w-5" />
              {profile?.messages && profile?.messages > 0 ? (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground">
                  {profile?.messages}
                </Badge>
              ) : ""}
            </Button>

            {/* Avatar/Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className='hover:bg-muted/70 p-0' asChild>
                <Button variant="ghost" className="gap-1 p-1 md:p-2 rounded-lg cursor-pointer">
                  <Avatar className="h-7 w-7">
                    {profile?.avatar ? (
                      <AvatarImage src={profile?.avatar} alt={profile?.name} />
                    ) : (
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {getInitials(profile?.name || "My Ritmo")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="hidden sm:inline-block text-sm font-medium">
                    {profile?.name}
                  </span>
                  <ChevronDown className="h-3 w-3 hidden sm:inline-block" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 bg-card border-border px-4 py-2">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile?.email || 'user@example.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer px-4 py-2 focus:bg-muted focus:text-muted-foreground  " asChild>
                  <Link href="/account">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer px-4 py-2 focus:bg-muted focus:text-muted-foreground" asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem variant="destructive" onClick={handleLogout} className="cursor-pointer px-4 py-2">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden cursor-pointer"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button> </div>

        </div>

      </header>

      {/* Mobile Navigation Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-secondary text-secondary-foreground border-r shadow-lg">
            <div className="flex h-14 items-center justify-between px-4 border-b">
              <Link className="flex items-center gap-2" href="/" onClick={() => setMobileMenuOpen(false)}>
                <Zap className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold tracking-tight">Ritmo</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="px-4 py-6 space-y-2">
              {NAV_LINKS.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile User Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {profile?.avatar ? (
                    <AvatarImage src={profile?.avatar} alt={profile?.name} />
                  ) : (
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {getInitials(profile?.avatar || "My Ritmo")}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{profile?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile?.email || 'user@example.com'}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4" />
                  <span className="text-sm">{profile?.streak}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}