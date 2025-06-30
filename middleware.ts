import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr';
import { getRedirectPath } from '@/lib/middleware/logic';

export async function middleware(request: NextRequest) {
  console.log('=== MIDDLEWARE START ===')
  console.log('Middleware running for:', request.nextUrl.pathname)
  // Create the response first
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh the session and get user in one call
  const { data: { user }, error } = await supabase.auth.getUser()
  console.log('User state:', !!user)
  // If there's an auth error, treat as no user
  if (error) {
    console.error('Auth error:', error)
  }

  const pathname = request.nextUrl.pathname

  let profile = null
  if (user && !error) {
    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('Profile fetch error:', profileError)
      } else {
        profile = data
      }
    } catch (error) {
      console.error('Profile query failed:', error)
    }
  }

  console.log('Profile:', profile)

  const redirectPath = getRedirectPath(user, pathname, profile);
  console.log('Redirect path:', redirectPath)
  if (redirectPath) {
      console.log('REDIRECTING TO:', redirectPath)
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }
  console.log('NO REDIRECT - CONTINUING TO PAGE')
  console.log('=== MIDDLEWARE END ===')
  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/dashboard', '/admin'],
}