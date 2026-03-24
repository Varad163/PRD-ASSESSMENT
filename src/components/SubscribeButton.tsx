"use client"

import { useSession } from "next-auth/react"

export default function SubscribeButton() {
  const { data: session } = useSession()

  const handleSubscribe = async (plan: string) => {
    if (!session?.user?.id) {
      alert("Please login first")
      return
    }

    const res = await fetch("/api/checkout", {
  method: "POST",
  headers: {
    "Content-Type": "application/json", // 🔥 IMPORTANT
  },
  body: JSON.stringify({
    plan,
    userId: session.user.id,
  }),
})

    const data = await res.json()
    window.location.href = data.url
  }

  return (
    <div className="flex gap-4">
      <button
        onClick={() => handleSubscribe("monthly")}
        className="bg-blue-500 px-4 py-2 rounded"
      >
        Monthly
      </button>

      <button
        onClick={() => handleSubscribe("yearly")}
        className="bg-green-500 px-4 py-2 rounded"
      >
        Yearly
      </button>
    </div>
  )
}