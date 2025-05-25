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
} from 'lucide-react';
import { CURRENT_USER, NAV_LINKS } from '@/lib/constants';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { getInitials } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export function Navbar() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/auth/signout', { method: 'POST' });
    router.push('/auth')
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2">
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
            </Button>

            {/* Logo and Brand */}
            <Link className="flex items-center gap-2" href="/">
              <Zap className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold tracking-tight">Ritmo</span>
            </Link>
          </div>

          {/* Desktop Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.slice(0, 4).map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <link.icon className="h-4 w-4" />
                <span className="hidden lg:inline-block">{link.name}</span>
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-1">

            {/* Streak - Hidden on small screens */}
            <div className='hidden sm:flex items-center gap-1 px-2 py-1'>
              <Flame className="h-5 w-5" />
              <span className="hidden md:inline">5 days</span>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative hover:bg-accent/70 cursor-pointer">
              <Bell className="h-5 w-5" />
              {CURRENT_USER.notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground">
                  {CURRENT_USER.notifications}
                </Badge>
              )}
            </Button>

            {/* Messages */}
            <Button variant="ghost" size="icon" className="relative hover:bg-accent/70 cursor-pointer">
              <MessageSquare className="h-5 w-5" />
              {CURRENT_USER.messages > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground">
                  {CURRENT_USER.messages}
                </Badge>
              )}
            </Button>

            {/* Avatar/Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 ml-2 py-2 hover:bg-accent/70 cursor-pointer">
                  <Avatar className="h-7 w-7">
                    {CURRENT_USER.avatar ? (
                      <AvatarImage src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
                    ) : (
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {getInitials(CURRENT_USER.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="hidden sm:inline-block text-sm font-medium">
                    {CURRENT_USER.name}
                  </span>
                  <ChevronDown className="h-3 w-3 hidden sm:inline-block" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 bg-background">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{CURRENT_USER.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {CURRENT_USER.email || 'user@example.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>

      </nav>

      {/* Mobile Navigation Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-background border-r shadow-lg">
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
                  {CURRENT_USER.avatar ? (
                    <AvatarImage src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
                  ) : (
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {getInitials(CURRENT_USER.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{CURRENT_USER.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {CURRENT_USER.email || 'user@example.com'}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4" />
                  <span className="text-sm">5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}