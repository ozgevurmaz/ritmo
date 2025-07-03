export function getRedirectPath(user: any, pathname: string, profile?: { role: string } | null) {
  // Unauthenticated users should go to auth for protected routes
  if (!user && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) {
    return '/auth';
  }

  // Authenticated users shouldn't access auth pages
  if (user && pathname.startsWith('/auth')) {
    return '/dashboard';
  }

  // Admin route protection
  if (user && pathname.startsWith('/admin') && profile?.role !== 'admin') {
    return '/unauthorized';
  }

  // Redirect root to dashboard for authenticated users
  if (user && pathname === '/') {
    return '/dashboard';
  }

  return null;
}