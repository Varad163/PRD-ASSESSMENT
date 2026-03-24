"use client"

import { useState } from "react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async () => {
   const res = await fetch("/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, password }),
})

    const data = await res.json()

    if (res.ok) {
      alert("User created successfully")
      window.location.href = "/login"
    } else {
      alert(data.error)
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
      <button onClick={handleRegister} className="bg-green-500 p-2">
        Register
      </button>
    </div>
  )
}