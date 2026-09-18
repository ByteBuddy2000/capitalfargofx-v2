// auth.ts
import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDB } from "@/lib/connectToDB"
import { User } from "@/models/User"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email or Username", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        await connectToDB()

        // 1. Select passwordHash because it is excluded by default in the model.
        const identifier = credentials.email.toLowerCase().trim()
        const user = await User.findOne({
          $or: [{ email: identifier }, { username: identifier }],
        }).select("+passwordHash")

        if (!user) return null

        // 2. Validate password
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )
        if (!passwordMatch) return null

        if (user.status === "INACTIVE") {
          throw new Error("EMAIL_NOT_VERIFIED")
        }

        // 3. Return user object that matches your next-auth.d.ts definitions
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
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = String(user.role ?? "")
          .trim()
          .toLowerCase() as "user" | "admin" | "super admin"
        token.name = user.fullName
        token.username = user.username
        token.email = user.email
        token.fullname = user.fullName
        token.status = user.status
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = String(token.role ?? "")
          .trim()
          .toLowerCase() as "user" | "admin" | "super admin"
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.fullName = token.fullname as string
        session.user.status = token.status as "ACTIVE" | "INACTIVE" | "SUSPENDED" | "BANNED"
      }
      return session
    },
  },
  pages: {
    signIn: "/signin", // Ensure this matches your login page path
  },
  secret: process.env.AUTH_SECRET,
}
