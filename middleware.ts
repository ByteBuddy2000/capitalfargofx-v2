// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Paths that are strictly protected
const AUTH_ROUTES = ["/dashboard", "/admin"]

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  })

  const { pathname } = request.nextUrl

  const role = String(token?.role ?? "").trim().toLowerCase()
  const destination =
    role === "admin" || role === "super admin"
      ? "/admin"
      : role === "user"
        ? "/dashboard"
        : "/login"

  // 1. Redirect logged-in users away from the login page.
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL(destination, request.url))
  }

  // 2. Protect defined dashboard routes
  const isProtectedRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    if (!token) {
      // Redirect to signin if no session
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (role !== "user" && role !== "admin" && role !== "super admin") {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (pathname.startsWith("/admin") && role === "user") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (
      pathname.startsWith("/dashboard") &&
      (role === "admin" || role === "super admin")
    ) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  // 3. Optional: Redirect root "/" to user's dashboard if logged in
  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL(destination, request.url))
  }

  return NextResponse.next()
}

export const config = {
  // We match everything except static files and API routes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
