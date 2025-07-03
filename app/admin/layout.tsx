import { Navbar } from '@/components/Navbar/Navbar';
import { Sidebar } from '@/components/Navbar/Sidebar';
import NavbarWrapper from '@/context/NavbarWrapper';

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  return (
    <div>
      <NavbarWrapper isAdmin={true}>
        {children }
      </NavbarWrapper>
    </div>
  );
}
