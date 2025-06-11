import { Navbar } from '@/components/Navbar/Navbar';
import { Sidebar } from '@/components/Navbar/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex flex-col min-h-screen">
        <Navbar isAdmin={true} />
        <div className="flex flex-1">
          <Sidebar isAdmin={true} />
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
    </div>
  );
}
