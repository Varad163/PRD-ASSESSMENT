"use client"

import { useEffect, useState } from "react"

type LeaderboardUser = {
  email: string
  wins: number
  total: number
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard")
      const data = await res.json()

      setLeaders(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
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
        ) : leaders.length === 0 ? (
          <p>No data</p>
        ) : (
          <div className="space-y-4">
            {leaders.map((user, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    #{index + 1} {user.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    Wins: {user.wins}
                  </p>
                </div>

                <p className="text-green-600 font-bold">
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