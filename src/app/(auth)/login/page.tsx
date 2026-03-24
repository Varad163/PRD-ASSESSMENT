"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    setLoading(true)
    setError("")

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.ok) {
      router.push("/dashboard") // ✅ better than window.location
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="flex flex-col gap-4 p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Login</h1>

      {error && <p className="text-red-500">{error}</p>}

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 text-black rounded"
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 text-black rounded"
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-blue-500 p-2 rounded"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  )
}