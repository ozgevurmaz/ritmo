'use client'

import { ReactNode } from 'react';

import { Sidebar } from '../components/Navbar/Sidebar';
import { Navbar } from '../components/Navbar/Navbar';


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