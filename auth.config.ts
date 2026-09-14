// auth.config.ts
import type { NextAuthConfig } from "next-auth"

export default {
  trustHost: true,
  providers: [],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name || user.fullName
        token.role = String(user.role ?? "").trim().toUpperCase() as
          | "USER"
          | "ADMIN"
          | "SUPER ADMIN"
        token.username = user.username
        token.status = user.status
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user._id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name || undefined
        session.user.role = String(token.role ?? "").trim().toUpperCase() as
          | "USER"
          | "ADMIN"
          | "SUPER ADMIN"
        session.user.username = token.username as string | undefined
        session.user.status = token.status as
          | "ACTIVE"
          | "SUSPENDED"
          | "BANNED"
          | undefined
      }

      return session
    },
  },
} satisfies NextAuthConfig
