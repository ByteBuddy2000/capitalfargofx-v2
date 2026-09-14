// middleware.ts

import { auth } from "@/auth"
import { NextResponse } from "next/server"

const normalizeRole = (role: unknown) =>
  String(role ?? "").toUpperCase()

const isAdminRole = (role: string) =>
  role === "ADMIN" || role === "SUPER ADMIN"

export default auth((req) => {
  const { nextUrl } = req
  const pathname = nextUrl.pathname

  const session = req.auth

  // ============================================================
  // Redirect logged-in users away from login page
  // ============================================================
  if (pathname === "/login" && session?.user) {
    const role = normalizeRole(session.user.role)

    return NextResponse.redirect(
      new URL(
        isAdminRole(role)
          ? "/admin"
          : "/dashboard",
        req.url
      )
    )
  }

  // ============================================================
  // Protect dashboard/admin routes
  // ============================================================
  const protectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin")

  if (protectedRoute && !session?.user) {
    const loginUrl = new URL("/login", req.url)

    loginUrl.searchParams.set(
      "callbackUrl",
      pathname
    )

    return NextResponse.redirect(loginUrl)
  }

  // ============================================================
  // Role checks
  // ============================================================
  if (session?.user) {
    const role = normalizeRole(session.user.role)

    if (
      pathname.startsWith("/admin") &&
      !isAdminRole(role)
    ) {
      return NextResponse.redirect(
        new URL("/dashboard", req.url)
      )
    }

    if (
      pathname.startsWith("/dashboard") &&
      isAdminRole(role)
    ) {
      return NextResponse.redirect(
        new URL("/admin", req.url)
      )
    }
  }

  // ============================================================
  // Redirect "/" when authenticated
  // ============================================================
  if (pathname === "/" && session?.user) {
    const role = normalizeRole(session.user.role)

    return NextResponse.redirect(
      new URL(
        isAdminRole(role)
          ? "/admin"
          : "/dashboard",
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