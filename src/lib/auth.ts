import CredentialsProvider from "next-auth/providers/credentials"
import { supabaseAdmin } from "./supabaseServer"
import bcrypt from "bcrypt"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        try {
          if (!credentials) return null

          const { email, password } = credentials

          const { data: user, error } = await supabaseAdmin
            .from("users")
            .select("*")
            .eq("email", email)
            .maybeSingle()

          if (error || !user) return null

          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) return null

          // ✅ INCLUDE ROLE
          return {
            id: user.id,
            email: user.email,
            role: user.role, // 🔥 important
          }
        } catch (err) {
          console.log("AUTH ERROR:", err)
          return null
        }
      },
    }),
  ],

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
        token.role = user.role // 🔥
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string // 🔥
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}