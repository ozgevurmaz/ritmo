"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  console.log("db connected")
  const {
    data: { user },
  } = await supabase.auth.getUser()
  console.log("user found")
  if (user) {
    await supabase.auth.signOut()
    console.log("logged out")
  }

  revalidatePath('/', 'layout')
  return NextResponse.redirect(new URL('/auth', req.url), {
    status: 302,
  })
}