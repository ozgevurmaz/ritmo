import NavbarWrapper from "@/context/NavbarWrapper";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavbarWrapper>
        {children}
        <Toaster position="top-right"
          theme="system"
          toastOptions={{
            duration: 3000,
          }} />
      </NavbarWrapper>
    </div>
  );
}
