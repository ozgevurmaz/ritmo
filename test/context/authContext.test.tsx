import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useUser } from '@/context/auth-context';
import React from 'react';

// Supabase client mock
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      }),
    },
  }),
}));

const TestComponent = () => {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user</div>;
  return <div>User: {user.email}</div>;
};

describe('AuthProvider', () => {
  it('renders loading and then no user', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('No user')).toBeInTheDocument();
    });
  });
});
