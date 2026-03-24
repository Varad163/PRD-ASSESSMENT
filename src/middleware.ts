import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function middleware(req: any) {
  const token = await getToken({ req })

  const isAuth = !!token
  const isProtected = req.nextUrl.pathname.startsWith("/dashboard")

  if (isProtected && !isAuth) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}