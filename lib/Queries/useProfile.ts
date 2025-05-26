import { useQuery } from '@tanstack/react-query';
import { createClient } from '../supabase/client';

export async function fetchProfile() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data as UserType;
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5,
  });
}
