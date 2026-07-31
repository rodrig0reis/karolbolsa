import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const isAuthPage = req.nextUrl.pathname.startsWith("/admin/login")
  
  // Verificação leve de cookie (Edge compatible)
  const sessionToken = req.cookies.get("next-auth.session-token")?.value || 
                       req.cookies.get("__Secure-next-auth.session-token")?.value
  
  const isAuth = !!sessionToken

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
    return NextResponse.next()
  }

  if (!isAuth && req.nextUrl.pathname.startsWith("/admin")) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    return NextResponse.redirect(
      new URL(`/admin/login?from=${encodeURIComponent(from)}`, req.url)
    );
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
