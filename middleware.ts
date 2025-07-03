import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr';
import { getRedirectPath } from '@/lib/middleware/logic';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()


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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    profile = data
  }

  const redirectPath = getRedirectPath(user, pathname, profile);

  if (redirectPath) {
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  await updateSession(request)
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
