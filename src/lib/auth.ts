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

          // 🔍 Find user
          const { data: user, error } = await supabaseAdmin
            .from("users")
            .select("*")
            .eq("email", email)
            .maybeSingle()

          if (error) {
            console.log("FETCH ERROR:", error)
            return null
          }

          if (!user) {
            console.log("User not found")
            return null
          }

          // 🔐 Compare hashed password
          const isValid = await bcrypt.compare(password, user.password)

          if (!isValid) {
            console.log("Wrong password")
            return null
          }

          // ✅ Return user object (IMPORTANT: include id)
          return {
            id: user.id,
            email: user.email,
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
    // 🔥 Add user.id into JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },

    // 🔥 Make id available in session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}