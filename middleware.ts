import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr';
import { getRedirectPath } from '@/lib/middleware/logic';

export async function middleware(request: NextRequest) {
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

  const redirectPath = getRedirectPath(user, pathname, profile);
  if (redirectPath) {
      console.log('REDIRECTING TO:', redirectPath)
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }
  return response
}

export const config = {
  matcher: [
  "/dashboard/:path*",
  "/admin/:path*",
  "/auth/:path*",
  "/:path*",
  "/",
  "/dashboard",
  "/admin",
  "/auth",
  ],
};
