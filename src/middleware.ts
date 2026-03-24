import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function middleware(req: any) {
  const token = await getToken({ req })
  const path = req.nextUrl.pathname

  // 🔐 1. Protect Dashboard (login required)
  if (path.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  // 🧑‍💻 2. Protect Admin (admin only)
  if (path.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
}