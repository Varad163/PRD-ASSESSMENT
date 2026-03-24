"use client"

import { useEffect, useState } from "react"
import SubscribeButton from "@/components/SubscribeButton"

export default function Dashboard() {
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscription = async () => {
      const res = await fetch("/api/subscription")
      const data = await res.json()

      setSubscription(data.subscription)
      setLoading(false)
    }

    fetchSubscription()
  }, [])

  if (loading) return <div>Loading...</div>

  if (!subscription || subscription.status !== "active") {
    return (
      <div className="p-10">
        <h2>You are not subscribed ❌</h2>
        <SubscribeButton />
      </div>
    )
  }

  return (
    <div className="p-10">
      <h2 className="text-green-500">You are subscribed ✅</h2>
    </div>
  )
}