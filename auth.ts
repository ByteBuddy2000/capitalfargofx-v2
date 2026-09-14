// auth.ts - NextAuth v5 configuration (project root)
import type { NextAuthConfig } from "next-auth"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { connectToDB } from "@/lib/connectToDB"
import { User } from "@/models/User"

export const authOptions: NextAuthConfig = {
  trustHost: true,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email or Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const identifier = String(credentials.email).trim().toLowerCase()

        const password = String(credentials.password)

        await connectToDB()

        const user = await User.findOne({
          $or: [{ email: identifier }, { username: identifier }],
        }).select("+passwordHash").exec()

        if (!user) {
          return null
        }

        const passwordMatches = await bcrypt.compare(
          password,
          user.passwordHash
        )

        if (!passwordMatches) {
          return null
        }

        if (user.status !== "ACTIVE") {
          return null
        }

        return {
          id: user._id.toString(),
          name: user.fullName,
          email: user.email,
          role: user.role,
          username: user.username,
          fullName: user.fullName,
          status: user.status,
          btcWallet: user.btcWallet,
          ethWallet: user.ethWallet,
          usdtWallet: user.usdtWallet,
          uplineUsername: user.uplineUsername,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.role = user.role as
          | "USER"
          | "ADMIN"
          | "SUPER ADMIN"
          | "user"
          | "admin"
          | "super admin"
        token.name = user.name || user.fullName
        token.username = user.username
        token.status = user.status as
          "ACTIVE" | "SUSPENDED" | "BANNED" | undefined
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user._id = token.id as string
        session.user.email = token.email as string
        session.user.name = (token.name as string) || undefined
        session.user.role = token.role as
          | "USER"
          | "ADMIN"
          | "SUPER ADMIN"
          | "user"
          | "admin"
          | "super admin"
        session.user.username = token.username as string | undefined
        session.user.status = token.status as
          "ACTIVE" | "SUSPENDED" | "BANNED" | undefined
      }

      return session
    },
  },

  // secret: process.env.AUTH_SECRET,
}

export const { handlers, auth } = NextAuth(authOptions)

