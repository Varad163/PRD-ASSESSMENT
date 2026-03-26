"use client"

import { useEffect, useState } from "react"

export default function LeaderboardPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLeaderboard = async () => {
    const res = await fetch("/api/leaderboard")
    const json = await res.json()

    console.log("LEADERBOARD:", json)

    setData(json.data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">🏆 Leaderboard</h1>

        {loading ? (
          <p>Loading...</p>
        ) : data.length === 0 ? (
          <p>No data yet</p>
        ) : (
          <div className="space-y-3">
            {data.map((user, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white p-4 rounded-xl shadow"
              >
                {/* Rank + Email */}
                <div>
                  <p className="font-semibold">
                    #{index + 1} {user.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    Wins: {user.wins}
                  </p>
                </div>

                {/* Prize */}
                <p className="font-bold text-green-600">
                  ₹{user.total}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}