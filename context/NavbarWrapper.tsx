'use client'

import { ReactNode } from 'react';
import { Sidebar } from '../components/Navbar/Sidebar';
import { Navbar } from '../components/Navbar/Navbar';

export function NavbarWrapper({ children, isAdmin = false }: { children: ReactNode, isAdmin?: boolean }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-40">
        <Navbar isAdmin={isAdmin} />
      </div>
      
      {/* Main content area with sidebar */}
      <div className="flex flex-1">
        {/* Sticky Sidebar */}
        <div className="sticky top-16 h-[calc(100vh-4rem)]">
          <Sidebar isAdmin={isAdmin} />
        </div>
        
        {/* Scrollable main content */}
        <main className="flex-1 p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default NavbarWrapper;