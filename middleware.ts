import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr';


export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

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

  if (!user) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  if (user && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

   if (user && pathname.startsWith('/admin') && profile?.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/(client)/:path*',
    '/admin/:path*',
    '/auth',
  ],
}