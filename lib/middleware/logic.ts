export function getRedirectPath(user: any, pathname: string, profile?: { role: string } | null) {
  if (!user && !pathname.startsWith('/auth')) return '/auth';
  if (user && pathname.startsWith('/auth')) return '/';
  if (user && pathname.startsWith('/admin') && profile?.role !== 'admin') return '/unauthorized';
  return null;
}