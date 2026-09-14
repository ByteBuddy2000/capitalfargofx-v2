// auth.config.ts
import type { NextAuthConfig } from "next-auth"

export default {
  trustHost: true,
  providers: [],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig
