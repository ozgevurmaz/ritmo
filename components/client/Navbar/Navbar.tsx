"use client"

import { useEffect, useState } from 'react';
import {
  Search,
  Bell,
  MessageSquare,
  Menu,
  X,
  Zap,
} from 'lucide-react';
import { CURRENT_USER, NAV_LINKS } from '@/lib/constants';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { getInitials } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo and Brand */}
        <Link className="flex items-center gap-2 mr-4" href="/">
          <Zap className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold tracking-tight">Ritmo</span>
        </Link>

        {/* Desktop Navigation - Hidden on Small and Medium Screens */}
        <div className="hidden lg:flex items-center space-x-3 xl:space-x-6">
          {NAV_LINKS.slice(0, 5).map((link) => (
            <Link
              href={link.href}
              key={link.name}
              className="flex items-center text-muted-foreground hover:text-foreground active:text-foreground"
            >
              <link.icon className="h-4 w-4 mr-1" />
              {link.name}
            </Link>
          ))}
        </div>

        {/* Search Bar - Hidden on Small and Medium Screens */}
        <div className="hidden lg:flex items-center relative max-w-sm">
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-9 h-9 rounded-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-1">
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

          {/* Avatar/Profile */}
          <Button variant="ghost" size="sm" className="gap-2 ml-2 py-2 hover:bg-transperent hover:text-foreground cursor-pointer">
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
          </Button>

          {/* Small and Medium Screens Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Small and Medium Screens Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t">
          <div className="container p-4 flex flex-col gap-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-9 h-9"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="justify-start"
                >
                  <link.icon className="h-4 w-4 mr-2" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}