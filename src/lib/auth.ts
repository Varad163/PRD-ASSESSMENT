import CredentialsProvider from "next-auth/providers/credentials"
import { supabaseAdmin } from "./supabaseServer"
import bcrypt from "bcrypt"

export const authOptions = {
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

          // ✅ Success
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

  secret: process.env.NEXTAUTH_SECRET,
}