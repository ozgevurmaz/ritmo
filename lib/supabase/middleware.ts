import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"

// Remove this function call from middleware or modify it
export async function updateSession(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // We can't modify cookies here effectively
          // This should be handled in the main middleware
        },
      },
    }
  )

  // Just refresh the session, don't return a response
  await supabase.auth.getUser()
  
  return NextResponse.next({ request })
}