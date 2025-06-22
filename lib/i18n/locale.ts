'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server'; // Adjust path as needed
import { Locale, defaultLocale } from './config';

const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale(): Promise<Locale> {
  try {
    // First, try to get locale from user profile
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('locale')
        .eq('id', user.id)
        .single();
      
      if (profile?.locale) {
        return profile.locale as Locale;
      }
    }
    
    // Fall back to cookie
    const cookieLocale = (await cookies()).get(COOKIE_NAME)?.value;
    if (cookieLocale) {
      return cookieLocale as Locale;
    }
    
    // Finally fall back to system/browser locale
    // You can get this from headers if needed
    return defaultLocale;
    
  } catch (error) {
    console.error('Error getting user locale:', error);
    return defaultLocale;
  }
}

export async function setUserLocale(locale: Locale) {
  try {
    // Set cookie first for immediate use
    (await cookies()).set(COOKIE_NAME, locale);
    
    // Update user profile if authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase
        .from('profiles')
        .update({ locale })
        .eq('id', user.id);
    }
    
  } catch (error) {
    console.error('Error setting user locale:', error);
    // Still set cookie even if profile update fails
    (await cookies()).set(COOKIE_NAME, locale);
  }
}