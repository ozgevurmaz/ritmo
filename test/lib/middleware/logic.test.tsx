import { getRedirectPath } from '@/lib/middleware/logic';

describe('getRedirectPath', () => {
  it('should redirect guest to /auth', () => {
    const result = getRedirectPath(null, '/admin');
    expect(result).toBe('/auth');
  });

  it('should redirect logged-in non-admin to /unauthorized', () => {
    const user = { id: '123' };
    const result = getRedirectPath(user, '/admin', { role: 'user' });
    expect(result).toBe('/unauthorized');
  });

  it('should allow admin to access /admin', () => {
    const user = { id: '123' };
    const result = getRedirectPath(user, '/admin', { role: 'admin' });
    expect(result).toBeNull();
  });

  it('should redirect logged-in user away from /auth', () => {
    const user = { id: '123' };
    const result = getRedirectPath(user, '/auth');
    expect(result).toBe('/');
  });
});
