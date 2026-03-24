import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

// TEMP: Replace later with DB call
const users = [
  {
    id: "1",
    email: "admin@test.com",
    password: "$2b$10$hashedpassword", // hashed
    role: "admin",
  },
]

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) return null

        const user = users.find(
          (u) => u.email === credentials.email
        )

        if (!user) return null

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}