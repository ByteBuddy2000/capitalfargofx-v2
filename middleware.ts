// middleware.ts

import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"

const normalizeRole = (role: unknown): string => {
  return String(role ?? "").trim().toUpperCase()
}

const isAdminRole = (role: unknown): boolean => {
  const normalized = normalizeRole(role)

  return (
    normalized === "ADMIN" ||
    normalized === "SUPER ADMIN"
  )
}

const isUserRole = (role: unknown): boolean => {
  return normalizeRole(role) === "USER"
}

const { auth: withAuth } = NextAuth(authConfig)

export default withAuth((req) => {
  const { nextUrl } = req
  const pathname = nextUrl.pathname
  const session = req.auth

  const role = normalizeRole(session?.user?.role)

  const isLoggedIn = !!session?.user

  const isAdmin = isAdminRole(role)
  const isUser = isUserRole(role)

  // ============================================================
  // Logged-in users should not access /login
  // ============================================================

  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(
      new URL(
        isAdmin
          ? "/admin"
          : isUser
            ? "/dashboard"
            : "/login",
        req.url
      )
    )
  }

  // ============================================================
  // Protect /dashboard and /admin
  // ============================================================

  const isDashboardRoute = pathname.startsWith("/dashboard")
  const isAdminRoute = pathname.startsWith("/admin")

  if ((isDashboardRoute || isAdminRoute) && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url)

    loginUrl.searchParams.set(
      "callbackUrl",
      pathname
    )

    return NextResponse.redirect(loginUrl)
  }

  // ============================================================
  // ADMIN route protection
  // ============================================================

  if (isAdminRoute && isLoggedIn) {
    if (!isAdmin) {
      return NextResponse.redirect(
        new URL("/dashboard", req.url)
      )
    }

    return NextResponse.next()
  }

  // ============================================================
  // USER dashboard protection
  // ============================================================

  if (isDashboardRoute && isLoggedIn) {
    if (!isUser) {
      return NextResponse.redirect(
        new URL("/admin", req.url)
      )
    }

    return NextResponse.next()
  }

  // ============================================================
  // Redirect authenticated users from "/"
  // ============================================================

  if (pathname === "/" && isLoggedIn) {
    return NextResponse.redirect(
      new URL(
        isAdmin
          ? "/admin"
          : isUser
            ? "/dashboard"
            : "/login",
        req.url
      )
    )
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}