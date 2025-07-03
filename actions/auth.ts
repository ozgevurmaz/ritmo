'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, signupSchema } from '@/lib/zod/auth/auth'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const result = loginSchema.safeParse(raw)
  if (!result.success) {
    return { error: 'Invalid data', issues: result.error.flatten().fieldErrors }
  }

  const { email, password } = result.data

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const raw = {
    email: String(formData.get('email') || ''),
    password: String(formData.get('password') || ''),
    confirmPassword: String(formData.get('confirmPassword') || ''),
  }

  const result = signupSchema.safeParse(raw)
  if (!result.success) {
    return { error: 'Invalid data', issues: result.error.flatten().fieldErrors }
  }

  const { email, password } = result.data

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) return { error: authError.message }

  const userId = authData.user?.id
  if (userId) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: userId, email, username: `user_${Math.floor(Math.random() * 100000)}` })

    if (profileError) {
      return { error: profileError.message }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/auth/verify-mail')
}

export async function resetPasswordForEmail(formData: FormData) {
  try {
    const supabase = await createClient()
    const email = formData.get('email') as string

    if (!email) {
      return { error: 'Email is required' }
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const redirectUrl = `${baseUrl}/auth/reset-password`

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    })

    if (error) {
      console.error('Reset password error:', error)
      return { error: error.message }
    }

    return { success: true }

  } catch (err) {
    console.error('Unexpected error in resetPasswordForEmail:', err)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/auth')
}


export const handleLogout = async () => {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Logout error:", error.message)
  } else {
    redirect('/auth')
  }
}