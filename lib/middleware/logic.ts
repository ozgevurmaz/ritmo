export function getRedirectPath(user: any, pathname: string, profile?: { role: string } | null): string | null {
  // If not logged in and trying to access protected pages
  if (!user && pathname.startsWith('/dashboard')) {
    return '/auth';
  }

  // If logged in and on auth page
  if (user && pathname.startsWith('/auth')) {
    return '/dashboard'; 
  }

  // Admin check
  if (pathname.startsWith('/admin') && profile?.role !== 'admin') {
    return '/unauthorized';
  }

  return null;
}
