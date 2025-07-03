export function getRedirectPath(user: any, pathname: string, profile?: { role: string } | null) {
  if (!user && !pathname.startsWith('/auth'))
    return '/auth';

  if (user && pathname.startsWith('/auth'))
    return '/dashboard';

  if (user && pathname.startsWith('/admin') && profile?.role !== 'admin')
    return '/unauthorized';

  if (user && (pathname.startsWith('/auth') || pathname === '/'))
    return '/dashboard';
  return null;
}