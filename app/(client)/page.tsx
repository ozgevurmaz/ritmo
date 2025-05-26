'use client'


import { ThemeToggle } from "@/components/themeToggle";
import { useProfile } from "@/lib/Queries/useProfile";

export default function Home() {
  const { data: profile, isLoading, error } = useProfile();


  if (error) return <div>Error loading profile: {error.message}</div>;

  return (
    <div>Welcome, {profile?.name ?? 'Guest'}

      <ThemeToggle />
    </div>
  );
}
