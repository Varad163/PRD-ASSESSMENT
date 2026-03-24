"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.ok) {
      window.location.href = "/dashboard"
    } else {
      alert("Login failed")
    }
  }

  return (
    <div className="flex flex-col gap-4 p-10">
      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 text-black"
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 text-black"
      />
      <button onClick={handleLogin} className="bg-blue-500 p-2">
        Login
      </button>
    </div>
  )
}