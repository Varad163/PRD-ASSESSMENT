"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!email || !password) {
      setError("Please fill all fields")
      return
    }

    try {
      setLoading(true)
      setError("")

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (!res || res.error) {
        setError("Invalid email or password")
        return
      }

      const session = await fetch("/api/auth/session").then((res) =>
        res.json()
      )

      if (session?.user?.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg hover:shadow-blue-200/40 hover:shadow-2xl transition-all duration-300 flex flex-col gap-5"
      >
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center text-gray-900 tracking-tight">
          Welcome Back 👋
        </h1>

        <p className="text-center text-gray-500 text-sm">
          Login to your account
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-lg font-semibold shadow-md"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
  Don’t have an account?{" "}
  <Link
    href="/register"
    className="text-blue-600 font-semibold hover:underline"
  >
    Sign up
  </Link>
</p>
      </form>
    </div>
  )
}