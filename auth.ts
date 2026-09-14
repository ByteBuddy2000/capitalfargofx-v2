// auth.ts - NextAuth v5 configuration (project root)
import type { NextAuthConfig } from "next-auth"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
// auth.ts
import authConfig from "./auth.config"
import bcrypt from "bcryptjs"
import { connectToDB } from "@/lib/connectToDB"
import { User } from "@/models/User"

export const authOptions: NextAuthConfig = {
  ...authConfig,

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

}

export const { handlers, auth } = NextAuth({
  ...authConfig,
  ...authOptions,
})

