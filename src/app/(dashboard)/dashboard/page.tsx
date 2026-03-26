"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

export default function DashboardPage() {
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const { data: session } = useSession() // ✅ get user email
useEffect(() => {
  if (!session) return

  const role = session.user?.role

  // 👑 ADMIN → redirect
  if (role === "admin") {
    router.replace("/admin")
  }

}, [session, router])
  // ✅ check subscription
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/subscription")

        if (!res.ok) {
          setSubscribed(false)
          setLoading(false)
          return
        }

        const data = await res.json()
        setSubscribed(data.active)
      } catch (err) {
        console.error("Subscription error:", err)
        setSubscribed(false)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // 💳 subscribe
  const subscribe = async (plan: "monthly" | "yearly") => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ plan }),
    })

    const data = await res.json()
    window.location.href = data.url
  }

  if (loading) return <p className="p-10">Loading...</p>

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* 🔵 SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between">
        
        <div>
          <h2 className="text-2xl font-bold mb-2">⛳ Golf App</h2>

          {/* ✅ USER EMAIL */}
          <p className="text-sm text-gray-400 mb-6">
            {session?.user?.email}
          </p>

          <ul className="space-y-3">

            <li
              onClick={() => router.push("/dashboard")}
              className="cursor-pointer hover:text-blue-400"
            >
              🏠 Dashboard
            </li>

            {subscribed && (
              <>
                <li
                  onClick={() => router.push("/scores")}
                  className="cursor-pointer hover:text-blue-400"
                >
                  ⛳ Scores
                </li>

                {/* ❌ REMOVED Score History */}

                <li
                  onClick={() => router.push("/results")}
                  className="cursor-pointer hover:text-blue-400"
                >
                  🏆 Results
                </li>

                <li
                  onClick={() => router.push("/leaderboard")}
                  className="cursor-pointer hover:text-blue-400"
                >
                  🏆 Leaderboard
                </li>

                {/* ❌ REMOVED Admin Panel */}
              </>
            )}
          </ul>
        </div>

        {/* 🔴 LOGOUT */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-red-500 hover:bg-red-600 p-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* 🟢 MAIN */}
      <div className="flex-1 p-10">

        <h1 className="text-3xl font-bold mb-8">🎉 Dashboard</h1>

        {!subscribed ? (
          <div className="bg-white p-8 rounded-2xl shadow-md text-center">

            <h2 className="text-xl font-semibold mb-4">
              Free Plan ❌
            </h2>

            <p className="text-gray-500 mb-6">
              Subscribe to unlock features
            </p>

            <div className="flex justify-center gap-6">
              <button
                onClick={() => subscribe("monthly")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg"
              >
                Monthly ₹500
              </button>

              <button
                onClick={() => subscribe("yearly")}
                className="bg-green-600 text-white px-6 py-3 rounded-lg"
              >
                Yearly ₹5000
              </button>
            </div>

          </div>
        ) : (
          <>
            {/* 👑 HEADER */}
            <div className="bg-white p-8 rounded-2xl shadow-md mb-6 flex justify-between items-center">

              <div>
                <h2 className="text-xl font-bold text-green-600">
                  Subscribed User 👑
                </h2>

                <p className="text-gray-500">
                  Full access unlocked
                </p>
              </div>

              <div className="text-4xl">🏆</div>
            </div>

            {/* 🔥 FEATURES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* ✅ ENTER SCORES */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-semibold">Enter Scores</h3>

                <button
                  onClick={() => router.push("/scores")}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>

              {/* ❌ REMOVED Score History card */}

              {/* ✅ STATUS */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-semibold">Premium Status</h3>

                <p className="text-green-600 mt-2">
                  Active ✅
                </p>
              </div>

            </div>

            {/* 🏆 RESULTS */}
            <div className="bg-white p-6 rounded-xl shadow mt-6">
              <h3 className="font-semibold mb-4">🏆 Your Results</h3>

              <button
                onClick={() => router.push("/results")}
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >
                View Results
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}