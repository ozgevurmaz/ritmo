import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr';
import { getRedirectPath } from './lib/middleware/logic';

export async function middleware(request: NextRequest) {
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

  const pathname = request.nextUrl.pathname
  
  // Get user - this includes session validation
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Auth error:', error)
    // Handle JWT errors by redirecting to auth
    if (error.message.includes('JWT') || error.message.includes('expired')) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  let profile = null

  // Only fetch profile for admin routes to optimize performance
  if (user && pathname.startsWith('/admin')) {
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

  const redirectPath = getRedirectPath(user, pathname, profile);
  if (redirectPath) {
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }
  
  return response
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*", 
    "/auth/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};