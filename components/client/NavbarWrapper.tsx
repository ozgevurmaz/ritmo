'use client'

import { ReactNode } from 'react';
import { Navbar } from './Navbar/Navbar';
import { Sidebar } from './Navbar/Sidebar';

export function NavbarWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

export default NavbarWrapper;