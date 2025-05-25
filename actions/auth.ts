'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export async function login(formData: FormData) {
  const supabase = await createClient()

  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const result = signupSchema.safeParse(raw)
  if (!result.success) {
    return { error: 'Invalid data', issues: result.error.flatten().fieldErrors }
  }

  const { email, password } = result.data

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
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
      .insert({ id: userId, email })

    if (profileError) {
      return { error: profileError.message }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}