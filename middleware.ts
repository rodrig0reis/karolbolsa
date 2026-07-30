import { NextResponse } from "next/server"
import { auth } from "./auth"

export default auth((req) => {
  const isAuth = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith("/admin/login")

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
    return null
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

  return null
})

export const config = {
  matcher: ["/admin/:path*"],
}
