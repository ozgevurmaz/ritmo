'use client'

import { ReactNode } from 'react';
import { Sidebar } from '../components/Navbar/Sidebar';
import { Navbar } from '../components/Navbar/Navbar';

export function NavbarWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

export default NavbarWrapper;